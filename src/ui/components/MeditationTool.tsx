import { MeditationConfig } from "../../model/MeditationConfig";
import { ListOrdered, Wind } from "lucide-react";
import { Card, CardHeader } from "../shared/Card";
import { TextBoxBordered } from "../shared/Box";

export function MeditationTool({ config }: { config: MeditationConfig}) {
  return (
    <div className="animate-fadeIn">
      <Card>
        <CardHeader
          icon={<Wind className="h-4 w-4" />}
          title={config?.title || "Meditations-Übung"}
        />

        <div className="space-y-5">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-amber-400/75">
            Fokussierte Praxis zur Sutra
          </p>

          {config.desc && (
            <TextBoxBordered>
                {config.desc}
            </TextBoxBordered>
          )}

          {config.instructions && config.instructions.length > 0 && (
            <section aria-labelledby="meditation-practice-steps" className="space-y-3">
              <h4 id="meditation-practice-steps" className="flex items-center gap-2 font-serif text-base font-semibold text-amber-100">
                <ListOrdered className="h-4 w-4 text-amber-400" />
                Praxisablauf
              </h4>
              <ol className="grid gap-2">
                {config.instructions.map((instruction, index) => (
                  <li
                    key={`${index}-${instruction}`}
                    className="flex items-start gap-3 rounded-xl border border-white/[0.07] bg-white/[0.035] p-3.5 transition-colors hover:border-amber-400/20 hover:bg-white/[0.055]"
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-amber-400/20 bg-amber-400/10 font-mono text-xs text-amber-200">
                      {(index + 1).toString().padStart(2, "0")}
                    </span>
                    <p className="pt-0.5 text-sm leading-relaxed text-slate-300">
                      {instruction}
                    </p>
                  </li>
                ))}
              </ol>
            </section>
          )}
        </div>
      </Card>
    </div>
  );
}