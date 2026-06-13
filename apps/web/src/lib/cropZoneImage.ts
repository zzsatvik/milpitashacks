import type { BoundingBox } from "@terraview/shared";

export async function cropZoneFromImage(
  imageUrl: string,
  bbox: BoundingBox,
  padding = 0.04,
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const x = Math.max(0, (bbox.x - padding) * img.naturalWidth);
      const y = Math.max(0, (bbox.y - padding) * img.naturalHeight);
      const w = Math.min(
        img.naturalWidth - x,
        (bbox.width + padding * 2) * img.naturalWidth,
      );
      const h = Math.min(
        img.naturalHeight - y,
        (bbox.height + padding * 2) * img.naturalHeight,
      );

      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(w));
      canvas.height = Math.max(1, Math.round(h));
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Canvas not supported"));
        return;
      }
      ctx.drawImage(img, x, y, w, h, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL("image/jpeg", 0.88));
    };
    img.onerror = () => reject(new Error("Failed to load image for crop"));
    img.src = imageUrl;
  });
}
