// ============================================
// KHATUNA MINI APP — AI BEAUTY CONSULTANT
// ============================================

const tg = window.Telegram?.WebApp;
if (tg) { tg.ready(); tg.expand(); tg.enableClosingConfirmation(); }

// ---- SERVICES DATA (synced with services.py) ----
const SERVICES = {
  hair: { name: "✂️ Парикмахерские", icon: "✂️", items: [
    { name: "Стрижка женская (короткие)", price: "от 900 ₽" },
    { name: "Стрижка женская (средние)", price: "от 1 200 ₽" },
    { name: "Стрижка женская (длинные)", price: "от 2 000 ₽" },
    { name: "Ровный срез", price: "1 200 ₽" },
    { name: "Горячие ножницы", price: "от 1 500 ₽" },
    { name: "Детская стрижка", price: "от 500 ₽" },
    { name: "Мужская модельная", price: "900 ₽" },
    { name: "Мужская под насадку", price: "400–500 ₽" },
    { name: "Пенсионерам (10–12ч)", price: "500 ₽" },
    { name: "Усы и борода", price: "700 ₽" },
    { name: "Окрашивание в один тон", price: "3 000–10 000 ₽" },
    { name: "Мелирование", price: "2 500–8 000 ₽" },
    { name: "Осветление", price: "3 000–10 000 ₽" },
    { name: "Химическая завивка", price: "3 500–8 000 ₽" },
    { name: "Укладка", price: "от 700 ₽" },
    { name: "Вечерняя причёска", price: "от 2 000 ₽" },
  ]},
  nails: { name: "💅 Ногтевой сервис", icon: "💅", items: [
    { name: "Маникюр (классика/аппарат)", price: "от 800 ₽" },
    { name: "Покрытие гель-лак", price: "1 000 ₽" },
    { name: "Маникюр + гель-лак", price: "2 300–2 600 ₽" },
    { name: "SPA-маникюр", price: "2 600 ₽" },
    { name: "Детский маникюр", price: "500 ₽" },
    { name: "Дизайн ногтей", price: "от 100 ₽" },
    { name: "Педикюр классический", price: "от 1 800 ₽" },
    { name: "Педикюр аппаратный", price: "от 2 200 ₽" },
    { name: "Педикюр + покрытие", price: "от 2 800 ₽" },
  ]},
  cosmo: { name: "💉 Косметология", icon: "💉", items: [
    { name: "Чистка комбинированная (Holy Land)", price: "4 500 ₽" },
    { name: "Процедура «Фарфоровая куколка»", price: "3 000 ₽" },
    { name: "Мезотерапия", price: "6 500 ₽" },
    { name: "Биоревитализация", price: "8 500–14 500 ₽" },
    { name: "Ботулинотерапия", price: "350 ₽/ед." },
    { name: "Увеличение губ (Stylage M)", price: "15 500 ₽" },
    { name: "Архитектура бровей хной", price: "2 000 ₽" },
    { name: "Ламинирование бровей", price: "от 2 000 ₽" },
    { name: "Окрашивание бровей", price: "800–1 000 ₽" },
    { name: "Коррекция бровей", price: "от 500 ₽" },
    { name: "Наращивание ресниц", price: "от 2 000 ₽" },
    { name: "Ламинирование ресниц", price: "от 1 800 ₽" },
  ]},
  massage: { name: "💆‍♀️ Массаж", icon: "💆‍♀️", items: [
    { name: "Миофасциально-букальный (1 час)", price: "3 000 ₽" },
    { name: "Авторский массаж лица (1 час)", price: "2 500–3 000 ₽" },
    { name: "Общий массаж тела (1 час)", price: "2 600 ₽" },
    { name: "Массаж спины", price: "2 000 ₽" },
    { name: "Массаж ШВЗ", price: "1 500 ₽" },
    { name: "Антицеллюлитный", price: "от 3 000 ₽" },
    { name: "Лимфодренажный", price: "от 3 000 ₽" },
    { name: "Вибромассаж", price: "от 2 000 ₽" },
  ]},
  epil: { name: "🌿 Эпиляция", icon: "🌿", items: [
    { name: "Бикини классическое", price: "1 500 ₽" },
    { name: "Бикини глубокое", price: "2 000 ₽" },
    { name: "Ноги полностью", price: "1 400 ₽" },
    { name: "Голени", price: "от 800 ₽" },
    { name: "Подмышки", price: "от 500 ₽" },
    { name: "Лицо полностью", price: "1 000 ₽" },
    { name: "Руки полностью", price: "от 800 ₽" },
  ]},
  perm: { name: "🖊️ Перманентный макияж", icon: "🖊️", items: [
    { name: "Брови", price: "8 000 ₽" },
    { name: "Губы", price: "8 000 ₽" },
    { name: "Межресничное пространство", price: "7 000 ₽" },
    { name: "Коррекция", price: "от 3 000 ₽" },
  ]},
};

