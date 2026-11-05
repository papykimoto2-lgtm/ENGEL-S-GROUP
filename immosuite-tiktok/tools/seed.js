// Jeu de données FICTIF pour la démonstration (noms, montants, lieux inventés).
module.exports = function seedInPage() {
  const T = new Date(); const iso = d => d.toISOString().slice(0,10);
  const addM = (d,m) => { const x=new Date(d); x.setMonth(x.getMonth()+m); return x; };
  const rnd = (()=>{ let s=42; return ()=>{ s=(s*16807)%2147483647; return (s-1)/2147483646; }; })();
  const uidn = (()=>{ let n=0; return p=>p+'_'+(++n); })();
  const P = [
    { id:'prog_palmiers', nom:'Résidence Les Palmiers', localisation:'Abidjan · Cocody Angré', nb_lots:16, statut:'travaux', nature:'construction', date_lancement:'2025-03-01', date_livraison:'2027-03-31', description:'Villas duplex et appartements F3/F4', publier_portail:true, created_at:'2025-02-10' },
    { id:'prog_lahou', nom:'Lotissement Grand-Lahou · Phase 1', localisation:'Grand-Lahou · Lagunes', nb_lots:24, statut:'lancement', nature:'lotissement', date_lancement:'2026-01-15', date_livraison:'2026-12-31', description:'Parcelles viabilisées de 300 à 600 m²', publier_portail:true, created_at:'2025-11-20' },
    { id:'prog_bassam', nom:'Cité Horizon Bassam', localisation:'Grand-Bassam · Mondoukou', nb_lots:12, statut:'etude', nature:'mixte', date_lancement:'2026-09-01', date_livraison:'2028-06-30', description:'Programme mixte villas et parcelles', publier_portail:false, created_at:'2026-06-02' }
  ];
  const lots=[], clients=[], versements=[];
  const noms=[['Koffi','Aya Marie'],['Traoré','Mamadou'],['Yao','Nadège'],['Bamba','Issouf'],['N\'Guessan','Carine'],['Coulibaly','Seydou'],['Kouamé','Estelle'],['Diallo','Fatoumata'],['Ouattara','Ibrahim'],['Konan','Prisca'],['Soro','Lassina'],['Tano','Rosine'],['Aka','Jean-Luc'],['Doumbia','Aminata'],['Gnamien','Sylvie'],['Zadi','Hervé'],['Kra','Mireille'],['Diomandé','Souleymane'],['Brou','Patricia'],['Adou','Franck']];
  let ci=0, vi=0;
  function mkLot(prog, i, kind) {
    const l = { id:'lot_'+prog.id+'_'+i, programme_id:prog.id, parcelle_id:'', operation_id:'', numero:(kind==='terrain'?'P':'V')+String(i).padStart(2,'0'), ilot:String.fromCharCode(65+Math.floor((i-1)/6)), nature:kind==='terrain'?'terrain':'villa', standing:['economique','moyen','haut'][i%3], pieces:kind==='terrain'?0:[3,4,5][i%3], mode_livraison:'gros_oeuvre', created_at:'2025-12-01' };
    if (kind==='terrain') { l.type='Terrain nu viabilisé'; l.surface=[300,400,450,500,600][i%5]; l.prix_mode='m2'; l.prix_m2=[30000,32000,35000][i%3]; l.prix=l.surface*l.prix_m2; l.cout_revient=Math.round(l.prix*0.62); }
    else { l.type=['Appartement F3','Villa duplex F4','Villa F5'][i%3]; l.surface=[92,128,165][i%3]; l.prix_mode='forfait'; l.prix=[38,54,72][i%3]*1000000; l.cout_revient=Math.round(l.prix*0.68); }
    l.statut='disponible'; return l;
  }
  function vendre(lot, k, statutWanted) {
    const [nom,prenoms]=noms[ci%noms.length]; ci++;
    const cid=uidn('cli'); const dsub=addM(T,-(3+Math.floor(rnd()*14)));
    const c={ id:cid, nom:nom.toUpperCase(), prenoms, tel:'07 0'+Math.floor(10+rnd()*89)+' '+Math.floor(10+rnd()*89)+' '+Math.floor(10+rnd()*89)+' 4'+Math.floor(rnd()*9), email:'', nationalite:'Ivoirienne', profession:['Ingénieur','Enseignant','Commerçant','Cadre bancaire','Médecin','Entrepreneur','Fonctionnaire'][ci%7], programme_id:lot.programme_id, lot_id:lot.id, lot_ids:[lot.id], surface:lot.surface, nature_bien:lot.nature==='terrain'?'terrain':'maison', type_logement:lot.type, standing:lot.standing, montant_total:lot.prix, apport:Math.round(lot.prix*0.2), duree:lot.nature==='terrain'?24:48, date_debut:iso(dsub), date_souscription:iso(dsub), statut:'actif', dossier:'DOS-2026-'+String(ci).padStart(4,'0'), created_at:iso(dsub), commercial:['Direction commerciale','Équipe Cocody','Équipe Bassam'][ci%3] };
    clients.push(c); lot.client_id=cid; lot.statut=statutWanted; if(statutWanted==='vendu') lot.date_vente=iso(dsub);
    // versements : apport + n mensualités
    const nm = statutWanted==='vendu' ? 5+Math.floor(rnd()*7) : 1+Math.floor(rnd()*2);
    const mens = Math.round((lot.prix-c.apport)/c.duree/1000)*1000;
    versements.push({ id:uidn('vrs'), ref:'VRS-2026-'+String(++vi).padStart(4,'0'), client_id:cid, date:iso(dsub), type:'apport', montant:c.apport, mode:['virement','cheque','mobile_money'][ci%3], mois:'', notes:'', created_at:iso(dsub), statut:'valide' });
    for (let m=1;m<=nm;m++){ const d=addM(dsub,m); if(d>T) break; versements.push({ id:uidn('vrs'), ref:'VRS-2026-'+String(++vi).padStart(4,'0'), client_id:cid, date:iso(d), type:'mensualite', montant:mens, mode:['virement','mobile_money','especes'][(ci+m)%3], mois:iso(d).slice(0,7), notes:'', created_at:iso(d), statut:'valide' }); }
  }
  [[P[0],16,'bati',[1,2,3,4,5,7,8,10,11,13],[6,9]],[P[1],24,'terrain',[1,2,3,5,6,8,9,11,12,14,15,17,18,20],[4,7,10,13,19]],[P[2],12,'mixte',[],[1,2]]].forEach(([prog,n,kind,sold,res])=>{
    for(let i=1;i<=n;i++){ const lot=mkLot(prog,i,kind==='bati'?'bati':(kind==='mixte'&&i%2?'terrain':(kind==='mixte'?'bati':'terrain'))); lots.push(lot); if(sold.includes(i)) vendre(lot,i,'vendu'); else if(res.includes(i)) vendre(lot,i,'reserve'); }
  });
  DATA.programmes.length=0; DATA.lots.length=0; DATA.clients.length=0; DATA.versements.length=0;
  P.forEach(x=>DATA.programmes.push(x)); lots.forEach(x=>DATA.lots.push(x)); clients.forEach(x=>DATA.clients.push(x)); versements.forEach(x=>DATA.versements.push(x));
  return { programmes:P.length, lots:lots.length, clients:clients.length, versements:versements.length };
};
