import { BorderBeam } from "./ui/border-beam";

function ColorPicker() {
  return (
    <div className="ferramenta">
      <BorderBeam
        size={80}
        duration={8}
        colorFrom="#8c52ff"
        colorTo="#a855f7"
        borderWidth={1}
      />
      <h1>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline-icon">
          <path d="M12 2v4" />
          <path d="m6.8 14-3.5 2" />
          <path d="m20.7 16-3.5-2" />
          <path d="M6.8 10 3.3 8" />
          <path d="m20.7 8-3.5 2" />
          <circle cx="12" cy="12" r="4" />
        </svg>
        Color Picker
      </h1>
      <p style={{ color: "var(--font-secondary)", fontFamily: "var(--font-mono)", fontSize: "var(--font-size-sm)" }}>
        Em desenvolvimento...
      </p>
    </div>
  );
}

export default ColorPicker;
