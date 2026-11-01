import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { api, getErrorMessage } from '../services/api.js';
import GlassCard from '../components/ui/GlassCard.jsx';
import Spinner from '../components/ui/Spinner.jsx';
import ProfileForm from '../components/admin/ProfileForm.jsx';
import ProjectForm from '../components/admin/ProjectForm.jsx';
import SkillForm from '../components/admin/SkillForm.jsx';
import ExperienceForm from '../components/admin/ExperienceForm.jsx';
import { api, asArray, getErrorMessage } from '../services/api.js';
const TABS = [
  ['profile', 'Profile'],
  ['projects', 'Projects'],
  ['skills', 'Skills'],
  ['experience', 'Experience'],
];

export default function AdminDashboard() {
  const { admin, logout } = useAuth();
  const [tab, setTab] = useState('profile');
  const [data, setData] = useState({ profile: null, projects: [], skills: [], experience: [] });
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState(null);
  const [editing, setEditing] = useState(null); // { section, item } or { section: 'new' }

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const [profile, projects, skills, experience] = await Promise.all([
        api.get('/profile'),
        api.get('/projects?all=true'),
        api.get('/skills?all=true'),
        api.get('/experience?all=true'),
      ]);
            setData({
        profile: profile.data,
        projects: asArray(projects.data),
        skills: asArray(skills.data),
        experience: asArray(experience.data),
      });
    } catch (err) {
      setNotice({ type: 'error', text: getErrorMessage(err, 'Could not load dashboard data') });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  const handleSaved = (text) => {
    setEditing(null);
    setNotice({ type: 'success', text });
    reload();
  };

  const remove = async (section, id, label) => {
    if (!window.confirm(`Delete "${label}"? This cannot be undone.`)) return;
    try {
      await api.delete(`/${section}/${id}`);
      setNotice({ type: 'success', text: `Deleted "${label}"` });
      reload();
    } catch (err) {
      setNotice({ type: 'error', text: getErrorMessage(err, 'Could not delete the item') });
    }
  };

  const switchTab = (next) => {
    setTab(next);
    setEditing(null);
    setNotice(null);
  };

  const handleLogout = async () => {
    await logout();
  };

  const listFor = (section) => data[section] || [];

  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Admin dashboard</h1>
          <p className="text-sm text-slate-400">Signed in as {admin?.email}</p>
        </div>
        <div className="flex gap-3">
          <a href="/" className="btn-glass">View site</a>
          <button type="button" onClick={handleLogout} className="btn-glass">Log out</button>
        </div>
      </div>

      <div role="tablist" aria-label="Dashboard sections" className="mb-6 flex flex-wrap gap-2">
        {TABS.map(([key, label]) => (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={tab === key}
            onClick={() => switchTab(key)}
            className={`rounded-xl px-4 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
              tab === key ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white' : 'btn-glass'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {notice && (
        <div
          role={notice.type === 'error' ? 'alert' : 'status'}
          className={`mb-6 flex items-start justify-between gap-4 rounded-xl px-4 py-3 text-sm ${
            notice.type === 'error' ? 'border border-rose-400/40 bg-rose-500/10 text-rose-100' : 'border border-emerald-400/40 bg-emerald-500/10 text-emerald-100'
          }`}
        >
          <span>{notice.text}</span>
          <button type="button" onClick={() => setNotice(null)} className="text-xs underline" aria-label="Dismiss message">Dismiss</button>
        </div>
      )}

      {loading ? (
        <Spinner label="Loading your content…" />
      ) : (
        <>
          {tab === 'profile' && (
            <ProfileForm profile={data.profile} onSaved={handleSaved} />
          )}

          {(tab === 'projects' || tab === 'skills' || tab === 'experience') && (
            <CollectionPanel
              section={tab}
              items={listFor(tab)}
              editing={editing}
              setEditing={setEditing}
              onSaved={handleSaved}
              onDelete={remove}
            />
          )}
        </>
      )}
    </section>
  );
}

const SECTION_CONFIG = {
  projects: {
    singular: 'project',
    Form: ProjectForm,
    label: (i) => i.title,
    meta: (i) => (i.published ? 'Published' : 'Hidden') + (i.featured ? ' · Featured' : ''),
  },
  skills: {
    singular: 'skill',
    Form: SkillForm,
    label: (i) => i.name,
    meta: (i) => [i.category, typeof i.level === 'number' ? `${i.level}%` : null, i.published ? 'Published' : 'Hidden'].filter(Boolean).join(' · '),
  },
  experience: {
    singular: 'entry',
    Form: ExperienceForm,
    label: (i) => `${i.role} at ${i.organization}`,
    meta: (i) => `${i.type === 'education' ? 'Education' : 'Experience'} · ${i.published ? 'Published' : 'Hidden'}`,
  },
};

function CollectionPanel({ section, items, editing, setEditing, onSaved, onDelete }) {
  const cfg = SECTION_CONFIG[section];
  const isEditingThis = editing && editing.section === section;
  const FormComponent = cfg.Form;

  return (
    <div className="space-y-6">
      {isEditingThis ? (
        <FormComponent
          key={editing.item?._id || 'new'}
          item={editing.item}
          onSaved={(text) => onSaved(text)}
          onCancel={() => setEditing(null)}
        />
      ) : (
        <div className="flex justify-end">
          <button type="button" className="btn-primary" onClick={() => setEditing({ section, item: null })}>
            Add {cfg.singular}
          </button>
        </div>
      )}

      {items.length === 0 ? (
        <GlassCard className="p-8 text-center text-slate-400">No {cfg.singular}s yet. Use “Add {cfg.singular}” to create one.</GlassCard>
      ) : (
        <ul className="space-y-3">
          {items.map((item) => (
            <li key={item._id}>
              <GlassCard className="flex flex-wrap items-center justify-between gap-4 p-4">
                <div className="min-w-0">
                  <p className="truncate font-semibold text-white">{cfg.label(item)}</p>
                  <p className="text-xs text-slate-400">{cfg.meta(item)}</p>
                </div>
                <div className="flex gap-2">
                  <button type="button" className="btn-glass" onClick={() => setEditing({ section, item })}>Edit</button>
                  <button type="button" className="btn-danger" onClick={() => onDelete(section, item._id, cfg.label(item))}>Delete</button>
                </div>
              </GlassCard>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
