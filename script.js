const $ = s => document.querySelector(s);
const n = x => (+x).toLocaleString('ar-EG');
const fm = o => {
  const h = Math.floor(o), m = Math.round((o - h) * 60);
  return n((h + 11) % 12 + 1) + ':' + (m < 10 ? '٠' : '') + n(m) + (h >= 12 ? ' م' : ' ص');
};

const S = {
  r: 'c',
  st: 0,
  bud: 400,
  own: true,
  occ: 'تخرّج',
  day: 'بكرة',
  pl: 'A',
  ph: 0,
  loc: 'قاعة حفل',
  hrs: 2,
  stf: 2,
  tch: true,
  sent: false,
  pcs: 10,
  vid: true,
  inb: [0, 0]
};

const PL = {
  A: {
    n: 'متوازنة',
    d: 'تعديل عبايتكِ مع مكياج كامل وحقيبة مؤجّرة',
    it: [
      { n: 'تعديل الأكمام', w: 'ورشة الدوحة للخياطة', p: 60, o: 13 },
      { n: 'مكياج كامل', w: 'مها، خبيرة مكياج', p: 260, o: 15, a: 270, ao: 16 },
      { n: 'تأجير حقيبة', w: 'ستوديو الإكسسوار', p: 60, o: 16.5 },
      { n: 'توصيل', w: 'لمسة', p: 10, o: 17.25 }
    ]
  },
  B: {
    n: 'اقتصادية',
    d: 'تعديل الأكمام مع مكياج سريع وإكسسوار بسيط',
    it: [
      { n: 'تعديل الأكمام', w: 'ورشة الدوحة للخياطة', p: 60, o: 13 },
      { n: 'مكياج سريع', w: 'مها، خبيرة مكياج', p: 200, o: 15.5, a: 210, ao: 16 },
      { n: 'تأجير إكسسوار', w: 'ستوديو الإكسسوار', p: 35, o: 16.5 },
      { n: 'توصيل', w: 'لمسة', p: 10, o: 17.25 }
    ]
  }
};

const items = pl => PL[pl || S.pl].it.map(i => S.own || i.n != 'تعديل الأكمام' ? i : { n: 'عباية جاهزة', w: 'متجر العباية الشريك', p: 280, o: 13 });
const done = () => S.ph >= 3;
const pr = i => done() && i.a ? i.a : i.p;
const tm = i => done() && i.a ? i.ao : i.o;
const tot = pl => items(pl).reduce((a, i) => a + (pl ? i.p : pr(i)), 0);

const mt = t => `<div class="mt"><i class="${t > S.bud ? 'ov' : ''}" style="width:${Math.min(100, t / S.bud * 100)}%"></i></div><small>${t > S.bud ? 'تتجاوز الميزانية بـ ' + n(t - S.bud) : 'المتبقي من الميزانية ' + n(S.bud - t)} ر.ق</small>`;
const ch = (k, a) => `<div class="chips">${a.map(v => `<button class="chip ${S[k] === v ? 'on' : ''}" onclick="set('${k}','${v}')">${v}</button>`).join('')}</div>`;
const sw = (k, t) => `<button class="sw ${S[k] ? 'on' : ''}" onclick="set('${k}',!S.${k})">${t}<b></b></button>`;
const stp = (k, mn, mx) => `<div class="stp"><button aria-label="زيادة" onclick="set('${k}',Math.min(${mx},S.${k}+1))">+</button><b>${n(S[k])}</b><button aria-label="إنقاص" onclick="set('${k}',Math.max(${mn},S.${k}-1))">−</button></div>`;

const tick = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';
const spark = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.2 6.8L21 11l-6.8 2.2L12 20l-2.2-6.8L3 11l6.8-2.2z"/></svg>';
const backIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M13 6l6 6-6 6"/></svg>';
const logoImg = '<img src="1 logo.png" alt="1 logo.png" class="logo-img">';