// ---- STATE ----
let currentTab = 'home';
let bookingData = {};
let bookingStep = 1;
let uploadedFiles = [];

// ---- TAB NAVIGATION ----
function switchTab(tabId) {
  currentTab = tabId;
  document.querySelectorAll('.tab').forEach(t => t.classList.toggle('active', t.dataset.tab === tabId));
  document.querySelectorAll('.page').forEach(p => p.classList.toggle('active', p.id === `page-${tabId}`));
  window.scrollTo({ top: 0, behavior: 'smooth' });
  if (tg) tg.HapticFeedback?.impactOccurred('light');
}
document.querySelectorAll('.tab').forEach(tab => tab.addEventListener('click', () => switchTab(tab.dataset.tab)));

// ---- CATALOG ----
function renderCatalog(filter = 'all', search = '') {
  const list = document.getElementById('servicesList');
  list.innerHTML = '';
  const s = search.toLowerCase();
  Object.entries(SERVICES).forEach(([key, cat]) => {
    if (filter !== 'all' && filter !== key) return;
    cat.items.forEach(srv => {
      if (search && !srv.name.toLowerCase().includes(s)) return;
      const card = document.createElement('div');
      card.className = 'service-card';
      card.innerHTML = `<div><div class="srv-name">${srv.name}</div><div class="srv-cat-badge">${cat.name}</div></div><div class="srv-price">${srv.price}</div>`;
      card.addEventListener('click', () => {
        bookingData = { category: key, service: srv.name, price: srv.price };
        switchTab('booking'); goToBookingStep(2);
      });
      list.appendChild(card);
    });
  });
  if (!list.children.length) list.innerHTML = '<div style="text-align:center;padding:40px;color:var(--tg-hint)">Ничего не найдено</div>';
}
document.querySelectorAll('.filter-chip').forEach(chip => {
  chip.addEventListener('click', () => {
    document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    renderCatalog(chip.dataset.cat, document.getElementById('searchInput').value);
  });
});
document.getElementById('searchInput').addEventListener('input', e => {
  const f = document.querySelector('.filter-chip.active').dataset.cat;
  renderCatalog(f, e.target.value);
});

// ---- BOOKING ----
function goToBookingStep(step) {
  bookingStep = step;
  document.querySelectorAll('.step').forEach(s => {
    const n = parseInt(s.dataset.step);
    s.classList.remove('active', 'done');
    if (n === step) s.classList.add('active');
    else if (n < step) s.classList.add('done');
  });
  document.querySelectorAll('.book-step').forEach(s => s.classList.remove('active'));
  document.getElementById(`bstep${step}`).classList.add('active');
  if (step === 2) renderDates();
  if (step === 3) renderTimes();
  if (step === 4) renderSummary();
  if (tg) tg.HapticFeedback?.impactOccurred('light');
}

