import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/EventsCalendar.css";

const EVENTS_2025 = [
  {
    round: 1,
    gp: "Australian GP",
    circuit: "Albert Park",
    location: "Melbourne, Australia",
    weekend: "14–16 Mar 2025",
    sprint: false,
    fp1: "14 Mar — 12:30",       // Motorsport UOL :contentReference[oaicite:1]{index=1}  
    fp2: "14 Mar — 16:00",       // :contentReference[oaicite:2]{index=2}  
    fp3: "15 Mar — 12:30",       // :contentReference[oaicite:3]{index=3}  
    qualy: "15 Mar — 16:00",     // :contentReference[oaicite:4]{index=4}  
    race: "16 Mar — 15:00"       // :contentReference[oaicite:5]{index=5}  
  },
  {
    round: 2,
    gp: "Chinese GP",
    circuit: "Shanghai International Circuit",
    location: "Shanghai, China",
    weekend: "21–23 Mar 2025",
    sprint: true,
    fp1: "21 Mar — 11:30",       // :contentReference[oaicite:6]{index=6}  
    fp2: "21 Mar — —",           // Sem dado claro para FP2 em UOL (não listado)  
    fp3: "22 Mar — —",           // idem  
    qualy: "22 Mar — 15:00",     // :contentReference[oaicite:7]{index=7}  
    race: "23 Mar — 15:00"       // :contentReference[oaicite:8]{index=8}  
  },
  {
    round: 3,
    gp: "Japanese GP",
    circuit: "Suzuka Circuit",
    location: "Suzuka, Japan",
    weekend: "04–06 Apr 2025",
    sprint: false,
    fp1: "04 Apr — 11:30",       // :contentReference[oaicite:9]{index=9}  
    fp2: "04 Apr — 15:00",       // :contentReference[oaicite:10]{index=10}  
    fp3: "05 Apr — 11:30",       // :contentReference[oaicite:11]{index=11}  
    qualy: "05 Apr — 15:00",     // :contentReference[oaicite:12]{index=12}  
    race: "06 Apr — 14:00"       // :contentReference[oaicite:13]{index=13}  
  },
  {
    round: 4,
    gp: "Bahrain GP",
    circuit: "Bahrain International Circuit",
    location: "Sakhir, Bahrain",
    weekend: "11–13 Apr 2025",
    sprint: false,
    fp1: "11 Apr — 14:30",       // :contentReference[oaicite:14]{index=14}  
    fp2: "11 Apr — 18:00",       // :contentReference[oaicite:15]{index=15}  
    fp3: "12 Apr — 15:30",       // :contentReference[oaicite:16]{index=16}  
    qualy: "12 Apr — 19:00",     // :contentReference[oaicite:17]{index=17}  
    race: "13 Apr — 18:00"       // :contentReference[oaicite:18]{index=18}  
  },
  {
    round: 5,
    gp: "Saudi Arabian GP",
    circuit: "Jeddah Corniche",
    location: "Jeddah, Saudi Arabia",
    weekend: "18–20 Apr 2025",
    sprint: false,
    fp1: "18 Apr — 16:30",       // :contentReference[oaicite:19]{index=19}  
    fp2: "18 Apr — 20:00",       // :contentReference[oaicite:20]{index=20}  
    fp3: "19 Apr — 16:30",       // :contentReference[oaicite:21]{index=21}  
    qualy: "19 Apr — 20:00",     // :contentReference[oaicite:22]{index=22}  
    race: "20 Apr — 14:00"       // :contentReference[oaicite:23]{index=23}  
  },
  {
    round: 6,
    gp: "Miami GP",
    circuit: "Miami International Autodrome",
    location: "Miami, USA",
    weekend: "02–04 May 2025",
    sprint: true,
    fp1: "02 May — 12:30",         // :contentReference[oaicite:24]{index=24}  
    fp2: "02 May — —",             // autoracing não liste FP2  
    fp3: "03 May — —",             // idem  
    qualy: "03 May — 17:00",       // autoracing :contentReference[oaicite:25]{index=25}  
    race: "04 May — 17:00"          // autoracing :contentReference[oaicite:26]{index=26}  
  },
  {
    round: 7,
    gp: "Emilia-Romagna GP (Imola)",
    circuit: "Imola",
    location: "Imola, Italy",
    weekend: "16–18 May 2025",
    sprint: false,
    fp1: "16 May — 08:30",        // :contentReference[oaicite:27]{index=27}  
    fp2: "16 May — 12:00",        // :contentReference[oaicite:28]{index=28}  
    fp3: "17 May — 07:30",        // :contentReference[oaicite:29]{index=29}  
    qualy: "17 May — 11:00",      // :contentReference[oaicite:30]{index=30}  
    race: "18 May — 10:00"        // :contentReference[oaicite:31]{index=31}  
  },
  {
    round: 8,
    gp: "Monaco GP",
    circuit: "Monte Carlo",
    location: "Monaco",
    weekend: "23–25 May 2025",
    sprint: false,
    fp1: "23 May — 08:30",        // autoracing :contentReference[oaicite:32]{index=32}  
    fp2: "23 May — 12:00",        // autoracing :contentReference[oaicite:33]{index=33}  
    fp3: "24 May — 07:30",        // autoracing :contentReference[oaicite:34]{index=34}  
    qualy: "24 May — 11:00",      // autoracing :contentReference[oaicite:35]{index=35}  
    race: "25 May — 10:00"        // autoracing :contentReference[oaicite:36]{index=36}  
  },
  {
    round: 9,
    gp: "Spanish GP",
    circuit: "Circuit de Barcelona-Catalunya",
    location: "Barcelona, Spain",
    weekend: "30 May – 01 Jun 2025",
    sprint: false,
    fp1: "30 May — 08:30",        // autoracing :contentReference[oaicite:37]{index=37}  
    fp2: "30 May — 12:00",        // autoracing :contentReference[oaicite:38]{index=38}  
    fp3: "31 May — 07:30",        // autoracing :contentReference[oaicite:39]{index=39}  
    qualy: "31 May — 11:00",      // autoracing :contentReference[oaicite:40]{index=40}  
    race: "01 Jun — 10:00"        // autoracing :contentReference[oaicite:41]{index=41}  
  },
  {
    round: 10,
    gp: "Canadian GP",
    circuit: "Circuit Gilles Villeneuve",
    location: "Montreal, Canada",
    weekend: "13–15 Jun 2025",
    sprint: true,
    fp1: "13 Jun — 13:30",        // Motorsport UOL :contentReference[oaicite:42]{index=42}  
    fp2: "13 Jun — 17:00",        // :contentReference[oaicite:43]{index=43}  
    fp3: "14 Jun — 12:30",        // :contentReference[oaicite:44]{index=44}  
    qualy: "14 Jun — 16:00",      // :contentReference[oaicite:45]{index=45}  
    race: "15 Jun — 14:00"        // :contentReference[oaicite:46]{index=46}  
  },
  {
    round: 11,
    gp: "Austrian GP",
    circuit: "Red Bull Ring",
    location: "Spielberg, Austria",
    weekend: "27–29 Jun 2025",
    sprint: false,
    fp1: "27 Jun — 13:30",        // :contentReference[oaicite:47]{index=47}  
    fp2: "27 Jun — 17:00",        // :contentReference[oaicite:48]{index=48}  
    fp3: "28 Jun — 12:30",        // :contentReference[oaicite:49]{index=49}  
    qualy: "28 Jun — 16:00",      // :contentReference[oaicite:50]{index=50}  
    race: "29 Jun — 15:00"        // :contentReference[oaicite:51]{index=51}  
  },
  {
    round: 12,
    gp: "British GP",
    circuit: "Silverstone",
    location: "Silverstone, United Kingdom",
    weekend: "04–06 Jul 2025",
    sprint: true,
    fp1: "04 Jul — 12:30",        // Motorsport UOL :contentReference[oaicite:52]{index=52}  
    fp2: "04 Jul — 16:00",        // :contentReference[oaicite:53]{index=53}  
    fp3: "05 Jul — 11:30",        // UOL :contentReference[oaicite:54]{index=54}  
    qualy: "05 Jul — 15:00",      // UOL :contentReference[oaicite:55]{index=55}  
    race: "06 Jul — 15:00"        // UOL :contentReference[oaicite:56]{index=56}  
  },
  {
    round: 13,
    gp: "Belgian GP",
    circuit: "Spa-Francorchamps",
    location: "Spa, Belgium",
    weekend: "25–27 Jul 2025",
    sprint: true,
    fp1: "25 Jul — 12:30",        // UOL :contentReference[oaicite:57]{index=57}  
    fp2: "25 Jul — —",            // não achei FP2 listado  
    fp3: "26 Jul — —",            // idem  
    qualy: "26 Jul — 16:00",      // UOL :contentReference[oaicite:58]{index=58}  
    race: "27 Jul — 15:00"        // UOL :contentReference[oaicite:59]{index=59}  
  },
  {
    round: 14,
    gp: "Hungarian GP",
    circuit: "Hungaroring",
    location: "Budapest, Hungary",
    weekend: "01–03 Aug 2025",
    sprint: false,
    fp1: "01 Aug — 13:30",        // Gazeta Esportiva :contentReference[oaicite:60]{index=60}  
    fp2: "01 Aug — 17:00",        // Gazeta Esportiva :contentReference[oaicite:61]{index=61}  
    fp3: "02 Aug — 12:30",        // Gazeta :contentReference[oaicite:62]{index=62}  
    qualy: "02 Aug — 16:00",      // Gazeta :contentReference[oaicite:63]{index=63}  
    race: "03 Aug — 10:00"        // Gazeta :contentReference[oaicite:64]{index=64}  
  },
  {
    round: 15,
    gp: "Dutch GP",
    circuit: "Zandvoort",
    location: "Zandvoort, Netherlands",
    weekend: "29–31 Aug 2025",
    sprint: true,
    fp1: "29 Aug — 12:30",        // UOL :contentReference[oaicite:65]{index=65}  
    fp2: "29 Aug — 16:00",        // UOL :contentReference[oaicite:66]{index=66}  
    fp3: "30 Aug — 11:30",        // UOL :contentReference[oaicite:67]{index=67}  
    qualy: "30 Aug — 15:00",      // UOL :contentReference[oaicite:68]{index=68}  
    race: "31 Aug — 15:00"        // UOL :contentReference[oaicite:69]{index=69}  
  },
  {
    round: 16,
    gp: "Italian GP (Monza)",
    circuit: "Autodromo Nazionale Monza",
    location: "Monza, Italy",
    weekend: "05–07 Sep 2025",
    sprint: false,
    fp1: "05 Sep — 13:30",        // UOL :contentReference[oaicite:70]{index=70}  
    fp2: "05 Sep — 17:00",        // UOL :contentReference[oaicite:71]{index=71}  
    fp3: "06 Sep — 12:30",        // UOL :contentReference[oaicite:72]{index=72}  
    qualy: "06 Sep — 16:00",      // UOL :contentReference[oaicite:73]{index=73}  
    race: "07 Sep — 15:00"        // UOL :contentReference[oaicite:74]{index=74}  
  },
  {
    round: 17,
    gp: "Azerbaijan GP",
    circuit: "Baku City Circuit",
    location: "Baku, Azerbaijan",
    weekend: "19–21 Sep 2025",
    sprint: false,
    fp1: "19 Sep — 12:30",        // UOL :contentReference[oaicite:75]{index=75}  
    fp2: "19 Sep — 16:00",        // UOL :contentReference[oaicite:76]{index=76}  
    fp3: "20 Sep — 12:30",        // UOL :contentReference[oaicite:77]{index=77}  
    qualy: "20 Sep — 16:00",      // UOL :contentReference[oaicite:78]{index=78}  
    race: "21 Sep — 15:00"        // UOL :contentReference[oaicite:79]{index=79}  
  },
  {
    round: 18,
    gp: "Singapore GP",
    circuit: "Marina Bay Street Circuit",
    location: "Singapore",
    weekend: "03–05 Oct 2025",
    sprint: true,
    fp1: "03 Oct — 17:30",        // UOL :contentReference[oaicite:80]{index=80}  
    fp2: "03 Oct — 21:00",        // UOL :contentReference[oaicite:81]{index=81}  
    fp3: "04 Oct — 17:30",        // UOL :contentReference[oaicite:82]{index=82}  
    qualy: "04 Oct — 21:00",      // UOL :contentReference[oaicite:83]{index=83}  
    race: "05 Oct — 20:00"        // UOL :contentReference[oaicite:84]{index=84}  
  },
  {
    round: 19,
    gp: "United States GP",
    circuit: "Circuit of the Americas",
    location: "Austin, USA",
    weekend: "17–19 Oct 2025",
    sprint: true,
    fp1: "17 Oct — 12:30",         // autoracing :contentReference[oaicite:85]{index=85}  
    fp2: "17 Oct — —",             // não encontrado  
    fp3: "18 Oct — —",             // idem  
    qualy: "18 Oct — 16:00",       // autoracing :contentReference[oaicite:86]{index=86}  
    race: "19 Oct — 14:00"         // Motorsport UOL menciona corrida, similar à UOL calendário :contentReference[oaicite:87]{index=87}  
  },
  {
    round: 20,
    gp: "Mexican GP",
    circuit: "Autódromo Hermanos Rodríguez",
    location: "Mexico City, Mexico",
    weekend: "24–26 Oct 2025",
    sprint: false,
    fp1: "24 Oct — 12:30",        // Motorsport UOL :contentReference[oaicite:88]{index=88}  
    fp2: "24 Oct — 16:00",        // :contentReference[oaicite:89]{index=89}  
    fp3: "25 Oct — 11:30",        // :contentReference[oaicite:90]{index=90}  
    qualy: "25 Oct — 15:00",      // :contentReference[oaicite:91]{index=91}  
    race: "26 Oct — 14:00"        // :contentReference[oaicite:92]{index=92}  
  },
  {
    round: 21,
    gp: "São Paulo GP",
    circuit: "Interlagos (Autódromo José Carlos Pace)",
    location: "São Paulo, Brazil",
    weekend: "07–09 Nov 2025",
    sprint: true,
    fp1: "07 Nov — 11:30",        // Motorsport UOL :contentReference[oaicite:93]{index=93}  
    fp2: "07 Nov — —",            // não encontrei FP2 no calendário público  
    fp3: "08 Nov — —",            // idem  
    qualy: "08 Nov — 15:00",      // UOL calendário :contentReference[oaicite:94]{index=94}  
    race: "09 Nov — —"            // UOL só dá data final; se quiser horário exato, pode precisar de fonte adicional  
  },
  {
    round: 22,
    gp: "Las Vegas GP",
    circuit: "Las Vegas Strip Circuit",
    location: "Las Vegas, USA",
    weekend: "20–22 Nov 2025",
    sprint: false,
    fp1: "20 Nov — —",            // não achei horário de treinos livres no UOL para Las Vegas 2025  
    fp2: "20 Nov — —",  
    fp3: "21 Nov — —",  
    qualy: "21 Nov — —",  
    race: "22 Nov — —"            // calendário UOL mostra data mas não horário claramente para as sessões  
  },
  {
    round: 23,
    gp: "Qatar GP",
    circuit: "Lusail Circuit",
    location: "Lusail, Qatar",
    weekend: "28–30 Nov 2025",
    sprint: true,
    fp1: "28 Nov — —",       // não encontrei horário detalhado no UOL para todas sessões  
    fp2: "28 Nov — —",
    fp3: "29 Nov — —",
    qualy: "29 Nov — —",
    race: "30 Nov — —"
  },
  {
    round: 24,
    gp: "Abu Dhabi GP",
    circuit: "Yas Marina Circuit",
    location: "Abu Dhabi, UAE",
    weekend: "05–07 Dec 2025",
    sprint: false,
    fp1: "05 Dec — 13:30",       // Motorsport UOL :contentReference[oaicite:95]{index=95}  
    fp2: "05 Dec — 17:00",       // :contentReference[oaicite:96]{index=96}  
    fp3: "06 Dec — 13:30",       // :contentReference[oaicite:97]{index=97}  
    qualy: "06 Dec — 17:00",     // :contentReference[oaicite:98]{index=98}  
    race: "07 Dec — 17:00"       // :contentReference[oaicite:99]{index=99}  
  },
];


