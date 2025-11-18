import NotRegistered from "../images/pilot-not-registered.png";
import "../styles/ResultsPilots.css"
import "../styles/Pilots.css";

export default function ResultsPilots({
  modalSessionKey,
  sessionResults,
  closeModal
}) {
  if (!modalSessionKey || !sessionResults?.[modalSessionKey]) return null;

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
                {sessionResults[modalSessionKey].map((r, i) => {
                  const d = r.driver;
                  const color = d?.team_colour ? `#${d.team_colour.replace("#", "")}` : "#FFD700";

                  const imageSrc =
                    d?.headshot_url && d.headshot_url !== "null"
                      ? d.headshot_url.replace("/1col/", "/3col/")
                      : NotRegistered;

                  let gapIncremental = "—";
                  if (i > 0) {
                    const atual = r.gap_to_leader;
                    const anterior = sessionResults[modalSessionKey][i - 1].gap_to_leader;
                    if (typeof atual === "number" && typeof anterior === "number") {
                      gapIncremental = `+${(atual - anterior).toFixed(3)}s`;
                    } else {
                      gapIncremental = r.gap_to_leader;
                    }
                  }

                  return (
                    <div key={i} className="pilot-card">
                      <div className="position-badge" style={{ borderColor: color }}>
                        {r.position || "—"}
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

                        <img
                          src={imageSrc}
                          alt={d?.full_name || "Piloto não registrado"}
                          className="pilot-photo"
                        />
                      </div>

                      <p className="pilot-name">{d?.full_name || "Desconhecido"}</p>
                      <p className="pilot-team">{d?.team_name || "—"}</p>
                      <p className="pilot-gap">
                        <strong>Intervalo:</strong> {gapIncremental || "Fora da corrida"}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
  );
}
