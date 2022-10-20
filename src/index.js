/*******************************************************
 * Авторское право (C) 2021-2022 Club Helper
 *
 * Этот файл является частью мини-приложения Club Helper, размещенного
 * в сети Интернет по адресу https://www.vk.com/app7938346
 *
 * Несанкционированное копирование, инженерный анализ, передача,
 * распространение кода приложения запрещены
 *******************************************************/

import React from "react";
import ReactDOM from "react-dom";
import bridge from "@vkontakte/vk-bridge";
import * as Sentry from "@sentry/react";
import moment from 'moment';
import 'moment/locale/ru';
import App from "./App";

// Инициализация VK Bridge
bridge.send("VKWebAppInit");

// Установка языка moment.js на русский
moment.locale("ru")

// Инициализация Sentry
Sentry.init({
  dsn: "https://af6ed8a8d8bf4838825744fed5750138@o1246975.ingest.sentry.io/6406561",
  beforeSend(event, hint) {
    // Проверяем, является ли это исключением, и если да, делаем запись в консоль
    if (event.exception) {
      console.log("Возникло необрабатываемое исключение, по которому был создан внутренний отчёт. Event ID: " + event.event_id);
      // Sentry.showReportDialog({ eventId: event.event_id });
    }
    return event;
  },


  // Установите значение tracesSampleRate на 1.0 чтобы собирать 100%
  // транзакций для мониторинга производительности.
  // Рекомендуется корректировать это значение в продакшне
  tracesSampleRate: 1.0,
  enableAutoSessionTracking: true
});

ReactDOM.render(<App />, document.getElementById("root"));
if (process.env.NODE_ENV === "development") {
  import("./eruda").then(({ default: eruda }) => { }); // Инициализация Eruda
}
