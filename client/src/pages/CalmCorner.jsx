import { useState, useEffect, useRef } from 'react';

const phases = [
  { name: 'Breathe in', duration: 4 },
  { name: 'Hold', duration: 4 },
  { name: 'Breathe out', duration: 4 },
];

const DOODLE_COLORS = [
  '#5a8f5e', // auralis green
  '#5b8fa8', // blue
  '#4a5568', // slate
  '#c084fc', // soft purple
  '#f472b6', // pink
  '#000000',
];

function BreathingSection() {
  const [phase, setPhase] = useState(0);
  const [count, setCount] = useState(0);
  const [running, setRunning] = useState(false);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (!running) return;
    const p = phases[phase];
    const t = setInterval(() => {
      setCount((c) => {
        if (c >= p.duration - 1) {
          setPhase((ph) => (ph + 1) % phases.length);
          return 0;
        }
        return c + 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [running, phase]);

  useEffect(() => {
    if (phase === 0) setScale(0.9 + (count / phases[0].duration) * 0.3);
    if (phase === 1) setScale(1.2);
    if (phase === 2) setScale(1.2 - (count / phases[2].duration) * 0.3);
  }, [phase, count]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 flex flex-col items-center border border-sky-100 dark:border-gray-700">
      <p className="text-gray-600 dark:text-gray-400 mb-6">Follow the circle. Breathe with the animation.</p>
      <div
        className="w-40 h-40 rounded-full bg-auralis-green/40 flex items-center justify-center transition-transform duration-1000 ease-in-out"
        style={{ transform: `scale(${scale})` }}
      >
        <span className="text-auralis-green-dark font-medium">{phases[phase].name}</span>
      </div>
      <p className="mt-4 text-sky-600 dark:text-sky-400">{count + 1} / {phases[phase].duration}s</p>
      <button
        type="button"
        onClick={() => setRunning((r) => !r)}
        className="mt-6 px-6 py-3 rounded-xl bg-auralis-green-dark text-white font-medium hover:bg-auralis-green"
      >
        {running ? 'Pause' : 'Start'}
      </button>
    </div>
  );
}

function DoodleSection() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState(DOODLE_COLORS[0]);
  const [brushSize, setBrushSize] = useState(3);
  const lastPos = useRef({ x: 0, y: 0 });

  const initCanvas = () => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const rect = container.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.floor(rect.width * dpr);
    canvas.height = Math.floor(rect.height * dpr);
    const ctx = canvas.getContext('2d');
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, rect.width, rect.height);
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    initCanvas();
    const ro = new ResizeObserver(() => initCanvas());
    ro.observe(container);
    return () => ro.disconnect();
  }, []);

  const getPos = (e) => {
    const container = containerRef.current;
    if (!container) return null;
    const rect = container.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  };

  const draw = (from, to) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();
  };

  const startDrawing = (e) => {
    e.preventDefault();
    const pos = getPos(e);
    if (pos) {
      lastPos.current = pos;
      setIsDrawing(true);
    }
  };

  const moveDrawing = (e) => {
    e.preventDefault();
    if (!isDrawing) return;
    const pos = getPos(e);
    if (pos) {
      draw(lastPos.current, pos);
      lastPos.current = pos;
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext('2d');
    const rect = container.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, rect.width, rect.height);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-sky-100 dark:border-gray-700">
      <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">Draw freely. No judgement, no saving—just relax.</p>
      <div className="flex flex-wrap items-center gap-4 mb-4">
        <div className="flex items-center gap-1">
          {DOODLE_COLORS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setColor(c)}
              className={`w-8 h-8 rounded-full border-2 ${color === c ? 'border-gray-800 dark:border-gray-200 scale-110' : 'border-transparent'}`}
              style={{ backgroundColor: c }}
              aria-label={`Color ${c}`}
            />
          ))}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">Size</span>
          <input
            type="range"
            min="1"
            max="12"
            value={brushSize}
            onChange={(e) => setBrushSize(Number(e.target.value))}
            className="w-24 accent-auralis-green-dark"
          />
        </div>
        <button
          type="button"
          onClick={clearCanvas}
          className="px-4 py-2 rounded-lg border border-sky-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm hover:bg-sky-50 dark:hover:bg-gray-700"
        >
          Clear
        </button>
      </div>
      <div
        ref={containerRef}
        className="relative w-full border border-sky-200 dark:border-gray-600 rounded-xl overflow-hidden bg-slate-50 dark:bg-gray-900"
        style={{ height: 400, maxHeight: '70vh' }}
      >
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full touch-none"
          style={{ cursor: 'crosshair' }}
        onMouseDown={startDrawing}
        onMouseMove={moveDrawing}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={moveDrawing}
        onTouchEnd={stopDrawing}
        />
      </div>
    </div>
  );
}

const TABS = [
  { id: 'breathing', label: 'Breathing' },
  { id: 'doodle', label: 'Doodle' },
];

export default function CalmCorner() {
  const [activeTab, setActiveTab] = useState('breathing');

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold text-auralis-green-dark mb-6">Calm Corner</h1>
      <div className="flex gap-2 mb-6">
        {TABS.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            onClick={() => setActiveTab(id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeTab === id
                ? 'bg-auralis-green-dark text-white'
                : 'bg-sky-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-auralis-green/30'
            }`}
          >
            {label}
          </button>
        ))}
      </div>
      {activeTab === 'breathing' && <BreathingSection />}
      {activeTab === 'doodle' && <DoodleSection />}
    </div>
  );
}
