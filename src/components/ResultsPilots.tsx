"use client";

import NotRegistered from "../images/pilot-not-registered.png";


type Driver = {
  driver_number?: string;
  full_name?: string;
  team_name?: string;
  team_colour?: string;
  headshot_url?: string;
};

type Result = {
  driver?: Driver;
  position?: number;
  duration?: number | number[];
  gap_to_leader?: number | string;
};

type ResultsPilotsProps = {
  modalSessionKey?: string;
  sessionResults?: Record<string, Result[]>;
  closeModal: () => void;
};

export default function ResultsPilots({
  modalSessionKey,
  sessionResults,
  closeModal,
}: ResultsPilotsProps) {
  if (!modalSessionKey || !sessionResults?.[modalSessionKey]) return null;

  const isQualifying = true; // você pode adaptar para diferenciar Q/NQ

  function formatDuration(dur: number) {
    if (dur == null || isNaN(dur)) return "–";
    const minutes = Math.floor(dur / 60);
    const seconds = (dur % 60).toFixed(3).padStart(6, "0");
    return `${minutes}:${seconds}`;
  }

  const results = sessionResults[modalSessionKey];

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="modal-window">
        <button className="modal-close" onClick={closeModal} aria-label="Fechar">
          ×
        </button>

        <div className="modal-header">
          <h3>Resultados — Sessão {modalSessionKey}</h3>
        </div>

        <div className="modal-body">
          <div className="pilots-grid pilots-grid-2x2">
            {results.map((r, i) => {
              const d = r.driver;
              const color = d?.team_colour ? `#${d.team_colour.replace("#", "")}` : "#FFD700";

              const imageSrc: string =
                d?.headshot_url && d.headshot_url !== "null"
                  ? d.headshot_url.replace("/1col/", "/3col/")
                  : NotRegistered.src; // ⚡ StaticImageData precisa de .src

             let durationDisplay: React.ReactNode = <div>—</div>;

              if (isQualifying && Array.isArray(r.duration)) {
                durationDisplay = r.duration.map((dur, idx) => {
                  const qName = `Q${idx + 1}`;
                  return (
                    <div key={idx}>
                      <strong>{qName}:</strong> {formatDuration(dur)}
                    </div>
                  );
                });
              } else if (isQualifying && !Array.isArray(r.duration)) {
                if (i === 0) {
                  durationDisplay = <div>{r.gap_to_leader || "—"}</div>;
                } else {
                  const atual = r.gap_to_leader;
                  const anterior = results[i - 1].gap_to_leader;
                  if (typeof atual === "number" && typeof anterior === "number") {
                    durationDisplay = <div>{`+${(atual - anterior).toFixed(3)}s`}</div>;
                  } else {
                    durationDisplay = <div>{r.gap_to_leader || "—"}</div>;
                  }
                }
              } else if (!isQualifying && r.duration != null) {
                durationDisplay = <div>{formatDuration(r.duration as number)}</div>;
              }

              // Gap incremental
              let gapIncremental: string | number = "—";
              if (!isQualifying && i > 0) {
                const atual = r.gap_to_leader;
                const anterior = results[i - 1].gap_to_leader;
                if (typeof atual === "number" && typeof anterior === "number") {
                  gapIncremental = `+${(atual - anterior).toFixed(3)}s`;
                } else {
                  gapIncremental = r.gap_to_leader as string;
                }
              }

              return (
                <div key={i} className="pilot-card">
                  <div className="position-badge" style={{ borderColor: color }}>
                    {r.position ?? "—"}
                  </div>

                  <div className="pilot-photo-container">
                    <span
                      className="pilot-number"
                      style={{
                        color,
                        textShadow: `0 0 10px ${color}, 0 0 18px ${color}`,
                      }}
                    >
                      {d?.driver_number}
                    </span>
                    <img src={imageSrc} alt={d?.full_name || "Piloto não registrado"} className="pilot-photo" />
                  </div>

                  <p className="pilot-name">{d?.full_name || "Desconhecido"}</p>
                  <p className="pilot-team">{d?.team_name || "—"}</p>

                  <div className="pilot-gap">
                    <div className="duration-list">{durationDisplay}</div>
                  </div>

                  {!isQualifying && (
                    <p className="pilot-gap">
                      <strong>Intervalo:</strong> {gapIncremental}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          <div className="scroll-top-button">
            <button
              className="buttonMore"
              onClick={() => {
                const body = document.querySelector(".modal-body");
                if (body) body.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              ↑ Voltar ao topo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
