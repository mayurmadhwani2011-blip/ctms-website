/* CTMS marketing site — interactions, i18n (EN ⇄ AR), demo components */
(function(){
'use strict';
var root=document.documentElement;
var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
var store={get:function(k){try{return localStorage.getItem(k);}catch(e){return null;}},set:function(k,v){try{localStorage.setItem(k,v);}catch(e){}}};
var LANG=root.getAttribute('lang')==='ar'?'ar':'en';
function L(en,ar){return LANG==='ar'?ar:en;}
function T(o){return o?(LANG==='ar'?o.ar:o.en):'';}
function $(s,c){return (c||document).querySelector(s);}
function $$(s,c){return [].slice.call((c||document).querySelectorAll(s));}
function ic(id){return '<svg class="ico"><use href="#i-'+id+'"/></svg>';}

/* =============================== Theme =============================== */
$$('[data-theme-toggle]').forEach(function(b){
  b.addEventListener('click',function(){
    var cur=root.getAttribute('data-theme')||(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');
    var next=cur==='dark'?'light':'dark';
    root.setAttribute('data-theme',next);store.set('ctms-theme',next);
  });
});

/* =============================== Nav =============================== */
var nav=$('#nav');
function onScroll(){nav.classList.toggle('scrolled',window.scrollY>12);}
window.addEventListener('scroll',onScroll,{passive:true});onScroll();

var mnav=$('#mnav'),menuBtn=$('#menuBtn');
function setMenu(open){mnav.classList.toggle('open',open);mnav.setAttribute('aria-hidden',open?'false':'true');menuBtn.setAttribute('aria-expanded',open?'true':'false');document.body.style.overflow=open?'hidden':'';}
menuBtn.addEventListener('click',function(){setMenu(true);});
$$('[data-close-menu]').forEach(function(el){el.addEventListener('click',function(){setMenu(false);});});

// active section highlight
var navLinks=$$('.nav-links a');
if('IntersectionObserver' in window){
  var secIO=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){var id='#'+e.target.id;navLinks.forEach(function(a){a.classList.toggle('active',a.getAttribute('href')===id);});}});},{rootMargin:'-45% 0px -50% 0px'});
  navLinks.forEach(function(a){var s=$(a.getAttribute('href'));if(s)secIO.observe(s);});
}

/* =============================== Reveal =============================== */
function observeReveal(){
  var els=$$('.reveal:not(.in)');
  if(reduce||!('IntersectionObserver' in window)){els.forEach(function(el){el.classList.add('in');});return;}
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});},{threshold:.1,rootMargin:'0px 0px -6% 0px'});
  els.forEach(function(el){io.observe(el);});
}
$('#yr').textContent=new Date().getFullYear();

/* =============================== Workflow =============================== */
var WF=[
 {ic:'cal',n:{en:'Appointment',ar:'الموعد'},d:{en:'Reception books Fatima with Dr. Ahmad at 10:30. The slot, doctor schedule and reminder are created in one step.',ar:'يحجز الاستقبال موعداً لفاطمة مع د. أحمد الساعة ١٠:٣٠. يُنشأ الموعد وجدول الطبيب والتذكير بخطوة واحدة.'},r:{en:'Schedule',ar:'الجدول'},rs:{en:'Dr. Ahmad · 10:30 · reminder queued',ar:'د. أحمد · ١٠:٣٠ · تذكير مجدول'},v:'APT-3318'},
 {ic:'checkin',n:{en:'Patient Check-In',ar:'تسجيل الوصول'},d:{en:'On arrival, the Civil ID is matched to the existing record — no duplicates — and Fatima joins the live queue.',ar:'عند الوصول، يُطابق الرقم المدني مع السجل الحالي — دون تكرار — وتنضم فاطمة إلى قائمة الانتظار المباشرة.'},r:{en:'Queue & attendance',ar:'الانتظار والحضور'},rs:{en:'Checked in 10:24 · position 2',ar:'وصلت ١٠:٢٤ · الترتيب ٢'},v:'Q-02'},
 {ic:'steth',n:{en:'Doctor Consultation',ar:'استشارة الطبيب'},d:{en:"Dr. Ahmad opens the visit from his worklist and sees full history, allergies and previous prescriptions.",ar:'يفتح د. أحمد الزيارة من قائمته ويرى التاريخ الكامل والحساسية والوصفات السابقة.'},r:{en:'Doctor worklist',ar:'قائمة الطبيب'},rs:{en:'Visit opened · history loaded',ar:'فُتحت الزيارة · حُمّل التاريخ'},v:'V-20931'},
 {ic:'file',n:{en:'EMR / Treatment',ar:'السجل الطبي / العلاج'},d:{en:'Vitals, clinical notes, diagnosis and services performed are recorded against the visit.',ar:'تُسجّل العلامات الحيوية والملاحظات السريرية والتشخيص والخدمات المقدّمة على الزيارة.'},r:{en:'Patient record (EMR)',ar:'السجل الطبي'},rs:{en:'Notes · vitals · 2 services',ar:'ملاحظات · علامات حيوية · خدمتان'},v:'P-10432'},
 {ic:'rx',n:{en:'Prescription',ar:'الوصفة'},d:{en:'A prescription is written and sent straight to the pharmacy queue — no paper, no re-typing.',ar:'تُكتب الوصفة وتُرسل مباشرةً إلى الصيدلية — دون ورق ودون إعادة إدخال.'},r:{en:'Prescription',ar:'الوصفة'},rs:{en:'Amoxicillin 500mg · 7 days',ar:'أموكسيسيلين ٥٠٠ ملغ · ٧ أيام'},v:'RX-7781'},
 {ic:'receipt',n:{en:'Billing',ar:'الفوترة'},d:{en:'The invoice builds itself from the services and medicines in the visit, each line attributed to the right doctor.',ar:'تُنشأ الفاتورة تلقائياً من خدمات الزيارة وأدويتها، وكل بند منسوب للطبيب الصحيح.'},r:{en:'Invoice',ar:'الفاتورة'},rs:{en:'3 lines · per-doctor attribution',ar:'٣ بنود · منسوبة للطبيب'},v:'KWD 45.000'},
 {ic:'card',n:{en:'Payment',ar:'الدفع'},d:{en:'Fatima pays KWD 30 by KNET and KWD 15 in cash. Both are recorded against the same invoice and the day-end drawer.',ar:'تدفع فاطمة ٣٠ د.ك عبر كي‑نت و١٥ د.ك نقداً. يُسجّل الاثنان على الفاتورة نفسها وصندوق نهاية اليوم.'},r:{en:'Payments',ar:'المدفوعات'},rs:{en:'KNET 30.000 · Cash 15.000',ar:'كي‑نت 30.000 · نقداً 15.000'},v:'PAID'},
 {ic:'box',n:{en:'Inventory Update',ar:'تحديث المخزون'},d:{en:'Dispensing reduces branch stock at cost. Amoxicillin drops below its reorder level and is flagged.',ar:'يخفض الصرف مخزون الفرع بالتكلفة. ينخفض الأموكسيسيلين دون حد إعادة الطلب ويُنبَّه عليه.'},r:{en:'Branch stock',ar:'مخزون الفرع'},rs:{en:'Amoxicillin −1 → 12 left · low',ar:'أموكسيسيلين −١ ← ١٢ متبقية · منخفض'},v:'−1'},
 {ic:'ledger',n:{en:'Accounting',ar:'المحاسبة'},d:{en:'Revenue, cost of goods and payment method totals post automatically to the branch books.',ar:'تُرحّل الإيرادات وتكلفة البضاعة وإجماليات طرق الدفع تلقائياً إلى دفاتر الفرع.'},r:{en:'Revenue & COGS',ar:'الإيراد وتكلفة البضاعة'},rs:{en:'Posted to Salmiya branch',ar:'رُحّلت إلى فرع السالمية'},v:'+45.000'},
 {ic:'trend',n:{en:'Profit & Loss',ar:'الأرباح والخسائر'},d:{en:"The owner's P&L, doctor revenue and branch comparison reflect the visit immediately — no month-end reconciliation.",ar:'تعكس الأرباح والخسائر وإيرادات الطبيب ومقارنة الفروع الزيارة فوراً — دون تسوية نهاية الشهر.'},r:{en:'P&L & owner reports',ar:'الأرباح وتقارير المالك'},rs:{en:'Doctor · service · branch updated',ar:'الطبيب · الخدمة · الفرع محدّثة'},v:'LIVE'}
];
var wfI=0,wfTimer=null,wfPlaying=!reduce,wfStarted=false,STEP_MS=3600,wfT0=0,wfRaf=0;
function renderWF(){
  var ol=$('#wfSteps'),prog=$('#wfProg');
  ol.innerHTML='';ol.appendChild(prog);
  WF.forEach(function(s,i){
    var li=document.createElement('li');li.className='wf-step';
    li.innerHTML='<button type="button" aria-label="'+T(s.n)+'"><span class="wf-node">'+ic(s.ic)+'</span><span class="nm">'+T(s.n)+'</span><span class="ix">'+String(i+1).padStart(2,'0')+'</span></button>';
    li.querySelector('button').addEventListener('click',function(){wfPlaying=false;updatePlayBtn();goWF(i);});
    ol.appendChild(li);
  });
  var lg=$('#ledger');lg.innerHTML='';
  WF.forEach(function(s){
    var d=document.createElement('div');d.className='lg-row';
    d.innerHTML='<span class="ic">'+ic(s.ic)+'</span><span class="t"><b>'+T(s.r)+'</b><small>'+T(s.rs)+'</small></span><span class="v">'+s.v+'</span>';
    lg.appendChild(d);
  });
  goWF(wfI,true);
}
function goWF(i,silent){
  wfI=i;var steps=$$('.wf-step'),rows=$$('.lg-row');
  steps.forEach(function(el,j){el.classList.toggle('done',j<i);el.classList.toggle('cur',j===i);});
  rows.forEach(function(el,j){el.classList.toggle('on',j<=i);el.classList.toggle('flash',j===i);});
  var s=WF[i];
  $('#wfK').textContent=L('STEP ','الخطوة ')+String(i+1).padStart(2,'0')+' / 10';
  $('#wfT').textContent=T(s.n);$('#wfD').textContent=T(s.d);
  var first=steps[0],cur=steps[i];
  if(first&&cur&&window.innerWidth>900){$('#wfProg').style.height=Math.max(0,cur.offsetTop-first.offsetTop)+'px';}
  if(!silent&&cur&&window.innerWidth<=900){var ol=$('#wfSteps');ol.scrollTo({left:cur.offsetLeft-ol.offsetLeft-16,behavior:reduce?'auto':'smooth'});}
  wfT0=performance.now();
  if(!wfPlaying)$('#wfBar').style.width='0';
}
function wfTick(now){
  if(wfPlaying){
    var p=Math.min((now-wfT0)/STEP_MS,1);$('#wfBar').style.width=(p*100)+'%';
    if(p>=1)goWF((wfI+1)%WF.length);
  }
  wfRaf=requestAnimationFrame(wfTick);
}
function updatePlayBtn(){var b=$('#wfPlay');b.innerHTML=ic(wfPlaying?'pause':'play');b.setAttribute('aria-label',wfPlaying?L('Pause walkthrough','إيقاف مؤقت'):L('Play walkthrough','تشغيل'));}
$('#wfPlay').addEventListener('click',function(){wfPlaying=!wfPlaying;if(wfPlaying)wfT0=performance.now();updatePlayBtn();});
if('IntersectionObserver' in window){
  new IntersectionObserver(function(es){es.forEach(function(e){
    if(e.isIntersecting&&!wfStarted){wfStarted=true;wfT0=performance.now();wfRaf=requestAnimationFrame(wfTick);}
  });},{threshold:.35}).observe($('#platform'));
}
window.addEventListener('resize',function(){goWF(wfI,true);});

