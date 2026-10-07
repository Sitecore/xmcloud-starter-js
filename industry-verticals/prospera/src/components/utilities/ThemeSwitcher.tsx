'use client';

import { useEffect, useState, JSX } from 'react';

export const Default = (): JSX.Element => {
  const [isSystemDark, setIsSystemDark] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');

    if (mq.matches) {
      setIsSystemDark(true);
    }

    mq.addEventListener('change', (evt) => {
      setIsSystemDark(evt.matches);
    });
  }, []);

  useEffect(() => {
    document.body.classList.toggle('dark', isSystemDark);
  }, [isSystemDark]);

  return (
    <label className="theme-switcher">
      <label htmlFor="theme-switcher" className="d-none">
        Switch theme
      </label>
      <input
        name="theme-switcher"
        id="theme-switcher"
        type="checkbox"
        checked={isSystemDark}
        onChange={() => setIsSystemDark(!isSystemDark)}
      />
      <span className="theme-switcher-slider"></span>
    </label>
  );
};