function renderCatCards() {
  const c = document.getElementById('catCards');
  c.innerHTML = '';
  Object.entries(SERVICES).forEach(([key, cat]) => {
    const card = document.createElement('div');
    card.className = 'cat-card';
    card.innerHTML = `<div class="cat-card-icon">${cat.icon}</div><div class="cat-card-name">${cat.name.replace(cat.icon + ' ', '')}</div>`;
    card.addEventListener('click', () => { bookingData.category = key; showServicesForBooking(key); });
    c.appendChild(card);
  });
}

function showServicesForBooking(catKey) {
  const c = document.getElementById('srvSelectList');
  const cat = SERVICES[catKey];
  c.style.display = 'block';
  document.getElementById('catCards').style.display = 'none';
  c.innerHTML = `<button class="btn-back" onclick="backToCats()" style="background:var(--glass-bg);border:1px solid var(--glass-border);color:var(--tg-text);padding:10px 16px;border-radius:8px;font-family:Montserrat;cursor:pointer;margin-bottom:12px;font-size:13px;backdrop-filter:blur(12px)">⬅️ Назад</button>`;
  cat.items.forEach(srv => {
    const item = document.createElement('div');
    item.className = 'srv-select-item';
    item.innerHTML = `<span>${srv.name}</span><span class="srv-price">${srv.price}</span>`;
    item.addEventListener('click', () => { bookingData.service = srv.name; bookingData.price = srv.price; goToBookingStep(2); });
    c.appendChild(item);
  });
}
function backToCats() { document.getElementById('catCards').style.display = 'grid'; document.getElementById('srvSelectList').style.display = 'none'; }

function renderDates() {
  const grid = document.getElementById('dateGrid'); grid.innerHTML = '';
  const today = new Date();
  const wd = ['Вс','Пн','Вт','Ср','Чт','Пт','Сб'];
  const mo = ['янв','фев','мар','апр','май','июн','июл','авг','сен','окт','ноя','дек'];
  for (let i = 0; i < 7; i++) {
    const d = new Date(today); d.setDate(d.getDate() + i);
    const ds = d.toISOString().split('T')[0];
    let label = `${d.getDate()} ${mo[d.getMonth()]}`;
    if (i === 0) label = `Сегодня, ${label}`; else if (i === 1) label = `Завтра, ${label}`;
    const btn = document.createElement('button'); btn.className = 'date-btn';
    btn.innerHTML = `${label}<div class="date-wd">${wd[d.getDay()]}</div>`;
    btn.addEventListener('click', () => {
      bookingData.date = ds; bookingData.dateLabel = label;
      document.querySelectorAll('.date-btn').forEach(b => b.classList.remove('selected')); btn.classList.add('selected');
      setTimeout(() => goToBookingStep(3), 300);
    });
    grid.appendChild(btn);
  }
}

function renderTimes() {
  const grid = document.getElementById('timeGrid'); grid.innerHTML = '';
  for (let h = 10; h < 21; h++) {
    const t = `${h.toString().padStart(2,'0')}:00`;
    const btn = document.createElement('button'); btn.className = 'time-btn'; btn.textContent = t;
    btn.addEventListener('click', () => {
      bookingData.time = t;
      document.querySelectorAll('.time-btn').forEach(b => b.classList.remove('selected')); btn.classList.add('selected');
      setTimeout(() => goToBookingStep(4), 300);
    });
    grid.appendChild(btn);
  }
}

function renderSummary() {
  document.getElementById('summaryCard').style.display = 'block';
  document.getElementById('sumService').textContent = bookingData.service || '—';
  document.getElementById('sumPrice').textContent = bookingData.price || '—';
  document.getElementById('sumDate').textContent = bookingData.dateLabel || bookingData.date || '—';
  document.getElementById('sumTime').textContent = bookingData.time || '—';
  if (tg?.initDataUnsafe?.user) {
    const u = tg.initDataUnsafe.user;
    const nf = document.getElementById('bookName');
    if (!nf.value) nf.value = [u.first_name, u.last_name].filter(Boolean).join(' ');
  }
}