export default function EventsCalendar() {
  const [query, setQuery] = useState("");
  const [onlySprint, setOnlySprint] = useState(false);
  const [expandedRound, setExpandedRound] = useState(null);

  const filtered = EVENTS_2025.filter(e => {
    const q = query.trim().toLowerCase();
    if (onlySprint && !e.sprint) return false;
    if (!q) return true;
    return (
      e.gp.toLowerCase().includes(q) ||
      e.circuit.toLowerCase().includes(q) ||
      e.location.toLowerCase().includes(q)
    );
  });

  return (
    <div className="events-page">
      <Navbar />

      <header className="events-header">
        <h1>Calendário de Corridas — F1 2025</h1>
        <p>Calendário compilado a partir do calendário oficial (temporada 2025).</p>

        <div className="events-controls">
          <input
            type="search"
            placeholder="Buscar por GP, circuito ou país..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Buscar corridas"
          />

          <label className="checkbox">
            <input
              type="checkbox"
              checked={onlySprint}
              onChange={(e) => setOnlySprint(e.target.checked)}
            />
            Mostrar apenas Sprint
          </label>
        </div>
      </header>

      <main className="events-list">
        {filtered.length === 0 ? (
          <p className="no-results">Nenhum evento encontrado.</p>
        ) : (
          filtered.map((e) => (
            <article key={e.round} className="event-card">
              <div className="event-left">
                <div className="round">R{e.round}</div>
                <div className="gp">{e.gp}</div>
                <div className="circuit">{e.circuit}</div>
                <div className="location">{e.location}</div>
              </div>

              <div className="event-right">
                <div className="weekend">{e.weekend}</div>

                <div className="meta">
                  {e.sprint && <span className="badge sprint">Sprint</span>}

                  <button
                    className="toggle"
                    onClick={() =>
                      setExpandedRound(expandedRound === e.round ? null : e.round)
                    }
                    aria-expanded={expandedRound === e.round}
                  >
                    {expandedRound === e.round ? "Fechar" : "Ver detalhes"}
                  </button>
                </div>

                {expandedRound === e.round && (
                  <div className="details">
                    <p><strong>Treino Livre 1:</strong> {e.fp1}</p>
                    <p><strong>Treino Livre 2:</strong> {e.fp2}</p>
                    <p><strong>Treino Livre 3:</strong> {e.fp3}</p>
                    <p><strong>Classificação:</strong> {e.qualy}</p>
                    <p><strong>Corrida:</strong> {e.race}</p>

                    <p className="small">
                      Dados compilados a partir de fontes oficiais e cobertura pública.
                    </p>
                  </div>
                )}
              </div>
            </article>
          ))
        )}
      </main>

      <footer className="events-footer">
        <small>Fonte: Formula1.com (calendário oficial) e reports públicos sobre sprint races.</small>
      </footer>

      <Footer />
    </div>
  );
}
