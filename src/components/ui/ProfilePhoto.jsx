import { useEffect, useState } from 'react';

export const DEFAULT_PHOTO = '/images/profile.jpg';

// Shows the configured photo. If it is missing or fails to load, shows initials instead
// of an unrelated image, so a wrong or missing file is obvious.
export default function ProfilePhoto({ src, name, alt, className = '' }) {
  const [failed, setFailed] = useState(false);
  const resolved = src || DEFAULT_PHOTO;

  useEffect(() => {
    setFailed(false);
  }, [resolved]);

  if (failed) {
    const initials =
      (name || 'Portfolio')
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0].toUpperCase())
        .join('') || 'P';
    return (
      <div
        role="img"
        aria-label={alt || 'Profile photo not available. Add client/public/images/profile.jpg'}
        className={`flex items-center justify-center bg-gradient-to-br from-cyan-500 to-purple-600 font-bold text-white ${className}`}
      >
        {initials}
      </div>
    );
  }

  return (
    <img
      src={resolved}
      alt={alt || `Photo of ${name || 'the portfolio owner'}`}
      onError={() => setFailed(true)}
      className={`object-cover object-top ${className}`}
      loading="eager"
      decoding="async"
    />
  );
}
