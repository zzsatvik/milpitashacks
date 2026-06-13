/**
 * Hand-mapped zones for public/demo-yard.jpg (Unsplash rooftop synthetic lawn).
 * Coordinates are % of the hero preview frame (object-cover, portrait crop).
 */
export interface HeroDemoZone {
  id: number;
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  severity: "high" | "moderate" | "good";
  metric: string;
}

export const HERO_DEMO_ZONES: HeroDemoZone[] = [
  {
    id: 1,
    x: 0,
    y: 40,
    w: 100,
    h: 60,
    label: "Synthetic turf",
    severity: "high",
    metric: "plastic surface · no habitat",
  },
  {
    id: 2,
    x: 0,
    y: 20,
    w: 13,
    h: 34,
    label: "Concrete wall",
    severity: "moderate",
    metric: "+4°F edge heat",
  },
  {
    id: 3,
    x: 11,
    y: 7,
    w: 30,
    h: 20,
    label: "Ornamental shrubs",
    severity: "good",
    metric: "some pollinator value",
  },
  {
    id: 4,
    x: 30,
    y: 5,
    w: 36,
    h: 22,
    label: "Pergola hardscape",
    severity: "moderate",
    metric: "impervious footprint",
  },
  {
    id: 5,
    x: 10,
    y: 27,
    w: 78,
    h: 9,
    label: "Metal fence line",
    severity: "moderate",
    metric: "runoff barrier",
  },
  {
    id: 6,
    x: 54,
    y: 0,
    w: 46,
    h: 30,
    label: "High-rise facade",
    severity: "moderate",
    metric: "urban heat island",
  },
];

export const HERO_DEMO_SCORES = {
  water: 78,
  biodiversity: 22,
  heat: "High",
  grade: "D+",
} as const;