/* =============================== Mock screen builders =============================== */
function top(title,branch){return '<div class="ui-top"><span class="ui-logo"><svg><use href="#logo"/></svg>'+title+'</span>'+(branch?'<span class="ui-branch">'+ic('pin')+branch+'</span>':'')+'<span class="ui-search">'+ic('search')+L('Search…','بحث…')+'</span><span class="ui-av">SA</span></div>';}
function side(on){var ids=['grid','cal','users','receipt','pill','box','wallet','payroll','chart','branch','key'];return '<div class="ui-side" aria-hidden="true">'+ids.map(function(x){return '<i'+(x===on?' class="on"':'')+'>'+ic(x)+'</i>';}).join('')+'</div>';}
function frame(on,title,inner){return '<div class="ui" role="img" aria-label="'+title+' — CTMS screen (demo data)">'+top('CTMS',L('Salmiya','السالمية'))+'<div class="ui-body">'+side(on)+'<div class="ui-main">'+inner+'</div></div></div>';}
function head(t,s,btns){return '<div class="ui-h"><div><b>'+t+'</b>'+(s?'<small>'+s+'</small>':'')+'</div>'+(btns?'<div style="display:flex;gap:6px">'+btns+'</div>':'')+'</div>';}
function kpis(a){return '<div class="ui-kpis">'+a.map(function(k){return '<div class="ui-kpi"><span>'+k[0]+'</span><b>'+k[1]+'</b>'+(k[2]?'<em'+(k[3]?' class="down"':'')+'>'+k[2]+'</em>':'')+'</div>';}).join('')+'</div>';}
function tbl(h,rows,rcols){rcols=rcols||[];return '<div class="ui-card" style="padding:4px;overflow-x:auto"><table class="ui-tbl"><thead><tr>'+h.map(function(x,i){return '<th'+(rcols.indexOf(i)>-1?' class="r"':'')+'>'+x+'</th>';}).join('')+'</tr></thead><tbody>'+rows.map(function(r){var cls=r.cls?' class="'+r.cls+'"':'';var cells=r.c||r;return '<tr'+cls+'>'+cells.map(function(x,i){return '<td'+(rcols.indexOf(i)>-1?' class="r"':'')+'>'+x+'</td>';}).join('')+'</tr>';}).join('')+'</tbody></table></div>';}
function pill(t,c){return '<span class="pill '+(c||'')+'">'+t+'</span>';}
function card(h,inner,extra){return '<div class="ui-card"'+(extra||'')+'><h5>'+h+'</h5>'+inner+'</div>';}
function hbars(a){return '<div class="ui-hbars">'+a.map(function(x){return '<div class="ui-hb"><span>'+x[0]+'</span><div class="ui-bar"><i style="width:'+x[1]+'%"></i></div><b>'+x[2]+'</b></div>';}).join('')+'</div>';}
function li(av,t,s,right){return '<div class="ui-li">'+(av?'<span class="av">'+av+'</span>':'')+'<span class="tx"><b>'+t+'</b>'+(s?'<small>'+s+'</small>':'')+'</span>'+(right||'')+'</div>';}
function spark(){return '<svg class="chart" viewBox="0 0 300 90" aria-hidden="true"><defs><linearGradient id="gs" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="var(--c1)" stop-opacity=".2"/><stop offset="1" stop-color="var(--c1)" stop-opacity="0"/></linearGradient></defs><line class="gl" x1="0" x2="300" y1="80" y2="80"/><path d="M0 64 L30 58 L60 60 L90 46 L120 50 L150 36 L180 42 L210 28 L240 32 L270 20 L300 14 L300 80 L0 80Z" fill="url(#gs)"/><path d="M0 64 L30 58 L60 60 L90 46 L120 50 L150 36 L180 42 L210 28 L240 32 L270 20 L300 14" fill="none" stroke="var(--c1)" stroke-width="2"/></svg>';}
function vbars(vals,hl){var w=300/vals.length;return '<svg class="chart" viewBox="0 0 300 96" aria-hidden="true"><g class="bars">'+vals.map(function(v,i){return '<rect x="'+(i*w+w*.18)+'" y="'+(88-v)+'" width="'+(w*.64)+'" height="'+v+'" rx="3" fill="'+(i===hl?'var(--c1)':'var(--c3)')+'"/>';}).join('')+'</g><line class="gl" x1="0" x2="300" y1="88" y2="88"/></svg>';}

var P={fa:L('Fatima Al-Enezi','فاطمة العنزي'),ym:L('Yousef Al-Mutairi','يوسف المطيري'),lh:L('Layla Al-Hajri','ليلى الهاجري'),ks:L('Khalid Al-Sabah','خالد الصباح'),ma:L('Mona Al-Azmi','منى العازمي')};
function refreshP(){P={fa:L('Fatima Al-Enezi','فاطمة العنزي'),ym:L('Yousef Al-Mutairi','يوسف المطيري'),lh:L('Layla Al-Hajri','ليلى الهاجري'),ks:L('Khalid Al-Sabah','خالد الصباح'),ma:L('Mona Al-Azmi','منى العازمي')};}
var DA=L('Dr. Ahmad','د. أحمد'),DN=L('Dr. Noura','د. نورة'),DF=L('Dr. Faisal','د. فيصل'),DM=L('Dr. Mariam','د. مريم');
function refreshD(){DA=L('Dr. Ahmad','د. أحمد');DN=L('Dr. Noura','د. نورة');DF=L('Dr. Faisal','د. فيصل');DM=L('Dr. Mariam','د. مريم');}