function set(k, v) { S[k] = v; R(true); }
function go(s) { S.st = s; R(); }
function role(r) { S.r = r; R(); }

function toast(m) {
  const t = $('#ts');
  t.textContent = m;
  t.classList.add('on');
  clearTimeout(toast.t);
  toast.t = setTimeout(() => t.classList.remove('on'), 2200);
}

function bud(v) {
  S.bud = +v;
  $('#bv').textContent = n(v) + ' ر.ق';
}

function reset() {
  Object.assign(S, { st: 0, ph: 0, pl: 'A', sent: false });
  R();
}

function send() {
  S.ph = 1;
  R(true);
  setTimeout(() => {
    if (S.ph == 1) {
      S.ph = 2;
      R(true);
    }
  }, 1600);
}

function pick(p) {
  S.pl = p;
  S.ph = 0;
  go(2);
}

function cust() {
  if (S.st == 0) {
    return `<h2>جهّزي إطلالتكِ في خطة واحدة</h2><p class="p">اختاري المناسبة والميزانية، ونرتّب المواعيد والتوصيل.</p>
      <div class="lb">المناسبة</div>${ch('occ', ['تخرّج', 'جلسة تصوير', 'عزيمة', 'زفاف'])}
      <div class="lb">الموعد</div>${ch('day', ['اليوم', 'بكرة', 'بعد ٣ أيام'])}
      <div class="lb">يجب أن تكوني جاهزة الساعة</div><div class="big">٦:٠٠ م</div>
      <label for="rg">الميزانية <b id="bv">${n(S.bud)} ر.ق</b></label><input id="rg" type="range" min="200" max="800" step="10" value="${S.bud}" oninput="bud(this.value)">
      ${sw('own', 'عندي عباية أريد استخدامها')}
      <button class="btn" onclick="go(1)">اعرضي الخطط</button>`;
  }

  if (S.st == 1) {
    return `<h2>خطتان لـ ${S.occ} ${S.day}</h2><p class="p">الأسعار تشمل التوصيل، والمواعيد مرتّبة لتنتهي قبل ٦:٠٠ م.</p>` +
      ['A', 'B'].map(k => {
        const t = tot(k);
        return `<div class="card ${S.pl == k ? 'sel' : ''}">
          <div class="hd"><b>${PL[k].n}</b><span>${n(t)} ر.ق</span></div>
          <div class="d">${PL[k].d}</div>
          ${items(k).map(i => `<div class="ln"><span>${i.n}<small>${i.w}</small></span><span>${n(i.p)}</span></div>`).join('')}
          ${mt(t)}
          <button class="btn" style="margin-top:12px;padding:12px" onclick="pick('${k}')">اختاري هذه الخطة</button>
        </div>`;
      }).join('') +
      `<button class="btn g" onclick="go(0)">تعديل الميزانية أو المناسبة</button>`;
  }

  if (S.st == 2) {
    const L = items().map(i => ({ ...i, t: tm(i) })).sort((a, b) => a.t - b.t);
    const c = i => {
      const x = i.a;
      if (S.ph == 0) return ['i', 'جاهز للإرسال', ''];
      if (S.ph == 1) return ['w', '<span class="sp"></span>بانتظار الرد', ''];
      if (S.ph == 2) return x ? ['n', 'تعذّر الموعد', 'no'] : ['o', 'مؤكد', 'ok'];
      return ['o', 'مؤكد', 'ok'];
    };
    const T = tot();
    return `<h2>${S.ph < 3 ? 'ترتيب اليوم' : 'خطتكِ جاهزة للاعتماد'}</h2><p class="p">كل عنصر يبقى «بانتظار الرد» حتى تؤكد الشريكة الوقت والسعر.</p>
      ${S.ph == 2 ? `<div class="al"><b>اعتذرت مها عن موعد ${fm(items().find(i => i.a).o)}</b><p class="d" style="margin:4px 0 10px">أقرب بديل الساعة ${fm(16)} بسعر ${n(items().find(i => i.a).a)} ر.ق. الإجمالي الجديد ${n(T + items().find(i => i.a).a - items().find(i => i.a).p)} ر.ق.</p><div class="row2"><button class="btn" onclick="set('ph',3)">أوافق على البديل</button><button class="btn g" onclick="S.ph=0;go(1)">غيّري الخطة</button></div></div>` : ''}
      <div class="tl">${L.map(i => {
        const s = c(i);
        return `<div class="ti ${s[2]}"><div class="tm">${fm(i.t)}</div><div class="r"><span><b>${i.n}</b><small class="d" style="display:block;margin:0">${i.w}</small></span><span class="st ${s[0] == 'i' ? 'i' : s[0]}">${s[1]}</span></div></div>`;
      }).join('')}<div class="ti end"><div class="tm">${fm(18)}</div><b>موعد ${S.occ}</b></div></div>
      <div class="card"><div class="hd"><b>الإجمالي</b><span>${n(T)} ر.ق</span></div>${mt(T)}</div>
      ${S.ph == 0 ? `<button class="btn" onclick="send()">أرسلي الطلب للشريكات</button>` : S.ph == 1 ? `<button class="btn" disabled>جارٍ انتظار الردود…</button>` : S.ph == 3 ? `<button class="btn" onclick="go(3)">اعتمدي الخطة</button>` : ''}`;
  }

  return `<div class="ctr"><div class="ok-i">${tick}</div><h2>تمّت جدولة إطلالتكِ</h2><p class="p">وصلكِ إشعار بكل موعد، وسنذكّركِ قبل كل خطوة.</p></div>
    <div class="card"><div class="hd"><b>${PL[S.pl].n} · ${S.occ} ${S.day}</b><span>${n(tot())} ر.ق</span></div>${mt(tot())}
      <div class="ln"><span>الجاهزية</span><b>٦:٠٠ م</b></div>
      <div class="ln"><span>سياسة الإلغاء والإرجاع</span><b>معروضة لكل عنصر</b></div>
    </div>
    <button class="btn" onclick="reset()">ابدئي خطة جديدة</button>`;
}

