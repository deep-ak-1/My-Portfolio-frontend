import { useState } from 'react';
import { api, getErrorMessage } from '../../services/api.js';
import { updateCachedProfile } from '../../hooks/useProfile.js';
import Field, { inputClass } from './Field.jsx';

export default function ProfileForm({ profile, onSaved }) {
  const [form, setForm] = useState({
    fullName: profile?.fullName === 'Your Name' ? '' : profile?.fullName || '',
    title: profile?.title || '',
    introduction: profile?.introduction || '',
    bio: profile?.bio || '',
    email: profile?.email || '',
    photoUrl: profile?.photoUrl || '/images/profile.jpg',
    resumeUrl: profile?.resumeUrl || '',
    github: profile?.socials?.github || '',
    linkedin: profile?.socials?.linkedin || '',
    twitter: profile?.socials?.twitter || '',
    website: profile?.socials?.website || '',
  });
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setFormError('');
    setSaving(true);
    const payload = {
      fullName: form.fullName,
      title: form.title,
      introduction: form.introduction,
      bio: form.bio,
      email: form.email,
      photoUrl: form.photoUrl,
      resumeUrl: form.resumeUrl,
      socials: { github: form.github, linkedin: form.linkedin, twitter: form.twitter, website: form.website },
    };
    try {
      const { data } = await api.put('/profile', payload);
      updateCachedProfile(data);
      onSaved('Profile saved');
    } catch (err) {
      setFormError(getErrorMessage(err, 'Could not save the profile'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} noValidate className="glass-card space-y-6 p-6" aria-label="Profile settings">
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Full name" id="pr-name" hint="Leave empty to keep the placeholder shown on the site">
          <input id="pr-name" className={inputClass} value={form.fullName} onChange={set('fullName')} maxLength={120} placeholder="Your full name" />
        </Field>
        <Field label="Professional title" id="pr-title" hint="Shown above your name">
          <input id="pr-title" className={inputClass} value={form.title} onChange={set('title')} maxLength={120} placeholder="MERN STACK DEVELOPER" />
        </Field>
        <Field label="Contact email" id="pr-email">
          <input id="pr-email" type="email" className={inputClass} value={form.email} onChange={set('email')} maxLength={254} />
        </Field>
        <Field label="Photo URL" id="pr-photo" hint="Default is /images/profile.jpg in client/public/images/">
          <input id="pr-photo" className={inputClass} value={form.photoUrl} onChange={set('photoUrl')} maxLength={500} />
        </Field>
        <Field label="Resume URL" id="pr-resume" hint="Link to a PDF you host elsewhere">
          <input id="pr-resume" className={inputClass} value={form.resumeUrl} onChange={set('resumeUrl')} maxLength={500} placeholder="https://…" />
        </Field>
      </div>

      <Field label="Short introduction (shown under your name)" id="pr-intro">
        <textarea id="pr-intro" rows={2} className={inputClass} value={form.introduction} onChange={set('introduction')} maxLength={500} />
      </Field>
      <Field label="Biography" id="pr-bio">
        <textarea id="pr-bio" rows={6} className={inputClass} value={form.bio} onChange={set('bio')} maxLength={3000} />
      </Field>

      <fieldset className="space-y-4">
        <legend className="mb-2 text-sm font-medium text-slate-200">Social links</legend>
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="GitHub" id="so-gh"><input id="so-gh" className={inputClass} value={form.github} onChange={set('github')} /></Field>
          <Field label="LinkedIn" id="so-li"><input id="so-li" className={inputClass} value={form.linkedin} onChange={set('linkedin')} /></Field>
          <Field label="X / Twitter" id="so-tw"><input id="so-tw" className={inputClass} value={form.twitter} onChange={set('twitter')} /></Field>
          <Field label="Website" id="so-web"><input id="so-web" className={inputClass} value={form.website} onChange={set('website')} /></Field>
        </div>
      </fieldset>

      {formError && <p role="alert" className="rounded-lg bg-rose-500/10 px-3 py-2 text-sm text-rose-200">{formError}</p>}
      <button type="submit" disabled={saving} className="btn-primary">{saving ? 'Saving…' : 'Save profile'}</button>
    </form>
  );
}
