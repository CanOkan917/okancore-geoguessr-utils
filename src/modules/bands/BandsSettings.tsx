import { useState } from 'react';
import { bandsModule } from './module';
import Toggle from '../../components/Toggle';

export default function BandsSettings() {
  const [cfg, setCfg] = useState(() => bandsModule.getCfg());
  const [latDraft, setLatDraft] = useState(String(cfg.latWidthKm));
  const [lngDraft, setLngDraft] = useState(String(cfg.lngWidthKm));

  function update(patch: Parameters<typeof bandsModule.setCfg>[0]) {
    bandsModule.setCfg(patch);
    setCfg(bandsModule.getCfg());
  }

  function commitLat(raw: string) {
    const v = Math.max(10, Math.min(1000, parseInt(raw, 10) || cfg.latWidthKm));
    setLatDraft(String(v));
    update({ latWidthKm: v });
  }

  function commitLng(raw: string) {
    const v = Math.max(10, Math.min(1000, parseInt(raw, 10) || cfg.lngWidthKm));
    setLngDraft(String(v));
    update({ lngWidthKm: v });
  }

  return (
    <div className="ogu-lines-opts">
      <div className="ogu-line-row">
        <span className="ogu-line-dot" style={{ background: '#ef4444' }} />
        <span className="ogu-lbl">Latitude band</span>
        <Toggle checked={cfg.showLat} onChange={v => update({ showLat: v })} />
      </div>
      {cfg.showLat && (
        <div className="ogu-band-slider">
          <input
            type="range"
            className="ogu-range"
            value={cfg.latWidthKm}
            min={10}
            max={1000}
            step={10}
            onChange={e => {
              const v = Number(e.target.value);
              setLatDraft(String(v));
              update({ latWidthKm: v });
            }}
          />
          <div className="ogu-band-val">
            <input
              type="number"
              className="ogu-num"
              value={latDraft}
              min={10}
              max={1000}
              step={10}
              onChange={e => setLatDraft(e.target.value)}
              onBlur={e => commitLat(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') commitLat(latDraft); }}
            />
            <span className="ogu-unit">km</span>
          </div>
        </div>
      )}

      <div className="ogu-line-row">
        <span className="ogu-line-dot" style={{ background: '#3b82f6' }} />
        <span className="ogu-lbl">Longitude band</span>
        <Toggle checked={cfg.showLng} onChange={v => update({ showLng: v })} />
      </div>
      {cfg.showLng && (
        <div className="ogu-band-slider">
          <input
            type="range"
            className="ogu-range"
            value={cfg.lngWidthKm}
            min={10}
            max={1000}
            step={10}
            onChange={e => {
              const v = Number(e.target.value);
              setLngDraft(String(v));
              update({ lngWidthKm: v });
            }}
          />
          <div className="ogu-band-val">
            <input
              type="number"
              className="ogu-num"
              value={lngDraft}
              min={10}
              max={1000}
              step={10}
              onChange={e => setLngDraft(e.target.value)}
              onBlur={e => commitLng(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') commitLng(lngDraft); }}
            />
            <span className="ogu-unit">km</span>
          </div>
        </div>
      )}
    </div>
  );
}
