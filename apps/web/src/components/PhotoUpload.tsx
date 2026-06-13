import { useCallback, useRef, useState } from "react";
import { Upload } from "./Icons";

interface PhotoUploadProps {
  onUpload: (file: File, dataUrl: string) => void;
  disabled?: boolean;
}

export function PhotoUpload({ onUpload, disabled }: PhotoUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith("image/")) return;
      const reader = new FileReader();
      reader.onload = () => onUpload(file, reader.result as string);
      reader.readAsDataURL(file);
    },
    [onUpload],
  );

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => !disabled && inputRef.current?.click()}
      onKeyDown={(e) => e.key === "Enter" && !disabled && inputRef.current?.click()}
      onDragOver={(e) => {
        e.preventDefault();
        if (!disabled) setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragOver(false);
        if (disabled) return;
        const file = e.dataTransfer.files[0];
        if (file) handleFile(file);
      }}
      className={`
        glass relative cursor-pointer overflow-hidden rounded-3xl p-10 text-center
        transition-all duration-300
        ${dragOver
          ? "border-glow-400/50 [box-shadow:0_0_0_4px_rgba(163,230,53,0.12),inset_0_1px_0_0_rgba(255,255,255,0.1),0_24px_48px_-12px_rgba(0,0,0,0.5)]"
          : "hover:border-glow-400/25"
        }
        ${disabled ? "pointer-events-none opacity-50" : ""}
      `}
    >
      {/* corner brackets */}
      <span className="pointer-events-none absolute left-4 top-4 h-3 w-3 border-l border-t border-glow-400/40" />
      <span className="pointer-events-none absolute right-4 top-4 h-3 w-3 border-r border-t border-glow-400/40" />
      <span className="pointer-events-none absolute bottom-4 left-4 h-3 w-3 border-b border-l border-glow-400/40" />
      <span className="pointer-events-none absolute bottom-4 right-4 h-3 w-3 border-b border-r border-glow-400/40" />

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />

      <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-glow-400/20 bg-glow-400/10 text-glow-300">
        <Upload size={22} strokeWidth={1.7} />
      </div>
      <p className="font-display text-xl text-forest-50">Drop your yard photo</p>
      <p className="mt-2 text-sm text-forest-100/55">
        or click to browse&nbsp;&nbsp;·&nbsp;&nbsp;JPG&nbsp;·&nbsp;PNG&nbsp;·&nbsp;HEIC
      </p>
      <p className="mt-5 font-mono-data text-[10px] uppercase tracking-[0.16em] text-forest-100/35">
        Tip — shoot from an elevated angle for full coverage
      </p>
    </div>
  );
}
