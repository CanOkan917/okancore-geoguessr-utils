import { useState } from 'react';
import { circleModule } from './module';

export default function CircleSettings() {
  const [cfg, setCfg] = useState(() => circleModule.getCfg());
  const [radiusDraft, setRadiusDraft] = useState(String(cfg.radius));

  function commitRadius(raw: string) {
    const v = Math.max(10, Math.min(3000, parseInt(raw, 10) || cfg.radius));
    setRadiusDraft(String(v));
    circleModule.setCfg({ radius: v });
    setCfg(circleModule.getCfg());
  }

  return (
    <>
      <div className="ogu-radius">
        <div className="ogu-row">
          <span className="ogu-lbl">Radius</span>
          <div className="ogu-field">
            <input
              type="number"
              className="ogu-num"
              value={radiusDraft}
              min={10}
              max={3000}
              step={10}
              onChange={e => setRadiusDraft(e.target.value)}
              onBlur={e => commitRadius(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') commitRadius(radiusDraft); }}
            />
            <span className="ogu-unit">km</span>
          </div>
        </div>
        <input
          type="range"
          className="ogu-range"
          value={cfg.radius}
          min={10}
          max={3000}
          step={10}
          onChange={e => {
            const v = Number(e.target.value);
            setRadiusDraft(String(v));
            circleModule.setCfg({ radius: v });
            setCfg(circleModule.getCfg());
          }}
        />
      </div>
      <div className="ogu-btn-row">
        <button className="ogu-btn" onClick={() => circleModule.applyAndDraw()}>
          Apply &amp; Draw
        </button>
        <button className="ogu-btn ogu-btn-rm" onClick={() => circleModule.drop()}>
          Remove
        </button>
      </div>
    </>
  );
}
