import type { ZoneActionPlan } from "@terraview/shared";
import { Compass, Droplet } from "./Icons";

interface ActionPlanDetailsProps {
  plan: ZoneActionPlan;
  compact?: boolean;
}

export function ActionPlanDetails({ plan, compact }: ActionPlanDetailsProps) {
  return (
    <div
      className={`space-y-4 border-t border-white/8 ${compact ? "pt-3" : "pt-4 mt-4"}`}
    >
      {plan.steps.length > 0 && (
        <section>
          <h4 className="font-mono-data text-[10px] uppercase tracking-[0.14em] text-forest-100/45">
            What to do
          </h4>
          <ol className="mt-2 space-y-2">
            {plan.steps.map((step, i) => (
              <li
                key={i}
                className="flex gap-2 text-sm leading-relaxed text-forest-100/70"
              >
                <span className="font-mono-data text-[10px] text-glow-400 tabular">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </section>
      )}

      {plan.items.length > 0 && (
        <section>
          <h4 className="font-mono-data text-[10px] uppercase tracking-[0.14em] text-forest-100/45">
            What to get
          </h4>
          <ul className="mt-2 space-y-2">
            {plan.items.map((item, i) => (
              <li
                key={i}
                className="rounded-xl border border-white/6 bg-white/[0.03] px-3 py-2.5"
              >
                <p className="font-medium text-forest-50">{item.name}</p>
                {item.quantity && (
                  <p className="mt-0.5 font-mono-data text-[10px] uppercase tracking-[0.1em] text-glow-300">
                    Qty: {item.quantity}
                  </p>
                )}
                <p className="mt-1 text-sm text-forest-100/60">{item.purpose}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {plan.where_to_buy.length > 0 && (
        <section>
          <h4 className="font-mono-data text-[10px] uppercase tracking-[0.14em] text-forest-100/45">
            Where to get it
          </h4>
          <ul className="mt-2 space-y-2">
            {plan.where_to_buy.map((store, i) => (
              <li
                key={store.place_id ?? `${store.store_name}-${i}`}
                className="rounded-xl border border-aurora-cyan/15 bg-aurora-cyan/5 px-3 py-2.5"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <Compass size={12} className="text-aurora-cyan" strokeWidth={2} />
                  <span className="font-medium text-forest-50">{store.store_name}</span>
                  {store.distance && (
                    <span className="rounded-full border border-aurora-cyan/25 px-2 py-0.5 font-mono-data text-[10px] text-aurora-cyan">
                      {store.distance}
                    </span>
                  )}
                </div>
                {store.address_hint && (
                  <p className="mt-1 text-sm text-forest-100/55">{store.address_hint}</p>
                )}
                {store.notes && (
                  <p className="mt-1 text-sm text-forest-100/65">{store.notes}</p>
                )}
                {store.maps_url && (
                  <a
                    href={store.maps_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex text-xs font-medium text-aurora-cyan transition hover:text-glow-300"
                  >
                    Open in Google Maps →
                  </a>
                )}
              </li>
            ))}
          </ul>
          <p className="mt-2 flex items-start gap-1.5 text-xs text-forest-100/40">
            <Droplet size={10} className="mt-0.5 shrink-0" strokeWidth={2} />
            {plan.where_to_buy.some((s) => s.place_id)
              ? "Live listings from Google Maps — confirm stock and hours before you go."
              : "Distances are estimates — confirm stock and hours before you go."}
          </p>
        </section>
      )}
    </div>
  );
}
