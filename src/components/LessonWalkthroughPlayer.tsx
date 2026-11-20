import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Check,
  Clock,
  Copy,
  Download,
  Film,
  Pause,
  Play,
  RotateCcw,
  Sparkles,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { LESSON_1_WALKTHROUGH_SCENES, WalkthroughScene } from '../data/lesson1Walkthrough';

interface LessonWalkthroughPlayerProps {
  scenes?: WalkthroughScene[];
}

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function drawCoverImage(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  w: number,
  h: number,
  scale: number,
  panX: number,
  panY: number,
  alpha: number
) {
  ctx.save();
  ctx.globalAlpha = alpha;
  const imgRatio = img.naturalWidth / Math.max(1, img.naturalHeight);
  const canvasRatio = w / h;
  let drawW = w;
  let drawH = h;
  if (imgRatio > canvasRatio) {
    drawH = h * scale;
    drawW = drawH * imgRatio;
  } else {
    drawW = w * scale;
    drawH = drawW / imgRatio;
  }
  const dx = (w - drawW) / 2 + panX;
  const dy = (h - drawH) / 2 + panY;
  ctx.drawImage(img, dx, dy, drawW, drawH);
  ctx.restore();
}

export function LessonWalkthroughPlayer({
  scenes = LESSON_1_WALKTHROUGH_SCENES,
}: LessonWalkthroughPlayerProps) {
  const [selectedSceneId, setSelectedSceneId] = useState<string>(scenes[0].id);
  const [isPlaying, setIsPlaying] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [voiceLang, setVoiceLang] = useState<'urdu' | 'en'>('urdu');
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [imagesReady, setImagesReady] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const loadedFramesRef = useRef<[HTMLImageElement | null, HTMLImageElement | null]>([null, null]);
  const rafRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);

  const activeScene = scenes.find((s) => s.id === selectedSceneId) ?? scenes[0];
  const duration = activeScene.durationSeconds;

  const stopSpeech = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }, []);

  const speakVoiceover = useCallback(
    (scene: WalkthroughScene, lang: 'urdu' | 'en') => {
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
      window.speechSynthesis.cancel();
      const text = lang === 'urdu' ? scene.voiceoverUrdu : scene.voiceoverEnglish;
      const utter = new SpeechSynthesisUtterance(text);
      utter.rate = lang === 'urdu' ? 0.96 : 0.98;
      utter.pitch = 1.03;
      utter.lang = lang === 'urdu' ? 'en-IN' : 'en-US';
      window.speechSynthesis.speak(utter);
    },
    []
  );

  // Preload frame images whenever activeScene changes
  useEffect(() => {
    stopSpeech();
    setIsPlaying(false);
    setElapsed(0);
    setImagesReady(false);
    loadedFramesRef.current = [null, null];

    if (!activeScene.frames) return;
    let cancelled = false;

    const loadImg = (src: string) =>
      new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
      });

    Promise.all([loadImg(activeScene.frames[0]), loadImg(activeScene.frames[1])])
      .then(([img1, img2]) => {
        if (cancelled) return;
        loadedFramesRef.current = [img1, img2];
        setImagesReady(true);
      })
      .catch(() => {
        if (!cancelled) setImagesReady(false);
      });

    return () => {
      cancelled = true;
    };
  }, [activeScene, stopSpeech]);

  // Draw a single cinematic 16:9 frame at timestamp `t` (0..12s)
  const renderFrame = useCallback(
    (t: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const w = canvas.width;
      const h = canvas.height;
      const progress = Math.min(1, Math.max(0, t / duration));
      const [img1, img2] = loadedFramesRef.current;

      ctx.fillStyle = '#24131E';
      ctx.fillRect(0, 0, w, h);

      if (img1 && img2) {
        // 0s -> 6.4s: Wide Studio shot with smooth Ken Burns push-in
        const p1 = Math.min(1, t / 6.5);
        const scale1 = 1.02 + p1 * 0.1;
        const panX1 = -p1 * 18;
        const panY1 = -p1 * 8;

        // 5.4s -> 6.6s: Smooth cinematic cross-dissolve into Macro Close-Up
        const fade = Math.min(1, Math.max(0, (t - 5.4) / 1.2));

        if (fade < 1) {
          drawCoverImage(ctx, img1, w, h, scale1, panX1, panY1, 1);
        }
        if (fade > 0) {
          const p2 = Math.min(1, Math.max(0, (t - 5.4) / 6.6));
          const scale2 = 1.11 - p2 * 0.08;
          const panX2 = 16 - p2 * 28;
          const panY2 = -4 + p2 * 6;
          drawCoverImage(ctx, img2, w, h, scale2, panX2, panY2, fade);
        }
      } else {
        // Pending scene luxury storyboard placeholder
        const grad = ctx.createLinearGradient(0, 0, w, h);
        grad.addColorStop(0, '#3D1F34');
        grad.addColorStop(0.55, '#6C3F52');
        grad.addColorStop(1, '#B88071');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);
      }

      // Soft cinematic top & bottom readability scrims
      const topScrim = ctx.createLinearGradient(0, 0, 0, h * 0.28);
      topScrim.addColorStop(0, 'rgba(30, 14, 24, 0.72)');
      topScrim.addColorStop(1, 'rgba(30, 14, 24, 0)');
      ctx.fillStyle = topScrim;
      ctx.fillRect(0, 0, w, h * 0.28);

      const botScrim = ctx.createLinearGradient(0, h * 0.56, 0, h);
      botScrim.addColorStop(0, 'rgba(26, 12, 22, 0)');
      botScrim.addColorStop(0.65, 'rgba(26, 12, 22, 0.76)');
      botScrim.addColorStop(1, 'rgba(26, 12, 22, 0.92)');
      ctx.fillStyle = botScrim;
      ctx.fillRect(0, h * 0.56, w, h * 0.44);

      // Top-left Studio Lesson Badge
      ctx.save();
      drawRoundedRect(ctx, 36, 30, 390, 42, 21);
      ctx.fillStyle = 'rgba(45, 23, 38, 0.74)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(223, 167, 151, 0.55)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.fillStyle = '#E8B8A9';
      ctx.font = '700 16px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(
        `GLAMCRAFT ACADEMY  ·  SCENE 0${activeScene.sceneNumber} / 0${scenes.length}`,
        56,
        57
      );
      ctx.restore();

      // Top-right Timer pill
      ctx.save();
      drawRoundedRect(ctx, w - 168, 30, 132, 42, 21);
      ctx.fillStyle = 'rgba(45, 23, 38, 0.74)';
      ctx.fill();
      ctx.fillStyle = '#FFF9F6';
      ctx.font = '600 16px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(
        `${t.toFixed(1)}s / ${duration}.0s`,
        w - 102,
        57
      );
      ctx.restore();

      // Timed Beat Lower-Third Caption (changes smoothly every 4 seconds)
      const beatIndex = t < 4 ? 0 : t < 8 ? 1 : 2;
      const beatText = activeScene.onScreenBeats[beatIndex];

      ctx.save();
      ctx.fillStyle = '#E7B8A8';
      ctx.font = '600 18px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(`LESSON 1: SKIN PREP & PRIME  ·  ${activeScene.title.toUpperCase()}`, 42, h - 104);

      ctx.fillStyle = '#FFFFFF';
      ctx.font = '600 30px "Playfair Display", Georgia, serif';
      ctx.fillText(beatText, 42, h - 60, w - 84);
      ctx.restore();

      // Bottom Rose-Gold Progress Track
      ctx.fillStyle = 'rgba(255, 249, 246, 0.25)';
      ctx.fillRect(0, h - 10, w, 10);
      const barGrad = ctx.createLinearGradient(0, 0, w, 0);
      barGrad.addColorStop(0, '#E6B8A8');
      barGrad.addColorStop(1, '#C58371');
      ctx.fillStyle = barGrad;
      ctx.fillRect(0, h - 10, w * progress, 10);
    },
    [activeScene, duration, scenes.length]
  );

  // Render whenever elapsed or imagesReady updates
  useEffect(() => {
    renderFrame(elapsed);
  }, [elapsed, imagesReady, renderFrame]);

  // Playback loop
  useEffect(() => {
    if (!isPlaying) return;
    lastTimeRef.current = performance.now();

    const tick = (now: number) => {
      const dt = (now - lastTimeRef.current) / 1000;
      lastTimeRef.current = now;
      setElapsed((prev) => {
        const next = prev + dt;
        if (next >= duration) {
          setIsPlaying(false);
          return duration;
        }
        return next;
      });
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [isPlaying, duration]);

  // Cleanup speech on unmount
  useEffect(() => () => stopSpeech(), [stopSpeech]);

  const handleTogglePlay = () => {
    if (activeScene.status !== 'ready') return;
    if (isPlaying) {
      setIsPlaying(false);
      stopSpeech();
    } else {
      const restart = elapsed >= duration - 0.1;
      if (restart) setElapsed(0);
      setIsPlaying(true);
      if (voiceEnabled) {
        speakVoiceover(activeScene, voiceLang);
      }
    }
  };

  const handleRestart = () => {
    stopSpeech();
    setElapsed(0);
    setIsPlaying(true);
    if (voiceEnabled && activeScene.status === 'ready') {
      speakVoiceover(activeScene, voiceLang);
    }
  };

  const handleExportVideo = async () => {
    const canvas = canvasRef.current;
    if (!canvas || activeScene.status !== 'ready' || isExporting) return;
    if (typeof MediaRecorder === 'undefined') return;

    stopSpeech();
    setIsPlaying(false);
    setIsExporting(true);
    setExportProgress(0);

    try {
      const stream = canvas.captureStream(30);
      const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
        ? 'video/webm;codecs=vp9'
        : 'video/webm';
      const recorder = new MediaRecorder(stream, {
        mimeType,
        videoBitsPerSecond: 4_500_000,
      });
      const chunks: BlobPart[] = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      const donePromise = new Promise<void>((resolve) => {
        recorder.onstop = () => {
          const blob = new Blob(chunks, { type: 'video/webm' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `glamcraft-lesson1-scene-0${activeScene.sceneNumber}.webm`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          resolve();
        };
      });

      recorder.start();
      const startPerf = performance.now();

      await new Promise<void>((resolve) => {
        const step = (now: number) => {
          const t = (now - startPerf) / 1000;
          if (t >= duration) {
            renderFrame(duration);
            setElapsed(duration);
            setExportProgress(100);
            resolve();
            return;
          }
          renderFrame(t);
          setElapsed(t);
          setExportProgress(Math.round((t / duration) * 100));
          requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      });

      recorder.stop();
      await donePromise;
    } finally {
      setIsExporting(false);
    }
  };

  const handleCopy = (key: string, text: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedKey(key);
    window.setTimeout(() => setCopiedKey(null), 1800);
  };

  const readyCount = scenes.filter((s) => s.status === 'ready').length;

  return (
    <div className="space-y-4">
      {/* 16:9 Interactive 12-Second Studio Canvas Video Stage */}
      <div className="overflow-hidden rounded-2xl border border-[#DFC0B6] bg-[#1E1019] shadow-md">
        <div className="relative aspect-video w-full">
          <canvas
            ref={canvasRef}
            width={1280}
            height={720}
            className="h-full w-full object-cover"
          />

          {/* Center Play Overlay when paused & ready */}
          {activeScene.status === 'ready' && !isPlaying && !isExporting && (
            <button
              type="button"
              onClick={handleTogglePlay}
              aria-label={`Play Scene ${activeScene.sceneNumber}`}
              className="absolute inset-0 flex items-center justify-center bg-black/15 transition-colors hover:bg-black/25"
            >
              <span className="flex h-16 w-16 items-center justify-center rounded-full border border-white/50 bg-[#C58371]/85 text-white shadow-xl transition-transform hover:scale-105">
                <Play className="h-7 w-7 fill-white ml-1" />
              </span>
            </button>
          )}

          {/* Pending Scene Notice */}
          {activeScene.status === 'pending' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#23111D]/70 p-6 text-center text-white">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-[#E8B8A9]">
                <Film className="h-6 w-6" />
              </div>
              <p className="mt-3 font-display text-xl font-bold">
                Scene {activeScene.sceneNumber} Queued Next
              </p>
              <p className="mt-1 max-w-md text-xs text-[#E5CDD8]">
                Reply “next” in chat to generate Scene {activeScene.sceneNumber} ({activeScene.title}) studio frames &amp; 12-second clip. Its full voiceover script and AI video prompt are ready below!
              </p>
            </div>
          )}

          {/* Exporting Overlay */}
          {isExporting && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#1C0E18]/80 text-white">
              <p className="font-display text-lg font-semibold">
                Rendering 12s HD Video Clip… {exportProgress}%
              </p>
              <div className="mt-3 h-2 w-56 overflow-hidden rounded-full bg-white/20">
                <div
                  className="h-full rose-gold-gradient transition-all"
                  style={{ width: `${exportProgress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Studio Player Controls Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 bg-[#2B1524] px-3.5 py-2.5 text-white">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleTogglePlay}
              disabled={activeScene.status !== 'ready' || isExporting}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg rose-gold-gradient px-3.5 text-xs font-semibold text-white disabled:opacity-40"
            >
              {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5 fill-white" />}
              <span>{isPlaying ? 'Pause' : 'Play 12s Clip'}</span>
            </button>

            <button
              type="button"
              onClick={handleRestart}
              disabled={activeScene.status !== 'ready' || isExporting}
              aria-label="Restart 12-second clip"
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-white/90 hover:bg-white/20 disabled:opacity-40"
            >
              <RotateCcw className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={() => {
                const next = !voiceEnabled;
                setVoiceEnabled(next);
                if (!next) stopSpeech();
              }}
              className="inline-flex h-9 items-center gap-1 rounded-lg bg-white/10 px-2.5 text-xs text-white/90 hover:bg-white/20"
            >
              {voiceEnabled ? <Volume2 className="h-3.5 w-3.5 text-[#E8B8A9]" /> : <VolumeX className="h-3.5 w-3.5" />}
              <span className="hidden sm:inline">{voiceEnabled ? 'Voice ON' : 'Muted'}</span>
            </button>

            <div className="inline-flex rounded-lg bg-white/10 p-0.5 text-[11px]">
              <button
                type="button"
                onClick={() => setVoiceLang('urdu')}
                className={`rounded-md px-2 py-1 font-medium ${
                  voiceLang === 'urdu' ? 'bg-white text-[#2D1B2E]' : 'text-white/80'
                }`}
              >
                Urdu
              </button>
              <button
                type="button"
                onClick={() => setVoiceLang('en')}
                className={`rounded-md px-2 py-1 font-medium ${
                  voiceLang === 'en' ? 'bg-white text-[#2D1B2E]' : 'text-white/80'
                }`}
              >
                English
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={handleExportVideo}
            disabled={activeScene.status !== 'ready' || isExporting}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[#E6B8A8]/40 bg-white/10 px-3 text-xs font-semibold text-[#F6DDD4] hover:bg-white/20 disabled:opacity-40"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Download 12s Clip (.webm)</span>
          </button>
        </div>
      </div>

      {/* 6-Scene × 12s Storyboard Strip */}
      <div className="rounded-2xl border border-[#F2E4DF] bg-white p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-[#B97664]">
              Lesson 1 Full Masterplan · 6 Scenes × 12s (72s Total)
            </p>
            <h2 className="font-display text-lg font-bold text-[#2D1B2E]">
              Skin Prep &amp; Prime Visual Walkthrough
            </h2>
          </div>
          <span className="rounded-full bg-[#FDF1EC] px-3 py-1 text-xs font-semibold text-[#9C5C4B] tabular-nums">
            {readyCount} of {scenes.length} Videos Ready
          </span>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {scenes.map((scene) => {
            const active = scene.id === activeScene.id;
            return (
              <button
                key={scene.id}
                type="button"
                onClick={() => setSelectedSceneId(scene.id)}
                className={`rounded-xl border p-2.5 text-left transition-all ${
                  active
                    ? 'border-[#C58371] bg-[#FDF1EC] shadow-sm'
                    : 'border-[#F2E4DF] bg-[#FFFDFB] hover:border-[#DFB7AA]'
                }`}
              >
                <div className="flex items-center justify-between gap-1 text-[10px] font-bold">
                  <span className="text-[#8C6458] tabular-nums">
                    SCENE 0{scene.sceneNumber} · 12s
                  </span>
                  <span
                    className={
                      scene.status === 'ready' ? 'text-[#2D6A4F]' : 'text-[#9B858E]'
                    }
                  >
                    {scene.status === 'ready' ? 'READY' : 'NEXT'}
                  </span>
                </div>
                <p className="mt-1 line-clamp-2 text-xs font-semibold text-[#2D1B2E]">
                  {scene.title}
                </p>
                <p className="mt-0.5 text-[10px] text-[#7A6572] tabular-nums">
                  {scene.timeRange}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Scene Voiceover Script + Copyable 12s AI Video Prompt */}
      <div className="rounded-2xl border border-[#F2E4DF] bg-white p-4 space-y-3.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#B97664]">
              <Clock className="h-3.5 w-3.5" />
              Scene 0{activeScene.sceneNumber} ({activeScene.timeRange}) · {activeScene.cameraDirection}
            </span>
            <h3 className="font-display text-lg font-bold text-[#2D1B2E]">
              {activeScene.title}
            </h3>
            <p className="text-xs text-[#7A6572]">{activeScene.aspectCovered}</p>
          </div>
        </div>

        {/* Voiceover Script Box */}
        <div className="rounded-xl border border-[#F2E4DF] bg-[#FFF9F6] p-3.5">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-bold text-[#2D1B2E]">
              Voiceover Script ({voiceLang === 'urdu' ? 'Roman Urdu' : 'English'})
            </span>
            <button
              type="button"
              onClick={() =>
                handleCopy(
                  'vo',
                  voiceLang === 'urdu' ? activeScene.voiceoverUrdu : activeScene.voiceoverEnglish
                )
              }
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#B97664] hover:text-[#2D1B2E]"
            >
              {copiedKey === 'vo' ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copiedKey === 'vo' ? 'Copied' : 'Copy Script'}</span>
            </button>
          </div>
          <p className="mt-1.5 text-sm leading-relaxed text-[#3E2736]">
            “{voiceLang === 'urdu' ? activeScene.voiceoverUrdu : activeScene.voiceoverEnglish}”
          </p>
        </div>

        {/* Exact 12-Second AI Video Prompt Box */}
        <div className="rounded-xl border border-[#E7CFC6] bg-[#FDF6F3] p-3.5">
          <div className="flex items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2D1B2E]">
              <Sparkles className="h-3.5 w-3.5 text-[#C58371]" />
              12-Second AI Video Prompt (Veo / Flow / Runway Ready)
            </span>
            <button
              type="button"
              onClick={() => handleCopy('prompt', activeScene.videoPrompt)}
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#B97664] hover:text-[#2D1B2E]"
            >
              {copiedKey === 'prompt' ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copiedKey === 'prompt' ? 'Copied' : 'Copy Prompt'}</span>
            </button>
          </div>
          <p className="mt-1.5 text-xs leading-relaxed text-[#523B49]">
            {activeScene.videoPrompt}
          </p>
        </div>

        <p className="text-xs text-[#6E5361]">
          <strong className="text-[#2D1B2E]">Bridal Pro Tip:</strong> {activeScene.proTip}
        </p>
      </div>
    </div>
  );
}