var SCREENS={
 dash:function(){return frame('grid',L('Dashboard','الرئيسية'),
   head(L('Clinic overview','نظرة عامة على العيادة'),L('Today · Salmiya','اليوم · السالمية'))+
   kpis([[L('Revenue','الإيراد'),'1,284.500','▲ 12.4%'],[L('Appointments','المواعيد'),'46','38 '+L('done','منجزة')],[L('Waiting','بالانتظار'),'7',L('11 min avg','متوسط ١١ د')],[L('Low stock','مخزون منخفض'),'4',L('items','أصناف'),1]])+
   '<div class="ui-row">'+card(L('Revenue trend','اتجاه الإيراد'),spark())+card(L('Top doctors today','أفضل الأطباء اليوم'),hbars([[DA,92,'612'],[DN,74,'488'],[DF,41,'184']]))+'</div>');},
 appt:function(){var h=[L('Time','الوقت'),DA,DN,DF,DM];
   var ev=function(c,t){return '<div class="ev '+c+'">'+t+'</div>';};
   var rows=[['09:00',ev('a',P.fa),'',ev('b',L('Implant review','مراجعة زراعة')),''],['09:30','',ev('a',P.ym),'',ev('c',L('Laser · 45m','ليزر · ٤٥د'))],['10:00',ev('b',L('Follow-up','متابعة')),'','',''],['10:30',ev('a',P.lh),ev('b',L('Cleaning','تنظيف')),ev('a',P.ks),''],['11:00','','',ev('c',L('Blocked','محجوز')),ev('a',P.ma)]];
   var cal='<div class="ui-cal">'+h.map(function(x){return '<div class="hd">'+x+'</div>';}).join('')+rows.map(function(r){return '<div class="tm">'+r[0]+'</div>'+r.slice(1).map(function(c){return '<div class="cl">'+c+'</div>';}).join('');}).join('')+'</div>';
   return frame('cal',L('Appointments','المواعيد'),head(L('Schedule · Tue 23 Sep','الجدول · الثلاثاء ٢٣ سبتمبر'),L('4 doctors · 46 appointments','٤ أطباء · ٤٦ موعداً'),'<span class="ui-btn sec">'+L('Day','يوم')+'</span><span class="ui-btn">+ '+L('Book','حجز')+'</span>')+cal+'<div class="leg"><span><i style="background:var(--brand)"></i>'+L('Confirmed','مؤكد')+'</span><span><i style="background:var(--info)"></i>'+L('Checked in','وصل')+'</span><span><i style="background:var(--warn)"></i>'+L('Procedure / blocked','إجراء / محجوز')+'</span></div>');},
 emr:function(){return frame('users',L('Patients & EMR','المرضى والسجل الطبي'),
   '<div class="ui-card" style="display:flex;gap:12px;align-items:center;flex-wrap:wrap"><span class="ui-av" style="width:40px;height:40px;font-size:13px">FA</span><div style="flex:1;min-width:140px"><b style="color:var(--ink);font-size:14px">'+P.fa+'</b><div style="color:var(--faint);font-size:11px">P-10432 · '+L('Civil ID','الرقم المدني')+' 2890•••••412 · 36 '+L('yrs','سنة')+'</div></div>'+pill(L('Allergy: Penicillin','حساسية: بنسلين'),'bad')+pill(L('Insurance','تأمين'),'info')+'</div>'+
   '<div class="ui-row">'+card(L('Clinical notes · today','ملاحظات سريرية · اليوم'),'<div style="font-size:11.5px;color:var(--ink-2);line-height:1.6">'+L('Sore throat 3 days, low-grade fever. Tonsils inflamed, no exudate. Dx: acute pharyngitis. Plan: antibiotic course, review in 7 days.','التهاب حلق منذ ٣ أيام مع حرارة خفيفة. اللوزتان ملتهبتان دون إفرازات. التشخيص: التهاب بلعوم حاد. الخطة: مضاد حيوي ومراجعة بعد ٧ أيام.')+'</div><div class="ui-grid2" style="margin-top:10px"><div class="ui-field"><span>BP</span><div>118/76</div></div><div class="ui-field"><span>'+L('Temp','الحرارة')+'</span><div>37.9 °C</div></div></div>')+
   card(L('Visit history','سجل الزيارات'),li('',L('Consultation','استشارة'),'12 Aug · '+DA,pill('KWD 25','brand'))+li('',L('Lab · CBC','مختبر · صورة دم'),'12 Aug',pill(L('Result','نتيجة'),'ok'))+li('',L('Dental cleaning','تنظيف أسنان'),'02 Jun · '+DN,pill('KWD 20','brand')))+'</div>');},
 bill:function(){return frame('receipt',L('Billing','الفوترة'),
   head('INV-2026-04812',P.fa+' · '+DA,pill(L('Paid','مدفوعة'),'ok'))+
   tbl([L('Item','البند'),L('Doctor','الطبيب'),L('Qty','الكمية'),L('Amount','المبلغ')],[[L('Consultation','استشارة'),DA,'1','25.000'],[L('Amoxicillin 500mg','أموكسيسيلين ٥٠٠ ملغ'),'—','1','4.750'],[L('CBC blood test','تحليل دم شامل'),DA,'1','15.250'],{cls:'strong',c:[L('Total (KWD)','الإجمالي (د.ك)'),'','','45.000']}],[2,3])+
   '<div class="ui-row eq">'+card(L('Payments','المدفوعات'),li('','KNET','10:52','<span class="amt">30.000</span>')+li('',L('Cash','نقداً'),'10:52','<span class="amt">15.000</span>'))+card(L('Actions','إجراءات'),'<div style="display:grid;gap:6px"><span class="ui-btn">'+L('Print receipt','طباعة الإيصال')+'</span><span class="ui-btn sec">'+L('Refund / return','استرداد / مرتجع')+'</span><span class="ui-btn sec">'+L('Send via WhatsApp','إرسال عبر واتساب')+'</span></div>')+'</div>');},
 pharm:function(){return frame('pill',L('Pharmacy','الصيدلية'),
   head(L('Dispensing queue','قائمة الصرف'),L('Prescriptions from doctors, live','وصفات الأطباء مباشرة'))+
   '<div class="ui-row">'+card(L('Waiting to dispense','بانتظار الصرف'),li('FA',P.fa,'RX-7781 · '+L('Amoxicillin 500mg × 21','أموكسيسيلين ٥٠٠ ملغ × ٢١'),'<span class="ui-btn">'+L('Dispense','صرف')+'</span>')+li('LH',P.lh,'RX-7779 · '+L('Cetirizine 10mg × 10','سيتريزين ١٠ ملغ × ١٠'),'<span class="ui-btn sec">'+L('Ready','جاهز')+'</span>')+li('KS',P.ks,'RX-7776 · '+L('Topical cream','كريم موضعي'),pill(L('Paid','مدفوعة'),'ok')))+
   card(L('Alerts','تنبيهات'),li('',L('Amoxicillin 500mg','أموكسيسيلين ٥٠٠ ملغ'),L('12 left · reorder at 20','١٢ متبقية · إعادة الطلب عند ٢٠'),pill(L('Low','منخفض'),'warn'))+li('',L('Lidocaine 2%','ليدوكايين ٢٪'),L('Batch L-221 expires in 28 days','التشغيلة L-221 تنتهي خلال ٢٨ يوماً'),pill(L('Expiry','انتهاء'),'bad')))+'</div>');},
 inv:function(){return frame('box',L('Inventory','المخزون'),
   head(L('Stock · Salmiya','المخزون · السالمية'),L('Valued at cost','بسعر التكلفة'),'<span class="ui-btn sec">'+L('Stock count','جرد')+'</span><span class="ui-btn">+ '+L('Purchase order','أمر شراء')+'</span>')+
   kpis([[L('Stock value','قيمة المخزون'),'9,840','KWD'],[L('Items','الأصناف'),'412'],[L('Below reorder','دون حد الطلب'),'4','',1],[L('Open POs','أوامر مفتوحة'),'3']])+
   tbl([L('Item','الصنف'),L('Unit','الوحدة'),L('On hand','المتوفر'),L('Cost','التكلفة'),L('Status','الحالة')],[[L('Amoxicillin 500mg','أموكسيسيلين ٥٠٠ ملغ'),L('Box','علبة'),'12','0.850',pill(L('Reorder','أعد الطلب'),'warn')],[L('Lidocaine 2% cartridge','خرطوشة ليدوكايين ٢٪'),L('Piece','قطعة'),'336','0.420',pill(L('OK','جيد'),'ok')],[L('Hyaluronic filler 1ml','فيلر هيالورونيك ١مل'),L('Syringe','حقنة'),'17','38.000',pill(L('OK','جيد'),'ok')],[L('Nitrile gloves M','قفازات نيتريل M'),L('Box','علبة'),'64','1.900',pill(L('OK','جيد'),'ok')]],[2,3]));},
 fin:function(){return frame('wallet',L('Finance','المالية'),
   head(L('Finance · September','المالية · سبتمبر'),L('Salmiya branch','فرع السالمية'))+
   kpis([[L('Revenue','الإيراد'),'24,610','▲ 7%'],[L('COGS','تكلفة البضاعة'),'4,020'],[L('Expenses','المصروفات'),'12,000'],[L('Net profit','صافي الربح'),'8,590','34.9%']])+
   '<div class="ui-row eq">'+card(L('Expenses by category','المصروفات حسب الفئة'),hbars([[L('Payroll','الرواتب'),100,'7,240'],[L('Rent','الإيجار'),48,'3,500'],[L('Utilities','المرافق'),14,'1,020'],[L('Other','أخرى'),3,'240']]))+
   card(L('Supplier balances','أرصدة الموردين'),li('',L('Gulf Medical Supplies','الخليج للمستلزمات الطبية'),L('Due in 12 days','مستحق خلال ١٢ يوماً'),'<span class="amt">1,240.000</span>')+li('',L('Al-Dawaa Pharma','الدواء فارما'),L('Due in 26 days','مستحق خلال ٢٦ يوماً'),'<span class="amt">860.500</span>'))+'</div>');},
 pay:function(){return frame('payroll',L('Payroll','الرواتب'),
   head(L('Payroll cycle 21 Aug – 20 Sep','دورة الرواتب ٢١ أغسطس – ٢٠ سبتمبر'),L('27 employees · Salmiya','٢٧ موظفاً · السالمية'),'<span class="ui-btn sec">'+L('Payslips','قسائم الرواتب')+'</span><span class="ui-btn">'+L('Approve','اعتماد')+'</span>')+
   tbl([L('Employee','الموظف'),L('Basic','الأساسي'),L('Allow.','البدلات'),L('Deduct.','الخصومات'),L('Net','الصافي'),L('Status','الحالة')],[[L('Reem Al-Shammari','ريم الشمري'),'450.000','75.000','(15.000)','510.000',pill(L('Ready','جاهز'),'ok')],[L('Hussain Ali','حسين علي'),'380.000','60.000','(0.000)','440.000',pill(L('Ready','جاهز'),'ok')],[L('Sara Mathew','سارة ماثيو'),'520.000','90.000','(26.000)','584.000',pill(L('Leave adj.','تعديل إجازة'),'warn')],{cls:'strong',c:[L('Total (27)','الإجمالي (٢٧)'),'','','','7,240.000','']}],[1,2,3,4]));},
 rep:function(){return frame('chart',L('Reports','التقارير'),
   head(L('Reports & analytics','التقارير والتحليلات'),L('Export any report to PDF or Excel','صدّر أي تقرير إلى PDF أو Excel'),'<span class="ui-btn sec">PDF</span><span class="ui-btn sec">Excel</span>')+
   '<div class="ui-row">'+card(L('Daily sales · September','المبيعات اليومية · سبتمبر'),vbars([40,52,46,62,70,30,56,64,50,68,76,34,66,80],13))+card(L('Report library','مكتبة التقارير'),li('',L('Profit & Loss','الأرباح والخسائر'),'',pill('PDF'))+li('',L('Revenue by doctor','الإيراد حسب الطبيب'),'',pill('XLS'))+li('',L('Stock valuation','تقييم المخزون'),'',pill('PDF'))+li('',L('Payroll analysis','تحليل الرواتب'),'',pill('XLS')))+'</div>');},
 multi:function(){var b=function(n,r,p,w){return '<div class="ui-card"><h5>'+n+pill(w,w==='A'?'ok':'brand')+'</h5><b style="font-size:16px;color:var(--ink)">KWD '+r+'</b><div style="color:var(--faint);font-size:10.5px;margin:2px 0 8px">'+L('Profit','الربح')+' '+p+'</div><div class="ui-bar"><i style="width:'+(w==='A'?92:w==='B+'?74:58)+'%"></i></div></div>';};
   return frame('branch',L('Multi-Branch','تعدد الفروع'),head(L('Group overview','نظرة على المجموعة'),L('3 branches · September','٣ فروع · سبتمبر'))+'<div class="ui-row r3">'+b(L('Salmiya','السالمية'),'24,610','8,590','A')+b(L('Hawally','حولي'),'18,340','5,470','B+')+b(L('Jahra','الجهراء'),'14,980','4,360','B')+'</div>'+card(L('Consolidated','الموحّد'),kpis([[L('Revenue','الإيراد'),'57,930'],[L('Profit','الربح'),'18,420'],[L('Appointments','المواعيد'),'1,612'],[L('Staff','الموظفون'),'64']])));},
 acc:function(){var rows=[[L('Appointments','المواعيد'),1,1,1,1],[L('Patient records','سجلات المرضى'),1,1,1,0],[L('Billing & refunds','الفوترة والاسترداد'),1,1,0,1],[L('Inventory','المخزون'),1,0,0,1],[L('P&L & finance','الأرباح والمالية'),1,0,0,0],[L('Payroll','الرواتب'),1,0,0,0]];
   var h=[L('Permission','الصلاحية'),L('Owner','المالك'),L('Reception','الاستقبال'),L('Doctor','الطبيب'),L('Pharmacy','الصيدلية')];
   var g='<div class="ui-perm">'+h.map(function(x){return '<div class="ph">'+x+'</div>';}).join('')+rows.map(function(r){return '<div>'+r[0]+'</div>'+r.slice(1).map(function(v){return '<div class="pc"><span class="tg'+(v?' on':'')+'"></span></div>';}).join('');}).join('')+'</div>';
   return frame('key',L('Access Control','التحكم بالصلاحيات'),head(L('Roles & permissions','الأدوار والصلاحيات'),L('Per screen, per report, per branch','لكل شاشة وتقرير وفرع'),'<span class="ui-btn">+ '+L('Custom role','دور مخصص')+'</span>')+g);}
};