function org() {
  const T = S.hrs * S.stf * 150 + (S.tch ? S.hrs * 100 : 0);
  if (S.sent) {
    return `<div class="ctr"><div class="ok-i">${tick}</div><h2>وصل طلب الحجز</h2><p class="p">سيؤكد فريق لمسة التوافر خلال ساعة.</p></div>
      <div class="card"><div class="hd"><b>ركن لمسة قبل الصورة</b><span>${n(T)} ر.ق</span></div>
        <div class="ln"><span>الموقع</span><b>${S.loc}</b></div>
        <div class="ln"><span>المدة</span><b>${n(S.hrs)} ساعة</b></div>
        <div class="ln"><span>رقم الطلب</span><b>LM-٢٦١١</b></div>
      </div>
      <button class="btn g" onclick="set('sent',false)">طلب جديد</button>`;
  }

  return `<h2>احجزي ركن «لمسة قبل الصورة»</h2><p class="p">ركن تجهيز في موقع فعاليتكِ، يُحجز بالساعة.</p>
    <div class="lb">موقع الفعالية</div>${ch('loc', ['قاعة حفل', 'استوديو تصوير', 'حرم جامعي'])}
    <div class="lb">مدة التشغيل (ساعات)</div>${stp('hrs', 1, 6)}
    <div class="lb">عدد العاملات</div>${stp('stf', 1, 4)}
    <div class="lb">الخدمات</div>
    <div class="ln"><span>ضبط الشيلة</span><b>مشمول</b></div>
    <div class="ln"><span>إزالة الوبر من العباية</span><b>مشمول</b></div>
    ${sw('tch', 'رتوش مكياج (+١٠٠ ر.ق في الساعة)')}
    <div class="card" style="margin-top:18px"><div class="hd"><b>التقدير</b><span>${n(T)} ر.ق</span></div><div class="d" style="margin:0">${n(S.stf)} عاملات × ${n(S.hrs)} ساعة × ١٥٠ ر.ق${S.tch ? ' + رتوش المكياج' : ''}</div></div>
    <button class="btn" onclick="set('sent',true)">أرسلي طلب الحجز</button>`;
}

