// Self-contained canvas ambient-effect engine. One class renders any of the 11 effect
// types (mirroring the app's Metal effects), parameterized by colors so it can re-skin
// live when the theme changes. No dependencies.

import type { EffectType } from '@/data/themes.schema';

export interface EffectConfig {
  type: EffectType;
  colors: string[];
  /** 0.5–1.5 multiplier on particle count; default 1 */
  density?: number;
  /** 0.5–2 multiplier on speed; default 1 */
  speed?: number;
}

interface P { x: number; y: number; vx: number; vy: number; r: number; a: number; rot: number; vr: number; ph: number; ci: number; }

const FALL: EffectType[] = ['snow', 'petals', 'maple', 'rain'];
const RISE: EffectType[] = ['motes', 'bubbles', 'fireflies'];
const BLOB: EffectType[] = ['orbs', 'aurora'];

function rand(a: number, b: number) { return a + Math.random() * (b - a); }

export class AmbientEffect {
  private ctx: CanvasRenderingContext2D;
  private cfg: Required<EffectConfig>;
  private ps: P[] = [];
  private raf = 0;
  private last = 0;
  private w = 0;
  private h = 0;
  private dpr = 1;
  private running = false;
  private reduce: boolean;
  private ro: ResizeObserver;
  private io?: IntersectionObserver;

  constructor(private canvas: HTMLCanvasElement, cfg: EffectConfig) {
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('2d context unavailable');
    this.ctx = ctx;
    this.cfg = { density: 1, speed: 1, ...cfg };
    this.reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.resize();
    this.spawn();
    this.ro = new ResizeObserver(() => { this.resize(); this.spawn(); });
    this.ro.observe(canvas);
    // Pause when scrolled offscreen to save battery.
    this.io = new IntersectionObserver((es) => {
      for (const e of es) e.isIntersecting ? this.start() : this.stop();
    }, { threshold: 0 });
    this.io.observe(canvas);
  }

  setConfig(next: Partial<EffectConfig>) {
    this.cfg = { ...this.cfg, ...next };
    this.spawn();
    if (this.reduce) this.drawStatic();
  }

  private resize() {
    const rect = this.canvas.getBoundingClientRect();
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.w = Math.max(1, rect.width);
    this.h = Math.max(1, rect.height);
    this.canvas.width = Math.round(this.w * this.dpr);
    this.canvas.height = Math.round(this.h * this.dpr);
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
  }

  private count(): number {
    const { type, density } = this.cfg;
    const area = this.w * this.h;
    if (BLOB.includes(type)) return type === 'aurora' ? 4 : 6;
    let base = Math.round(area / 14000);
    if (type === 'rain') base = Math.round(area / 7000);
    if (type === 'stars') base = Math.round(area / 11000);
    if (type === 'fireflies') base = Math.round(area / 30000); // glow is costly — keep sparse
    return Math.max(8, Math.min(150, Math.round(base * density)));
  }

  private spawn() {
    const n = this.count();
    const { type } = this.cfg;
    this.ps = [];
    for (let i = 0; i < n; i++) this.ps.push(this.make(type, i, true));
  }

  private make(type: EffectType, i: number, initial: boolean): P {
    const w = this.w, h = this.h;
    const ci = i % Math.max(1, this.cfg.colors.length);
    if (BLOB.includes(type)) {
      return { x: rand(0, w), y: rand(0, h), vx: rand(-6, 6), vy: rand(-6, 6),
               r: type === 'aurora' ? rand(w * 0.3, w * 0.6) : rand(80, 200),
               a: type === 'aurora' ? 0.20 : 0.5, rot: 0, vr: 0, ph: rand(0, 6.28), ci };
    }
    if (RISE.includes(type)) {
      return { x: rand(0, w), y: initial ? rand(0, h) : h + 10, vx: rand(-8, 8),
               vy: -rand(12, 34), r: type === 'bubbles' ? rand(4, 12) : rand(1.2, 3),
               a: rand(0.3, 0.9), rot: 0, vr: 0, ph: rand(0, 6.28), ci };
    }
    if (type === 'stars') {
      return { x: rand(0, w), y: rand(0, h), vx: rand(-3, 3), vy: rand(-3, 3),
               r: rand(0.6, 1.8), a: rand(0.3, 1), rot: 0, vr: 0, ph: rand(0, 6.28), ci };
    }
    // FALL
    const fast = type === 'rain';
    return { x: rand(0, w), y: initial ? rand(0, h) : -10, vx: type === 'rain' ? 0 : rand(-10, 10),
             vy: fast ? rand(380, 560) : rand(28, 70), r: type === 'rain' ? rand(8, 16) : rand(4, 9),
             a: rand(0.4, 0.9), rot: rand(0, 6.28), vr: rand(-1.5, 1.5), ph: rand(0, 6.28), ci };
  }

  private step(dt: number) {
    const { type, speed } = this.cfg;
    const s = speed * dt;
    for (let i = 0; i < this.ps.length; i++) {
      const p = this.ps[i];
      if (BLOB.includes(type)) {
        p.x += p.vx * s; p.y += p.vy * s; p.ph += dt;
        if (p.x < -p.r) p.x = this.w + p.r; if (p.x > this.w + p.r) p.x = -p.r;
        if (p.y < -p.r) p.y = this.h + p.r; if (p.y > this.h + p.r) p.y = -p.r;
        continue;
      }
      if (type === 'stars') {
        p.x += p.vx * s; p.y += p.vy * s; p.ph += dt * 2;
        if (p.x < 0) p.x = this.w; if (p.x > this.w) p.x = 0;
        if (p.y < 0) p.y = this.h; if (p.y > this.h) p.y = 0;
        continue;
      }
      if (RISE.includes(type)) {
        p.x += p.vx * s + Math.sin(p.ph + p.y * 0.02) * 6 * s;
        p.y += p.vy * s; p.ph += dt * 2;
        if (p.y < -12) Object.assign(p, this.make(type, i, false));
        continue;
      }
      // FALL
      p.y += p.vy * s;
      p.x += (type === 'rain' ? 0 : Math.sin(p.ph + p.y * 0.01) * 16) * s;
      p.rot += p.vr * dt;
      if (p.y > this.h + 14) Object.assign(p, this.make(type, i, false));
    }
  }