var MODS=[
 {k:'dash',ic:'grid',n:{en:'Dashboard',ar:'لوحة التحكم'},d:{en:'The clinic at a glance: revenue, appointments, queue, stock alerts and doctor performance — live, per branch.',ar:'العيادة بنظرة واحدة: الإيراد والمواعيد والانتظار وتنبيهات المخزون وأداء الأطباء — مباشرةً ولكل فرع.'},c:{en:['Live KPIs for today and month-to-date','Branch switcher for multi-location clinics','Low-stock and outstanding-balance alerts','Doctor and service leaderboards'],ar:['مؤشرات مباشرة لليوم والشهر','تبديل الفرع للعيادات متعددة المواقع','تنبيهات المخزون المنخفض والأرصدة المستحقة','ترتيب الأطباء والخدمات']},b:{en:'Managers spot problems in minutes instead of discovering them at month-end.',ar:'يكتشف المديرون المشكلات خلال دقائق بدل نهاية الشهر.'}},
 {k:'appt',ic:'cal',n:{en:'Appointments',ar:'المواعيد'},d:{en:'A multi-doctor calendar with departments, schedules, status tracking and follow-up booking.',ar:'تقويم متعدد الأطباء مع الأقسام والجداول وتتبّع الحالة وحجز المتابعات.'},c:{en:['Doctor columns with department filters','Check-in, queue and no-show tracking','Follow-up scheduling from the visit','WhatsApp appointment reminders'],ar:['أعمدة الأطباء مع تصفية الأقسام','تسجيل الوصول والانتظار وتتبّع الغياب','جدولة المتابعة من الزيارة','تذكيرات المواعيد عبر واتساب']},b:{en:'Fewer no-shows and a front desk that always knows who is next.',ar:'غياب أقل واستقبال يعرف دائماً من التالي.'}},
 {k:'emr',ic:'users',n:{en:'Patients & EMR',ar:'المرضى والسجل الطبي'},d:{en:'Complete patient records with history, clinical notes, vitals, allergies, documents and prescriptions.',ar:'سجلات مرضى كاملة مع التاريخ والملاحظات السريرية والعلامات الحيوية والحساسية والمستندات والوصفات.'},c:{en:['Civil ID and phone duplicate detection','Visit history across doctors and branches','Clinical notes, vitals and allergy flags','Attachments and patient documents'],ar:['كشف تكرار الرقم المدني والهاتف','سجل الزيارات عبر الأطباء والفروع','ملاحظات سريرية وعلامات حيوية وتنبيهات حساسية','مرفقات ومستندات المريض']},b:{en:'Doctors see the whole patient in one place — safer care, faster consultations.',ar:'يرى الطبيب المريض كاملاً في مكان واحد — رعاية أكثر أماناً واستشارات أسرع.'}},
 {k:'bill',ic:'receipt',n:{en:'Billing',ar:'الفوترة'},d:{en:'Itemised invoices with per-line doctor attribution, split payments, discounts, packages and refunds.',ar:'فواتير مفصّلة مع نسبة كل بند للطبيب ودفعات مقسّمة وخصومات وباقات واسترداد.'},c:{en:['Split payments: KNET, card, cash, insurance','Discounts, packages and sales returns','Per-doctor, per-service revenue split','Thermal receipts and PDF invoices'],ar:['دفعات مقسّمة: كي‑نت وبطاقة ونقداً وتأمين','خصومات وباقات ومرتجعات','توزيع الإيراد لكل طبيب وخدمة','إيصالات حرارية وفواتير PDF']},b:{en:'Every fils is attributed correctly, so the numbers reconcile without spreadsheets.',ar:'كل فلس يُنسب بدقة، فتتطابق الأرقام دون جداول بيانات.'}},
 {k:'pharm',ic:'pill',n:{en:'Pharmacy',ar:'الصيدلية'},d:{en:'Prescriptions flow from the doctor to a dispensing queue, with stock deducted at cost automatically.',ar:'تنتقل الوصفات من الطبيب إلى قائمة الصرف، ويُخصم المخزون بالتكلفة تلقائياً.'},c:{en:['Live dispensing queue from prescriptions','Batch and expiry-date tracking','Low-stock and reorder alerts','Sales returns and write-offs'],ar:['قائمة صرف مباشرة من الوصفات','تتبّع التشغيلات وتواريخ الانتهاء','تنبيهات المخزون المنخفض وإعادة الطلب','مرتجعات المبيعات والإهلاك']},b:{en:'No lost prescriptions, no expired stock surprises, accurate cost of goods.',ar:'لا وصفات ضائعة ولا مفاجآت انتهاء صلاحية، وتكلفة بضاعة دقيقة.'}},
 {k:'inv',ic:'box',n:{en:'Inventory',ar:'المخزون'},d:{en:'Products, units of measure, purchase orders, stock counts and branch-level stock valuation.',ar:'المنتجات ووحدات القياس وأوامر الشراء والجرد وتقييم المخزون لكل فرع.'},c:{en:['Purchase orders and supplier records','Stock counts with variance tracking','Multiple units (box, strip, piece)','Valuation at cost, per branch'],ar:['أوامر الشراء وسجلات الموردين','جرد مع تتبّع الفروقات','وحدات متعددة (علبة، شريط، قطعة)','التقييم بالتكلفة لكل فرع']},b:{en:'Know what you hold, what it cost, and what to reorder — at every location.',ar:'اعرف ما لديك وتكلفته وما يجب طلبه — في كل موقع.'}},
 {k:'fin',ic:'wallet',n:{en:'Finance',ar:'المالية'},d:{en:'Revenue, expenses, cost of goods and supplier balances feed a live profit & loss for each branch.',ar:'الإيرادات والمصروفات وتكلفة البضاعة وأرصدة الموردين تغذّي أرباحاً وخسائر مباشرة لكل فرع.'},c:{en:['Automatic P&L from daily operations','Expense categories and recording','Supplier balances and payables','Branch-level and consolidated books'],ar:['أرباح وخسائر تلقائية من العمليات اليومية','فئات المصروفات وتسجيلها','أرصدة الموردين والمستحقات','دفاتر لكل فرع وموحّدة']},b:{en:'Close the month in minutes. See profit daily, not quarterly.',ar:'أغلق الشهر في دقائق. شاهد الربح يومياً لا فصلياً.'}},
 {k:'pay',ic:'payroll',n:{en:'Payroll',ar:'الرواتب'},d:{en:'Salary cycles, allowances, deductions, leave and payslips — posted straight into your P&L.',ar:'دورات الرواتب والبدلات والخصومات والإجازات وقسائم الرواتب — تُرحّل مباشرةً إلى الأرباح والخسائر.'},c:{en:['Custom cycles (e.g. 21st to 20th)','Allowances, deductions and leave','Payslips as PDF','Payroll cost by branch in P&L'],ar:['دورات مخصصة (مثل ٢١ إلى ٢٠)','البدلات والخصومات والإجازات','قسائم رواتب PDF','تكلفة الرواتب لكل فرع في الأرباح']},b:{en:'Payroll that matches how your clinic actually pays — and lands in the books automatically.',ar:'رواتب تطابق طريقة الدفع الفعلية في عيادتك — وتُسجّل في الدفاتر تلقائياً.'}},
 {k:'rep',ic:'chart',n:{en:'Reports & Analytics',ar:'التقارير والتحليلات'},d:{en:'Financial, clinical and operational reports, filterable by date, doctor, service and branch.',ar:'تقارير مالية وسريرية وتشغيلية قابلة للتصفية حسب التاريخ والطبيب والخدمة والفرع.'},c:{en:['P&L, revenue by doctor and service','Inventory movement and valuation','Payroll and expense analysis','Export to PDF and Excel'],ar:['الأرباح والإيراد حسب الطبيب والخدمة','حركة المخزون وتقييمه','تحليل الرواتب والمصروفات','تصدير إلى PDF وExcel']},b:{en:'One source of truth — every report agrees with every other report.',ar:'مصدر واحد للحقيقة — كل تقرير يتفق مع الآخر.'}},
 {k:'multi',ic:'branch',n:{en:'Multi-Branch',ar:'تعدد الفروع'},d:{en:'Run several locations from one platform with separate stock, staff and books — and one consolidated view.',ar:'أدر عدة مواقع من منصة واحدة بمخزون وموظفين ودفاتر منفصلة — ورؤية موحّدة.'},c:{en:['Per-branch P&L and stock','Consolidated group reporting','Consistent services and pricing setup','Branch comparison dashboards'],ar:['أرباح ومخزون لكل فرع','تقارير موحّدة للمجموعة','إعداد موحّد للخدمات والأسعار','لوحات مقارنة الفروع']},b:{en:'Grow to new locations without changing systems or losing visibility.',ar:'توسّع إلى مواقع جديدة دون تغيير الأنظمة أو فقدان الرؤية.'}},
 {k:'acc',ic:'key',n:{en:'Access Control',ar:'التحكم بالصلاحيات'},d:{en:'Granular, role-based permissions — down to individual screens, reports and branches.',ar:'صلاحيات دقيقة حسب الدور — حتى مستوى الشاشة والتقرير والفرع.'},c:{en:['Built-in and custom roles','Per-report and per-action permissions','Location-level access','Activity and audit logs'],ar:['أدوار جاهزة ومخصصة','صلاحيات لكل تقرير وإجراء','وصول على مستوى الفرع','سجلات النشاط والتدقيق']},b:{en:'Staff see exactly what they need — sensitive financial and clinical data stays protected.',ar:'يرى الموظف ما يحتاجه فقط — وتبقى البيانات المالية والسريرية محمية.'}}
];
var mxI=0;
function tabsA11y(list,onSel){
  list.addEventListener('keydown',function(e){
    var tabs=$$('[role=tab]',list),i=tabs.indexOf(document.activeElement);if(i<0)return;
    var rtl=root.dir==='rtl',nx=null;
    if(e.key==='ArrowRight')nx=rtl?i-1:i+1;else if(e.key==='ArrowLeft')nx=rtl?i+1:i-1;else if(e.key==='Home')nx=0;else if(e.key==='End')nx=tabs.length-1;
    if(nx===null)return;e.preventDefault();nx=(nx+tabs.length)%tabs.length;tabs[nx].focus();onSel(nx);
  });
}
function renderMX(){
  var t=$('#mxTabs');t.innerHTML='';
  MODS.forEach(function(m,i){
    var b=document.createElement('button');b.type='button';b.className='pilltab';b.setAttribute('role','tab');b.id='mx-t-'+m.k;b.setAttribute('aria-controls','mxPanel');
    b.setAttribute('aria-selected',i===mxI?'true':'false');b.tabIndex=i===mxI?0:-1;b.innerHTML=ic(m.ic)+'<span>'+T(m.n)+'</span>';
    b.addEventListener('click',function(){selMX(i);});t.appendChild(b);
  });
  paintMX(false);
}
function selMX(i){mxI=i;$$('#mxTabs [role=tab]').forEach(function(b,j){b.setAttribute('aria-selected',j===i?'true':'false');b.tabIndex=j===i?0:-1;});paintMX(true);var b=$$('#mxTabs [role=tab]')[i];if(b&&b.scrollIntoView&&window.innerWidth<900)b.scrollIntoView({block:'nearest',inline:'center',behavior:reduce?'auto':'smooth'});}
function paintMX(anim){
  var m=MODS[mxI],p=$('#mxPanel');p.setAttribute('aria-labelledby','mx-t-'+m.k);
  p.innerHTML='<div class="mx-copy"><h3>'+T(m.n)+'</h3><p>'+T(m.d)+'</p><ul class="mx-caps">'+T(m.c).map(function(c){return '<li>'+ic('check')+'<span>'+c+'</span></li>';}).join('')+'</ul><div class="mx-benefit">'+ic('trend')+'<span><b>'+L('Business impact','الأثر على العمل')+'</b>'+T(m.b)+'</span></div></div><div class="mx-screen">'+SCREENS[m.k]()+'</div>';
  if(anim){p.classList.remove('enter');void p.offsetWidth;p.classList.add('enter');}
}
tabsA11y($('#mxTabs'),selMX);