// File Upload
const fileUpload = document.getElementById('fileUpload');
const fileInput = document.getElementById('fileInput');
fileUpload.addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', e => {
  Array.from(e.target.files).forEach(file => {
    if (uploadedFiles.length >= 5) return;
    const reader = new FileReader();
    reader.onload = ev => { uploadedFiles.push({ name: file.name, data: ev.target.result }); renderFilePreviews(); };
    reader.readAsDataURL(file);
  });
});
function renderFilePreviews() {
  const c = document.getElementById('filePreviews'); c.innerHTML = '';
  uploadedFiles.forEach((f, i) => { c.innerHTML += `<div class="file-preview"><img src="${f.data}" alt=""/><button class="file-preview-remove" onclick="removeFile(${i})">✕</button></div>`; });
}
function removeFile(i) { uploadedFiles.splice(i, 1); renderFilePreviews(); }

function submitBooking() {
  const name = document.getElementById('bookName').value.trim();
  const phone = document.getElementById('bookPhone').value.trim();
  if (!name) { alert('Введите ваше имя'); return; }
  if (!phone || phone.length < 6) { alert('Введите номер телефона'); return; }
  const data = { action: 'booking', ...bookingData, name, phone, comment: document.getElementById('bookComment').value.trim() };
  if (tg) { tg.sendData(JSON.stringify(data)); tg.HapticFeedback?.notificationOccurred('success'); }
  document.querySelectorAll('.book-step').forEach(s => s.classList.remove('active'));
  const s = document.getElementById('bstepSuccess'); s.style.display = 'block'; s.classList.add('active');
  document.querySelectorAll('.step').forEach(s => s.classList.add('done'));
}

function resetBooking() {
  bookingData = {}; bookingStep = 1; uploadedFiles = [];
  document.getElementById('bookName').value = '';
  document.getElementById('bookPhone').value = '';
  document.getElementById('bookComment').value = '';
  document.getElementById('summaryCard').style.display = 'none';
  document.getElementById('bstepSuccess').style.display = 'none';
  document.getElementById('filePreviews').innerHTML = '';
  document.getElementById('catCards').style.display = 'grid';
  document.getElementById('srvSelectList').style.display = 'none';
  goToBookingStep(1);
}

// Gallery
document.querySelectorAll('.gal-item').forEach(item => {
  item.addEventListener('click', () => {
    document.getElementById('lbImg').src = item.querySelector('img').src;
    document.getElementById('lightbox').classList.add('open');
  });
});
function closeLightbox() { document.getElementById('lightbox').classList.remove('open'); }
document.getElementById('lightbox').addEventListener('click', e => { if (e.target === document.getElementById('lightbox')) closeLightbox(); });

function showPromos() { switchTab('home'); setTimeout(() => document.getElementById('promosSection').scrollIntoView({ behavior: 'smooth' }), 300); }

// ================================================
// AI BEAUTY CONSULTANT — INTELLIGENT ENGINE
// ================================================
const AI_NAME = "Бьюти-стилист";