function par() {
  const rq = [
    ['تعديل أكمام عباية سوداء', 60, 'التسليم قبل ١:٠٠ م'],
    ['تأجير حقيبة سهرة', 60, 'الاستلام ٤:٣٠ م']
  ];
  const E = S.pcs * 20 + (S.vid ? 250 : 0);

  return `<h2>أهلًا بكِ يا شريكتنا</h2><p class="p">طلبات محدّدة بموعد وسعر، تقبلينها أو تعتذرين عنها.</p>
    <div class="lb">طلبات جديدة</div>${rq.map((q, i) => `<div class="card"><div class="hd"><b>${q[0]}</b><span>${n(q[1])}</span></div><div class="d" style="margin:0">${q[2]}</div>${S.inb[i] ? `<span class="st ${S.inb[i] == 1 ? 'o' : 'n'}" style="display:inline-block;margin-top:10px">${S.inb[i] == 1 ? 'تم القبول' : 'تم الاعتذار'}</span>` : `<div class="row2"><button class="btn" onclick="S.inb[${i}]=1;R(true)">قبول</button><button class="btn g" onclick="S.inb[${i}]=2;R(true)">اعتذار</button></div>`}</div>`).join('')}
    <div class="lb" style="margin-top:22px">تصوير مجموعتكِ</div>
    <div class="card">
      <label for="pc" style="margin-top:0">عدد القطع <b id="pv">${n(S.pcs)}</b></label>
      <input id="pc" type="range" min="5" max="30" value="${S.pcs}" oninput="S.pcs=+this.value;$('#pv').textContent=n(this.value);$('#pe').textContent=n(S.pcs*20+(S.vid?250:0))+' ر.ق';$('#pp').textContent=n(S.pcs*3)">
      ${sw('vid', 'إضافة فيديو قصير')}
      <div class="ln" style="margin-top:14px"><span>صور للمتجر</span><b id="pp">${n(S.pcs * 3)}</b></div>
      <div class="ln"><span>الباقة</span><b id="pe">${n(E)} ر.ق</b></div>
    </div>
    <button class="btn" onclick="toast('أُرسل طلب موعد التصوير')">اطلبي موعد التصوير</button>`;
}

function canGoBack() {
  if (S.r === 'c') return S.st > 0;
  if (S.r === 'o') return S.sent;
  return false;
}

function goBack() {
  if (S.r === 'c' && S.st > 0) {
    if (S.st === 2) S.ph = 0;
    S.st -= 1;
    R();
  } else if (S.r === 'o' && S.sent) {
    S.sent = false;
    R();
  }
}

function R(keep) {
  const m = $('#mn'), y = keep ? m.scrollTop : 0;
  const showBack = canGoBack();
  $('#hd').innerHTML = `
    <div class="top">
      <button class="back-btn" aria-label="رجوع" ${showBack ? 'onclick="goBack()"' : 'disabled'}>${backIcon}</button>
      <div class="logo">${logoImg}${spark}</div>
    </div>
    ${S.r == 'c' ? `<div class="dots">${[0, 1, 2, 3].map(i => `<i class="${i <= S.st ? 'on' : ''}"></i>`).join('')}</div>` : ''}
  `;
  m.innerHTML = S.r == 'c' ? cust() : S.r == 'o' ? org() : par();
  m.scrollTop = y;
  $('#nv').innerHTML = [['c', 'العميلة'], ['o', 'منظّمة فعالية'], ['p', 'شريكة']].map(a => `<button class="${S.r == a[0] ? 'on' : ''}" onclick="role('${a[0]}')">${a[1]}</button>`).join('');
}

R();
