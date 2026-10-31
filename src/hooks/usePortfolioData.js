import { useEffect, useState } from 'react';
import { api, getErrorMessage } from '../services/api.js';

// Loads all public content in parallel. Each section can fail independently.
export default function usePortfolioData() {
  const [state, setState] = useState({
    loading: true,
    profile: null,
    projects: [],
    skills: [],
    experience: [],
    error: '',
  });

  useEffect(() => {
    let active = true;
    Promise.allSettled([
      api.get('/profile'),
      api.get('/projects'),
      api.get('/skills'),
      api.get('/experience'),
    ]).then(([profile, projects, skills, experience]) => {
      if (!active) return;
      const failed = [profile, projects, skills, experience].find((r) => r.status === 'rejected');
      setState({
        loading: false,
        profile: profile.status === 'fulfilled' ? profile.value.data : null,
        projects: projects.status === 'fulfilled' ? projects.value.data : [],
        skills: skills.status === 'fulfilled' ? skills.value.data : [],
        experience: experience.status === 'fulfilled' ? experience.value.data : [],
        error: failed ? getErrorMessage(failed.reason, 'Could not load some portfolio content') : '',
      });
    });
    return () => {
      active = false;
    };
  }, []);

  return state;
}