const AI_KNOWLEDGE = {
  haircut: {
    round: ["Каскад на средние волосы — удлиняет лицо", "Удлинённое каре — маскирует щёки", "Боб с удлинёнными прядями у лица", "Стрижка с косой чёлкой"],
    oval: ["Пикси — идеально для овального лица", "Каре любой длины", "Чёлка: прямая, косая, арочная", "Боб-каре — подчеркнёт скулы"],
    square: ["Каскад с мягкими локонами", "Удлинённый боб — смягчает углы", "Градуированная стрижка с объёмом на макушке", "Косая удлинённая чёлка"],
    heart: ["Каре до плеч — балансирует подбородок", "Стрижка слоями от подбородка", "Боб с объёмом на уровне скул"],
    general: [
      "✂️ <b>Каре</b> — классика, подходит любому типу лица. от 1 200 ₽",
      "✂️ <b>Каскад</b> — придаёт объём тонким волосам. от 1 500 ₽",
      "✂️ <b>Пикси</b> — дерзкая и стильная короткая стрижка. от 900 ₽",
      "✂️ <b>Боб-каре</b> — модный тренд 2026. от 1 200 ₽",
      "✂️ <b>Шегги</b> — небрежный объём, эффект движения. от 1 500 ₽",
    ],
  },
  color: {
    warm: ["Карамельный блонд", "Медовый каштан", "Тёплый шоколад", "Золотистая бронза"],
    cool: ["Пепельный блонд", "Платина", "Холодный каштан", "Серебристый балаяж"],
    bright: ["Клубничный блонд", "Розовое золото", "Карамельный омбре", "Медный"],
    general: [
      "🎨 <b>Балаяж</b> — натуральный переход цвета. 3 000–10 000 ₽",
      "🎨 <b>Аиртач</b> — мягкий объёмный эффект. от 5 000 ₽",
      "🎨 <b>Шатуш</b> — солнечные блики в волосах. от 4 000 ₽",
      "🎨 <b>Тонирование</b> — освежает образ без вреда. от 2 000 ₽",
      "🎨 <b>Мелирование</b> — многогранный цвет. 2 500–8 000 ₽",
    ],
  },
  styling: {
    general: [
      "💫 <b>Голливудские локоны</b> — роскошь для вечера. от 2 000 ₽",
      "💫 <b>Пляжные волны</b> — лёгкий эффект отдыха. от 700 ₽",
      "💫 <b>Объёмная укладка</b> — буст-ап эффект. от 700 ₽",
      "💫 <b>Гладкий хвост</b> — элегантно и просто. от 700 ₽",
      "💫 <b>Французская коса</b> — романтика для длинных волос. от 1 000 ₽",
      "💫 <b>Пучок</b> — низкий или высокий, для любого повода. от 700 ₽",
    ],
  },
  nails: {
    general: [
      "💅 <b>Френч</b> — бессмертная классика. 2 300 ₽",
      "💅 <b>Градиент (омбре)</b> — плавные переходы цветов. 2 400 ₽",
      "💅 <b>Кошачий глаз</b> — магнитный гель-лак с глубиной. 2 500 ₽",
      "💅 <b>Минимализм</b> — тонкие линии, точки, геометрия. 2 300 ₽",
      "💅 <b>Стразы и фольга</b> — яркий праздничный дизайн. от 2 500 ₽",
      "💅 <b>Нюдовые оттенки</b> — элегантно на каждый день. 2 300 ₽",
    ],
  },
  skincare: {
    general: [
      "🧴 <b>Чистка комбинированная (Holy Land)</b> — глубокое очищение. 4 500 ₽",
      "🧴 <b>Биоревитализация</b> — увлажнение изнутри. 8 500–14 500 ₽",
      "🧴 <b>Мезотерапия</b> — витаминный коктейль для кожи. 6 500 ₽",
      "🧴 <b>Фарфоровая куколка</b> — сияние и тонус. 3 000 ₽",
      "🧴 <b>Ботулинотерапия</b> — разглаживание мимических морщин. 350 ₽/ед.",
    ],
  },
  brows: {
    general: [
      "🖊️ <b>Архитектура хной</b> — форма + окрашивание. 2 000 ₽",
      "🖊️ <b>Ламинирование бровей</b> — эффект уложенных бровей. от 2 000 ₽",
      "🖊️ <b>Перманент бровей</b> — идеальная форма надолго. 8 000 ₽",
      "🖊️ <b>Наращивание ресниц</b> — выразительный взгляд. от 2 000 ₽",
      "🖊️ <b>Ламинирование ресниц</b> — натуральный объём. от 1 800 ₽",
    ],
  },
};

