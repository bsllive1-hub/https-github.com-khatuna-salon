# 📍 Проект «Хатуна» — Все расположения файлов

## 🖥️ Локально (ваш ПК)

### Основной сайт + Mini App
```
c:\Users\user\Desktop\miniapppp\khatuna\
├── index.html          — Главный сайт салона
├── styles.css          — Стили сайта
├── script.js           — Скрипт сайта
├── .gitignore          — Защита от утечки файлов
├── miniapp\
│   ├── index.html      — Mini App (Telegram)
│   ├── app.js          — Логика Mini App + ИИ-стилист
│   └── app.css         — Стили Mini App
├── bot\
│   ├── bot.py          — Telegram-бот (основной файл)
│   ├── handlers.py     — Обработчики команд бота
│   ├── keyboards.py    — Клавиатуры бота
│   ├── services.py     — Услуги и прайс-лист
│   ├── config.py       — Настройки бота
│   ├── database.py     — База данных бронирований
│   ├── requirements.txt— Зависимости бота
│   ├── Procfile         — Railway deployment
│   └── runtime.txt     — Python version
└── gemini-proxy\
    ├── server.py       — Прокси-сервер ИИ (OpenRouter)
    ├── requirements.txt— Зависимости прокси
    ├── Procfile         — Railway deployment
    └── runtime.txt     — Python version
```

---

## ☁️ GitHub (удалённо)

| Что | URL |
|-----|-----|
| **Сайт + Mini App** | https://github.com/bsllive1-hub/https-github.com-khatuna-salon |
| **GitHub Pages (живой сайт)** | https://bsllive1-hub.github.io/https-github.com-khatuna-salon/ |
| **Mini App (живая)** | https://bsllive1-hub.github.io/https-github.com-khatuna-salon/miniapp/ |

---

## 🚂 Railway (серверы)

| Сервис | URL |
|--------|-----|
| **ИИ-прокси (OpenRouter)** | https://gemini-proxy-production-35ac.up.railway.app |
| **Health check** | https://gemini-proxy-production-35ac.up.railway.app/health |
| **Railway Dashboard** | https://railway.com/project/92d04263-1f28-4c88-b598-e810b4cf764e |

---

## 🔑 API-ключи (хранятся на Railway, НЕ в коде)

| Ключ | Где хранится |
|------|-------------|
| **OpenRouter API Key** | Railway env var `OPENROUTER_API_KEY` |
| **Telegram Bot Token** | В файле `bot/config.py` (не в публичном репо) |

---

## 🤖 Telegram

| Что | Значение |
|-----|---------|
| **Бот** | @SalonXatunaBot |
| **Mini App URL** | Привязана к кнопке меню бота |

---

## 📝 Что сохранено

- ✅ Сайт салона — GitHub Pages (автодеплой)
- ✅ Mini App с ИИ-стилистом — GitHub Pages
- ✅ ИИ-прокси (7 моделей + vision) — Railway
- ✅ Telegram-бот — Railway
- ✅ Все файлы на ПК — `c:\Users\user\Desktop\miniapppp\khatuna\`
