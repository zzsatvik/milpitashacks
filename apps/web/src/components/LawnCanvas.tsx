import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { LawnZone } from "@lawn-audit/shared";
import { SEVERITY_COLORS } from "@lawn-audit/shared";
import type { ViewTab } from "../types";

interface LawnCanvasProps {
  imageUrl: string;
  zones: LawnZone[];
  activeTab: ViewTab;
  selectedZoneId: number | null;
  onZoneSelect: (zoneId: number | null) => void;
}

export function LawnCanvas({
  imageUrl,
  zones,
  activeTab,
  selectedZoneId,
  onZoneSelect,
}: LawnCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const zoneNumbers = useMemo(() => {
    const sorted = [...zones].sort((a, b) => a.id - b.id);
    return new Map(sorted.map((z, i) => [z.id, i + 1]));
  }, [zones]);

  const updateDimensions = useCallback(() => {
    const img = imageRef.current;
    const container = containerRef.current;
    if (!img || !container || !img.naturalWidth) return;

    const maxWidth = container.clientWidth;
    const ratio = img.naturalHeight / img.naturalWidth;
    const width = maxWidth;
    const height = width * ratio;
    setDimensions({ width, height });
  }, []);

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      imageRef.current = img;
      updateDimensions();
    };
    img.src = imageUrl;
  }, [imageUrl, updateDimensions]);

  useEffect(() => {
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, [updateDimensions]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const img = imageRef.current;
    if (!canvas || !img || dimensions.width === 0) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = dimensions.width * dpr;
    canvas.height = dimensions.height * dpr;
    canvas.style.width = `${dimensions.width}px`;
    canvas.style.height = `${dimensions.height}px`;
    ctx.scale(dpr, dpr);

    ctx.clearRect(0, 0, dimensions.width, dimensions.height);
    ctx.drawImage(img, 0, 0, dimensions.width, dimensions.height);

    zones.forEach((zone) => {
      const x = zone.bbox.x * dimensions.width;
      const y = zone.bbox.y * dimensions.height;
      const w = zone.bbox.width * dimensions.width;
      const h = zone.bbox.height * dimensions.height;
      const colors = SEVERITY_COLORS[zone.severity];
      const isSelected = zone.id === selectedZoneId;
      const num = zoneNumbers.get(zone.id) ?? zone.id;

      if (activeTab === "before") {
        ctx.fillStyle = colors.fill;
        ctx.fillRect(x, y, w, h);
        ctx.strokeStyle = colors.stroke;
        ctx.lineWidth = isSelected ? 3 : 2;
        ctx.strokeRect(x, y, w, h);

        ctx.font = "600 12px 'Source Sans 3', sans-serif";
        const label = zone.label;
        const textWidth = ctx.measureText(label).width;
        const pillH = 22;
        const pillW = textWidth + 16;
        const pillX = x;
        const pillY = Math.max(y - pillH - 4, 4);

        ctx.fillStyle = colors.stroke;
        ctx.fillRect(pillX, pillY, pillW, pillH);
        ctx.fillStyle = "#fff";
        ctx.fillText(label, pillX + 8, pillY + 15);
      } else {
        ctx.fillStyle = isSelected
          ? "rgba(47, 82, 54, 0.2)"
          : "rgba(47, 82, 54, 0.08)";
        ctx.fillRect(x, y, w, h);
        ctx.setLineDash([8, 5]);
        ctx.strokeStyle = isSelected ? "#2f5236" : "#4a8554";
        ctx.lineWidth = isSelected ? 3 : 2;
        ctx.strokeRect(x, y, w, h);
        ctx.setLineDash([]);

        drawNumberBadge(ctx, x + w / 2, y + h / 2, num, isSelected);
      }

      if (isSelected && activeTab === "before") {
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 4]);
        ctx.strokeRect(x + 2, y + 2, w - 4, h - 4);
        ctx.setLineDash([]);
      }
    });
  }, [dimensions, zones, activeTab, selectedZoneId, zoneNumbers]);

  useEffect(() => {
    draw();
  }, [draw]);

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const clickX = (e.clientX - rect.left) / rect.width;
    const clickY = (e.clientY - rect.top) / rect.height;

    const hit = [...zones]
      .reverse()
      .find(
        (z) =>
          clickX >= z.bbox.x &&
          clickX <= z.bbox.x + z.bbox.width &&
          clickY >= z.bbox.y &&
          clickY <= z.bbox.y + z.bbox.height,
      );

    onZoneSelect(hit ? hit.id : null);
  };

  return (
    <div ref={containerRef} className="relative w-full overflow-hidden rounded-2xl">
      <canvas
        ref={canvasRef}
        onClick={handleClick}
        className="block w-full cursor-crosshair rounded-2xl"
        role="img"
        aria-label="Annotated lawn photo"
      />
      <span className="pointer-events-none absolute left-2 top-2 h-3 w-3 border-l border-t border-glow-400/60" />
      <span className="pointer-events-none absolute right-2 top-2 h-3 w-3 border-r border-t border-glow-400/60" />
      <span className="pointer-events-none absolute bottom-2 left-2 h-3 w-3 border-b border-l border-glow-400/60" />
      <span className="pointer-events-none absolute bottom-2 right-2 h-3 w-3 border-b border-r border-glow-400/60" />
    </div>
  );
}

function drawNumberBadge(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  num: number,
  selected: boolean,
) {
  const s = selected ? 32 : 28;
  ctx.fillStyle = selected ? "#1a2e1f" : "#2f5236";
  ctx.fillRect(cx - s / 2, cy - s / 2, s, s);
  ctx.strokeStyle = "#fff";
  ctx.lineWidth = 2.5;
  ctx.strokeRect(cx - s / 2, cy - s / 2, s, s);

  ctx.fillStyle = "#fff";
  ctx.font = `700 ${selected ? 14 : 13}px 'DM Sans', sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(String(num), cx, cy + 0.5);
  ctx.textAlign = "start";
  ctx.textBaseline = "alphabetic";
}
