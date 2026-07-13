import { useEffect, useState } from "react";

export default function Loader() {
  const [play, setPlay] = useState(false);

  useEffect(() => {
    setPlay(true);
  }, []);

  return (
    <div className="flex h-screen justify-center items-center bg-primary">
      <div className="flex bg-white w-[250px] h-[250px] rounded-full items-center justify-center py-10">
        <style>{`
          @keyframes draw {
            to { stroke-dashoffset: 0; }
          }
          @keyframes pop {
            0% { transform: scale(0); opacity: 0; }
            100% { transform: scale(1); opacity: 1; }
          }
          .draw-path {
            stroke-dasharray: 1;
            stroke-dashoffset: 1;
            animation: draw 0.6s ease-out forwards;
          }
          .pop-dot {
            transform-origin: center;
            opacity: 0;
            animation: pop 0.12s ease-out forwards;
          }
        `}</style>

        <svg viewBox="0 0 120 100" width="160" height="130" className="overflow-visible">
          {/* Arc du dessus */}
          <path
            d="M14 46 Q 30 8 60 26 Q 90 8 106 46"
            fill="none" stroke="#d8b23c" strokeWidth="3" strokeLinecap="round"
            pathLength="1"
            className={play ? "draw-path" : ""}
            style={{ animationDelay: "0s" }}
          />

          {/* Boule gauche */}
          <circle cx="14" cy="40" r="6" fill="none" stroke="#d8b23c" strokeWidth="2.5"
            pathLength="1" className={play ? "draw-path" : ""} style={{ animationDelay: "0.5s" }} />
  
          {/* Boule centrale gauche */}
          <circle cx="40" cy="40" r="6" fill="none" stroke="#d8b23c" strokeWidth="2.5"
                pathLength="1" className={play ? "draw-path" : ""} style={{ animationDelay: "0.5s" }} />

        <line x1="8" y1="53" x2="55" y2="53" stroke="#d8b23c" strokeWidth="2.5"
            pathLength="1" className={play ? "draw-path" : ""}
            style={{ animationDelay: "0.5s", animationDuration: "0.3s" }} />

          {/* Boule centrale droite */}
          <circle cx="80" cy="40" r="6" fill="none" stroke="#d8b23c" strokeWidth="2.5"
                pathLength="1" className={play ? "draw-path" : ""} style={{ animationDelay: "0.5s" }} />

          {/* Boule droite */}
          <circle cx="106" cy="40" r="6" fill="none" stroke="#d8b23c" strokeWidth="2.5"
            pathLength="1" className={play ? "draw-path" : ""} style={{ animationDelay: "0.5s" }} />


          {/* Boule centrale */}
          <circle cx="60" cy="20" r="6" fill="none" stroke="#d8b23c" strokeWidth="2.5"
            pathLength="1" className={play ? "draw-path" : ""} style={{ animationDelay: "0.3s" }} />

          {/* Croix */}
          <line x1="60" y1="6" x2="60" y2="14" stroke="#d8b23c" strokeWidth="2"
            pathLength="1" className={play ? "draw-path" : ""} style={{ animationDelay: "0.3s" }} />
          <line x1="56" y1="9" x2="64" y2="9" stroke="#d8b23c" strokeWidth="2"
            pathLength="1" className={play ? "draw-path" : ""} style={{ animationDelay: "0.3s" }} />

          {/* Bandeau */}
          <rect x="8" y="46" width="104" height="40" rx="4" fill="none" stroke="#d8b23c" strokeWidth="3"
            pathLength="1" className={play ? "draw-path" : ""}
            style={{ animationDelay: "0.3s", animationDuration: "0.2s" }} />

          {/* Center Line */}
          <line x1="8" y1="66" x2="112" y2="66" stroke="#d8b23c" strokeWidth="2.5"
            pathLength="1" className={play ? "draw-path" : ""}
            style={{ animationDelay: "0.4s", animationDuration: "0.3s" }} />

          {/* All points ... */}
          {[20, 36, 52, 68, 84, 100].map((x, i) => (
            <circle key={x} cx={x} cy="78" r="2.5" fill="#d8b23c"
              className={play ? "pop-dot" : "opacity-0"}
              style={{ animationDelay: `${0.5 + i * 0.05}s` }} />
          ))}
        </svg>
      </div>
    </div>
  );
}