/* =============================== Roles =============================== */
var ROLES=[
 {k:'owner',ic:'trend',n:{en:'Clinic Owner',ar:'مالك العيادة'},q:{en:'"Are we profitable this month — and which doctors, services and branches are driving it?"',ar:'«هل نحن رابحون هذا الشهر — وأي الأطباء والخدمات والفروع تقود ذلك؟»'},g:{en:['Revenue','Profit','Branch comparison','Doctor performance','Expenses'],ar:['الإيراد','الربح','مقارنة الفروع','أداء الأطباء','المصروفات']},mods:['grid','wallet','chart','branch','payroll','key'],kp:[[{en:'Net profit MTD',ar:'صافي الربح'},'18,420'],[{en:'Margin',ar:'الهامش'},'31.8%'],[{en:'Best branch',ar:'أفضل فرع'},{en:'Salmiya',ar:'السالمية'}]]},
 {k:'rec',ic:'cal',n:{en:'Receptionist',ar:'الاستقبال'},q:{en:'"Who is next, who is late, and has everyone paid before they leave?"',ar:'«من التالي، ومن تأخر، وهل دفع الجميع قبل المغادرة؟»'},g:{en:['Appointments','Patient registration','Queue','Billing','Follow-ups'],ar:['المواعيد','تسجيل المرضى','الانتظار','الفوترة','المتابعات']},mods:['cal','users','receipt'],kp:[[{en:'Today',ar:'اليوم'},'46'],[{en:'Waiting',ar:'بالانتظار'},'7'],[{en:'Unpaid',ar:'غير مدفوعة'},'2']]},
 {k:'doc',ic:'steth',n:{en:'Doctor',ar:'الطبيب'},q:{en:'"Show me this patient\'s full history before I walk into the room."',ar:'«أرني التاريخ الكامل لهذا المريض قبل أن أدخل الغرفة.»'},g:{en:['Patient history','EMR','Clinical notes','Prescriptions','Treatment history'],ar:['تاريخ المريض','السجل الطبي','الملاحظات السريرية','الوصفات','سجل العلاج']},mods:['cal','users','pill'],kp:[[{en:'My patients',ar:'مرضاي'},'14'],[{en:'Next',ar:'التالي'},'10:30'],[{en:'My revenue',ar:'إيرادي'},'612']]},
 {k:'fin',ic:'wallet',n:{en:'Finance',ar:'المالية'},q:{en:'"Do today\'s collections match the invoices — and what do we owe suppliers?"',ar:'«هل تتطابق تحصيلات اليوم مع الفواتير — وكم ندين للموردين؟»'},g:{en:['Revenue','Expenses','Supplier balances','COGS','Payroll','Profit & Loss'],ar:['الإيراد','المصروفات','أرصدة الموردين','تكلفة البضاعة','الرواتب','الأرباح والخسائر']},mods:['receipt','wallet','payroll','chart'],kp:[[{en:'Collected',ar:'المحصّل'},'1,106.250'],[{en:'Payables',ar:'المستحقات'},'2,100.500'],[{en:'COGS MTD',ar:'تكلفة البضاعة'},'9,480']]},
 {k:'ph',ic:'pill',n:{en:'Pharmacy',ar:'الصيدلية'},q:{en:'"What needs dispensing now, and what is about to run out or expire?"',ar:'«ماذا يجب صرفه الآن، وما الذي أوشك على النفاد أو الانتهاء؟»'},g:{en:['Dispensing queue','Stock levels','Batches & expiry','Purchase orders','Returns'],ar:['قائمة الصرف','مستويات المخزون','التشغيلات والانتهاء','أوامر الشراء','المرتجعات']},mods:['pill','box'],kp:[[{en:'To dispense',ar:'للصرف'},'3'],[{en:'Low stock',ar:'منخفض'},'4'],[{en:'Expiring',ar:'قارب الانتهاء'},'2']]},
 {k:'hr',ic:'payroll',n:{en:'HR / Payroll',ar:'الموارد البشرية / الرواتب'},q:{en:'"Is this cycle\'s payroll right — leave, allowances and deductions included?"',ar:'«هل رواتب هذه الدورة صحيحة — بما فيها الإجازات والبدلات والخصومات؟»'},g:{en:['Staff records','Salary cycles','Leave','Allowances & deductions','Payslips'],ar:['سجلات الموظفين','دورات الرواتب','الإجازات','البدلات والخصومات','قسائم الرواتب']},mods:['users','payroll'],kp:[[{en:'Employees',ar:'الموظفون'},'64'],[{en:'Cycle',ar:'الدورة'},'21–20'],[{en:'On leave',ar:'في إجازة'},'3']]}
];
var roI=0;
function renderRO(){
  var t=$('#roTabs');t.innerHTML='';
  ROLES.forEach(function(r,i){
    var b=document.createElement('button');b.type='button';b.className='pilltab';b.setAttribute('role','tab');b.id='ro-t-'+r.k;b.setAttribute('aria-controls','roPanel');
    b.setAttribute('aria-selected',i===roI?'true':'false');b.tabIndex=i===roI?0:-1;b.innerHTML=ic(r.ic)+'<span>'+T(r.n)+'</span>';
    b.addEventListener('click',function(){selRO(i);});t.appendChild(b);
  });
  paintRO(false);
}
function selRO(i){roI=i;$$('#roTabs [role=tab]').forEach(function(b,j){b.setAttribute('aria-selected',j===i?'true':'false');b.tabIndex=j===i?0:-1;});paintRO(true);}
function paintRO(anim){
  var r=ROLES[roI],p=$('#roPanel');p.setAttribute('aria-labelledby','ro-t-'+r.k);
  var all=[['grid',{en:'Dashboard',ar:'الرئيسية'}],['cal',{en:'Appointments',ar:'المواعيد'}],['users',{en:'Patients & EMR',ar:'المرضى'}],['receipt',{en:'Billing',ar:'الفوترة'}],['pill',{en:'Pharmacy',ar:'الصيدلية'}],['box',{en:'Inventory',ar:'المخزون'}],['wallet',{en:'Finance',ar:'المالية'}],['payroll',{en:'Payroll',ar:'الرواتب'}],['chart',{en:'Reports',ar:'التقارير'}],['branch',{en:'Branches',ar:'الفروع'}],['key',{en:'Access control',ar:'الصلاحيات'}]];
  var mods=all.map(function(m){var ok=r.mods.indexOf(m[0])>-1;return '<div class="ui-li" style="opacity:'+(ok?1:.45)+'"><span class="av" style="background:'+(ok?'var(--brand-soft)':'var(--surface-3)')+';color:'+(ok?'var(--brand)':'var(--faint)')+'">'+'<svg class="ico" style="width:13px;height:13px"><use href="#i-'+m[0]+'"/></svg></span><span class="tx"><b>'+T(m[1])+'</b></span>'+(ok?pill(L('Allowed','مسموح'),'ok'):'<svg class="ico" style="width:14px;height:14px;color:var(--faint)"><use href="#i-lock"/></svg>')+'</div>';}).join('');
  var k='<div class="ui-kpis" style="grid-template-columns:repeat(3,minmax(0,1fr))">'+r.kp.map(function(x){return '<div class="ui-kpi"><span>'+T(x[0])+'</span><b>'+(typeof x[1]==='object'?T(x[1]):x[1])+'</b></div>';}).join('')+'</div>';
  var ui='<div class="ui" role="img" aria-label="'+T(r.n)+' workspace in CTMS (demo data)">'+top('CTMS')+'<div class="ui-main">'+head(L('Signed in as ','مسجّل كـ ')+T(r.n),L('Only permitted modules are visible','تظهر الوحدات المسموح بها فقط'))+k+'<div class="ui-card" style="padding:4px 10px"><div class="ui-list" style="grid-template-columns:1fr 1fr;display:grid;column-gap:16px">'+mods+'</div></div></div></div>';
  p.innerHTML='<div><p class="role-q">'+T(r.q)+'</p><ul class="role-gets">'+T(r.g).map(function(g,i){return '<li><span class="n">'+String(i+1).padStart(2,'0')+'</span><span>'+g+'</span>'+ic('check')+'</li>';}).join('')+'</ul><button class="btn btn-secondary" type="button" data-demo style="margin-top:24px">'+L('See the ','شاهد مساحة ')+T(r.n)+L(' workspace',' في عرض حي')+'</button></div>'+ui;
  if(anim){p.classList.remove('enter');void p.offsetWidth;p.classList.add('enter');}
  bindDemo(p);
}
tabsA11y($('#roTabs'),selRO);

/* =============================== FAQ =============================== */
var FAQ=[
 [{en:'Can CTMS work without internet?',ar:'هل يعمل CTMS دون إنترنت؟'},{en:'Yes. With on-premise or hybrid deployment, CTMS runs on a server inside your clinic, so booking, billing and dispensing continue when the internet is down. Cloud deployments require a connection.',ar:'نعم. في التشغيل المحلي أو الهجين يعمل CTMS على خادم داخل عيادتك، فيستمر الحجز والفوترة والصرف عند انقطاع الإنترنت. أما التشغيل السحابي فيتطلب اتصالاً.'}],
 [{en:'Can CTMS manage multiple branches?',ar:'هل يدير CTMS عدة فروع؟'},{en:'Yes. Each branch keeps its own stock, staff and P&L, and owners get a consolidated view across the group.',ar:'نعم. لكل فرع مخزونه وموظفوه وأرباحه وخسائره، ويحصل المالك على رؤية موحّدة للمجموعة.'}],
 [{en:'Does CTMS support Arabic?',ar:'هل يدعم CTMS اللغة العربية؟'},{en:'Fully. CTMS has a complete Arabic right-to-left interface alongside English, and each user can choose their language.',ar:'بالكامل. يوفر CTMS واجهة عربية كاملة من اليمين لليسار إلى جانب الإنجليزية، ويختار كل مستخدم لغته.'}],
 [{en:'Can we migrate our existing patient data?',ar:'هل يمكن نقل بيانات المرضى الحالية؟'},{en:'Yes. Patient lists can be imported from Excel/CSV, and our team assists with migrating services, staff and stock during onboarding.',ar:'نعم. يمكن استيراد قوائم المرضى من Excel/CSV، ويساعد فريقنا في نقل الخدمات والموظفين والمخزون أثناء التهيئة.'}],
 [{en:'Can doctors access patient history?',ar:'هل يستطيع الأطباء الاطلاع على تاريخ المريض؟'},{en:'Yes. Doctors see previous visits, clinical notes, vitals, allergies and prescriptions — subject to the permissions you assign.',ar:'نعم. يرى الأطباء الزيارات السابقة والملاحظات والعلامات الحيوية والحساسية والوصفات — وفق الصلاحيات التي تحددها.'}],
 [{en:'Does CTMS include pharmacy inventory?',ar:'هل يشمل CTMS مخزون الصيدلية؟'},{en:'Yes. Products, units, purchase orders, stock counts, batches and expiry dates, returns and write-offs are all included.',ar:'نعم. المنتجات والوحدات وأوامر الشراء والجرد والتشغيلات وتواريخ الانتهاء والمرتجعات والإهلاك كلها مشمولة.'}],
 [{en:'Does CTMS include accounting and P&L?',ar:'هل يشمل CTMS المحاسبة والأرباح والخسائر؟'},{en:'Yes. Revenue, cost of goods, expenses and payroll flow into a live profit & loss per branch and for the whole group.',ar:'نعم. تنساب الإيرادات وتكلفة البضاعة والمصروفات والرواتب إلى أرباح وخسائر مباشرة لكل فرع وللمجموعة.'}],
 [{en:'Can permissions be controlled per employee?',ar:'هل يمكن التحكم بالصلاحيات لكل موظف؟'},{en:'Yes. Use built-in or custom roles with permissions down to individual screens, reports, actions and branches.',ar:'نعم. استخدم أدواراً جاهزة أو مخصصة بصلاحيات تصل إلى الشاشة والتقرير والإجراء والفرع.'}],
 [{en:'How are backups handled?',ar:'كيف يتم النسخ الاحتياطي؟'},{en:'CTMS takes automatic, encrypted backups on a schedule and a safety snapshot before every update. Data can be restored from verified snapshots.',ar:'يأخذ CTMS نسخاً احتياطية مشفّرة تلقائية ولقطة أمان قبل كل تحديث، ويمكن الاستعادة من لقطات موثّقة.'}],
 [{en:'Can CTMS be hosted in the cloud?',ar:'هل يمكن استضافة CTMS سحابياً؟'},{en:'Yes. We can host CTMS on a private cloud server for you, so there is no hardware to manage.',ar:'نعم. يمكننا استضافة CTMS على خادم سحابي خاص لك، دون أجهزة تديرها.'}],
 [{en:'Can CTMS run on our own server?',ar:'هل يعمل CTMS على خادمنا الخاص؟'},{en:'Yes. CTMS installs as a managed Windows service on a server or PC in your clinic, and staff access it from browsers on your network.',ar:'نعم. يُثبّت CTMS كخدمة ويندوز مُدارة على خادم أو جهاز في عيادتك، ويصل إليه الموظفون من المتصفح على الشبكة.'}],
 [{en:'Can reports be exported?',ar:'هل يمكن تصدير التقارير؟'},{en:'Yes. Reports export to PDF and Excel/CSV, and can be printed directly.',ar:'نعم. تُصدّر التقارير إلى PDF وExcel/CSV ويمكن طباعتها مباشرة.'}],
 [{en:'Does CTMS support multiple payment methods?',ar:'هل يدعم CTMS طرق دفع متعددة؟'},{en:'Yes. Record KNET, card, cash, insurance and other methods you configure — including split payments on a single invoice.',ar:'نعم. سجّل كي‑نت والبطاقة والنقد والتأمين وأي طرق أخرى تضيفها — بما فيها تقسيم الدفع على فاتورة واحدة.'}],
 [{en:'How long does implementation take?',ar:'كم تستغرق عملية التطبيق؟'},{en:'It depends on the number of branches and the data being migrated. We agree a timeline with you during the demo, and our team handles setup, migration and staff training.',ar:'يعتمد ذلك على عدد الفروع والبيانات المنقولة. نتفق معك على جدول زمني أثناء العرض، ويتولى فريقنا الإعداد والنقل وتدريب الموظفين.'}]
];
function renderFAQ(){
  var el=$('#faqList'),open=$$('details[open]',el).map(function(d){return d.dataset.i;});
  el.innerHTML=FAQ.map(function(f,i){return '<details class="acc-item" data-i="'+i+'"'+(open.indexOf(String(i))>-1?' open':'')+'><summary><span>'+T(f[0])+'</span><span class="pm">'+ic('plus')+'</span></summary><div class="acc-body">'+T(f[1])+'</div></details>';}).join('');
}
(function(){var s=document.createElement('script');s.type='application/ld+json';s.textContent=JSON.stringify({'@context':'https://schema.org','@type':'FAQPage',mainEntity:FAQ.map(function(f){return {'@type':'Question',name:f[0].en,acceptedAnswer:{'@type':'Answer',text:f[1].en}};})});document.head.appendChild(s);})();

