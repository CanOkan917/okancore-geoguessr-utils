interface Props {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export default function Toggle({ checked, onChange }: Props) {
  return (
    <label className="ogu-sw">
      <input
        type="checkbox"
        checked={checked}
        onChange={e => onChange(e.target.checked)}
      />
      <span className="ogu-sw-track" />
      <span className="ogu-sw-thumb" />
    </label>
  );
}
