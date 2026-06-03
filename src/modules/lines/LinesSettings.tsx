import { useState } from 'react';
import { linesModule } from './module';
import Toggle from '../../components/Toggle';

export default function LinesSettings() {
  const [cfg, setCfg] = useState(() => linesModule.getCfg());

  function update(patch: Parameters<typeof linesModule.setCfg>[0]) {
    linesModule.setCfg(patch);
    setCfg(linesModule.getCfg());
  }

  return (
    <div className="ogu-lines-opts">
      <div className="ogu-line-row">
        <span className="ogu-line-dot" style={{ background: '#ef4444' }} />
        <span className="ogu-lbl">Latitude line</span>
        <Toggle checked={cfg.showLat} onChange={v => update({ showLat: v })} />
      </div>
      <div className="ogu-line-row">
        <span className="ogu-line-dot" style={{ background: '#3b82f6' }} />
        <span className="ogu-lbl">Longitude line</span>
        <Toggle checked={cfg.showLng} onChange={v => update({ showLng: v })} />
      </div>
    </div>
  );
}
