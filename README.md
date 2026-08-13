# Aero English - ICAO Level 4 Trainer

Адаптивное учебное веб-приложение для подготовки к ICAO English Level 4 на основе книги *Check Your Aviation English*.

**Приложение:** https://andreivinchain.github.io/icao-level-4-trainer/

## Что реализовано

- 30 тематических units и 300 учебных заданий;
- 30 иллюстраций units и 8 изображений контрольных тестов из учебного материала;
- интерактивные picture questions, gist quiz, phrase builder, matching, role-play и speaking timer;
- раскрываемые model answers, адаптированные по listening scripts книги;
- 6 progress tests и 2 review tests;
- 240 словарных карточек;
- 30 сценариев Pilot-ATC;
- локальные аудиотреки CD1-CD3;
- прогресс и настройки в `localStorage`;
- мобильный интерфейс, тёмная тема и PWA manifest.

## Запуск

Требуется Node.js `>=22.13.0`.

```bash
npm install
npm run dev
```

Приложение откроется на `http://localhost:3000`.

Для запуска на телефоне в одной Wi-Fi сети:

```bash
npm run dev -- --hostname 0.0.0.0
```

Откройте на телефоне сетевой адрес, который появится в строке `Network`.

## Проверка

```bash
npm run lint
npm run build
npm run build:pages
```

## Структура

- `app/course-data.ts` - 30 units, тесты, словарь и привязка аудио;
- `app/page.tsx` - экраны приложения и интерактивная логика;
- `app/globals.css` - адаптивный интерфейс;
- `public/audio/` - локальные аудиоматериалы;
- `PRODUCT.md` - концепция, архитектура и дальнейшее развитие.

## Права на материалы

Учебные тексты и аудио используются для личной подготовки. Пользователь несёт ответственность за соблюдение прав правообладателя при использовании и распространении материалов книги.
