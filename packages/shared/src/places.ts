import type { LawnAnalysis, LawnZone, StoreOption } from "./types";

export type StorePoolKey = "nursery" | "hardware" | "landscape";

export const STORE_POOL_QUERIES: Record<StorePoolKey, string> = {
  nursery: "garden center plant nursery",
  hardware: "Home Depot Lowe's hardware store",
  landscape: "landscape supply mulch soil",
};

export function pickStorePoolForZone(zone: LawnZone): StorePoolKey {
  const text = `${zone.label} ${zone.issue} ${zone.recommendation}`.toLowerCase();
  if (/hardscape|pavement|concrete|asphalt|driveway|walkway|patios?/.test(text)) {
    return "hardware";
  }
  if (/mulch|soil|compost|gravel|sand|erosion|bare soil/.test(text)) {
    return "landscape";
  }
  if (/turf|grass|plant|native|shrub|tree|bed|pollinator|ground cover|flower/.test(text)) {
    return "nursery";
  }
  return "nursery";
}

export function mergeLiveStoresIntoAnalysis(
  analysis: LawnAnalysis,
  pools: Partial<Record<StorePoolKey, StoreOption[]>>,
): LawnAnalysis {
  const zones = analysis.zones.map((zone) => {
    if (!zone.action_plan) return zone;

    const poolKey = pickStorePoolForZone(zone);
    const primary = pools[poolKey] ?? [];
    const fallback = pools.nursery ?? pools.hardware ?? pools.landscape ?? [];
    const liveStores = dedupeStores([...primary, ...fallback]).slice(0, 3);

    if (liveStores.length === 0) return zone;

    return {
      ...zone,
      action_plan: {
        ...zone.action_plan,
        where_to_buy: liveStores,
      },
    };
  });

  return { ...analysis, zones };
}

function dedupeStores(stores: StoreOption[]): StoreOption[] {
  const seen = new Set<string>();
  const out: StoreOption[] = [];
  for (const store of stores) {
    const key = store.place_id ?? store.store_name.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(store);
  }
  return out;
}
