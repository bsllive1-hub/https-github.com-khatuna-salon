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
// AI BEAUTY CONSULTANT — GEMINI-POWERED ENGINE
// ================================================
const GEMINI_PROXY_URL = "https://gemini-proxy-production-35ac.up.railway.app/api/chat";

const SYSTEM_PROMPT = `Ты — ИИ бьюти-стилист салона красоты «Хатуна» в Москве (Алтуфьевское шоссе, 74).
Твоя задача — давать персональные рекомендации по красоте и помогать клиентам выбрать услуги.

ПРАВИЛА:
- Отвечай на русском языке, дружелюбно и профессионально
- Используй эмодзи умеренно
- Давай конкретные рекомендации с ценами из прайса
- При анализе фото определяй: форму лица, тип кожи, цветотип, и давай индивидуальные рекомендации
- В конце ответа предлагай записаться
- Ответы должны быть краткими (до 200 слов)

ПРАЙС-ЛИСТ САЛОНА:
✂️ ПАРИКМАХЕРСКИЕ:
- Стрижка женская (короткие) от 900₽, (средние) от 1200₽, (длинные) от 2000₽
- Ровный срез 1200₽, Горячие ножницы от 1500₽
- Детская стрижка от 500₽, Мужская модельная 900₽
- Пенсионерам (10-12ч) 500₽, Усы и борода 700₽
- Окрашивание в один тон 3000-10000₽, Мелирование 2500-8000₽
- Осветление 3000-10000₽, Химзавивка 3500-8000₽
- Укладка от 700₽, Вечерняя причёска от 2000₽

💅 НОГТЕВОЙ СЕРВИС:
- Маникюр классика/аппарат от 800₽, Гель-лак 1000₽
- Маникюр + гель-лак 2300-2600₽, SPA-маникюр 2600₽
- Детский маникюр 500₽, Дизайн от 100₽
- Педикюр классический от 1800₽, аппаратный от 2200₽, с покрытием от 2800₽

💉 КОСМЕТОЛОГИЯ:
- Чистка комбинированная (Holy Land) 4500₽
- Фарфоровая куколка 3000₽, Мезотерапия 6500₽
- Биоревитализация 8500-14500₽, Ботулинотерапия 350₽/ед
- Увеличение губ (Stylage M) 15500₽
- Архитектура бровей хной 2000₽, Ламинирование бровей от 2000₽
- Окрашивание бровей 800-1000₽, Коррекция бровей от 500₽
- Наращивание ресниц от 2000₽, Ламинирование ресниц от 1800₽

💆 МАССАЖ:
- Миофасциально-букальный (1 час) 3000₽
- Авторский массаж лица (1 час) 2500-3000₽
- Общий массаж тела (1 час) 2600₽, Спины 2000₽, ШВЗ 1500₽
- Антицеллюлитный от 3000₽, Лимфодренажный от 3000₽

🌿 ЭПИЛЯЦИЯ:
- Бикини классическое 1500₽, глубокое 2000₽
- Ноги полностью 1400₽, Голени от 800₽, Подмышки от 500₽

🖊️ ПЕРМАНЕНТНЫЙ МАКИЯЖ:
- Брови 8000₽, Губы 8000₽, Межресничное 7000₽, Коррекция от 3000₽

КОНТАКТЫ: +7(993)285-99-02, Ежедневно 10-21, Dog-friendly, Wi-Fi, Парковка`;

let chatHistory = [];

async function callGemini(userText, imageBase64 = null) {
  const parts = [];
  if (imageBase64) {
    const base64Data = imageBase64.split(',')[1];
    const mimeType = imageBase64.match(/data:(.*?);/)?.[1] || 'image/jpeg';
    parts.push({ inlineData: { mimeType, data: base64Data } });
  }
  parts.push({ text: userText });

  chatHistory.push({ role: "user", parts });

  const contents = [
    { role: "user", parts: [{ text: SYSTEM_PROMPT }] },
    { role: "model", parts: [{ text: "Понятно! Я ИИ бьюти-стилист салона «Хатуна». Готова помочь с подбором услуг, стрижек, окрашивания, ухода и записью. Чем могу помочь?" }] },
    ...chatHistory
  ];

  try {
    const resp = await fetch(GEMINI_PROXY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents,
        generationConfig: {
          temperature: 0.8,
          maxOutputTokens: 800,
          topP: 0.9,
        }
      })
    });

    if (!resp.ok) {
      const err = await resp.text();
      console.error('Gemini error:', err);
      return "⚠️ Извините, произошла ошибка. Попробуйте ещё раз или позвоните нам: +7(993)285-99-02";
    }

    const data = await resp.json();
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "Не удалось получить ответ.";
    chatHistory.push({ role: "model", parts: [{ text: reply }] });

    // Keep history manageable
    if (chatHistory.length > 20) chatHistory = chatHistory.slice(-16);

    return reply;
  } catch (e) {
    console.error('Gemini fetch error:', e);
    return "⚠️ Нет связи с ИИ. Проверьте интернет или позвоните: +7(993)285-99-02";
  }
}

