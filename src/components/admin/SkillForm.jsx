import { useState } from 'react';
import { api, getErrorMessage } from '../../services/api.js';
import Field, { inputClass } from './Field.jsx';

export default function SkillForm({ item, onSaved, onCancel }) {
  const [form, setForm] = useState({
    name: item?.name || '',
    category: item?.category || '',
    level: item?.level ?? '',
    published: item ? Boolean(item.published) : true,
  });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  const set = (key) => (e) =>
    setForm((f) => ({ ...f, [key]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setFormError('');
    const next = {};
    if (!form.name.trim()) next.name = 'Skill name is required';
    const level = form.level === '' ? null : Number(form.level);
    if (level !== null && (Number.isNaN(level) || level < 0 || level > 100)) next.level = 'Enter a number from 0 to 100, or leave empty';
    setErrors(next);
    if (Object.keys(next).length) return;

    setSaving(true);
    const payload = { name: form.name, category: form.category, level, published: form.published };
    try {
      if (item) await api.put(`/skills/${item._id}`, payload);
      else await api.post('/skills', payload);
      onSaved(item ? 'Skill updated' : 'Skill added');
    } catch (err) {
      setFormError(getErrorMessage(err, 'Could not save the skill'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} noValidate className="glass-card space-y-5 p-6" aria-label={item ? 'Edit skill' : 'New skill'}>
      <h3 className="text-lg font-semibold text-white">{item ? 'Edit skill' : 'New skill'}</h3>
      <div className="grid gap-5 md:grid-cols-3">
        <Field label="Skill name *" id="s-name" error={errors.name}>
          <input id="s-name" className={inputClass} value={form.name} onChange={set('name')} maxLength={60} />
        </Field>
        <Field label="Category" id="s-cat" hint="e.g. Frontend, Backend, Tools">
          <input id="s-cat" className={inputClass} value={form.category} onChange={set('category')} maxLength={60} />
        </Field>
        <Field label="Proficiency (optional, 0–100)" id="s-level" error={errors.level}>
          <input id="s-level" type="number" min={0} max={100} className={inputClass} value={form.level} onChange={set('level')} />
        </Field>
      </div>
      <label className="flex items-center gap-2 text-sm text-slate-200">
        <input type="checkbox" checked={form.published} onChange={set('published')} /> Published (visible to visitors)
      </label>
      {formError && <p role="alert" className="rounded-lg bg-rose-500/10 px-3 py-2 text-sm text-rose-200">{formError}</p>}
      <div className="flex flex-wrap gap-3">
        <button type="submit" disabled={saving} className="btn-primary">{saving ? 'Saving…' : 'Save skill'}</button>
        <button type="button" onClick={onCancel} className="btn-glass">Cancel</button>
      </div>
    </form>
  );
}
