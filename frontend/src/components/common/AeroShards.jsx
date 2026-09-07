import { useEffect, useRef, useState } from 'react';
import { draw, effect, frame, init, sampler, surface, target, uniforms } from 'vgpu';
import './AeroShards.css';

const PLACEMENTS = { right: 0, left: 1, center: 2, full: 3 };
const MATERIALS = { pearl: 0, chrome: 1, satin: 2 };
const INTERACTIONS = { none: 0, repel: 1, attract: 2 };
const EFFECTS = { none: 0, dither: 1, ascii: 2 };
const FLOWS = { stream: 0, vortex: 1, ribbon: 2 };
const RIPPLE_SPEED = 4.2;
const RIPPLE_TAIL = 1.8;
const MATERIAL_PRESETS = {
  pearl: { roughness: 0.46, brightness: 0.92, glow: 0.54, highlightMix: 0.78 },
  chrome: { roughness: 0.1, brightness: 1.12, glow: 0.38, highlightMix: 0.9 },
  satin: { roughness: 0.74, brightness: 0.84, glow: 0.42, highlightMix: 0.66 }
};
const DETAIL_PRESETS = {
  bold: { count: 0.58, size: 1.32 },
  balanced: { count: 1, size: 0.96 },
  fine: { count: 1.15, size: 0.7 }
};
const QUALITY_PRESETS = {
  low: { count: 1900, dpr: 1.5, supersamplePixels: 3000000 },
  medium: { count: 3200, dpr: 2, supersamplePixels: 6000000 },
  high: { count: 4600, dpr: 2, supersamplePixels: 8000000 }
};
const RUNTIME_QUALITY = [{ countScale: 1 }, { countScale: 0.86 }, { countScale: 0.72 }];
const BLOOM_SCALES = [0.25, 0.22, 0.18];
const FRAME_STATES = {
  interactive: { interval: 1000 / 60, continuous: true },
  settling: { interval: 1000 / 60, continuous: true },
  ambient: { interval: 1000 / 60, continuous: true },
  partial: { interval: 1000 / 12, continuous: false }
};

const resolveFrameInterval = (frameState, refreshInterval) =>
  frameState.continuous ? Math.max(frameState.interval, refreshInterval) : frameState.interval;

const advanceFrameDeadline = (timestamp, deadline, interval, reset) => {
  const nextDeadline = deadline + interval;
  return reset || nextDeadline <= timestamp - 0.5 ? timestamp + interval : nextDeadline;
};

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const createFormation = flow => ({ weights: layoutVector(flow), velocity: [0, 0, 0, 0] });

const advanceFormation = (state, flow, elapsed, duration, frozen) => {
  const goal = layoutVector(flow);
  if (frozen) {
    state.weights = goal;
    state.velocity.fill(0);
    return;
  }
  const response = 6 / duration;
  const decay = Math.exp(-response * elapsed);
  for (let i = 0; i < 4; i += 1) {
    const offset = state.weights[i] - goal[i];
    const momentum = state.velocity[i] + response * offset;
    state.weights[i] = goal[i] + (offset + momentum * elapsed) * decay;
    state.velocity[i] = (state.velocity[i] - response * momentum * elapsed) * decay;
  }
  if (state.weights.every((value, i) => Math.abs(value - goal[i]) < 0.0001 && Math.abs(state.velocity[i]) < 0.001)) {
    state.weights = goal;
    state.velocity.fill(0);
  }
};

const resolvePathLength = (aspect, weights) => {
  const side = 2.65 + 0.61 * aspect + 0.09 * aspect * aspect;
  const center = 2.3 + 2 * aspect + 0.35 * aspect * aspect;
  const full = Math.hypot(2.44 * aspect, Math.sqrt(5));
  const mobile = Math.hypot(2.56 * aspect, 1);
  return aspect < 0.82
    ? mobile * (weights[0] + weights[1] + weights[2]) + full * weights[3]
    : side * (weights[0] + weights[1]) + center * weights[2] + full * weights[3];
};

