import { useEffect, useRef, useState } from "react";

/**
 * TournamentClock — cœur de l'app, équivalent de l'écran principal BlindValet.
 *
 * Props:
 *  - levels: [{ smallBlind, bigBlind, ante, durationMinutes, isBreak, breakLabel }]
 *  - onLevelChange(index): callback quand on passe au niveau suivant (pour sync Supabase)
 *  - initialLevelIndex, initialSecondsLeft: pour reprendre un tournoi en cours
 */
export default function TournamentClock({
  levels = [],
  onLevelChange,
  initialLevelIndex = 0,
  initialSecondsLeft = null,
  hideControls = false,
  readOnly = false,
}) {
  const [levelIndex, setLevelIndex] = useState(initialLevelIndex);
  const [secondsLeft, setSecondsLeft] = useState(
    initialSecondsLeft ?? (levels[initialLevelIndex]?.durationMinutes || 20) * 60
  );
  const [isRunning, setIsRunning] = useState(false);
  const audioRef = useRef(null);
  const intervalRef = useRef(null);

  const currentLevel = levels[levelIndex];
  const nextLevel = levels[levelIndex + 1];

  useEffect(() => {
    if (!isRunning) return;
    intervalRef.current = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          playSound();
          goToNextLevel();
          return (levels[levelIndex + 1]?.durationMinutes || 20) * 60;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRunning, levelIndex]);

  function playSound() {
    audioRef.current?.play().catch(() => {});
  }

  function goToNextLevel() {
    const next = levelIndex + 1;
    if (next < levels.length) {
      setLevelIndex(next);
      onLevelChange?.(next);
    } else {
      setIsRunning(false);
    }
  }

  function goToPrevLevel() {
    const prev = Math.max(0, levelIndex - 1);
    setLevelIndex(prev);
    setSecondsLeft((levels[prev]?.durationMinutes || 20) * 60);
    onLevelChange?.(prev);
  }

  function skipToNext() {
    goToNextLevel();
    setSecondsLeft((levels[levelIndex + 1]?.durationMinutes || 20) * 60);
  }

  function formatTime(s) {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  }

  if (!currentLevel) {
    return (
      <div className="flex items-center justify-center h-full text-felt-cream/60 font-body">
        Aucune structure de blinds chargée.
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-full bg-felt-bg text-felt-cream font-body px-6">
      <audio ref={audioRef} src="/level-end.mp3" />

      {/* Niveau courant */}
      <div className="text-felt-gold/80 font-display tracking-wide text-lg mb-2">
        {currentLevel.isBreak ? currentLevel.breakLabel || "PAUSE" : `NIVEAU ${levelIndex + 1}`}
      </div>

      {/* Timer géant */}
      <div className="font-display text-[16vw] leading-none tabular-nums tracking-tight">
        {formatTime(secondsLeft)}
      </div>

      {/* Blinds actuelles */}
      {!currentLevel.isBreak && (
        <div className="mt-4 flex items-baseline gap-3 text-4xl font-display">
          <span>{currentLevel.smallBlind}</span>
          <span className="text-felt-cream/40">/</span>
          <span>{currentLevel.bigBlind}</span>
          {currentLevel.ante > 0 && (
            <span className="text-felt-gold text-2xl ml-2">ante {currentLevel.ante}</span>
          )}
        </div>
      )}

      {/* Aperçu du niveau suivant */}
      {nextLevel && (
        <div className="mt-3 text-sm text-felt-cream/50">
          Prochain :{" "}
          {nextLevel.isBreak
            ? nextLevel.breakLabel || "Pause"
            : `${nextLevel.smallBlind}/${nextLevel.bigBlind}${
                nextLevel.ante ? ` (ante ${nextLevel.ante})` : ""
              }`}
        </div>
      )}

      {/* Contrôles */}
      {!readOnly && (
        <div className="mt-10 flex gap-4">
          <ClockButton onClick={goToPrevLevel}>◀ Précédent</ClockButton>
          <ClockButton primary onClick={() => setIsRunning((r) => !r)}>
            {isRunning ? "Pause" : "Lecture"}
          </ClockButton>
          <ClockButton onClick={skipToNext}>Suivant ▶</ClockButton>
        </div>
      )}
    </div>
  );
}

function ClockButton({ children, onClick, primary }) {
  return (
    <button
      onClick={onClick}
      className={`px-6 py-3 rounded-md font-display tracking-wide transition-colors ${
        primary
          ? "bg-felt-gold text-felt-bg hover:bg-felt-gold/90"
          : "bg-felt-panel text-felt-cream hover:bg-felt-panel/70 border border-felt-cream/10"
      }`}
    >
      {children}
    </button>
  );
}
