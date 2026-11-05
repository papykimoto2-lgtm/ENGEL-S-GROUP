const { chromium } = require('playwright'); const fs=require('fs');
const seed = require('./seed.js');
const W=+process.argv[2]||1080,H=+process.argv[3]||1500,OUT=process.argv[4]||'cap';
(async()=>{fs.mkdirSync(OUT,{recursive:true});
const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:W,height:H},deviceScaleFactor:+(process.argv[5]||1)});const p=await ctx.newPage();
const errs=[];p.on('pageerror',e=>errs.push(e.message.slice(0,160)));
await p.route(/^https?:\/\/(?!file)/,r=>r.abort());
await p.goto('file:///home/user/papykimoto2-lgtm/ImmoSuite-ERP/index.html');await p.waitForTimeout(2500);
await p.fill('#setup-nom','Direction Menko');await p.fill('#setup-login','direction');await p.fill('#setup-pass','Menko#2026a');await p.fill('#setup-pass2','Menko#2026a');
await p.evaluate(()=>creerPremierAdmin());await p.waitForTimeout(2500);
await p.fill('#login-user','direction');await p.fill('#login-pass','Menko#2026a');await p.evaluate(()=>doLogin());await p.waitForTimeout(4000);
await p.evaluate(`(${seed.toString()})()`);
await p.evaluate(()=>{ const T=new Date(); const iso=d=>d.toISOString().slice(0,10); const d=n=>{const x=new Date(T);x.setDate(x.getDate()+n);return iso(x)};
 const L=[['Kouadio Armand','prospect','Résidence Les Palmiers',45000000,'facebook'],['Tanoh Sylvie','prospect','Lotissement Grand-Lahou · Phase 1',12000000,'whatsapp'],['Bakayoko Idriss','prospect','Résidence Les Palmiers',60000000,'site web'],['Ehui Carole','contact','Lotissement Grand-Lahou · Phase 1',15000000,'apporteur'],['Sangaré Moussa','contact','Résidence Les Palmiers',55000000,'recommandation'],['Lago Estelle','visite','Résidence Les Palmiers',70000000,'salon'],['Yapi Christian','visite','Lotissement Grand-Lahou · Phase 1',11000000,'whatsapp'],['Fofana Mariam','visite_faite','Résidence Les Palmiers',42000000,'facebook'],['Aby Désiré','visite_faite','Lotissement Grand-Lahou · Phase 1',14000000,'apporteur'],['Sidibé Karim','negociation','Résidence Les Palmiers',68000000,'recommandation'],['Gbané Hortense','negociation','Lotissement Grand-Lahou · Phase 1',16000000,'site web'],['Niamké Paul','reservation','Résidence Les Palmiers',54000000,'apporteur']];
 DATA.leads.length=0; L.forEach((r,i)=>{ const pr=DATA.programmes.find(p=>p.nom===r[2]); DATA.leads.push({id:'ld'+i,nom:r[0],tel:'07 '+(10+i*3)+' 22 '+(40+i)+' 1'+i,email:'',profession:'',programme_id:pr?pr.id:'',type_logement:'',budget:r[3],source:r[4],stade:r[1],commercial_id:'',date_contact:d(-12+i),date_relance:d(i%5),notes:'',created_at:d(-12+i)}); }); });
const scrollMain = async (y)=>{ await p.evaluate(y=>{ const els=[document.scrollingElement,...document.querySelectorAll('.main-content,.content,main,#main,.page.active,.page-container')]; els.forEach(e=>{ if(e){ e.scrollTop=y; } }); window.scrollTo(0,y); }, y); await p.waitForTimeout(500); };
const shots=JSON.parse(process.argv[6]||'null') || [
 ['cockpit',"goTo('dashboard')",[0,520]],
 ['programmes',"goTo('programmes')",[0,560]],
 ['lots',"goTo('lots');switchTab('lots','grille')",[0,700]],
 ['souscripteurs',"goTo('clients')",[0,650]],
 ['paiements',"goTo('paiements')",[0,480]],
 ['commercial',"goTo('commercialisation')",[0,560]],
 ['crm',"goTo('leads')",[0,420]],
 ['bilan',"goTo('bilan-promotion');var s=document.getElementById('bp-programme');if(s){s.value='prog_palmiers';bpRender();}",[0,760]],
 ['lotsdash',"goTo('lots')",[0,520]],
];
for(const [name,code,ys] of shots){ try{ await p.evaluate(code); await p.waitForTimeout(1300); for(let i=0;i<ys.length;i++){ await scrollMain(ys[i]); await p.screenshot({path:`${OUT}/${name}_${i}.png`}); } await scrollMain(0);}catch(e){console.log('fail',name,e.message.slice(0,100));} }
console.log(errs.slice(0,6));
await b.close()})();
