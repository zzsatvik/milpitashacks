import { useCallback, useRef, useState } from "react";

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
        relative cursor-pointer rounded-2xl border-2 border-dashed p-12 text-center
        transition-all duration-300
        ${dragOver
          ? "border-forest-500 bg-forest-50 scale-[1.01]"
          : "border-forest-300/60 bg-white/60 hover:border-forest-400 hover:bg-white/80"
        }
        ${disabled ? "pointer-events-none opacity-50" : ""}
      `}
    >
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

      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-forest-100 text-3xl">
        📷
      </div>
      <p className="font-display text-xl text-forest-800">
        Drop your yard photo here
      </p>
      <p className="mt-2 text-sm text-forest-600/80">
        or click to browse — JPG, PNG, HEIC
      </p>
      <p className="mt-4 text-xs text-forest-500">
        Tip: shoot from an elevated angle to capture the full yard
      </p>
    </div>
  );
}