  private draw() {
    const ctx = this.ctx, { type, colors } = this.cfg;
    ctx.clearRect(0, 0, this.w, this.h);
    const col = (i: number) => colors[i % colors.length] || '#ffffff';

    if (type === 'aurora' || type === 'orbs') {
      ctx.globalCompositeOperation = 'lighter';
      for (const p of this.ps) {
        const breathe = 0.6 + 0.4 * Math.sin(p.ph);
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
        const c = col(p.ci);
        g.addColorStop(0, hexA(c, (type === 'aurora' ? 0.16 : 0.5) * breathe));
        g.addColorStop(1, hexA(c, 0));
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.2832); ctx.fill();
      }
      ctx.globalCompositeOperation = 'source-over';
      return;
    }

    if (type === 'stars') {
      // constellation lines between near stars
      ctx.lineWidth = 1;
      for (let i = 0; i < this.ps.length; i++) {
        for (let j = i + 1; j < this.ps.length; j++) {
          const a = this.ps[i], b = this.ps[j];
          const dx = a.x - b.x, dy = a.y - b.y, d2 = dx * dx + dy * dy;
          if (d2 < 120 * 120) {
            ctx.strokeStyle = hexA(col(0), 0.08 * (1 - Math.sqrt(d2) / 120));
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        }
      }
      for (const p of this.ps) {
        const tw = 0.5 + 0.5 * Math.sin(p.ph);
        ctx.fillStyle = hexA(col(p.ci), p.a * tw);
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.2832); ctx.fill();
      }
      return;
    }

    for (const p of this.ps) {
      ctx.save();
      ctx.translate(p.x, p.y);
      const c = col(p.ci);
      if (type === 'rain') {
        ctx.strokeStyle = hexA(c, p.a * 0.6); ctx.lineWidth = 1.4;
        ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, p.r); ctx.stroke();
      } else if (type === 'bubbles') {
        ctx.strokeStyle = hexA(c, p.a); ctx.lineWidth = 1.4;
        ctx.beginPath(); ctx.arc(0, 0, p.r, 0, 6.2832); ctx.stroke();
      } else if (type === 'motes') {
        ctx.globalCompositeOperation = 'lighter';
        ctx.fillStyle = hexA(c, p.a * 0.8);
        ctx.beginPath(); ctx.arc(0, 0, p.r, 0, 6.2832); ctx.fill();
        ctx.globalCompositeOperation = 'source-over';
      } else if (type === 'fireflies') {
        // Cheap glow: an additive radial-gradient halo + a bright core (no shadowBlur).
        const pulse = 0.35 + 0.65 * Math.abs(Math.sin(p.ph));
        ctx.globalCompositeOperation = 'lighter';
        const halo = p.r * 4;
        const g = ctx.createRadialGradient(0, 0, 0, 0, 0, halo);
        g.addColorStop(0, hexA(c, p.a * pulse * 0.8));
        g.addColorStop(1, hexA(c, 0));
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(0, 0, halo, 0, 6.2832); ctx.fill();
        ctx.fillStyle = hexA(c, p.a * pulse);
        ctx.beginPath(); ctx.arc(0, 0, p.r, 0, 6.2832); ctx.fill();
        ctx.globalCompositeOperation = 'source-over';
      } else if (type === 'petals' || type === 'maple' || type === 'bamboo') {
        ctx.rotate(p.rot); ctx.fillStyle = hexA(c, p.a);
        const rx = type === 'bamboo' ? p.r * 1.8 : p.r;
        const ry = type === 'bamboo' ? p.r * 0.45 : p.r * 0.62;
        ctx.beginPath(); ctx.ellipse(0, 0, rx, ry, 0, 0, 6.2832); ctx.fill();
      } else { // snow
        ctx.fillStyle = hexA(c, p.a);
        ctx.beginPath(); ctx.arc(0, 0, p.r, 0, 6.2832); ctx.fill();
      }
      ctx.restore();
    }
  }

  private drawStatic() { this.draw(); }

  private loop = (now: number) => {
    if (!this.running) return;
    const dt = Math.min(0.05, (now - this.last) / 1000) || 0.016;
    this.last = now;
    this.step(dt);
    this.draw();
    this.raf = requestAnimationFrame(this.loop);
  };

  start() {
    if (this.running) return;
    if (this.reduce) { this.drawStatic(); return; } // static single frame
    this.running = true;
    this.last = performance.now();
    this.raf = requestAnimationFrame(this.loop);
  }

  stop() {
    this.running = false;
    if (this.raf) cancelAnimationFrame(this.raf);
  }

  destroy() {
    this.stop();
    this.ro.disconnect();
    this.io?.disconnect();
  }
}

/** Apply an alpha to a #rrggbb hex, returning an rgba() string. */
export function hexA(hex: string, a: number): string {
  const h = hex.replace('#', '');
  const n = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  const r = parseInt(n.slice(0, 2), 16), g = parseInt(n.slice(2, 4), 16), b = parseInt(n.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${Math.max(0, Math.min(1, a))})`;
}