/* =============================== Pricing =============================== */
var CUR={KWD:{sym:'KWD',rate:1,dec:0,step:1,name:'Kuwait — KWD'},USD:{sym:'$',rate:3.26,dec:0,step:1,name:'US Dollar — $'},EUR:{sym:'€',rate:3.0,dec:0,step:1,name:'Euro — €'},GBP:{sym:'£',rate:2.56,dec:0,step:1,name:'British Pound — £'},SAR:{sym:'SAR',rate:12.2,dec:0,step:5,name:'Saudi Riyal — SAR'},AED:{sym:'AED',rate:11.98,dec:0,step:5,name:'UAE Dirham — AED'},QAR:{sym:'QAR',rate:11.87,dec:0,step:5,name:'Qatari Riyal — QAR'},BHD:{sym:'BHD',rate:1.23,dec:1,step:0.5,name:'Bahraini Dinar — BHD'},OMR:{sym:'OMR',rate:1.25,dec:1,step:0.5,name:'Omani Rial — OMR'},EGP:{sym:'EGP',rate:160,dec:0,step:50,name:'Egyptian Pound — EGP'},INR:{sym:'₹',rate:285,dec:0,step:50,name:'Indian Rupee — ₹'}};
var TZ={'Asia/Kuwait':'KWD','Asia/Riyadh':'SAR','Asia/Dubai':'AED','Asia/Qatar':'QAR','Asia/Bahrain':'BHD','Asia/Muscat':'OMR','Africa/Cairo':'EGP','Asia/Kolkata':'INR','Asia/Calcutta':'INR','Europe/London':'GBP'};
var CC={KW:'KWD',SA:'SAR',AE:'AED',QA:'QAR',BH:'BHD',OM:'OMR',EG:'EGP',IN:'INR',GB:'GBP',US:'USD',DE:'EUR',FR:'EUR',ES:'EUR',IT:'EUR',NL:'EUR',IE:'EUR',PT:'EUR',BE:'EUR',AT:'EUR'};
function detectCur(){try{var tz=Intl.DateTimeFormat().resolvedOptions().timeZone||'';if(TZ[tz])return TZ[tz];if(tz.indexOf('Europe/')===0)return 'EUR';if(tz.indexOf('America/')===0)return 'USD';var ls=navigator.languages||[navigator.language||''];for(var i=0;i<ls.length;i++){var m=/[-_]([A-Za-z]{2})$/.exec(ls[i]||'');if(m&&CC[m[1].toUpperCase()])return CC[m[1].toUpperCase()];}}catch(e){}return 'KWD';}
var curCode=store.get('ctms-cur')||detectCur();if(!CUR[curCode])curCode='KWD';
var mode='y';
function fmt(k){var c=CUR[curCode];var v=Math.round((k*c.rate)/c.step)*c.step;return v.toLocaleString('en-US',{minimumFractionDigits:c.dec,maximumFractionDigits:c.dec});}
function setCA(el,k){var c=$('.cur',el),a=$('.amt',el);if(c)c.textContent=CUR[curCode].sym;if(a)a.textContent=fmt(k);}
function renderPricing(){
  var ann=mode==='y',sym=CUR[curCode].sym;
  $$('#pricing .plan .cost[data-m]').forEach(function(cost){
    var m=+cost.getAttribute('data-m'),bill=cost.parentNode.querySelector('.bill');
    setCA(cost,ann?m*0.8:m);
    bill.textContent=ann?L('Billed annually · ','يُدفع سنوياً · ')+sym+' '+fmt(m*0.8*12)+L(' / year',' / سنة'):L('Billed monthly','يُدفع شهرياً');
  });
  var ad=$('#pricing .addon .ap');if(ad)setCA(ad,+ad.getAttribute('data-m'));
}
$$('#billSeg button').forEach(function(b){b.addEventListener('click',function(){mode=b.getAttribute('data-mode');$$('#billSeg button').forEach(function(x){x.setAttribute('aria-selected',x===b?'true':'false');});renderPricing();});});
var curSel=$('#curSel');
Object.keys(CUR).forEach(function(c){var o=document.createElement('option');o.value=c;o.textContent=CUR[c].name;curSel.appendChild(o);});
curSel.value=curCode;curSel.addEventListener('change',function(){curCode=curSel.value;store.set('ctms-cur',curCode);renderPricing();});

/* =============================== Modal + form =============================== */
var modal=$('#demoModal'),lastFocus=null;
function openModal(kind){
  lastFocus=document.activeElement;
  var prop=kind==='proposal',found=kind==='founding';
  $('#f-kind').value=prop?'Proposal':found?'Founding clinic':(kind?'Demo — '+kind+' plan':'Demo');
  $('#mdEb').textContent=prop?L('Proposal','عرض سعر'):found?L('Founding clinics','العيادات المؤسِّسة'):L('Live demo','عرض حي');
  $('#mdTitle').textContent=prop?L('Request a tailored proposal.','اطلب عرضاً مخصصاً.'):L('See CTMS on a clinic like yours.','شاهد CTMS على عيادة مثل عيادتك.');
  $('#demoForm button[type=submit]').textContent=prop?L('Request proposal','اطلب العرض'):L('Request my demo','اطلب العرض الحي');
  modal.classList.add('open');modal.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';
  setTimeout(function(){var f=$('#f-name');if(f&&$('#formFields').style.display!=='none')f.focus();},60);
}
function closeModal(){modal.classList.remove('open');modal.setAttribute('aria-hidden','true');document.body.style.overflow='';if(lastFocus&&lastFocus.focus)lastFocus.focus();}
function bindDemo(scope){$$('[data-demo]',scope).forEach(function(b){if(b._bd)return;b._bd=1;b.addEventListener('click',function(e){e.preventDefault();openModal(b.getAttribute('data-kind'));});});}
bindDemo(document);
$$('[data-close-modal]').forEach(function(el){el.addEventListener('click',closeModal);});
document.addEventListener('keydown',function(e){
  if(e.key==='Escape'){if(modal.classList.contains('open'))closeModal();if(mnav.classList.contains('open'))setMenu(false);}
  if(e.key==='Tab'&&modal.classList.contains('open')){
    var f=$$('button,input,select,textarea,a[href]',$('.modal-box',modal)).filter(function(x){return x.offsetParent!==null&&x.tabIndex>-1;});
    if(!f.length)return;var a=f[0],z=f[f.length-1];
    if(e.shiftKey&&document.activeElement===a){e.preventDefault();z.focus();}else if(!e.shiftKey&&document.activeElement===z){e.preventDefault();a.focus();}
  }
});
if(location.hash==='#demo')openModal();

var form=$('#demoForm');
form.addEventListener('submit',function(e){
  e.preventDefault();
  if(!form.checkValidity()){form.reportValidity();return;}
  if(form._honey&&form._honey.value)return;
  var btn=$('button[type=submit]',form),orig=btn.textContent;btn.disabled=true;btn.textContent=L('Sending…','جارٍ الإرسال…');
  var v=function(id){return $('#'+id).value;};
  fetch('https://formsubmit.co/ajax/mayur.madhwani2011@gmail.com',{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},
    body:JSON.stringify({_subject:'CTMS website — '+v('f-kind'),_template:'table',request:v('f-kind'),name:v('f-name'),clinic:v('f-clinic'),email:v('f-email'),phone:v('f-phone'),branches:v('f-branches'),role:v('f-role'),message:v('f-msg'),language:LANG})
  }).then(function(r){return r.ok?r.json():Promise.reject();}).then(function(){
    $('#formFields').style.display='none';$('#formOk').classList.add('show');
  }).catch(function(){
    btn.disabled=false;btn.textContent=orig;
    alert(L('Sorry — your request could not be sent. Please email info@appscrafter.com or message us on WhatsApp.','عذراً — تعذّر إرسال طلبك. راسلنا على info@appscrafter.com أو عبر واتساب.'));
  });
});