const AI_RESPONSES = {
  greeting: [
    "Привет! 👋 Рада вас видеть! Расскажите, какой образ вы хотите — и я подберу идеальные услуги.",
    "Здравствуйте! ✨ Я ваш персональный бьюти-советник. Чем могу помочь?",
  ],
  face_shape: "Чтобы подобрать идеальную стрижку, подскажите форму вашего лица:\n\n🔵 Круглое\n🔷 Овальное\n🔲 Квадратное\n💎 Сердечко\n\nИли загрузите фото — я подскажу!",
  skin_type: "Для ухода за кожей важно знать ваш тип:\n\n💧 Сухая\n✨ Нормальная\n💦 Жирная\n🔀 Комбинированная\n\nЧто у вас?",
  hair_type: "Расскажите о ваших волосах:\n\n🌊 Волнистые\n〰️ Прямые\n🌀 Кудрявые\n📏 Длина: короткие/средние/длинные?",
  unknown: [
    "Интересный вопрос! 🤔 Я специализируюсь на стрижках, укладках, цвете волос, маникюре и уходе за кожей. Спросите меня об этом!",
    "Расскажу подробнее о наших услугах! Выберите тему: стрижка ✂️, окрашивание 🎨, укладка 💫, ногти 💅 или уход 🧴",
  ],
  booking_suggest: "\n\n📆 <i>Хотите записаться? Нажмите на вкладку «Запись» или выберите услугу выше!</i>",
};

function aiQuickTopic(topic) {
  const topicNames = {
    haircut: 'подбор стрижки', color: 'подбор цвета', styling: 'укладку',
    nails: 'дизайн ногтей', skincare: 'уход за кожей', brows: 'брови и ресницы',
  };
  addUserMessage(`Хочу консультацию по теме: ${topicNames[topic]}`);
  setTimeout(() => generateAIResponse(topic), 800);
}

function generateAIResponse(topic, context = '') {
  showTyping();
  setTimeout(() => {
    hideTyping();
    const knowledge = AI_KNOWLEDGE[topic];
    if (!knowledge) {
      addBotMessage(AI_RESPONSES.unknown[Math.floor(Math.random() * AI_RESPONSES.unknown.length)]);
      return;
    }
    const items = knowledge.general;
    let response = '';
    switch (topic) {
      case 'haircut':
        response = `✂️ <b>Рекомендации по стрижке:</b>\n\nВот что идеально подойдёт в этом сезоне:\n\n${items.join('\n\n')}\n\n💡 <i>Совет:</i> Для точной рекомендации расскажите форму лица или загрузите фото!`;
        break;
      case 'color':
        response = `🎨 <b>Модные окрашивания 2026:</b>\n\nТренды этого сезона:\n\n${items.join('\n\n')}\n\n💡 <i>Совет:</i> Тёплые оттенки подходят для тёплого цветотипа (весна/осень), холодные — для лета/зимы.`;
        break;
      case 'styling':
        response = `💫 <b>Идеи для укладки:</b>\n\n${items.join('\n\n')}\n\n💡 <i>Для повседневной или вечерней?</i> Уточните, подберу точнее!`;
        break;
      case 'nails':
        response = `💅 <b>Трендовый дизайн ногтей:</b>\n\n${items.join('\n\n')}\n\n💡 <i>Наш мастер Гаяне создаёт потрясающие дизайны!</i>`;
        break;
      case 'skincare':
        response = `🧴 <b>Уход за кожей:</b>\n\n${items.join('\n\n')}\n\n💡 <i>Процедуры подбираются индивидуально. Какой у вас тип кожи?</i>`;
        break;
      case 'brows':
        response = `🖊️ <b>Брови и ресницы:</b>\n\n${items.join('\n\n')}\n\n💡 <i>Перманент держится 1–2 года и экономит время утром!</i>`;
        break;
    }
    response += AI_RESPONSES.booking_suggest;
    addBotMessage(response);
    addRecommendationCards(topic);
  }, 1200 + Math.random() * 800);
}

