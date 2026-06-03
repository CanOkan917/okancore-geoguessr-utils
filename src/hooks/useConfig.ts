import { useState, useCallback } from 'react';
import type { Config } from '../types';

const DEFAULTS: Config = {
  radius: 500,
  enabled: true,
  multiRound: true,
  circleColor: '#00e5ff',
  circleOpacity: 0.18,
  strokeColor: '#00e5ff',
  strokeWeight: 2.5,
};

function load(): Config {
  try {
    const saved = GM_getValue<string | null>('ogu_cfg', null);
    return saved ? { ...DEFAULTS, ...JSON.parse(saved) } : { ...DEFAULTS };
  } catch {
    return { ...DEFAULTS };
  }
}

export function useConfig() {
  const [cfg, setCfg] = useState<Config>(load);

  const update = useCallback((patch: Partial<Config>) => {
    setCfg(prev => {
      const next = { ...prev, ...patch };
      GM_setValue('ogu_cfg', JSON.stringify(next));
      return next;
    });
  }, []);

  return [cfg, update] as const;
}