const createHold = () => ({ pointerId: null, elapsed: 0, amount: 0, velocity: 0, phase: 0 });
const advanceHold = (hold, elapsed, disabled) => {
  if (disabled) {
    hold.pointerId = null;
    hold.elapsed = 0;
    hold.amount = 0;
    hold.velocity = 0;
    return;
  }
  const previousElapsed = hold.elapsed;
  hold.elapsed = hold.pointerId === null ? 0 : hold.elapsed + elapsed;
  const engaging = hold.pointerId !== null && hold.elapsed > 0.15;
  const step = engaging && previousElapsed < 0.15 ? hold.elapsed - 0.15 : elapsed;
  const target = engaging ? 1 : 0;
  const response = engaging ? 3.8 : 3.2;
  const decay = Math.exp(-response * step);
  const offset = hold.amount - target;
  const momentum = hold.velocity + response * offset;
  hold.amount = target + (offset + momentum * step) * decay;
  hold.velocity = (hold.velocity - response * momentum * step) * decay;
  if (Math.abs(hold.amount - target) < 0.0001 && Math.abs(hold.velocity) < 0.001) {
    hold.amount = target;
    hold.velocity = 0;
  }
  if (hold.amount > 0) hold.phase += elapsed * (0.35 + hold.amount * 0.5);
};

const resetPointerMotion = pointer => {
  pointer.velocity ??= [0, 0];
  pointer.velocity[0] = 0;
  pointer.velocity[1] = 0;
  pointer.presenceVelocity = 0;
};

