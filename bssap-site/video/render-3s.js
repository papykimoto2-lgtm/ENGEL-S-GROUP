const { chromium } = require('playwright'); const fs = require('fs');
const only = process.argv[2] ? process.argv[2].split(',').map(Number) : null;
const OUT = process.argv[3] || 'frames';
(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const b = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const ctx = await b.newContext({ viewport: { width: 360, height: 640 }, deviceScaleFactor: 3 });
  await ctx.addInitScript(() => {
    let t = 0; const q = [];
    performance.now = () => t; Date.now = () => 1.7e12 + t;
    window.requestAnimationFrame = cb => { q.push(cb); return q.length; }; window.cancelAnimationFrame = () => {};
    window.__step = dt => { t += dt; const cur = q.splice(0); cur.forEach(f => { try { f(t); } catch (e) { console.error(e && e.message); } }); };
    window.__pr = 3; window.__coDelay = 120; window.__botPx = 168; window.__topPx = 84; window.__fill = .93;
  });
  const p = await ctx.newPage();
  p.on('pageerror', e => console.log('pageerror:', e.message)); p.on('console', m => { if (m.type() === 'error') console.log('err:', m.text().slice(0, 160)); });
  await p.goto('file://' + __dirname + '/site.html'); await p.waitForTimeout(2800);
  await p.addStyleTag({ content: '.tools,nav#dots,#caption{display:none!important} #sub{bottom:15.5vh!important} header{padding-top:46px!important}' });
  await p.evaluate(() => { for (let i = 0; i < 3; i++) window.__step(33); });
  await p.evaluate(() => { gsap.globalTimeline.timeScale(1.9); window.__bssap.start(false); document.getElementById('intro') && document.getElementById('intro').remove(); gsap.globalTimeline.totalTime(2.3); });
  const FPS = 30, N = 90, EV = { 10: 1, 34: 4, 52: 5 };
  for (let f = 0; f < N; f++) {
    if (EV[f] != null) await p.evaluate(i => window.__bssap.activate(i), EV[f]);
    await p.evaluate(() => window.__step(1000 / 30));
    if (!only || only.includes(f)) await p.screenshot({ path: `${OUT}/f${String(f).padStart(3, '0')}.jpg`, type: 'jpeg', quality: 92 });
  }
  await b.close();
})();
