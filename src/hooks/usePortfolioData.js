import { useEffect, useState } from 'react';
import { api, asArray, getErrorMessage } from '../services/api.js';

// Loads all public content in parallel. Each section fails independently and always
// ends up as an array, so the UI cannot crash on unexpected data.
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
        projects: projects.status === 'fulfilled' ? asArray(projects.value.data) : [],
        skills: skills.status === 'fulfilled' ? asArray(skills.value.data) : [],
        experience: experience.status === 'fulfilled' ? asArray(experience.value.data) : [],
        error: failed ? getErrorMessage(failed.reason, 'Could not load some portfolio content') : '',
      });
    });
    return () => {
      active = false;
    };
  }, []);

  return state;
}
