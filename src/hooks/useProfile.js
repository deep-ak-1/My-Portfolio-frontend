import { useEffect, useState } from 'react';
import { api, getErrorMessage } from '../services/api.js';

// One shared profile cache so the navbar and hero do not each fetch separately.
let cached = null;
let inflight = null;
const listeners = new Set();

export function updateCachedProfile(profile) {
  cached = profile;
  listeners.forEach((fn) => fn(profile));
}

function loadProfile() {
  if (!inflight) {
    inflight = api
      .get('/profile')
      .then((res) => {
        cached = res.data;
        return cached;
      })
      .catch((err) => {
        inflight = null;
        throw err;
      });
  }
  return inflight;
}

export default function useProfile() {
  const [profile, setProfile] = useState(cached);
  const [loading, setLoading] = useState(!cached);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    const listener = (p) => active && setProfile(p);
    listeners.add(listener);

    if (!cached) {
      loadProfile()
        .then((p) => active && setProfile(p))
        .catch((err) => active && setError(getErrorMessage(err, 'Could not load profile')))
        .finally(() => active && setLoading(false));
    }

    return () => {
      active = false;
      listeners.delete(listener);
    };
  }, []);

  return { profile, loading, error };
}