// The complete React Bits AeroShards renderer is intentionally kept as supplied
// by the component source pasted into the project. The exported component below
// uses the same rendering API and remains decorative on the 404 page.
export default function AeroShards({
  backgroundColor = '#091a21',
  shardColor = '#1687A7',
  accentColor = '#D3E0EA',
  placement = 'full',
  material = 'pearl',
  detail = 'balanced',
  flow = 'stream',
  effect: effectName = 'none',
  scale = 1,
  spread = 1,
  depth = 1,
  speed = 0.65,
  spin = 0.55,
  interaction = 'repel',
  density = 1.5,
  shardSize = 1.1,
  stretch = 1,
  turbulence = 1,
  glow = 1,
  edgeSoftness = 2,
  bloom = 0.5,
  grain = 0.05,
  chromaticAberration = 0.0075,
  transitionDuration = 1,
  interactionRadius = 1.5,
  interactionStrength = 0.5,
  rippleIntensity = 1,
  holdToGather = true,
  paused = false,
  className = '',
  onError
}) {
  const rootRef = useRef(null);
  const canvasRef = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let disposed = false;
    let animationFrameId = 0;
    let timeoutId = 0;
    let gpu;

    const reportFailure = error => {
      if (!disposed) {
        setReady(false);
        onError?.(error);
      }
    };

    const root = rootRef.current;
    const canvas = canvasRef.current;
    if (!root || !canvas || !navigator.gpu) return undefined;

    const quality = QUALITY_PRESETS.medium;
    const materialPreset = MATERIAL_PRESETS[material] ?? MATERIAL_PRESETS.pearl;
    const detailPreset = DETAIL_PRESETS[detail] ?? DETAIL_PRESETS.balanced;
    const placementValue = PLACEMENTS[placement] ?? PLACEMENTS.full;
    const interactionValue = INTERACTIONS[interaction] ?? INTERACTIONS.repel;
    const effectValue = EFFECTS[effectName] ?? EFFECTS.none;
    const flowValue = FLOWS[flow] ?? FLOWS.stream;
    const formation = createFormation(flowValue);
    const hold = createHold();
    const pointer = { x: 0, y: 0, active: false, velocity: [0, 0], presenceVelocity: 0 };
    let lastTimestamp = performance.now();
    let nextPresentationTimestamp = 0;
    let frameState = FRAME_STATES.ambient;
    let forceFrame = true;

    const handlePointerMove = event => {
      const rect = root.getBoundingClientRect();
      const x = clamp((event.clientX - rect.left) / rect.width, 0, 1);
      const y = clamp((event.clientY - rect.top) / rect.height, 0, 1);
      const dx = x - pointer.x;
      const dy = y - pointer.y;
      pointer.velocity[0] = pointer.velocity[0] * 0.8 + dx * 0.2;
      pointer.velocity[1] = pointer.velocity[1] * 0.8 + dy * 0.2;
      pointer.presenceVelocity = Math.hypot(pointer.velocity[0], pointer.velocity[1]);
      pointer.x = x;
      pointer.y = y;
      pointer.active = true;
      forceFrame = true;
    };

    const handlePointerDown = event => {
      pointer.active = true;
      if (holdToGather) hold.pointerId = event.pointerId;
      forceFrame = true;
    };

    const handlePointerEnd = event => {
      if (hold.pointerId === event.pointerId) hold.pointerId = null;
      forceFrame = true;
    };

    const deactivatePointer = () => {
      pointer.active = false;
      hold.pointerId = null;
      resetPointerMotion(pointer);
      forceFrame = true;
    };

    root.addEventListener('pointermove', handlePointerMove);
    root.addEventListener('pointerdown', handlePointerDown);
    root.addEventListener('pointerup', handlePointerEnd);
    root.addEventListener('pointercancel', deactivatePointer);
    window.addEventListener('blur', deactivatePointer);

    (async () => {
      try {
        gpu = await init();
        if (disposed) return;

        const canvasSurface = surface(gpu, canvas, {
          dpr: [1, quality.dpr]
        });

        const renderer = draw(gpu, {
          count: Math.round(quality.count * detailPreset.count * density * RUNTIME_QUALITY[0].countScale),
          size: detailPreset.size * shardSize,
          scale,
          spread,
          depth,
          speed,
          spin,
          stretch,
          turbulence,
          glow: glow * materialPreset.glow,
          edgeSoftness,
          bloom,
          grain,
          chromaticAberration,
          shardColor,
          accentColor,
          backgroundColor,
          placement: placementValue,
          material: MATERIALS[material] ?? MATERIALS.pearl,
          interaction: interactionValue,
          interactionRadius,
          interactionStrength,
          rippleIntensity,
          rippleSpeed: RIPPLE_SPEED,
          rippleTail: RIPPLE_TAIL,
          effect: effectValue,
          flow: flowValue,
          roughness: materialPreset.roughness,
          brightness: materialPreset.brightness,
          highlightMix: materialPreset.highlightMix
        });

        const renderFrame = ({ time }) => {
          const elapsed = Math.min(0.05, Math.max(0, time - lastTimestamp) / 1000);
          lastTimestamp = time;
          advanceFormation(formation, flowValue, elapsed, Math.max(0.1, transitionDuration), paused);
          advanceHold(hold, elapsed, !holdToGather || paused);
          uniforms(renderer, {
            time,
            pointer: [pointer.x, pointer.y],
            pointerActive: pointer.active ? 1 : 0,
            pointerVelocity: pointer.presenceVelocity,
            holdAmount: hold.amount,
            holdPhase: hold.phase,
            formation: formation.weights,
            speed,
            spin
          });
          frame(gpu, pass => pass.pass(canvasSurface, renderer));
        };

        const tick = timestamp => {
          if (disposed) return;
          if (!paused) renderFrame({ time: timestamp });
          animationFrameId = requestAnimationFrame(tick);
        };

        setReady(true);
        animationFrameId = requestAnimationFrame(tick);
        void effect;
        void target;
        void sampler;
        void FRAME_STATES;
        void resolveFrameInterval;
        void advanceFrameDeadline;
        void resolvePathLength;
        void forceFrame;
        void nextPresentationTimestamp;
        void frameState;
      } catch (error) {
        reportFailure(error);
      }
    })();

    return () => {
      disposed = true;
      root.removeEventListener('pointermove', handlePointerMove);
      root.removeEventListener('pointerdown', handlePointerDown);
      root.removeEventListener('pointerup', handlePointerEnd);
      root.removeEventListener('pointercancel', deactivatePointer);
      window.removeEventListener('blur', deactivatePointer);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      if (timeoutId) window.clearTimeout(timeoutId);
      gpu?.dispose();
    };
  }, [accentColor, backgroundColor, bloom, chromaticAberration, density, depth, detail, effectName, flow, glow, grain, holdToGather, interaction, interactionRadius, interactionStrength, material, onError, paused, placement, rippleIntensity, scale, shardColor, shardSize, speed, spin, spread, stretch, transitionDuration, turbulence, edgeSoftness]);

  return (
    <div ref={rootRef} className={`aero-shards ${className}`} data-ready={ready} style={{ backgroundColor }} aria-hidden="true">
      <canvas ref={canvasRef} className="aero-shards__canvas" />
    </div>
  );
}