function addRecommendationCards(topic) {
  const msgs = document.getElementById('aiMessages');
  const knowledge = AI_KNOWLEDGE[topic];
  if (!knowledge) return;
  const items = knowledge.general.slice(0, 3);
  const cardHtml = items.map(item => {
    const match = item.match(/<b>(.+?)<\/b>.*?(\d[\d\s–,]*₽)/);
    if (!match) return '';
    return `<div class="ai-reco-item"><span>${match[1]}</span><button class="ai-reco-book" onclick="aiBookService('${match[1]}')">Записаться</button></div>`;
  }).join('');
  if (cardHtml) {
    const div = document.createElement('div');
    div.className = 'ai-msg ai-msg-bot';
    div.innerHTML = `<div class="ai-msg-avatar">💡</div><div class="ai-reco-card"><h5>Рекомендуемое:</h5>${cardHtml}</div>`;
    div.style.animation = 'fadeIn 0.3s';
    msgs.appendChild(div);
    msgs.scrollTop = msgs.scrollHeight;
  }
}

function aiBookService(serviceName) {
  bookingData = { service: serviceName, price: '' };
  switchTab('booking');
  goToBookingStep(2);
}

function aiSendMessage() {
  const input = document.getElementById('aiInput');
  const text = input.value.trim();
  if (!text) return;
  addUserMessage(text);
  input.value = '';
  const lower = text.toLowerCase();
  let topic = null;
  if (/стриж|стрижк|причес|причёс|каре|боб|пикси|каскад|короткие|волосы подстричь/i.test(lower)) topic = 'haircut';
  else if (/цвет|краш|окраш|блонд|мелирование|балаяж|шатуш|тониров|покрасить|перекрасить/i.test(lower)) topic = 'color';
  else if (/укладк|локон|кудри|завив|причёс|причес|уложить|фен/i.test(lower)) topic = 'styling';
  else if (/ноготь|ногт|маник|педикюр|гель|лак|дизайн ногт|френч/i.test(lower)) topic = 'nails';
  else if (/кожа|кож|лицо|лиц|чистк|мезо|ботокс|биоревит|увлаж|морщин|прыщ|акне|уход/i.test(lower)) topic = 'skincare';
  else if (/бров|ресниц|перманент|наращивание ресниц|ламинирование/i.test(lower)) topic = 'brows';
  else if (/прив|здравст|добрый|хай|hello|привет/i.test(lower)) {
    showTyping();
    setTimeout(() => { hideTyping(); addBotMessage(AI_RESPONSES.greeting[Math.floor(Math.random() * AI_RESPONSES.greeting.length)]); }, 800);
    return;
  }
  else if (/форма лица|тип лица|какое лицо|круг|овал|квадрат/i.test(lower)) {
    showTyping();
    setTimeout(() => { hideTyping(); addBotMessage(AI_RESPONSES.face_shape); }, 600);
    return;
  }
  else if (/круглое|oval|овальное/i.test(lower)) {
    showTyping();
    const shape = /кругл/i.test(lower) ? 'round' : 'oval';
    setTimeout(() => {
      hideTyping();
      const recs = AI_KNOWLEDGE.haircut[shape];
      addBotMessage(`Для ${shape === 'round' ? 'круглого' : 'овального'} лица идеально:\n\n${recs.map(r => `• ${r}`).join('\n')}\n\n💇‍♀️ Хотите записаться на одну из этих стрижек?`);
    }, 1000);
    return;
  }
  else if (/квадратн/i.test(lower)) {
    showTyping();
    setTimeout(() => {
      hideTyping();
      const recs = AI_KNOWLEDGE.haircut.square;
      addBotMessage(`Для квадратного лица рекомендую:\n\n${recs.map(r => `• ${r}`).join('\n')}\n\nЗадача — смягчить углы скул мягкими линиями.`);
    }, 1000);
    return;
  }
  else if (/цена|стоимо|сколько|прайс/i.test(lower)) {
    showTyping();
    setTimeout(() => { hideTyping(); addBotMessage("Полный прайс-лист на вкладке 💇‍♀️ <b>Услуги</b>!\n\nНо если скажете какая услуга интересует — сразу назову цену 😊"); }, 600);
    return;
  }
  else if (/запис|забронир|прийти|время|свободн/i.test(lower)) {
    showTyping();
    setTimeout(() => { hideTyping(); addBotMessage("Для записи перейдите на вкладку 📆 <b>Запись</b> — там можно выбрать услугу, дату и время!\n\nИли скажите какую услугу хотите — и я подскажу лучшие варианты 💖"); }, 600);
    return;
  }
  if (topic) {
    generateAIResponse(topic, text);
  } else {
    showTyping();
    setTimeout(() => {
      hideTyping();
      addBotMessage(AI_RESPONSES.unknown[Math.floor(Math.random() * AI_RESPONSES.unknown.length)]);
    }, 800);
  }
}

