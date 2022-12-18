/*******************************************************
 * Авторское право (C) 2021-2022 Club Helper
 *
 * Этот файл является частью мини-приложения Club Helper, размещенного
 * в сети Интернет по адресу https://www.vk.com/app7938346
 *
 * Несанкционированное копирование, инженерный анализ, передача,
 * распространение кода приложения запрещены
 *******************************************************/

import React, { useState, useEffect, useRef } from 'react';
import bridge from '@vkontakte/vk-bridge';
import ScreenSpinner from '@vkontakte/vkui/dist/components/ScreenSpinner/ScreenSpinner';
import {AdaptivityProvider, AppRoot, ConfigProvider, Platform, SplitLayout, usePlatform, VKCOM} from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';
import Context from './Context/Context';

import Home from './panels/Home';

import './css/main.css';

const App = () => {
  const platformname = (/Android|iPhone|iPad|iPod/i.test(navigator.userAgent));
  const platformwithPlat = usePlatform();
  const platform = useRef();
  const [activeStory, setActiveStory] = useState('start_page');
  const [fetchedUser, setUser] = useState(null);
  const [popout, setPopout] = useState(<ScreenSpinner size='large' />);
  const api_url = 'https://ch.n1rwana.ml/api/';
  const [token, setToken] = useState("");
  const timerRef = useRef(null);
  const [appearance, setAppearance] = useState('light');
  const lights = ['bright_light', 'vkcom_light'];

  const [isLoading, setLoading] = useState(false);
  const [history, setHistory] = useState(['tickets_list']);

  function useScheme(scheme, needChange = false) {
    let isLight = lights.includes(scheme);

    if (needChange) {
      isLight = !isLight;
    }
    console.log(isLight)
    setAppearance(isLight ? 'light' : 'dark');

    if (platform.current !== VKCOM) {
      bridge.send('VKWebAppSetViewSettings', {
        'status_bar_style': isLight ? 'dark' : 'light',
        'action_bar_color': isLight ? '#FFF' : '#000',
        'navigation_bar_color': isLight ? '#FFF' : '#000'
     });
    }
  }

  useEffect(() => {
    platform.current = platformname ? platformwithPlat : Platform.VKCOM;
  });

  useEffect(() => {
    async function fetchData() {
      const user = await bridge.send('VKWebAppGetUserInfo');
      setUser(null);
    }
    fetchData();
  });

  useEffect(() => {
    bridge.subscribe(({ detail: { type, data } }) => {
      if (type === 'VKWebAppUpdateConfig') {
        useScheme(data.scheme)
      }
    });
  }, []);

  /**
   * Делает запись в консоль
   *
   * @param {string} mode - Тип сообщения
   * @param {string} data - Текст сообщения
   */
  const log = (mode, data) => {
    if (mode == "text") {
      console.log('%cCH: %c' + data, 'color: #F8AC6E', 'color: #0077FF')
    }
  }

  const advTimeout = 120000;

  /**
   * Функция, которая автоматически показывает пользователю рекламу
   * раз в advTimeout миллисекунд(ы)
   */
  const showAd = () => {
    clearTimeout(timerRef.current);

    bridge.send('VKWebAppShowNativeAds', { ad_format: "interstitial" })
      .then(timerRef.current = setTimeout(() => showAd(), advTimeout))
      .catch(error => console.error(error));
  }

  // timerRef.current = setTimeout(() => showAd(), advTimeout)

  /**
   * Осуществляет переход между панелями в приложении.
   *
   * @param {string} target — ID панели, на которую нужно осуществить переход
   */
  const go = (target) => {
    setLoading(true);
    window.history.pushState({ panel: target }, target);
    setActiveStory(target);
    setHistory([...history, target]);
  };

  /**
   * Функция для системной кнопки "Назад" на Android и свайпов на iOS.
   * Возвращает пользователя на предыдущую панель или закрывает приложение,
   * если это невозможно.
   */
  const goBack = (offset) => {
    if (!offset) offset = 1;
    console.log(history, history[history.length - offset])

    if (history.length === 1) {
      bridge.send("VKWebAppClose", { "status": "success" });
    } else if (history.length > offset) {
      let target = history[history.length - offset];
      window.history.pushState({ panel: target }, target);
      history.pop();
      setActiveStory(target);
    }
  }

  /**
   * Обработчик события изменения истории браузера для работы
   * навигационных кнопок.
   */
  useEffect(() => {
    window.addEventListener('popstate', (e) => { e.preventDefault(); goBack(); });
  })

  if (token != null) {
    return (
      <Context.Provider value={{ fetchedUser, setPopout, api_url }}>
        <ConfigProvider platform={platform.current} popout={popout} appearance={appearance}>
          <AdaptivityProvider>
            <AppRoot>
              <SplitLayout popout={popout}>
                <Home
                  id='home'
                  log={log}
                  fetchedUser={fetchedUser}
                  platform={platform}
                  appearance={appearance}
                  setAppearance={setAppearance}
                  popout={popout}
                  setPopout={setPopout}
                  api_url={api_url}
                  setActiveStory={setActiveStory}
                  activeStory={activeStory}
                  isLoading={isLoading}
                  setLoading={setLoading}
                  go={go}
                  goBack={goBack}
                  history={history}
                  setHistory={setHistory}
                />
              </SplitLayout>
            </AppRoot>
          </AdaptivityProvider>
        </ConfigProvider>
      </Context.Provider>
    );
  } else {
    return (
      <AppRoot>Ошибка при получении токена.</AppRoot>
    )
  }

}

export default App;

