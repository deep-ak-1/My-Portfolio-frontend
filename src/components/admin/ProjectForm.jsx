import { useState } from 'react';
import { api, getErrorMessage } from '../../services/api.js';
import Field, { inputClass } from './Field.jsx';

const isHttp = (v) => /^https?:\/\//i.test(v);

export default function ProjectForm({ item, onSaved, onCancel }) {
  const [form, setForm] = useState({
    title: item?.title || '',
    description: item?.description || '',
    technologies: (item?.technologies || []).join(', '),
    imageUrl: item?.imageUrl || '',
    githubUrl: item?.githubUrl || '',
    liveUrl: item?.liveUrl || '',
    featured: Boolean(item?.featured),
    published: item ? Boolean(item.published) : true,
    order: item?.order ?? 0,
  });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  const set = (key) => (e) =>
    setForm((f) => ({ ...f, [key]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

  const validate = () => {
    const next = {};
    if (!form.title.trim()) next.title = 'Title is required';
    if (form.githubUrl && !isHttp(form.githubUrl)) next.githubUrl = 'Must start with http:// or https://';
    if (form.liveUrl && !isHttp(form.liveUrl)) next.liveUrl = 'Must start with http:// or https://';
    if (form.imageUrl && !(isHttp(form.imageUrl) || form.imageUrl.startsWith('/'))) {
      next.imageUrl = 'Use an http(s):// address or a /path';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = async (e) => {
    e.preventDefault();
    setFormError('');
    if (!validate()) return;
    setSaving(true);
    const payload = {
      ...form,
      technologies: form.technologies.split(',').map((s) => s.trim()).filter(Boolean),
      order: Number(form.order) || 0,
    };
    try {
      if (item) await api.put(`/projects/${item._id}`, payload);
      else await api.post('/projects', payload);
      onSaved(item ? 'Project updated' : 'Project added');
    } catch (err) {
      setFormError(getErrorMessage(err, 'Could not save the project'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} noValidate className="glass-card space-y-5 p-6" aria-label={item ? 'Edit project' : 'New project'}>
      <h3 className="text-lg font-semibold text-white">{item ? 'Edit project' : 'New project'}</h3>

      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Title *" id="p-title" error={errors.title}>
          <input id="p-title" className={inputClass} value={form.title} onChange={set('title')} maxLength={120} />
        </Field>
        <Field label="Technologies" id="p-tech" hint="Comma-separated, e.g. React, Node.js, MongoDB">
          <input id="p-tech" className={inputClass} value={form.technologies} onChange={set('technologies')} />
        </Field>
      </div>

      <Field label="Description" id="p-desc">
        <textarea id="p-desc" rows={3} className={inputClass} value={form.description} onChange={set('description')} maxLength={2000} />
      </Field>

      <div className="grid gap-5 md:grid-cols-2">
        <Field label="GitHub URL" id="p-gh" error={errors.githubUrl}>
          <input id="p-gh" className={inputClass} value={form.githubUrl} onChange={set('githubUrl')} placeholder="https://github.com/…" />
        </Field>
        <Field label="Live demo URL" id="p-live" error={errors.liveUrl}>
          <input id="p-live" className={inputClass} value={form.liveUrl} onChange={set('liveUrl')} placeholder="https://…" />
        </Field>
        <Field label="Project image URL" id="p-img" error={errors.imageUrl} hint="Optional screenshot. Leave empty for none.">
          <input id="p-img" className={inputClass} value={form.imageUrl} onChange={set('imageUrl')} />
        </Field>
        <Field label="Display order" id="p-order" hint="Lower numbers appear first">
          <input id="p-order" type="number" className={inputClass} value={form.order} onChange={set('order')} />
        </Field>
      </div>

      <div className="flex flex-wrap gap-6 text-sm text-slate-200">
        <label className="flex items-center gap-2"><input type="checkbox" checked={form.featured} onChange={set('featured')} /> Featured</label>
        <label className="flex items-center gap-2"><input type="checkbox" checked={form.published} onChange={set('published')} /> Published (visible to visitors)</label>
      </div>

      {formError && <p role="alert" className="rounded-lg bg-rose-500/10 px-3 py-2 text-sm text-rose-200">{formError}</p>}

      <div className="flex flex-wrap gap-3">
        <button type="submit" disabled={saving} className="btn-primary">{saving ? 'Saving…' : 'Save project'}</button>
        <button type="button" onClick={onCancel} className="btn-glass">Cancel</button>
      </div>
    </form>
  );
}
