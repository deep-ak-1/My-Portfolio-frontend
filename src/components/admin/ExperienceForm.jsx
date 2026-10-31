import { useState } from 'react';
import { api, getErrorMessage } from '../../services/api.js';
import Field, { inputClass } from './Field.jsx';

export default function ExperienceForm({ item, onSaved, onCancel }) {
  const [form, setForm] = useState({
    type: item?.type || 'experience',
    organization: item?.organization || '',
    role: item?.role || '',
    startDate: item?.startDate || '',
    endDate: item?.endDate || '',
    current: Boolean(item?.current),
    description: item?.description || '',
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
    if (!form.organization.trim()) next.organization = 'Organization is required';
    if (!form.role.trim()) next.role = 'Role or qualification is required';
    setErrors(next);
    if (Object.keys(next).length) return;

    setSaving(true);
    try {
      if (item) await api.put(`/experience/${item._id}`, form);
      else await api.post('/experience', form);
      onSaved(item ? 'Entry updated' : 'Entry added');
    } catch (err) {
      setFormError(getErrorMessage(err, 'Could not save the entry'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} noValidate className="glass-card space-y-5 p-6" aria-label={item ? 'Edit entry' : 'New entry'}>
      <h3 className="text-lg font-semibold text-white">{item ? 'Edit entry' : 'New entry'}</h3>
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Type" id="e-type">
          <select id="e-type" className={inputClass} value={form.type} onChange={set('type')}>
            <option value="experience">Experience</option>
            <option value="education">Education</option>
          </select>
        </Field>
        <Field label="Organization *" id="e-org" error={errors.organization}>
          <input id="e-org" className={inputClass} value={form.organization} onChange={set('organization')} maxLength={120} />
        </Field>
        <Field label="Role or qualification *" id="e-role" error={errors.role}>
          <input id="e-role" className={inputClass} value={form.role} onChange={set('role')} maxLength={120} />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Start" id="e-start" hint="e.g. Jan 2024">
            <input id="e-start" className={inputClass} value={form.startDate} onChange={set('startDate')} maxLength={40} />
          </Field>
          <Field label="End" id="e-end">
            <input id="e-end" className={inputClass} value={form.endDate} onChange={set('endDate')} maxLength={40} disabled={form.current} />
          </Field>
        </div>
      </div>
      <Field label="Description" id="e-desc">
        <textarea id="e-desc" rows={3} className={inputClass} value={form.description} onChange={set('description')} maxLength={2000} />
      </Field>
      <div className="flex flex-wrap gap-6 text-sm text-slate-200">
        <label className="flex items-center gap-2"><input type="checkbox" checked={form.current} onChange={set('current')} /> Current</label>
        <label className="flex items-center gap-2"><input type="checkbox" checked={form.published} onChange={set('published')} /> Published (visible to visitors)</label>
      </div>
      {formError && <p role="alert" className="rounded-lg bg-rose-500/10 px-3 py-2 text-sm text-rose-200">{formError}</p>}
      <div className="flex flex-wrap gap-3">
        <button type="submit" disabled={saving} className="btn-primary">{saving ? 'Saving…' : 'Save entry'}</button>
        <button type="button" onClick={onCancel} className="btn-glass">Cancel</button>
      </div>
    </form>
  );
}