function addUserMessage(text) {
  const msgs = document.getElementById('aiMessages');
  const div = document.createElement('div');
  div.className = 'ai-msg ai-msg-user';
  div.innerHTML = `<div class="ai-msg-avatar">👤</div><div class="ai-msg-bubble">${text}</div>`;
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
}

function addBotMessage(html) {
  const msgs = document.getElementById('aiMessages');
  const div = document.createElement('div');
  div.className = 'ai-msg ai-msg-bot';
  div.innerHTML = `<div class="ai-msg-avatar">🪞</div><div class="ai-msg-bubble glass-bubble">${html.replace(/\n/g, '<br>')}</div>`;
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
  if (tg) tg.HapticFeedback?.impactOccurred('light');
}

function showTyping() {
  const msgs = document.getElementById('aiMessages');
  const div = document.createElement('div');
  div.className = 'ai-msg ai-msg-bot'; div.id = 'aiTyping';
  div.innerHTML = `<div class="ai-msg-avatar">🪞</div><div class="ai-msg-bubble glass-bubble"><div class="ai-typing"><span></span><span></span><span></span></div></div>`;
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
}
function hideTyping() { document.getElementById('aiTyping')?.remove(); }

// AI Photo Upload
const aiUpload = document.getElementById('aiUpload');
const aiFileInput = document.getElementById('aiFileInput');
aiUpload.addEventListener('click', () => aiFileInput.click());
aiFileInput.addEventListener('change', e => {
  const file = e.target.files[0]; if (!file) return;
  const reader = new FileReader();
  reader.onload = ev => {
    document.getElementById('aiUploadPlaceholder').style.display = 'none';
    const prev = document.getElementById('aiUploadPreview');
    prev.style.display = 'block';
    document.getElementById('aiPreviewImg').src = ev.target.result;
  };
  reader.readAsDataURL(file);
});

function aiAnalyzePhoto() {
  addBotMessage("📸 Фото получено! Анализирую...");
  showTyping();
  setTimeout(() => {
    hideTyping();
    addBotMessage(
      "🔍 <b>Результат анализа:</b>\n\n" +
      "На основе вашего фото могу рекомендовать:\n\n" +
      "✂️ <b>Стрижка:</b> Удлинённое каре или каскад средней длины — подчеркнёт черты лица\n\n" +
      "🎨 <b>Цвет:</b> Тёплый карамельный балаяж или медовые блики — добавят объём и глубину\n\n" +
      "💫 <b>Укладка:</b> Мягкие пляжные волны или объёмная укладка у корней\n\n" +
      "💅 <b>Ногти:</b> Нюдовый маникюр или нежный розовый градиент — в тон образу\n\n" +
      "🧴 <b>Уход:</b> Увлажняющая процедура для лица — для здорового сияния\n\n" +
      "📆 <i>Готовы записаться? Нажмите «Запись» или спросите подробнее!</i>"
    );
    addRecommendationCards('haircut');
  }, 2500);
}

document.getElementById('aiInput').addEventListener('keypress', e => { if (e.key === 'Enter') aiSendMessage(); });

// ---- INIT ----
document.addEventListener('DOMContentLoaded', () => { renderCatalog(); renderCatCards(); });