function aiQuickTopic(topic) {
  const topicNames = {
    haircut: 'Порекомендуй стрижку, которая мне подойдёт. Расскажи о трендах 2026 и ценах.',
    color: 'Хочу покрасить волосы. Какие модные окрашивания в 2026? Расскажи о ценах.',
    styling: 'Какую укладку порекомендуешь? Расскажи варианты с ценами.',
    nails: 'Хочу сделать маникюр. Какой дизайн в тренде? Расскажи о ценах.',
    skincare: 'Расскажи об уходе за кожей лица. Какие процедуры есть и цены?',
    brows: 'Хочу оформить брови и ресницы. Какие варианты и цены?',
  };
  const displayNames = {
    haircut: 'подбор стрижки', color: 'подбор цвета', styling: 'укладку',
    nails: 'дизайн ногтей', skincare: 'уход за кожей', brows: 'брови и ресницы',
  };
  addUserMessage(`Хочу консультацию по теме: ${displayNames[topic]}`);
  showTyping();
  callGemini(topicNames[topic]).then(reply => {
    hideTyping();
    addBotMessage(reply);
  });
}

function aiBookService(serviceName) {
  bookingData = { service: serviceName, price: '' };
  switchTab('booking');
  goToBookingStep(2);
}

async function aiSendMessage() {
  const input = document.getElementById('aiInput');
  const text = input.value.trim();
  if (!text) return;
  addUserMessage(text);
  input.value = '';
  showTyping();
  const reply = await callGemini(text);
  hideTyping();
  addBotMessage(reply);
}

function addUserMessage(text) {
  const msgs = document.getElementById('aiMessages');
  const div = document.createElement('div');
  div.className = 'ai-msg ai-msg-user';
  div.innerHTML = `<div class="ai-msg-avatar">👤</div><div class="ai-msg-bubble">${text}</div>`;
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
}

function addBotMessage(text) {
  const msgs = document.getElementById('aiMessages');
  const div = document.createElement('div');
  div.className = 'ai-msg ai-msg-bot';
  // Convert markdown bold **text** to <b>text</b> and newlines to <br>
  let html = text
    .replace(/\*\*(.+?)\*\*/g, '<b>$1</b>')
    .replace(/\*(.+?)\*/g, '<i>$1</i>')
    .replace(/\n/g, '<br>');
  div.innerHTML = `<div class="ai-msg-avatar">🪞</div><div class="ai-msg-bubble glass-bubble">${html}</div>`;
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

async function aiAnalyzePhoto() {
  const imgSrc = document.getElementById('aiPreviewImg').src;
  if (!imgSrc || !imgSrc.startsWith('data:')) {
    addBotMessage("⚠️ Сначала загрузите фото!");
    return;
  }
  addBotMessage("📸 Фото получено! Анализирую с помощью ИИ...");
  showTyping();
  const prompt = "Проанализируй это фото человека как профессиональный бьюти-стилист. Определи: 1) Форму лица 2) Цветотип (тёплый/холодный) 3) Тип и состояние волос (если видно). Дай конкретные рекомендации по: стрижке, цвету волос, укладке, макияжу, уходу за кожей. Укажи цены из нашего прайс-листа. Будь дружелюбной и профессиональной.";
  const reply = await callGemini(prompt, imgSrc);
  hideTyping();
  addBotMessage(reply);
}

document.getElementById('aiInput').addEventListener('keypress', e => { if (e.key === 'Enter') aiSendMessage(); });

// ---- INIT ----
document.addEventListener('DOMContentLoaded', () => { renderCatalog(); renderCatCards(); });
