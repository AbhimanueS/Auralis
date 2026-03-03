import { useMemo, useState } from 'react';

const CAPACITY = 4;

// Each level is an array of tubes; each tube is bottom->top order.
const LEVELS = [
  {
    id: 1,
    difficulty: 'Easy',
    tubes: [
      ['#22c55e', '#ef4444', '#22c55e', '#f59e0b'],
      ['#60a5fa', '#f59e0b', '#ef4444', '#60a5fa'],
      ['#a855f7', '#22c55e', '#60a5fa', '#a855f7'],
      ['#ef4444', '#a855f7', '#f59e0b', '#f59e0b'],
      [],
      [],
    ],
  },
  {
    id: 2,
    difficulty: 'Easy',
    tubes: [
      ['#f97316', '#f97316', '#38bdf8', '#a855f7'],
      ['#10b981', '#38bdf8', '#f43f5e', '#10b981'],
      ['#a855f7', '#f43f5e', '#38bdf8', '#10b981'],
      ['#f43f5e', '#a855f7', '#f97316', '#f97316'],
      [],
      [],
    ],
  },
  {
    id: 3,
    difficulty: 'Medium',
    tubes: [
      ['#f59e0b', '#22c55e', '#f59e0b', '#60a5fa'],
      ['#60a5fa', '#ef4444', '#a855f7', '#a855f7'],
      ['#22c55e', '#60a5fa', '#ef4444', '#22c55e'],
      ['#ef4444', '#f59e0b', '#a855f7', '#60a5fa'],
      ['#a855f7', '#ef4444', '#22c55e', '#f59e0b'],
      [],
      [],
    ],
  },
  {
    id: 4,
    difficulty: 'Medium',
    tubes: [
      ['#ef4444', '#60a5fa', '#10b981', '#f59e0b'],
      ['#f59e0b', '#a855f7', '#60a5fa', '#ef4444'],
      ['#10b981', '#f59e0b', '#a855f7', '#10b981'],
      ['#a855f7', '#10b981', '#ef4444', '#60a5fa'],
      ['#60a5fa', '#a855f7', '#f59e0b', '#ef4444'],
      [],
      [],
    ],
  },
  {
    id: 5,
    difficulty: 'Hard',
    tubes: [
      ['#10b981', '#f43f5e', '#60a5fa', '#f59e0b'],
      ['#a855f7', '#10b981', '#f59e0b', '#60a5fa'],
      ['#f43f5e', '#60a5fa', '#10b981', '#a855f7'],
      ['#f59e0b', '#a855f7', '#f43f5e', '#10b981'],
      ['#60a5fa', '#f59e0b', '#a855f7', '#f43f5e'],
      ['#f43f5e', '#10b981', '#60a5fa', '#a855f7'],
      [],
      [],
    ],
  },
];

function deepCopyTubes(tubes) {
  return tubes.map((t) => t.slice());
}

function topColor(tube) {
  return tube.length ? tube[tube.length - 1] : null;
}

function isSolved(tubes) {
  return tubes.every((t) => {
    if (t.length === 0) return true;
    if (t.length !== CAPACITY) return false;
    const c = t[0];
    return t.every((x) => x === c);
  });
}

function countPourable(tube) {
  if (!tube.length) return 0;
  const c = topColor(tube);
  let n = 0;
  for (let i = tube.length - 1; i >= 0; i -= 1) {
    if (tube[i] !== c) break;
    n += 1;
  }
  return n;
}

function canPour(fromTube, toTube) {
  if (!fromTube.length) return false;
  if (toTube.length >= CAPACITY) return false;
  if (!toTube.length) return true;
  return topColor(fromTube) === topColor(toTube);
}

function pour(tubes, fromIdx, toIdx) {
  const next = deepCopyTubes(tubes);
  const from = next[fromIdx];
  const to = next[toIdx];
  if (!canPour(from, to)) return null;
  const fromTop = topColor(from);
  const movable = countPourable(from);
  const space = CAPACITY - to.length;
  const amount = Math.min(movable, space);
  if (amount <= 0) return null;
  for (let i = 0; i < amount; i += 1) {
    const v = from.pop();
    if (v !== fromTop) {
      // Should never happen, but keep state safe.
      from.push(v);
      break;
    }
    to.push(v);
  }
  return next;
}