/* =============================== i18n =============================== */
var AR={
skip:'تخطَّ إلى المحتوى',brand_sub:'من Appscrafter',
nav_platform:'المنصة',nav_solutions:'الحلول',nav_modules:'الوحدات',nav_security:'الأمان',nav_integrations:'التكاملات',nav_pricing:'الأسعار',nav_resources:'الموارد',
cta_book:'احجز عرضاً',cta_live:'احجز عرضاً حياً',cta_explore:'اكتشف CTMS',cta_demo:'احجز عرضاً',cta_proposal:'اطلب عرض سعر',
hero_flag:'الكويت · الخليج',hero_tag:'مصمّم لعيادات الكويت والخليج',hero_h1a:'نظام التشغيل',hero_h1b:'للعيادات الحديثة.',
hero_lead:'أدر المواعيد وسجلات المرضى والفوترة والمخزون والصيدلية والرواتب والمالية والفروع المتعددة من منصة ذكية واحدة.',
hm1:'العربية والإنجليزية',hm2:'يعمل دون إنترنت، محلياً',hm3:'جاهز لتعدد الفروع',
d_branch1:'السالمية',d_search:'ابحث عن مريض أو فاتورة أو رقم مدني…',d_greet:'صباح الخير، د. سارة',d_date:'الثلاثاء · ٢٣ سبتمبر ٢٠٢٦ · فرع السالمية',d_newappt:'+ موعد',d_newinv:'+ فاتورة جديدة',
d_k1:'فواتير اليوم',d_k2:'التحصيلات',d_k3:'مرضى جدد',d_k4:'المستحقات',d_rev14:'الإيراد · آخر ١٤ يوماً',d_this:'هذه الفترة',d_prev:'السابقة',d_queue:'الانتظار المباشر',
p1:'فاطمة العنزي',p2:'يوسف المطيري',p3:'ليلى الهاجري',p4:'خالد الصباح',d_q1s:'د. أحمد · استشارة',d_q2s:'د. نورة · أسنان',d_q3s:'د. أحمد · متابعة',d_q4s:'جلدية · جلسة ليزر',
st_with:'مع الطبيب',st_wait8:'ينتظر ٨ د',st_in:'وصل',st_bill:'عند المحاسبة',
fl1:'إيراد اليوم',fl_vs:'مقارنة بالثلاثاء الماضي',fl2:'المواعيد',fl2s:'٣٨ منجزة · ٣ غياب',fl3:'مرضى بالانتظار',fl3s:'متوسط الانتظار ١١ دقيقة',fl4:'مخزون منخفض',fl4b:'أموكسيسيلين ٥٠٠ ملغ',fl4s:'١٢ متبقية · أعد الطلب',fl5:'أداء الأطباء',fl6:'صافي الربح · الشهر',fl6s:'هامش',
doc1:'د. أحمد',doc2:'د. نورة',doc3:'د. فيصل',doc4:'د. مريم',doc5:'د. حصة',
tr1:'وحدة متكاملة',tr2:'العربية والإنجليزية',tr2s:'واجهة RTL كاملة',tr3:'متعدد الفروع',tr3s:'رؤية موحّدة',tr4:'محلي + سحابي',tr4s:'حسب اختيارك',tr5:'صلاحيات حسب الدور',tr5s:'لكل موظف',tr6:'نسخ احتياطي مشفّر',tr6s:'تلقائي',tr7:'تقارير فورية',tr7s:'أرباح مباشرة',
ps_eb:'المشكلة',ps_h2:'لا يجب أن تحتاج عيادتك إلى خمسة أنظمة لتعمل.',ps_p:'حين يعمل كل قسم بأداته الخاصة لا يتطابق شيء — ويكون المالك آخر من يعلم.',ps_before:'اليوم، في معظم العيادات',
ps1:'برنامج مواعيد منفصل',ps1s:'أداة ١',ps2:'سجلات المرضى على Excel',ps2s:'أداة ٢',ps3:'نظام مخزون منفصل',ps3s:'أداة ٣',ps4:'محاسبة يدوية',ps4s:'أداة ٤',ps5:'رواتب يدوية',ps5s:'أداة ٥',ps6:'تقارير فروع غير مترابطة',ps6s:'مكالمات هاتفية',
ps_after:'مع CTMS',ps_h3:'CTMS يربط كل شيء.',hub1:'المواعيد',hub2:'المرضى والسجل',hub3:'الفوترة',hub4:'المخزون',hub5:'المالية والأرباح',hub6:'الرواتب · الفروع',
wf_eb:'سير عمل مترابط',wf_h2:'زيارة واحدة. كل الدفاتر محدّثة.',wf_p:'تابع زيارة مريض واحدة. تُسجّل كل خطوة مرة واحدة — ويحدّث CTMS تلقائياً السجلات السريرية والتشغيلية والمالية المرتبطة بها.',lg_h:'السجلات التي حدّثتها هذه الزيارة',
mx_eb:'مستكشف الوحدات',mx_h2:'كل قسم. منصة واحدة.',mx_p:'اختر وحدة لترى الشاشة التي سيستخدمها فريقك — وما تغيّره في عملك.',
ow_eb:'لمالكي العيادات',ow_h2:'اعرف بدقة كيف تؤدي عيادتك.',ow_p:'الإيراد والربح والأطباء والخدمات والفروع والنقد — محدّثة لحظة بلحظة، لا في نهاية الشهر.',
ow_k1:'إيراد اليوم',ow_vs:'مقارنة بالأسبوع الماضي',ow_k2:'الإيراد الشهري',ow_mtd:'منذ بداية الشهر',ow_k3:'صافي الربح',ow_k4:'هامش الربح',ow_doc:'الإيراد حسب الطبيب',ow_this:'هذا الشهر',ow_svc:'الإيراد حسب الخدمة',
sv1:'الاستشارات',sv2:'الأسنان',sv3:'الجلدية والليزر',sv4:'الصيدلية',sv5:'المختبر وأخرى',ow_branch:'مقارنة الفروع',ow_rev:'الإيراد',ow_exp:'المصروفات',br2:'حولي',br3:'الجهراء',
ow_expenses:'المصروفات',ex1:'الرواتب',ex2:'تكلفة البضاعة',ex3:'الإيجار',ex4:'المرافق',ex5:'أخرى',
ow_m1:'الذمم المستحقة',ow_m1s:'٤١ فاتورة',ow_m2:'قيمة المخزون',ow_m2s:'بالتكلفة · ٣ فروع',ow_m3:'تكلفة الرواتب',ow_m3s:'الدورة الحالية',ow_m4:'تحويل المواعيد',ow_m4s:'محجوز ← حضر',ow_m5:'زيارات المرضى',
demo_note:'بيانات تجريبية توضيحية. لا تُعرض على هذا الموقع أي معلومات حقيقية لمرضى أو عيادات.',
ro_eb:'الحلول حسب الدور',ro_h2:'مساحة العمل المناسبة لكل شخص في العيادة.',ro_p:'الجميع يدخل إلى النظام نفسه — ويرى فقط ما يحتاجه دوره.',
mb_eb:'إدارة الفروع المتعددة',mb_h2:'رؤية واحدة لكل المواقع.',mb_p:'يعمل كل فرع باستقلالية — بجدوله ومخزونه وموظفيه ودفاتره — بينما يحصل المالك على تقارير موحّدة للمجموعة.',
mb1:'عمليات على مستوى الفرع',mb1p:'مخزون وأسعار وموظفون وأرباح منفصلة لكل موقع.',mb2:'رؤية موحّدة للمالك',mb2p:'إيراد المجموعة وربحها وأداؤها في شاشة واحدة.',mb3:'صلاحيات حسب الموقع',mb3p:'يصل الموظفون فقط إلى الفروع المعيّنين فيها.',
mb_all:'كل الفروع',mb_mtd:'سبتمبر ٢٠٢٦ · منذ بداية الشهر',mb_k1:'إيراد المجموعة',mb_k2:'ربح المجموعة',mb_k3:'المواعيد',mb_k4:'الموظفون المناوبون',mb_k4s:'٣ فروع',
th_branch:'الفرع',th_rev:'الإيراد',th_appt:'المواعيد',th_profit:'الربح',th_stock:'قيمة المخزون',th_staff:'الموظفون',th_perf:'الأداء',mb_total:'إجمالي المجموعة',
gu_eb:'الملاءمة المحلية',gu_h2:'مصمّم لعيادات الخليج.',gu_p:'ليس منتجاً أجنبياً مترجماً. صُمّم CTMS حول الطريقة التي تسجّل بها عيادات الكويت والخليج المرضى وتفوتر وتدفع الرواتب وتعدّ التقارير.',
gu1:'العربية + الإنجليزية',gu1s:'تبديل فوري لكل مستخدم',gu2:'واجهة كاملة من اليمين لليسار',gu2s:'الشاشات والإيصالات والتقارير',gu3:'دعم الرقم المدني',gu3s:'كشف التكرار عند التسجيل',gu4:'فوترة بالدينار الكويتي',gu4s:'دقة ثلاث خانات عشرية',gu5:'كي‑نت والبطاقة والنقد',gu5s:'تقسيم الدفع على فاتورة واحدة',gu6:'عمليات متعددة الفروع',gu6s:'عبر المحافظات والدول',gu7:'ممارسات الرواتب المحلية',gu7s:'دورات وبدلات وخصومات مخصصة',gu8:'تطبيق ودعم محلي',gu8s:'فريق في الكويت وتهيئة في الموقع',
se_eb:'الأمان وملكية البيانات',se_h2:'بياناتك. خوادمك. قواعدك.',se_p:'صُمّم CTMS لتبقى بيانات العيادة تحت السيطرة وقابلة للاستعادة والمساءلة — سواء عمل داخل مبناك أو في السحابة.',
se_log:'سجل النشاط',se_filter:'تصفية حسب المستخدم أو الفرع أو الإجراء…',au1:'استرداد جزئي للفاتورة INV-04812',au1s:'ريم · الاستقبال · السالمية',au_fin:'مالية',au2:'تعديل صلاحيات دور «صيدلي»',au2s:'المشرف · المكتب الرئيسي',au_acc:'صلاحيات',au3:'اكتمل نسخ احتياطي مشفّر · موثّق',au3s:'النظام · مجدول',au_sys:'النظام',au4:'عرض سجل المريض P-10432',au4s:'د. أحمد · حولي',au_emr:'السجل الطبي',
se1:'التحكم بالوصول حسب الدور',se1s:'صلاحيات دقيقة حتى مستوى الشاشة والتقرير.',se2:'سجلات التدقيق',se2s:'تُسجّل الإجراءات الحساسة مع المستخدم والوقت والموقع.',se3:'نسخ احتياطي مشفّر',se3s:'تُشفّر النسخ الاحتياطية قبل تخزينها.',se4:'نسخ احتياطي تلقائي',se4s:'لقطات مجدولة دون تدخل من الموظفين.',se5:'تحديثات آمنة',se5s:'لقطة أمان قبل كل ترقية.',se6:'استعادة البيانات',se6s:'استعد من لقطات موثّقة عند الحاجة.',se7:'تتبّع نشاط المستخدمين',se7s:'اعرف من فعل ماذا ومتى في العيادة.',se8:'صلاحيات على مستوى الموقع',se8s:'حدّد لكل مستخدم الفروع التي يعمل بها.',se9:'نشر على خادم خاص',se9s:'بيئة مخصصة لك وحدك.',se10:'تشغيل محلي',se10s:'شغّل CTMS بالكامل على أجهزة داخل عيادتك.',
se_note:'يوفر CTMS ضوابط تقنية تدعم التزاماتك في حماية البيانات. لا ندّعي شهادات من جهات خارجية لم نحصل عليها — اطلب منا وثائق الأمان الحالية.',
dp_eb:'التشغيل',dp_h2:'يُنشر بالطريقة التي تعمل بها عيادتك.',dv_clinic:'عيادتك',dv_server:'خادم CTMS',dv_b1:'فرع',dv_b2:'فرع',dv_mob:'المالك',dv_owner:'رؤية المالك',
dp1:'محلي',dp1p:'يعمل CTMS كخدمة مُدارة على خادم أو جهاز داخل عيادتك، ويفتحه الموظفون من أي متصفح على الشبكة.',dp1a:'يستمر بالعمل عند انقطاع الإنترنت',dp1b:'البيانات لا تغادر مقرّك',
dp2:'سحابي',dp2p:'نستضيف CTMS ونديره لك على خادم خاص. ادخل بأمان من أي مكان دون أجهزة تديرها.',dp2a:'خادم خاص — غير مشترك',dp2b:'التحديثات والنسخ الاحتياطي مُدارة لك',
dp3:'هجين / متعدد المواقع',dp3p:'اجمع بين تثبيتات محلية في كل موقع ووصول مركزي للإدارة. نصمّم البنية حسب فروعك واتصالك.',dp3a:'سرعة ومرونة محلية لكل فرع',dp3b:'تقارير موحّدة للمالك',
off_b:'انقطع الإنترنت؟ الاستقبال يواصل العمل.',off_p:'في التشغيل المحلي والهجين يستمر CTMS بالعمل محلياً عند انقطاع الاتصال — فيستمر الحجز والفوترة والصرف كالمعتاد.',
in_eb:'التكاملات',in_h2:'يعمل مع الأدوات التي تستخدمها عيادتك.',in_p:'فقط ما يدعمه CTMS اليوم — دون وعود غير مؤكدة.',
in1:'واتساب',in1p:'تذكيرات المواعيد وإشعارات المرضى تُرسل من CTMS.',in2:'كي‑نت والبطاقة والنقد',in2p:'طرق دفع قابلة للإعداد مع تقسيم الدفع ومطابقة يومية.',in3:'طابعات الإيصالات الحرارية',in3p:'اطبع الإيصالات على طابعات حرارية ٨٠ ملم بتخطيط قابل للتعديل.',in4:'PDF',in4p:'فواتير ووصفات وقسائم رواتب وتقارير بصيغة PDF نظيفة وقابلة للطباعة.',in5:'Excel / CSV',in5p:'صدّر التقارير وقوائم المرضى، واستورد بيانات المرضى الحالية من جداول البيانات.',in6:'المحاسبة والبريد وواجهات API',in6p:'تحتاج ربطاً بنظام آخر؟ أخبرنا بمتطلباتك وسنحدد النطاق معك.',
rp_eb:'التقارير وذكاء الأعمال',rp_h2:'قرارات مبنية على أرقام يمكنك الوثوق بها.',rp_p:'لأن كل معاملة موجودة في نظام واحد، يتفق كل تقرير مع الآخر.',rp_pl:'الأرباح والخسائر',rp_sep:'سبتمبر ٢٠٢٦',
pl1:'إيراد الخدمات',pl2:'مبيعات الصيدلية',pl3:'إجمالي الإيراد',pl4:'تكلفة البضاعة المباعة',pl5:'مجمل الربح',pl6:'الرواتب',pl7:'الإيجار والمرافق',pl8:'مصروفات أخرى',pl9:'صافي الربح',
rp_daily:'المبيعات اليومية',rp_pay:'تحليل المدفوعات',pm_card:'بطاقة',pm_cash:'نقداً',pm_ins:'تأمين',rp_inv:'حركة المخزون',im_item:'الصنف',im_open:'الافتتاحي',im_in:'وارد',im_out:'صادر',im_close:'الختامي',it1:'أموكسيسيلين ٥٠٠ ملغ',it2:'خرطوشة ليدوكايين ٢٪',it3:'فيلر هيالورونيك ١مل',rp_val:'تقييم المخزون',rp_vals:'بالتكلفة، كل الفروع',
rl1:'الأرباح والخسائر',rl2:'الإيراد حسب الطبيب',rl3:'الإيراد حسب الخدمة',rl4:'أداء الفروع',rl5:'إحصاءات المرضى',rl6:'حركة المخزون',rl7:'تقييم المخزون',rl8:'تحليل الرواتب',rl9:'تحليل المصروفات',rl10:'المبيعات اليومية',rl11:'تحليل المدفوعات',rp_exp:'كل تقرير يُصدّر إلى',rp_print:'طباعة',
wy_eb:'لماذا CTMS',wy_h2:'أربعة أسباب تختار العيادات CTMS.',wy1:'عمليات مترابطة',wy1p:'الاستقبال والأطباء والصيدلية والمخزون والرواتب تتشارك سجلاً واحداً. لا شيء يُدخل مرتين ولا شيء يخرج عن التزامن.',wy2:'ذكاء مالي',wy2p:'كل خدمة وبيع ومرتجع وراتب ينساب مباشرةً إلى الأرباح والخسائر — لكل طبيب وخدمة وفرع، في اليوم نفسه.',wy3:'ملاءمة خليجية',wy3p:'واجهة عربية RTL والرقم المدني ودقة الدينار وكي‑نت وممارسات الرواتب المحلية — مدمجة لا مضافة.',wy4:'ملكية البيانات',wy4p:'شغّله على خادمك أو سحابة خاصة. النسخ المشفّرة والاستعادة الكاملة تبقي سجلاتك بين يديك.',
pf_eb:'العملاء',pf_h2:'نستقبل الآن العيادات المؤسِّسة.',pf_p:'ستُنشر هنا نتائج موثّقة من عملائنا مع انطلاق عياداتنا المؤسِّسة.',pf_logo:'شعار العيادة',pf_s1:'عيادات عاملة',pf_s2:'فروع مُدارة',pf_s3:'معاملات منجزة',pf_s4:'متوسط زمن الدعم',pf_q:'ستظهر هنا شهادة من عيادة موثّقة تستخدم CTMS.',pf_cta:'انضم كعيادة مؤسِّسة',
pr_eb:'الأسعار',pr_h2:'خطط بسيطة. قدرات جادّة.',pr_p:'كل خطة تشمل العربية والإنجليزية والنسخ الاحتياطي المشفّر والصلاحيات حسب الدور والتهيئة والدعم المحلي.',bill_m:'شهري',bill_y:'سنوي',bill_save:'−٢٠٪',per_mo:'/ شهرياً',
p1n:'المبتدئة',p1d:'لطبيب فردي أو عيادة جديدة.',p1a:'المرضى والمواعيد والوصفات',p1b:'الفوترة والإيصالات',p1c:'تقارير الإيراد اليومية',p1e:'موقع واحد · حتى ٣ مستخدمين',
p_pop:'الأكثر اختياراً',p2n:'العيادة',p2d:'الحزمة الكاملة لعيادة مزدحمة بفرع واحد.',p2a:'كل ما في المبتدئة',p2b:'الصيدلية والمخزون والمشتريات',p2c:'أرباح وخسائر وتقارير مالية كاملة',p2d2:'صلاحيات حسب الدور',p2e:'مستخدمون بلا حدود',
p3n:'متعدد الفروع',p3d:'للمجموعات التي تدير موقعين أو أكثر.',p3a:'كل ما في العيادة',p3b:'مخزون وأرباح لكل فرع',p3c:'لوحة موحّدة للمالك',p3e:'صلاحيات حسب الموقع',
p4n:'المؤسسات',p4d:'للمراكز الطبية والمجموعات الصحية ذات الاحتياجات المعقدة.',p4c:'مخصص',p4b:'عرض مصمّم لك',p4a:'خادم خاص أو تشغيل محلي',p4bb:'نقل البيانات وتدريب الموظفين',p4cc:'دعم بأولوية',p4dd:'دراسة تكاملات مخصصة',
ad_n:'الرواتب',ad_t:'إضافة',ad_p:'دورات الرواتب والبدلات والخصومات والإجازات والقسائم — تُضاف إلى أي خطة.',pr_note:'الأسعار لكل عيادة بالدينار الكويتي. العملات الأخرى تقريبية. الدفع السنوي يوفّر ٢٠٪.',
fq_eb:'الموارد · الأسئلة الشائعة',fq_h2:'أسئلة وأجوبة.',fq_p:'لم تجد ما تبحث عنه؟ فريقنا في الكويت سيشرح لك كل شيء.',fq_wa:'راسلنا على واتساب',
fc_eb:'ابدأ الآن',fc_h2:'شاهد عيادتك بالكامل في نظام واحد.',fc_p:'اكتشف كيف يربط CTMS مرضاك وأطباءك والاستقبال والمخزون والمالية والإدارة.',
ft_full:'نظام الإدارة الشاملة للعيادات',ft_tag:'نظام تشغيل العيادات في الكويت والخليج — المرضى والعمليات والمالية في منصة واحدة.',ft_wf:'سير العمل المترابط',ft_owner:'لوحة المالك',ft_reports:'التقارير وذكاء الأعمال',ft_dep:'التشغيل',
m_appt:'المواعيد',m_emr:'المرضى والسجل الطبي',m_pharm:'الصيدلية',m_fin:'المالية',m_pay:'الرواتب',ft_roles:'حسب الدور',ft_gulf:'عيادات الخليج',ft_res:'الموارد',ft_faq:'الأسئلة الشائعة',ft_ds:'نظام التصميم',ft_support:'الدعم',ft_company:'الشركة',ft_about:'عن CTMS',ft_contact:'تواصل معنا',
ft_copy:'CTMS — نظام الإدارة الشاملة للعيادات',ft_pow:'بدعم من',ft_priv:'سياسة الخصوصية',ft_terms:'الشروط',wa:'تواصل معنا',
md_eb:'عرض حي',md_h:'شاهد CTMS على عيادة مثل عيادتك.',md_p:'جولة لمدة ٣٠ دقيقة مصمّمة لأقسامك. نرد خلال يوم عمل واحد.',
f_name:'الاسم الكامل',f_clinic:'اسم العيادة / المجموعة',f_email:'البريد الإلكتروني للعمل',f_phone:'الهاتف / واتساب',f_opt:'(اختياري)',f_branches:'عدد الفروع',f_role:'دورك',fr1:'المالك / المدير',fr2:'مدير العيادة',fr3:'طبيب',fr4:'المالية',fr5:'أخرى',f_msg:'ما الذي تود رؤيته؟',f_submit:'اطلب العرض الحي',f_note:'نستخدم بياناتك فقط لترتيب العرض.',ok_h:'تم استلام طلبك.',ok_p:'شكراً لك — سيتواصل فريقنا معك خلال يوم عمل واحد لتحديد موعد الجلسة.'
};
var EN={};
$$('[data-i18n]').forEach(function(el){var k=el.getAttribute('data-i18n');if(!(k in EN))EN[k]=el.textContent;});
function applyLang(lang,first){
  LANG=lang;var ar=lang==='ar';
  root.setAttribute('lang',lang);root.setAttribute('dir',ar?'rtl':'ltr');
  $$('[data-i18n]').forEach(function(el){var k=el.getAttribute('data-i18n');var v=ar?(AR[k]||EN[k]):EN[k];if(v!=null&&el.textContent!==v)el.textContent=v;});
  $$('[data-lang]').forEach(function(b){b.setAttribute('aria-pressed',b.getAttribute('data-lang')===lang?'true':'false');});
  document.title=ar?'CTMS — نظام الإدارة الشاملة للعيادات':'CTMS — Clinic Top Management System';
  refreshP();refreshD();
  renderWF();renderMX();renderRO();renderFAQ();renderPricing();updatePlayBtn();
  if(!first){store.set('ctms-lang',lang);}
  observeReveal();
}
$$('[data-lang]').forEach(function(b){b.addEventListener('click',function(){if(b.getAttribute('data-lang')!==LANG)applyLang(b.getAttribute('data-lang'));});});
applyLang(LANG,true);
})();
