// Lightweight JS for buttery-smooth interactions
// - Canvas background with subtle motion using rAF
// - Mobile menu toggle
// - Small optimizations for 90fps-capable devices
(function(){
  // DOM refs
  const canvas = document.getElementById('bgCanvas');
  const ctx = canvas && canvas.getContext && canvas.getContext('2d');
  const yearEl = document.getElementById('year');
  if(yearEl) yearEl.textContent = new Date().getFullYear();

  // Mobile menu
  const menuToggle = document.getElementById('menuToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  if(menuToggle){
    menuToggle.addEventListener('click', ()=>{
      const open = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', String(!open));
      if(mobileMenu) {
        if(open){ mobileMenu.hidden = true; }
        else { mobileMenu.hidden = false; }
      }
    });
  }

  // Canvas background: gentle floating nodes — optimized for transform-like motion
  if(!ctx || window.matchMedia('(prefers-reduced-motion: reduce)').matches){
    // no canvas or reduced motion -> bail
    if(canvas) canvas.style.opacity = 0.6;
    return;
  }

  // Resize canvas to device pixel ratio
  function fitCanvas(){
    const dpr = Math.min(window.devicePixelRatio || 1, 2); // cap DPR for performance
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    ctx.setTransform(dpr,0,0,dpr,0,0);
  }
  fitCanvas();
  window.addEventListener('resize', () => { fitCanvas(); });

  // Create nodes
  const NODE_COUNT = 18;
  const nodes = [];
  const palette = ['rgba(124,140,255,0.14)','rgba(110,231,183,0.12)','rgba(255,255,255,0.06)'];

  function rand(min,max){ return Math.random()*(max-min)+min; }
  for(let i=0;i<NODE_COUNT;i++){
    nodes.push({
      x: rand(0, canvas.clientWidth),
      y: rand(0, canvas.clientHeight),
      r: rand(40, 140),
      vx: rand(-0.02, 0.02),
      vy: rand(-0.02, 0.02),
      col: palette[i % palette.length],
      phase: rand(0, Math.PI*2),
      speed: rand(0.0008, 0.0025)
    });
  }

  // Animation loop using rAF; keep computations minimal
  let last = performance.now();
  function draw(now){
    const dt = Math.min(32, now - last); // cap dt
    last = now;
    const cw = canvas.clientWidth;
    const ch = canvas.clientHeight;

    ctx.clearRect(0,0,cw,ch);

    // subtle blur-layered nodes
    for(let i=0;i<nodes.length;i++){
      const n = nodes[i];
      // evolve position slightly with tiny oscillation to mimic floating
      n.phase += n.speed * dt;
      const ox = Math.cos(n.phase) * 8;
      const oy = Math.sin(n.phase) * 6;
      const x = (n.x + ox);
      const y = (n.y + oy);

      // draw soft radial
      const g = ctx.createRadialGradient(x, y, n.r*0.03, x, y, n.r);
      g.addColorStop(0, n.col);
      g.addColorStop(1, 'rgba(2,6,23,0)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x, y, n.r, 0, Math.PI*2);
      ctx.fill();
    }

    // subtle lines between close nodes
    ctx.lineWidth = 0.6;
    ctx.strokeStyle = 'rgba(124,140,255,0.04)';
    for(let a=0;a<nodes.length;a++){
      for(let b=a+1;b<nodes.length;b++){
        const na = nodes[a], nb = nodes[b];
        const dx = na.x - nb.x, dy = na.y - nb.y;
        const d = Math.hypot(dx, dy);
        if(d < 220){
          ctx.globalAlpha = 1 - (d / 220);
          ctx.beginPath();
          ctx.moveTo(na.x, na.y);
          ctx.lineTo(nb.x, nb.y);
          ctx.stroke();
        }
      }
    }
    ctx.globalAlpha = 1;

    // move nodes a tiny bit
    for(let i=0;i<nodes.length;i++){
      const n = nodes[i];
      n.x += n.vx * dt;
      n.y += n.vy * dt;
      // wrap around
      if(n.x < -200) n.x = cw + 200;
      if(n.x > cw + 200) n.x = -200;
      if(n.y < -200) n.y = ch + 200;
      if(n.y > ch + 200) n.y = -200;
    }

    // request next frame
    rafId = requestAnimationFrame(draw);
  }

  let rafId = requestAnimationFrame((t)=>{ last = t; draw(t); });

  // Pause animation when tab not visible to save CPU
  document.addEventListener('visibilitychange', ()=>{
    if(document.hidden){
      if(rafId) cancelAnimationFrame(rafId);
      rafId = null;
    } else {
      if(!rafId) rafId = requestAnimationFrame((t)=>{ last = t; draw(t); });
    }
  });
})();
