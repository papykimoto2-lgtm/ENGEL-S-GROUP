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
    window.__pr = 3; window.__coDelay = 500; window.__botPx = 196; window.__topPx = 84; window.__fill = .93;
  });
  const p = await ctx.newPage();
  p.on('pageerror', e => console.log('pageerror:', e.message)); p.on('console', m => { if (m.type() === 'error') console.log('err:', m.text().slice(0, 160)); });
  await p.goto('file://' + __dirname + '/site.html'); await p.waitForTimeout(2800);
  await p.addStyleTag({ content: '.tools,nav#dots,#caption{display:none!important} #sub{bottom:13.5vh!important} header{padding-top:46px!important} #byline{display:block!important;position:fixed;left:0;right:0;bottom:3.2vh;margin:0;text-align:center;font-size:10.5px;line-height:1.45;z-index:6;color:rgba(255,255,255,.92);text-shadow:0 1px 8px rgba(40,0,0,.6)} .logo small{display:block!important}' });
  await p.evaluate(() => { for (let i = 0; i < 3; i++) window.__step(33); });
  await p.evaluate(() => { gsap.globalTimeline.timeScale(1.25); window.__bssap.start(false); document.getElementById('intro') && document.getElementById('intro').remove(); });
  const N = 450, EV = { 50: 1, 118: 2, 184: 3, 232: 4, 272: 5, 352: 6, 394: 7 };
  const t0 = Date.now();
  for (let f = 0; f < N; f++) {
    if (EV[f] != null) await p.evaluate(i => window.__bssap.activate(i), EV[f]);
    if (f === 394) await p.evaluate(() => {
      const by = document.getElementById('byline');
      by.innerHTML = '<div style="font-size:13px;letter-spacing:.2em;text-transform:uppercase;opacity:.92">Un concept</div><div style="font-family:Fredoka,sans-serif;font-weight:700;font-size:31px;line-height:1.1;margin-top:2px"><span style="color:#00d084">SANIX</span> AFRICA</div><div style="font-size:12.5px;margin-top:8px;opacity:.95">Pour vos produits, contactez-nous au</div><div style="font-size:15px;font-weight:700;margin-top:2px">+225 07 79 18 10 75 / 01 40 01 77 51</div>';
      gsap.fromTo(by, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: .6, ease: 'power3.out' });
      document.getElementById('subCta').style.display = 'none'; document.getElementById('subK').style.display = 'none';
      document.getElementById('sub').style.setProperty('bottom', '28vh', 'important');
    });
    await p.evaluate(() => window.__step(1000 / 30));
    if (!only || only.includes(f)) await p.screenshot({ path: `${OUT}/f${String(f).padStart(3, '0')}.jpg`, type: 'jpeg', quality: 92 });
    if (f % 50 === 0) console.log(f, ((Date.now() - t0) / 1000).toFixed(0) + 's');
  }
  console.log('done'); await b.close();
})();