function Tube({ tube, selected, canReceive, onClick }) {
  const fillCount = tube.length;
  const isFull = fillCount === CAPACITY;

  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'relative w-[72px] sm:w-[80px] h-[180px] sm:h-[200px] rounded-[22px]',
        'border-4',
        selected
          ? 'border-white shadow-[0_0_0_4px_rgba(255,255,255,0.22)]'
          : canReceive
            ? 'border-white/70'
            : 'border-white/35',
        'bg-white/5 hover:bg-white/10 transition-colors',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70',
      ].join(' ')}
      aria-label="Tube"
    >
      {/* Inner glass */}
      <div className="absolute inset-2 rounded-[16px] border border-white/20 overflow-hidden">
        {/* Empty background */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-white/0" />
        {/* Liquids bottom aligned */}
        <div className="absolute inset-0 flex flex-col-reverse">
          {Array.from({ length: CAPACITY }).map((_, i) => {
            const color = tube[i] || null; // bottom->top
            const isTop = i === fillCount - 1;
            return (
              <div
                // eslint-disable-next-line react/no-array-index-key
                key={i}
                className="flex-1"
                style={{
                  background: color
                    ? `linear-gradient(180deg, ${color} 0%, ${color} 70%, rgba(255,255,255,0.18) 100%)`
                    : 'transparent',
                  boxShadow: color && isTop ? 'inset 0 10px 18px rgba(255,255,255,0.18)' : undefined,
                }}
              />
            );
          })}
        </div>
      </div>

      {/* Lip */}
      <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-[86%] h-5 rounded-full border-4 border-white/35 bg-white/5" />

      {/* Subtle shine */}
      <div className="absolute top-4 left-3 w-2 h-[78%] rounded-full bg-white/15" />

      {isFull && (
        <div className="absolute -bottom-7 inset-x-0 text-center text-[10px] text-white/70">
          Full
        </div>
      )}
    </button>
  );
}

export default function WaterSortGame() {
  const [levelIdx, setLevelIdx] = useState(0);
  const level = LEVELS[levelIdx];

  const initial = useMemo(() => deepCopyTubes(level.tubes), [level]);
  const [tubes, setTubes] = useState(() => deepCopyTubes(level.tubes));
  const [selected, setSelected] = useState(null);
  const [history, setHistory] = useState([]);

  const solved = useMemo(() => isSolved(tubes), [tubes]);

  const reset = () => {
    setTubes(deepCopyTubes(level.tubes));
    setSelected(null);
    setHistory([]);
  };

  const nextLevel = () => {
    const next = (levelIdx + 1) % LEVELS.length;
    setLevelIdx(next);
    const l = LEVELS[next];
    setTubes(deepCopyTubes(l.tubes));
    setSelected(null);
    setHistory([]);
  };

  const prevLevel = () => {
    const prev = (levelIdx - 1 + LEVELS.length) % LEVELS.length;
    setLevelIdx(prev);
    const l = LEVELS[prev];
    setTubes(deepCopyTubes(l.tubes));
    setSelected(null);
    setHistory([]);
  };

  const undo = () => {
    setHistory((h) => {
      if (!h.length) return h;
      const last = h[h.length - 1];
      setTubes(deepCopyTubes(last));
      setSelected(null);
      return h.slice(0, -1);
    });
  };

  const handleTubeClick = (idx) => {
    if (solved) return;

    if (selected == null) {
      if (!tubes[idx].length) return;
      setSelected(idx);
      return;
    }

    if (selected === idx) {
      setSelected(null);
      return;
    }

    const next = pour(tubes, selected, idx);
    if (!next) {
      // If you tapped a different non-empty tube, switch selection.
      if (tubes[idx].length) setSelected(idx);
      return;
    }

    setHistory((h) => [...h, deepCopyTubes(tubes)]);
    setTubes(next);
    setSelected(null);
  };

  return (
    <div className="rounded-2xl overflow-hidden shadow-lg border border-white/20 bg-gradient-to-b from-[#2b2440] to-[#1f1b2f] text-white">
      <div className="p-5 sm:p-6 flex items-start justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs tracking-wide">
            <span className="opacity-80">{level.difficulty.toUpperCase()}</span>
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-semibold">Level {level.id}</div>
          <div className="mt-1 text-sm text-white/70">
            Tap a tube to pick up color, then tap another tube to pour.
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={prevLevel}
            className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-sm"
          >
            Prev
          </button>
          <button
            type="button"
            onClick={nextLevel}
            className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-sm"
          >
            Next
          </button>
        </div>
      </div>

      <div className="px-5 sm:px-6 pb-6">
        <div className="flex flex-wrap gap-4 sm:gap-5 justify-center">
          {tubes.map((tube, i) => (
            <Tube
              // eslint-disable-next-line react/no-array-index-key
              key={i}
              tube={tube}
              selected={selected === i}
              canReceive={selected != null && selected !== i && canPour(tubes[selected], tube)}
              onClick={() => handleTubeClick(i)}
            />
          ))}
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={undo}
            disabled={!history.length}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-sm disabled:opacity-40 disabled:hover:bg-white/10"
          >
            Undo
          </button>
          <button
            type="button"
            onClick={reset}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-sm"
          >
            Restart
          </button>
          {solved && (
            <div className="px-4 py-2 rounded-xl bg-emerald-500/20 border border-emerald-400/30 text-emerald-100 text-sm">
              Solved! Nice work.
            </div>
          )}
        </div>
      </div>

      {/* Keep memo stable (prevents unused var lint in some setups) */}
      <span className="hidden">{initial ? '' : ''}</span>
    </div>
  );
}

