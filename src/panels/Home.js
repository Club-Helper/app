/*******************************************************
 * Авторское право (C) 2021-2023 Cloud Apps
 *
 * Этот файл является частью мини-приложения Club Helper, размещенного
 * в сети Интернет по адресу https://www.vk.com/app7938346
 *
 * Несанкционированное копирование, инженерный анализ, передача,
 * распространение кода приложения запрещены
 *******************************************************/

import React, { useState, useEffect } from 'react';

import Group from '@vkontakte/vkui/dist/components/Group/Group';
import { Avatar, Button, Cell, ConfigProvider, PanelHeader, Panel, Placeholder, SplitCol, SplitLayout, Tabbar, TabbarItem, useAdaptivity, View, ViewWidth, VKCOM, Alert, Footer, Link, SimpleCell, Spinner, PanelHeaderBack, Spacing, ScreenSpinner, ModalRoot, ModalPage, Div } from '@vkontakte/vkui';
import { Icon24Linked, Icon28MessagesOutline, Icon28SettingsOutline, Icon28CommentOutline, Icon28AdvertisingOutline, Icon28StatisticsOutline, Icon28ArticlesOutline, Icon36Users3Outline, Icon32AdvertisingOutline, Icon28UserTagOutline, Icon28LifebuoyOutline, Icon24BroadcastOutline } from '@vkontakte/icons';
import { Epic } from '@vkontakte/vkui/dist/components/Epic/Epic';

import Donut from './features/landings/Donut';
import Welcome from './features/landings/Welcome';

import AppInfo from './features/common/AppInfo';
import ClubInfo from './features/common/ClubInfo';

import SignError from './features/errors/SignError';
import Banned from './features/errors/Banned';

import StartPage from './features/common/StartPage';
import CallAdmin from './features/common/CallAdmin';

import Settings from './features/settings/Settings'

import Links from './features/links/List';
import Comments from './features/comments/List';
import Templates from './features/templates/Templates';

import TicketsList from './features/tickets/List';
import Ticket from './features/tickets/Ticket';
import TicketEval from './features/tickets/TicketEval';

import MailingList from './features/mailing/List';
import StatsHome from './features/stats/Home';
import Office from './features/office/Index';
import Clubs from './features/office/Clubs';
import Mailings from './features/office/Mailings';
import ClubCard from './features/office/Club';
import ClubCardMailings from './features/office/ClubCardMailings';

import FAQIndex from './features/faq/Index';
import FAQTopic from './features/faq/Topic';

import DonutIcon from '../img/donut.png'

import bridge from '@vkontakte/vk-bridge';
import FAQTriggers from './features/faq/Triggers';
import FAQSymptoms from './features/faq/Symptoms';
import FAQSolutions from './features/faq/Solutions';

function Home({
  platform,
  popout,
  setPopout,
  api_url,
  setHistory,
  appearance,
  setAppearance,
  activeStory,
  setActiveStory,
  isLoading,
  setLoading,
  go,
  goBack,
  history
}) {
  const viewWidth = useAdaptivity().viewWidth;
  const isDesktop = viewWidth >= ViewWidth.SMALL_TABLET;
  const isMobile = !isDesktop;
  const hasHeader = platform.current !== VKCOM;
  const [modals, setModals] = useState(false);
  const [signCheckStatus, setSignCheckStatus] = useState(true)
  const [banned, setBan] = useState(null);
  const [isNew, setIsNew] = useState(true);
  const [group_id, setGroupId] = useState(0);
  const [user_id, setUserId] = useState(0);
  const [token, setToken] = useState(null);
  const [club, setClub] = useState(null);
  const [donut, setDonut] = useState(null);
  const [donutStatus, setDonutStatus] = useState(false);
  const [club_role, setRole] = useState(null);
  const [page, setPage] = useState(null);

  const [messages_enabled, setMessagesStatus] = useState(false);
  const [links_enabled, setLinksStatus] = useState(false);
  const [comments_enabled, setCommentsStatus] = useState(false);

  const [ticket, setTicket] = useState(null);

  const [mailingState, setMailingState] = useState(null);
  const [linksState, setLinksState] = useState(null);
  const [ticketsState, setTicketsState] = useState(null);
  const [settingsState, setSettingsState] = useState(null);
  const [commentsState, setCommentsState] = useState(null);

  const [lastClubID, setLastClubID] = useState(0);

  const [office, setOffice] = useState(null);
  const [clubCard, setClubCard] = useState(null);
  const [clubCardMailings, setClubCardMailings] = useState(null);

  const [startupError, setStartupError] = useState(null);
  const [showMenu, toggleShowMenu] = useState(true);
  const [showMobileMenu, toggleShowMobileMenu] = useState(true);

  const [openedSolution, setOpenedSolution] = useState(null);
  const [openedProduct, setOpenedProduct] = useState(null);
  const [openedTrigger, setOpenedTrigger] = useState(null);
  const [openedTriggerTitle, setOpenedTriggerTitle] = useState([]);
  const [chooseSymptoms, setChooseSymptoms] = useState(null);
  const [triggerMode, setTriggerMode] = useState(null);
  const [openedCategoryId, setOpenedCategoryId] = useState(null);
  const [openedSymptom, setOpenedSymptom] = useState(null);
  const [openedTSolution, setOpenedTSolution] = useState(null);

  const [languageCode, setLanguageCode] = useState("ru");
  const [locale, setLocale] = useState({});
  const [ruLocale, setRuLocale] = useState({});

  const [needToShowClubStartOnboarding, toggleNeedToShowClubStartOnboarding] = useState(false);

  const [activeModal, setActiveModal] = useState("");
  const [apiScheme, setScheme] = useState("https");

  const [needToOpenSettingsOnClubMount, toggleNeedToOpenSettingsOnClubMount] = useState(false);

  const [tapticEngineSupport, toggleTapticEngineSupport] = useState(false);

  const checkVersion = (a, b) => {

    const [majorA, minorA] = String(a).split('.').map(v => Number.parseInt(v));
    const [majorB, minorB] = String(b).split('.').map(v => Number.parseInt(v));

    if (majorA !== majorB) {
      return majorA > majorB;
    }

    return minorA > minorB;

  };

  let queryString = window.location.search;
  const params = new URLSearchParams(queryString);

  const [canViewTickets, toggleCanViewTickets] = useState(null);
  const [canViewPattern, toggleCanViewPattern] = useState(null);
  const [canViewMailing, toggleCanViewMailing] = useState(null);
  const [canViewPush, toggleCanViewPush]       = useState(null);
  const [canViewClubs, toggleCanViewClubs]     = useState(null);
  const [canViewSupport, toggleCanViewSupport] = useState(null);
  const [canViewDonut, toggleCanViewDonut]     = useState(null);
  const [canAddReport, toggleCanAddReport]     = useState(null);

  const [color, setColor] = useState("");
  const [menuPosition, setMenuPosition] = useState("");

  useEffect(() => {
    bridge.send("VKWebAppGetClientVersion")
      .then((data) => {
        if (params.get('odr_enabled') === "1" && checkVersion(data.version, '6.46')) {
          setScheme('vkcors');
        }
      })

    if (!localStorage.getItem("ch_appearance_color")) {
      let _accent = isDesktop ? (appearance === "light" ? "#5181b8" : "#ffffff") : (appearance === "light" ? "#0077ff" : "#ffffff");

      localStorage.setItem("ch_appearance_color", _accent);
      setColor(_accent);
    } else {
      setColor(localStorage.getItem("ch_appearance_color"));
    }

    if (!localStorage.getItem("ch_appearance_menu")) {
      localStorage.setItem("ch_appearance_menu", "right");
      setMenuPosition("right");
    } else {
      setMenuPosition(localStorage.getItem("ch_appearance_menu"));
    }

    toggleTapticEngineSupport(bridge.supports("VKWebAppTapticNotificationOccurred"));

    /*fetch(`${apiScheme}://cloud-apps.ru/translation/ru`)
      .then(response => response.json())
      .then(data => {
        console.log("RU LOCALE", data);
        setRuLocale(data);
        if (params.get("vk_language") == "ru") setLocale(data);
      })

    if (params.get("vk_language") != "ru") {
      fetch(`${apiScheme}://cloud-apps.ru/translation/${params.get("vk_language")}`)
        .then(response => response.json())
        .then(data => {
          console.log(`LOCALE (${params.get("vk_language")})`, data);
          setLocale(data);
        })
    }*/

    fetch(`${apiScheme}://cloud-apps.ru/api/app.start${window.location.search}`)
      .then(response => response.json())
      .then(data => {
        if (data.error == null) {
          setSignCheckStatus(true);
          if (data.response.status == "fail") {
            setBan(data.response)
          } else {
            let role = params.get("vk_viewer_group_role");
            setGroupId(Number(params.get("vk_group_id")));
            setUserId(Number(params.get("vk_user_id")));
            setRole(role);
            setToken(data.response.token);
            setLanguageCode(params.get("vk_language"));

            console.log("Session ID", data.response.session_id);

            setLastClubID(data.response.last_club)

            toggleCanViewTickets(data.response.can_view_tickets);
            toggleCanViewPattern(data.response.can_view_pattern);
            toggleCanViewMailing(data.response.can_view_mailing);
            toggleCanViewPush(data.response.can_view_push);
            toggleCanViewClubs(data.response.can_view_clubs);
            toggleCanViewSupport(data.response.can_view_support);
            toggleCanViewDonut(data.response.can_view_donut);

            if (data.response.page === "app") {
              setPage("app");
              setRole(role)
              setIsNew(false);

              fetch(`${apiScheme}://cloud-apps.ru/api/clubs.get?token=${data.response.token}`)
                .then(response => response.json())
                .then(data => {
                  if (!data.error) {
                    setClub(data.response)
                    setDonut(data.response.donut)
                    setDonutStatus(data.response.donut.status)
                    setMessagesStatus(data.response.setting.messages.status)
                    setLinksStatus(data.response.setting.links.status)
                    setCommentsStatus(data.response.setting.comments.status)
                    setPopout(null)

                    if (data.response.error) {
                      if (role == "admin") {
                        toggleShowMenu(false);
                        setStartupError(data.response.error)
                        setActiveStory('club_info');
                      } else {
                        toggleShowMenu(false);
                        setActiveStory('call_admin');
                      }
                    } else {
                      if (data.response.setting.messages.status == false && data.response.setting.links.status == false && data.response.setting.comments.status == false && role != "admin") {
                        toggleShowMenu(false);
                        setActiveStory('call_admin');
                      } else {
                        setActiveStory(data.response.can_view_tickets ? 'tickets_list' : 'club_info');
                      }
                    }
                  } else {
                    setPopout(null);
                    createError(data.error.error_msg);
                  }
                })
            } else if (data.response.page === "call_admin" || data.response.page === "need_admin") {
              setPage("app");
              setIsNew(false);
              toggleShowMenu(false);

              setActiveStory("call_admin");
            } else if (data.response.page === "landing") {
              setIsNew(true);
              setPage("landing");

            } else if (data.response.page === "landing_setting") {
              setIsNew(true);
              setPage("landing_setting");
            } else if (data.response.page === "office") {
              setIsNew(false);

              fetch(`${apiScheme}://cloud-apps.ru/api/office.get?token=${data.response.token}`)
                .then(response => response.json())
                .then(data => {
                  setOffice(data.response);
                })

              setPage("office");
              if (data.response.can_view_clubs) {
                setHistory(["office-clubs"]);
                setActiveStory("office-clubs");
              } else {
                setHistory(["office"]);
                setActiveStory("office");
              }
            } else if (data.response.page === "club") {
              setIsNew(false);
              setToken(data.response.token)

              toggleCanAddReport(data.response.can_add_report);
              toggleCanViewMailing(data.response.can_view_mailing);

              /*ym(90794548, 'userParams', {
                session_id: data.response.session_id
              });*/

              fetch(`${apiScheme}://cloud-apps.ru/api/clubs.get?token=${data.response.token}`)
                .then(response => response.json())
                .then(res => {
                  setClubCard(res.response);
                  fetch(`${apiScheme}://cloud-apps.ru/api/mailings.get?token=${data.response.token}&my=true`)
                    .then(response => response.json())
                    .then(cc => setClubCardMailings(cc.response));
                })

              setPage("club");
              setActiveStory("club-card");
            }
          }
        } else {
          setSignCheckStatus(false);
        }
      })
  }, [])

  const t = (key) => {
    if (locale[key]) return locale[key];
    else if (ruLocale[key]) return ruLocale[key];
    else return `{{${key}}}`;
  }

  const updateOffice = () => {
    fetch(`${apiScheme}://cloud-apps.ru/api/office.get?token=${token}`)
      .then(response => response.json())
      .then(data => {
        setOffice(data.response);
      })
  }

  const updateCCMailings = () => {
    fetch(`${apiScheme}://cloud-apps.ru/api/mailings.get?token=${token}&my=true`)
      .then(response => response.json())
      .then(cc => setClubCardMailings(cc.response));
  }

  /**
   * Создаёт модальное окно с ошибкой
   *
   * @param {string} text - Текст ошибки
   */
  const createError = (text) => {
    setPopout(
      <Alert
        actions={[
          {
            title: "Закрыть",
            autoclose: true,
            mode: "cancel",
          },
        ]}
        onClose={() => setPopout(null)}
        actionsLayout="vertical"
        header="Ошибка"
        text={text}
      />
    )
  }

  /**
   * Возвращает форму слова в зависимости от числа, переданного в n
   *
   * @param {int} n - Число
   * @param {Array} text_forms - Массив с формами слова, напр. ["ссылку", "ссылки", "ссылок"]
   * @returns {string}
   */
  const declOfNum = (n, text_forms) => { // Склонение слов
    n = Math.abs(n) % 100;
    let n1 = n % 10;
    if (n > 10 && n < 20) { return text_forms[2]; }
    if (n1 > 1 && n1 < 5) { return text_forms[1]; }
    if (n1 == 1) { return text_forms[0]; }
    return text_forms[2];
  }

  /**
   * Сгенерировать рандомную строку.
   *
   * @param {int} length — Длина строки
   */
  const generateRandomString = (length) => {
    let result = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() *
        charactersLength));
    }
    return result;
  }

  /**
   * Генерирует случайное число в пределах от min до max.
   *
   * @param {int} min — Минимально возможное число
   * @param {int} max — Максимально возможное число
   */
  const generateRandomInt = (min, max) => {
    return Math.random() * (max - min) + min;
  }

  /**
   * Форматирует название роли
   *
   * @param {string} raw — Название роли, которое отдаёт VK
   */
  const formatRole = (raw) => {
    const roles = {
      "moderator": "Модератор",
      "editor": "Редактор",
      "administrator": "Администратор",
      "creator": "Создатель"
    };

    return roles[raw];
  }

  /**
   * Преобразует объект в query string
   *
   * @param {object} obj
   * @returns {string} Query string
   */
  const serialize = (obj) => {
    let str = [];
    for (let p in obj)
      if (obj.hasOwnProperty(p)) {
        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
      }
    return str.join("&");
  }

  const generateRefSourceString = (source) => {
    let _id = group_id ? -group_id : user_id;
    return JSON.stringify({
      owner_id: _id,
      source: source
    });
  }

  const menuItems = [
    {
      id: "tickets_list",
      triggers: [
        "tickets_list",
        "ticket"
      ],
      name: "Обращения",
      before: <Icon28MessagesOutline fill={isMobile ? ["tickets_list", "ticket"].includes(activeStory) ? color : "" : color} />,
      show: (club_role === "admin" || messages_enabled) && canViewTickets,
      fill: ["tickets_list", "ticket"].includes(activeStory) ? color : ""
    },
    {
      id: "links",
      triggers: ["links"],
      name: "Ссылки",
      before: <Icon24Linked width={28} height={28} fill={isMobile ? ["links"].includes(activeStory) ? color : "" : color} />,
      show: false,
      fill: ["links"].includes(activeStory) ? color : ""
    },

    {
      id: "comments",
      triggers: ["comments"],
      name: "Комментарии",
      before: <Icon28CommentOutline fill={isMobile ? ["comments"].includes(activeStory) ? color : "" : color} />,
      show: false,
      fill: ["comments"].includes(activeStory) ? color : ""
    },
    {
      id: "templates",
      triggers: ["templates"],
      name: "Шаблоны",
      before: <Icon28ArticlesOutline fill={isMobile ? ["templates"].includes(activeStory) ? color : "" : color} />,
      show: (club_role === "admin" || links_enabled) || (club_role === "admin" || comments_enabled) && canViewPattern,
      fill: ["templates"].includes(activeStory) ? color : ""
    },
    {
      id: "mailing_list",
      triggers: ["mailing_list", "mailing"],
      name: "Рассылки",
      before: <Icon28AdvertisingOutline fill={isMobile ? ["mailing_list", "mailing"].includes(activeStory) ? color : "" : color} />,
      show: canViewMailing,
      fill: ["mailing_list", "mailing"].includes(activeStory) ? color : ""
    },
    {
      id: "settings",
      triggers: ["settings"],
      name: "Настройки",
      before: <Icon28SettingsOutline fill={isMobile ? ["settings"].includes(activeStory) ? color : "" : color} />,
      // show: (club_role === "admin")
      show: false,
      fill: ["settings"].includes(activeStory) ? color : ""
    },
    {
      id: "stats_home",
      triggers: ["stats_home"],
      name: "Статистика",
      before: <Icon28StatisticsOutline fill={isMobile ? ["stats_home"].includes(activeStory) ? color : "" : color} />,
      // show: (club_role === "admin")
      show: false,
      fill: ["stats_home"].includes(activeStory) ? color : ""
    },
    {
      id: "club_info",
      triggers: ["club_info", "settings", "stats_home", "faq", "faq-solution", "faq-triggers", "faq-symptoms", "faq-tsolution"],
      name: club?.name,
      before: <Avatar size={28} src={club?.photo} />,
      show: !isDesktop && canViewClubs,
      fill: ["club_info", "settings", "stats_home", "faq", "faq-solution", "faq-triggers", "faq-symptoms", "faq-tsolution"].includes(activeStory) ? color : ""
    },
  ];

  const officeMenuItems = [
    {
      id: "office",
      triggers: ["office"],
      name: office?.user?.first_name,
      before: <Avatar size={28} src={office?.user?.photo} />,
      show: !isDesktop,
      fill: ["office"].includes(activeStory) ? color : ""
    },
    {
      id: "office-clubs",
      triggers: ["office-clubs"],
      name: "Сообщества",
      before: <Icon36Users3Outline width={28} height={28} fill={isMobile ? ["office-clubs"].includes(activeStory) ? color : "" : color} />,
      show: canViewClubs,
      fill: ["stats_home"].includes(activeStory) ? color : ""
    },
    {
      id: "office-mailings",
      triggers: ["office-mailings"],
      name: "Рассылки",
      before: <Icon32AdvertisingOutline width={28} height={28} fill={isMobile ? ["office-mailings"].includes(activeStory) ? color : "" : color} />,
      show: canViewMailing,
      fill: ["office-mailings"].includes(activeStory) ? color : ""
    },
    {
      id: "faq",
      triggers: ["faq", "faq-solution", "faq-triggers", "faq-symptoms", "faq-tsolution"],
      name: "Поддержка",
      before: <Icon28LifebuoyOutline fill={isMobile ? ["faq", "faq-solution", "faq-triggers", "faq-symptoms", "faq-tsolution"].includes(activeStory) ? color : "" : color} />,
      show: canViewSupport,
      fill: ["faq", "faq-solution", "faq-triggers", "faq-symptoms", "faq-tsolution"].includes(activeStory) ? color : ""
    }
  ];

  const clubMenuItems = [
    {
      id: "club-card",
      triggers: ["club-card"],
      name: clubCard?.name,
      before: <Avatar src={clubCard?.photo} size={28} fill={isMobile ? ["club-card"].includes(activeStory) ? color : "" : color} />,
      show: !isDesktop,
      fill: ["club-card"].includes(activeStory) ? color : ""
    },
    {
      id: "clubCard-mailings",
      triggers: ["clubCard-mailings"],
      name: "Рассылки",
      before: <Icon32AdvertisingOutline width={28} height={28} fill={isMobile ? ["clubCard-mailings"].includes(activeStory) ? color : "" : color} />,
      show: true,
      fill: ["clubCard-mailings"].includes(activeStory) ? color : ""
    }
  ]

  let club_role_formatted = formatRole(club_role);

  function setCookie(name, value, days) {
    let expires = "";
    if (days) {
      let date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
  }

  function getCookie(name) {
    let nameEQ = name + "=";
    let ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  }

  function eraseCookie(name) {
    document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  }

  const parseLinks = (string) => {
    const regex = /\[(https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*))\|(.*)\]/g;
    return string.replaceAll(regex, '<a href="$1" target="_blank" style="color: #2688eb; text-decoration: none;">$2</a>');
  }

  const req = (method, body, callback, onError) => {
    if (this?.fetchFailRetryTimeout) {
      clearTimeout(this.fetchFailRetryTimeout);
    }

    if (navigator.onLine) {
      fetch(`${apiScheme}://cloud-apps.ru/api/${method}`, {
        method: "POST",
        body: JSON.stringify(body)
      })
        .then(response => response.json())
        .then(data => {
          if (!data.error) {
            console.log(`/${method}`, data);
            callback(data);
          } else {
            console.error(`/${method}`, data);
            if (!onError) {
              if (data.error?.error_msg) {
                createError(data.error?.error_msg)
              }
            } else {
              onError(data);
            }
          }
        })
        .catch((error) => {
          if (onError) {
            onError();
          } else {
            console.error("CRITICAL FETCH ERROR", error);
          }
          setPopout(<ScreenSpinner />);
          this.fetchFailRetryTimeout = setTimeout(() => {
            req(method, body, callback, onError);
            setPopout(null);
            let _activeStory = activeStory;
            setActiveStory("");
            setActiveStory(_activeStory);
          }, 10000);
        })
    } else {
      setActiveModal("noInternet");
    }
  }

  const changeMode = (mode) => {
    if (mode == "office") {
      setPopout(<ScreenSpinner />);
      fetch(`${apiScheme}://cloud-apps.ru/api/office.get?token=${token}`)
        .then(response => response.json())
        .then(data => {
          setOffice(data.response);
        })

      setHistory(["office-clubs"]);
      setPage("office");
      setActiveStory("office-clubs");
      toggleShowMenu(true);
      setBan(null);
    }
  }

  const basicProps = {
    club_role: club_role,
    group_id: group_id,
    go: go,
    goBack: goBack,
    token: token,
    isMobile: isMobile,
    setPopout: setPopout,
    platform: platform,
    hasDonut: donutStatus,
    createError: createError,
    isLoading: isLoading,
    setLoading: setLoading,
    appearance: appearance,
    req: req,
    generateRefSourceString: generateRefSourceString,
    toggleShowMenu: toggleShowMenu,
    parseLinks: parseLinks,
    params: params,
    t: t,
    color: color,
    setColor: setColor,
    menuPosition: menuPosition,
    setMenuPosition: setMenuPosition,
    tapticEngineSupport: tapticEngineSupport
  };

  const panels = [
    {
      id: "club_start_onboarding",
      panelHeader: null,
      obj: (
        <Welcome
          {...basicProps}
          toggleNeedToShowClubStartOnboarding={toggleNeedToShowClubStartOnboarding}
          toggleShowMenu={toggleShowMenu}
          setActiveStory={setActiveStory}
        />
      )
    },
    {
      id: "comments_list",
      panelHeader: isMobile && <PanelHeader>Комментарии</PanelHeader>,
      obj: (
        <Comments
          {...basicProps}
          declOfNum={declOfNum}
          commentsState={commentsState}
          setCommentsState={setCommentsState}
          toggleNeedToOpenSettingsOnClubMount={toggleNeedToOpenSettingsOnClubMount}
          toggleShowMobileMenu={toggleShowMobileMenu}
        />
      )
    },
    {
      id: "templates",
      panelHeader: null,
      obj: (
        <Templates
          {...basicProps}
          declOfNum={declOfNum}
          linksState={linksState}
          setLinksState={setLinksState}
          toggleNeedToOpenSettingsOnClubMount={toggleNeedToOpenSettingsOnClubMount}
          toggleShowMobileMenu={toggleShowMobileMenu}
          donutStatus={donutStatus}
        />
      )
    },
    {
      id: "stats_home",
      panelHeader: null,
      obj: (
        <StatsHome
          {...basicProps}
        />
      )
    },
    {
      id: "mailing_list",
      panelHeader: null,
      obj: (
        <MailingList
          {...basicProps}
          mailingState={mailingState}
          setMailingState={setMailingState}
          declOfNum={declOfNum}
          toggleNeedToOpenSettingsOnClubMount={toggleNeedToOpenSettingsOnClubMount}
          toggleShowMobileMenu={toggleShowMobileMenu}
        />
      )
    },
    {
      id: "links",
      panelHeader: isMobile && <PanelHeader>Ссылки</PanelHeader>,
      obj: (
        <Links
          {...basicProps}
          declOfNum={declOfNum}
          linksState={linksState}
          setLinksState={setLinksState}
          toggleNeedToOpenSettingsOnClubMount={toggleNeedToOpenSettingsOnClubMount}
          toggleShowMobileMenu={toggleShowMobileMenu}
          donutStatus={donutStatus}
        />
      )
    },
    {
      id: "donut-landing",
      panelHeader: (
        <PanelHeader
          left={<PanelHeaderBack onClick={() => goBack()} />}
        >
          VK Donut
        </PanelHeader>
      ),
      obj: (
        <Donut
          {...basicProps}
        />
      )
    },
    {
      id: "sign-error",
      panelHeader: null,
      obj: (
        <SignError
          {...basicProps}
        />
      )
    },
    {
      id: "settings",
      panelHeader: isMobile && <PanelHeader left={<PanelHeaderBack onClick={() => goBack()} />}>Настройки</PanelHeader>,
      obj: (
        <Settings
          {...basicProps}
          setAppearance={setAppearance}
          serialize={serialize}
          settingsState={settingsState}
          setSettingsState={setSettingsState}
          setDonutStatus={setDonutStatus}
          setIsNew={setIsNew}
          setActiveStory={setActiveStory}
          setPopout={setPopout}
          setBan={setBan}
          setHistory={setHistory}
        />
      )
    },
    {
      id: "tickets_list",
      panelHeader: isMobile && <PanelHeader>Обращения</PanelHeader>,
      obj: (
        <TicketsList
          {...basicProps}
          needToShowClubStartOnboarding={needToShowClubStartOnboarding}
          toggleNeedToShowClubStartOnboarding={toggleNeedToShowClubStartOnboarding}
          setCookie={setCookie}
          getCookie={getCookie}
          setTicket={setTicket}
          ticketsState={ticketsState}
          setTicketsState={setTicketsState}
          setActiveStory={setActiveStory}
          setIsNew={setIsNew}
          parseLinks={parseLinks}
          toggleNeedToOpenSettingsOnClubMount={toggleNeedToOpenSettingsOnClubMount}
          toggleShowMobileMenu={toggleShowMobileMenu}
        />
      )
    },
    {
      id: "ticket",
      panelHeader: null,
      obj: (
        <Ticket
          {...basicProps}
          generateRandomString={generateRandomString}
          generateRandomInt={generateRandomInt}
          ticket={ticket}
          setActiveStory={setActiveStory}
          club={club}
          toggleShowMobileMenu={toggleShowMobileMenu}
        />
      )
    },
    {
      id: "call_admin",
      panelHeader: null,
      obj: (
        <CallAdmin
          {...basicProps}
          changeMode={changeMode}
        />
      )
    },
    {
      id: "app_info",
      panelHeader: null,
      obj: (
        <AppInfo
          {...basicProps}
        />
      )
    },
    {
      id: "ticket_eval",
      panelHeader: null,
      obj: (
        <TicketEval
          {...basicProps}
          setIsNew={setIsNew}
          club={club}
          setActiveStory={setActiveStory}
        />
      )
    },
    {
      id: "club_info",
      panelHeader: null,
      obj: (
        <ClubInfo
          id="club_info"
          {...basicProps}
          club={club}
          setActiveStory={setActiveStory}
          setIsNew={setIsNew}
          club_role={club_role}
          formatRole={formatRole}
          setAppearance={setAppearance}
          setDonutStatus={setDonutStatus}
          serialize={serialize}
          startupError={startupError}
          setStartupError={setStartupError}
          setPage={setPage}
          changeMode={changeMode}
          setPopout={setPopout}
          showMenu={showMenu}
          toggleShowMenu={toggleShowMenu}
          toggleShowMobileMenu={toggleShowMobileMenu}
          needToOpenSettingsOnClubMount={needToOpenSettingsOnClubMount}
          toggleNeedToOpenSettingsOnClubMount={toggleNeedToOpenSettingsOnClubMount}
        />
      )
    },
    {
      id: "banned",
      panelHeader: null,
      obj: (
        <Banned req={req} setToken={setToken} changeMode={changeMode} id="banned" {...banned} isDesktop={isDesktop} appearance={appearance} generateRefSourceString={generateRefSourceString} />
      )
    },
    {
      id: "faq",
      panelHeader: null,
      obj: (
        <FAQIndex
          {...basicProps}
          setOpenedSolution={setOpenedSolution}
          openedSolution={openedSolution}
          setOpenedProduct={setOpenedProduct}
          setTriggerMode={setTriggerMode}
          triggerMode={triggerMode}
          openedCategoryId={openedCategoryId}
          setOpenedCategoryId={setOpenedCategoryId}
          openedSymptom={openedSymptom}
          setOpenedSymptom={setOpenedSymptom}
          openedTSolution={openedTSolution}
          setOpenedTSolution={setOpenedTSolution}
          showMenu={showMenu}
          setActiveStory={setActiveStory}
        />
      )
    },
    {
      id: "faq-solution",
      panelHeader: null,
      obj: (
        <FAQTopic
          {...basicProps}
          openedSolution={openedSolution}
          setOpenedSolution={setOpenedSolution}
          topic={openedSolution}
          setOpenedProduct={setOpenedProduct}
          openedProduct={openedProduct}
          openedTrigger={openedTrigger}
          setOpenedTrigger={setOpenedTrigger}
          openedTriggerTitle={openedTriggerTitle}
          setOpenedTriggerTitle={setOpenedTriggerTitle}
          setChooseSymptoms={setChooseSymptoms}
          setTriggerMode={setTriggerMode}
          triggerMode={triggerMode}
          openedCategoryId={openedCategoryId}
          setOpenedCategoryId={setOpenedCategoryId}
          openedSymptom={openedSymptom}
          setOpenedSymptom={setOpenedSymptom}
          openedTSolution={openedTSolution}
          setOpenedTSolution={setOpenedTSolution}
        />
      )
    },
    {
      id: "faq-triggers",
      panelHeader: null,
      obj: (
        <FAQTriggers
          {...basicProps}
          openedProduct={openedProduct}
          openedSolution={openedSolution}
          openedTrigger={openedTrigger}
          setOpenedTrigger={setOpenedTrigger}
          openedTriggerTitle={openedTriggerTitle}
          setTriggerMode={setTriggerMode}
          triggerMode={triggerMode}
          openedCategoryId={openedCategoryId}
          setOpenedCategoryId={setOpenedCategoryId}
          openedSymptom={openedSymptom}
          setOpenedSymptom={setOpenedSymptom}
          openedTSolution={openedTSolution}
          setOpenedTSolution={setOpenedTSolution}
        />
      )
    },
    {
      id: "faq-symptoms",
      panelHeader: null,
      obj: (
        <FAQSymptoms
          {...basicProps}
          openedSolution={openedSolution}
          openedTrigger={openedTrigger}
          setOpenedTrigger={setOpenedTrigger}
          symptoms={chooseSymptoms}
          openedTriggerTitle={openedTriggerTitle}
          openedProduct={openedProduct}
          setOpenedTriggerTitle={setOpenedTriggerTitle}
          setTriggerMode={setTriggerMode}
          triggerMode={triggerMode}
          openedCategoryId={openedCategoryId}
          setOpenedCategoryId={setOpenedCategoryId}
          openedSymptom={openedSymptom}
          setOpenedSymptom={setOpenedSymptom}
          openedTSolution={openedTSolution}
          setOpenedTSolution={setOpenedTSolution}
        />
      )
    },
    {
      id: "faq-tsolution",
      panelHeader: null,
      obj: (
        <FAQSolutions
          {...basicProps}
          openedSolution={openedSolution}
          openedTrigger={openedTrigger}
          setOpenedTrigger={setOpenedTrigger}
          symptoms={chooseSymptoms}
          openedTriggerTitle={openedTriggerTitle}
          openedProduct={openedProduct}
          setOpenedTriggerTitle={setOpenedTriggerTitle}
          setTriggerMode={setTriggerMode}
          triggerMode={triggerMode}
          openedCategoryId={openedCategoryId}
          setOpenedCategoryId={setOpenedCategoryId}
          openedSymptom={openedSymptom}
          setOpenedSymptom={setOpenedSymptom}
          openedTSolution={openedTSolution}
          setOpenedTSolution={setOpenedTSolution}
        />
      )
    }
  ];

  const officePanels = [
    {
      id: "office",
      panelHeader: null,
      obj: (
        <Office appearance={appearance} platform={platform} go={go} parseLinks={parseLinks} setPage={setPage} setActiveStory={setActiveStory} setPopout={setPopout} office={office} req={req} color={color} setColor={setColor} menuPosition={menuPosition} setMenuPosition={setMenuPosition} setAppearance={setAppearance} isDesktop={isDesktop} />
      )
    },
    {
      id: "office-clubs",
      panelHeader: null,
      obj: (
        <Clubs
          appearance={appearance}
          platform={platform}
          setRole={setRole}
          setGroupId={setGroupId}
          setPage={setPage}
          setActiveStory={setActiveStory}
          toggleShowMenu={toggleShowMenu}
          setPopout={setPopout}
          office={office}
          formatRole={formatRole}
          req={req}
          token={token}
          setOffice={setOffice}
          setClub={setClub}
          setToken={setToken}
          setIsNew={setIsNew}
          setDonut={setDonut}
          setDonutStatus={setDonutStatus}
          setMessagesStatus={setMessagesStatus}
          setLinksStatus={setLinksStatus}
          setCommentsStatus={setCommentsStatus}
          club_role={club_role}
          setStartupError={setStartupError}
          setHistory={setHistory}
          t={t}
          toggleShowMobileMenu={toggleShowMobileMenu}
        />
      )
    },
    {
      id: "office-mailings",
      panelHeader: null,
      obj: (
        <Mailings
          {...basicProps}
          appearance={appearance}
          platform={platform}
          setPopout={setPopout}
          office={office}
          mailings={office?.mailings}
          formatRole={formatRole}
          token={token}
          updateOffice={updateOffice}
          createError={createError}
          req={req}
        />
      )
    },
    {
      id: "faq",
      panelHeader: null,
      obj: (
        <FAQIndex
          {...basicProps}
          setOpenedSolution={setOpenedSolution}
          openedSolution={openedSolution}
          setOpenedProduct={setOpenedProduct}
          setTriggerMode={setTriggerMode}
          triggerMode={triggerMode}
          openedCategoryId={openedCategoryId}
          setOpenedCategoryId={setOpenedCategoryId}
          openedSymptom={openedSymptom}
          setOpenedSymptom={setOpenedSymptom}
          openedTSolution={openedTSolution}
          setOpenedTSolution={setOpenedTSolution}
          showMenu={showMenu}
        />
      )
    },
    {
      id: "faq-solution",
      panelHeader: null,
      obj: (
        <FAQTopic
          {...basicProps}
          openedSolution={openedSolution}
          setOpenedSolution={setOpenedSolution}
          topic={openedSolution}
          setOpenedProduct={setOpenedProduct}
          openedProduct={openedProduct}
          openedTrigger={openedTrigger}
          setOpenedTrigger={setOpenedTrigger}
          openedTriggerTitle={openedTriggerTitle}
          setOpenedTriggerTitle={setOpenedTriggerTitle}
          setChooseSymptoms={setChooseSymptoms}
          setTriggerMode={setTriggerMode}
          triggerMode={triggerMode}
          openedCategoryId={openedCategoryId}
          setOpenedCategoryId={setOpenedCategoryId}
          openedSymptom={openedSymptom}
          setOpenedSymptom={setOpenedSymptom}
          openedTSolution={openedTSolution}
          setOpenedTSolution={setOpenedTSolution}
        />
      )
    },
    {
      id: "faq-triggers",
      panelHeader: null,
      obj: (
        <FAQTriggers
          {...basicProps}
          openedProduct={openedProduct}
          openedSolution={openedSolution}
          openedTrigger={openedTrigger}
          setOpenedTrigger={setOpenedTrigger}
          openedTriggerTitle={openedTriggerTitle}
          setTriggerMode={setTriggerMode}
          triggerMode={triggerMode}
          openedCategoryId={openedCategoryId}
          setOpenedCategoryId={setOpenedCategoryId}
          openedSymptom={openedSymptom}
          setOpenedSymptom={setOpenedSymptom}
          openedTSolution={openedTSolution}
          setOpenedTSolution={setOpenedTSolution}
        />
      )
    },
    {
      id: "faq-symptoms",
      panelHeader: null,
      obj: (
        <FAQSymptoms
          {...basicProps}
          openedSolution={openedSolution}
          openedTrigger={openedTrigger}
          setOpenedTrigger={setOpenedTrigger}
          symptoms={chooseSymptoms}
          openedTriggerTitle={openedTriggerTitle}
          openedProduct={openedProduct}
          setOpenedTriggerTitle={setOpenedTriggerTitle}
          setTriggerMode={setTriggerMode}
          triggerMode={triggerMode}
          openedCategoryId={openedCategoryId}
          setOpenedCategoryId={setOpenedCategoryId}
          openedSymptom={openedSymptom}
          setOpenedSymptom={setOpenedSymptom}
          openedTSolution={openedTSolution}
          setOpenedTSolution={setOpenedTSolution}
        />
      )
    },
    {
      id: "faq-tsolution",
      panelHeader: null,
      obj: (
        <FAQSolutions
          {...basicProps}
          openedSolution={openedSolution}
          openedTrigger={openedTrigger}
          setOpenedTrigger={setOpenedTrigger}
          symptoms={chooseSymptoms}
          openedTriggerTitle={openedTriggerTitle}
          openedProduct={openedProduct}
          setOpenedTriggerTitle={setOpenedTriggerTitle}
          setTriggerMode={setTriggerMode}
          triggerMode={triggerMode}
          openedCategoryId={openedCategoryId}
          setOpenedCategoryId={setOpenedCategoryId}
          openedSymptom={openedSymptom}
          setOpenedSymptom={setOpenedSymptom}
          openedTSolution={openedTSolution}
          setOpenedTSolution={setOpenedTSolution}
        />
      )
    },
    {
      id: "app_info",
      panelHeader: null,
      obj: (
        <AppInfo {...basicProps} />
      )
    }
  ];

  window.addEventListener('online', () => {
    console.log('Became online');
    setActiveModal("");
  });
  window.addEventListener('offline', () => {
    console.log('Became offline');
    setActiveModal("noInternet");
  });

  const modal = (
    <ModalRoot activeModal={activeModal}>
      <ModalPage
        id="noInternet"
        onClose={() => { setActiveModal(""); setActiveModal("noInternet"); }}
      >
        <Div>
          <Placeholder
            icon={<Icon24BroadcastOutline width={56} height={56} fill="var(--accent)" />}
          >
            Упс, похоже, Вы теперь оффлайн.
            <br />
            Мы подождём, пока Ваше <br /> соединение вернётся.
          </Placeholder>
        </Div>
      </ModalPage>
    </ModalRoot>
  )

  if (/^\#mark-ticket\/(0|[1-9][0-9]*)$/.test(window.location.hash)) {
    return (
      <View
        id='ticket_eval'
        activePanel='ticket_eval'
        history={history}
        onSwipeBack={() => goBack()}
      >
        <Panel
          id='ticket_eval'
        >
          <TicketEval
            club_role={club_role}
            club={club}
            token={token}
            isMobile={isMobile}
            setActiveStory={setActiveStory}
            setIsNew={setIsNew}
            hasDonut={donutStatus}
            platform={platform}
            setPopout={setPopout}
            createError={createError}
            appearance={appearance}
          />
        </Panel>
      </View>
    );
  }
  else {
    if (signCheckStatus == true) {
      if (banned == null) {
        if (isNew == false && page == "app") {
          return (
            <ConfigProvider platform={platform.current} appearance={appearance}>
              <SplitLayout
                modal={modal}
                style={needToShowClubStartOnboarding ? {
                  justifyContent: "center",
                  background: "rgb(63, 138, 224)",
                  height: "auto"
                } : (isDesktop ? {
                  justifyContent: "center",
                  paddingTop: "10px",
                  boxSizing: "border-box"
                } : {
                  justifyContent: "center"
                })}
              >
                {menuPosition === "right" ? <>
                  <SplitCol
                    animate={true}
                    spaced={!needToShowClubStartOnboarding && isDesktop}
                    width={needToShowClubStartOnboarding ? (isDesktop ? '80%' : '100%') : (isDesktop ? '660px' : '100%')}
                    maxWidth={needToShowClubStartOnboarding ? (isDesktop ? '80%' : '100%') : (isDesktop ? '660px' : '100%')}
                  >
                    <Epic activeStory={activeStory} tabbar={!isDesktop && club && showMenu && showMobileMenu && (
                      <Tabbar>
                        {menuItems.map(menuItem =>
                          menuItem.show &&
                          <TabbarItem
                            key={menuItem.id}
                            onClick={() => go(menuItem.id)}
                            selected={menuItem.triggers.includes(activeStory)}
                            disabled={activeStory === menuItem.id}
                            data-story={menuItem.id}
                            text={menuItem.name}
                            style={menuItem.style ? { ...menuItem.style, color: menuItem.fill } : { color: menuItem.fill }}
                          >
                            {menuItem.before}
                          </TabbarItem>
                        )}
                      </Tabbar>
                    )}>
                      <View
                        id={activeStory}
                        activePanel={activeStory}
                        history={history}
                        onSwipeBack={() => goBack()}
                      >
                        {panels.map((panel, idx) => (
                          <Panel
                            key={idx}
                            id={panel.id}
                          >
                            {panel.panelHeader}
                            {panel.obj}
                          </Panel>
                        ))}
                      </View>
                    </Epic>
                  </SplitCol>
                  {showMenu && isDesktop && !(messages_enabled == false && links_enabled == false && comments_enabled == false && club_role != "admin") ? (
                    <SplitCol fixed width="280px" maxWidth="280px">
                      <Panel>
                        {hasHeader && <PanelHeader />}
                        <Group>
                          <Cell
                            onClick={() => changeMode("office")}
                            before={
                              <Icon28UserTagOutline fill={color} />
                            }
                          >
                            Личный кабинет
                          </Cell>
                          <Spacing separator />
                          {club ?
                            <>
                              <Cell
                                onClick={() => go("club_info")}
                                before={
                                  <Avatar
                                    size={28}
                                    src={club.photo}
                                    onClick={() => go("club_info")}
                                    badge={donutStatus ? <img src={DonutIcon} style={{
                                      width: '14px',
                                      height: '14px'
                                    }} alt="" /> : ""}
                                  />
                                }
                                style={activeStory == "club_info" ? {
                                  cursor: "pointer",
                                  backgroundColor: "var(--button_secondary_background)",
                                  borderRadius: 8
                                } : { cursor: "pointer" }}
                                disabled={activeStory == "club_info"}
                              >
                                {club.name}
                              </Cell>
                            </> : <Spinner />}
                        </Group>

                        <Group>
                          {menuItems.map(menuItem =>
                            menuItem.show &&
                            <>
                              <Cell
                                key={menuItem.id}
                                disabled={activeStory === menuItem.id}
                                style={menuItem.triggers.includes(activeStory) ? {
                                  backgroundColor: "var(--button_secondary_background)",
                                  borderRadius: 8
                                } : {}}
                                data-story={menuItem.id}
                                onClick={() => go(menuItem.id)}
                                before={menuItem.before}
                              >
                                {menuItem.name}
                              </Cell>
                            </>
                          )}
                        </Group>

                        <Group>
                          <Link href={"https://vk.me/cloud_apps?ref=" + generateRefSourceString("employee_searching")} target='_blank'>
                            <SimpleCell multiline before={<Avatar src="https://sun1-30.userapi.com/s/v1/ig2/huS_WYDpyzONDEF6thCzF5iJR7tkaemWgqLDELYRZjCs7lEN_Phi-pmYzlp-wGQJC43111s2hgBk_L323Jh6rx4t.jpg?size=100x100&quality=95&crop=0,0,400,400&ava=1" shadow={false} />}>
                              Команда Cloud Apps ищет сотрудников
                              <br /><br />
                              <Button size="s" stretched mode="secondary">Подробнее</Button>
                            </SimpleCell>
                          </Link>
                        </Group>

                        <Footer onClick={() => {
                          activeStory !== "app_info" && go("app_info")
                        }}>
                          v1.1.0-beta
                        </Footer>
                      </Panel>
                    </SplitCol>

                  ) : ""}
                </> :
                  <>
                    {showMenu && isDesktop && !(messages_enabled == false && links_enabled == false && comments_enabled == false && club_role != "admin") ? (
                      <SplitCol fixed width="280px" maxWidth="280px">
                        <Panel>
                          {hasHeader && <PanelHeader />}
                          <Group>
                            <Cell
                              onClick={() => changeMode("office")}
                              before={
                                <Icon28UserTagOutline fill={color} />
                              }
                            >
                              Личный кабинет
                            </Cell>
                            <Spacing separator />
                            {club ?
                              <>
                                <Cell
                                  onClick={() => go("club_info")}
                                  before={
                                    <Avatar
                                      size={28}
                                      src={club.photo}
                                      onClick={() => go("club_info")}
                                      badge={donutStatus ? <img src={DonutIcon} style={{
                                        width: '14px',
                                        height: '14px'
                                      }} alt="" /> : ""}
                                    />
                                  }
                                  style={activeStory == "club_info" ? {
                                    cursor: "pointer",
                                    backgroundColor: "var(--button_secondary_background)",
                                    borderRadius: 8
                                  } : { cursor: "pointer" }}
                                  disabled={activeStory == "club_info"}
                                >
                                  {club.name}
                                </Cell>
                              </> : <Spinner />}
                          </Group>

                          <Group>
                            {menuItems.map(menuItem =>
                              menuItem.show &&
                              <>
                                <Cell
                                  key={menuItem.id}
                                  disabled={activeStory === menuItem.id}
                                  style={menuItem.triggers.includes(activeStory) ? {
                                    backgroundColor: "var(--button_secondary_background)",
                                    borderRadius: 8
                                  } : {}}
                                  data-story={menuItem.id}
                                  onClick={() => go(menuItem.id)}
                                  before={menuItem.before}
                                >
                                  {menuItem.name}
                                </Cell>
                              </>
                            )}
                          </Group>

                          <Group>
                            <Link href={"https://vk.me/cloud_apps?ref=" + generateRefSourceString("employee_searching")} target='_blank'>
                              <SimpleCell multiline before={<Avatar src="https://sun1-30.userapi.com/s/v1/ig2/huS_WYDpyzONDEF6thCzF5iJR7tkaemWgqLDELYRZjCs7lEN_Phi-pmYzlp-wGQJC43111s2hgBk_L323Jh6rx4t.jpg?size=100x100&quality=95&crop=0,0,400,400&ava=1" shadow={false} />}>
                                Команда Cloud Apps ищет сотрудников
                                <br /><br />
                                <Button size="s" stretched mode="secondary">Подробнее</Button>
                              </SimpleCell>
                            </Link>
                          </Group>

                          <Footer onClick={() => {
                            activeStory !== "app_info" && go("app_info")
                          }}>
                            v1.1.0-beta
                          </Footer>
                        </Panel>
                      </SplitCol>

                    ) : ""}
                    <SplitCol
                      animate={true}
                      spaced={!needToShowClubStartOnboarding && isDesktop}
                      width={needToShowClubStartOnboarding ? (isDesktop ? '80%' : '100%') : (isDesktop ? '660px' : '100%')}
                      maxWidth={needToShowClubStartOnboarding ? (isDesktop ? '80%' : '100%') : (isDesktop ? '660px' : '100%')}
                    >
                      <Epic activeStory={activeStory} tabbar={!isDesktop && club && showMenu && showMobileMenu && (
                        <Tabbar>
                          {menuItems.map(menuItem =>
                            menuItem.show &&
                            <TabbarItem
                              key={menuItem.id}
                              onClick={() => go(menuItem.id)}
                              selected={menuItem.triggers.includes(activeStory)}
                              disabled={activeStory === menuItem.id}
                              data-story={menuItem.id}
                              text={menuItem.name}
                              style={menuItem.style ? { ...menuItem.style, color: menuItem.fill } : { color: menuItem.fill }}
                            >
                              {menuItem.before}
                            </TabbarItem>
                          )}
                        </Tabbar>
                      )}>
                        <View
                          id={activeStory}
                          activePanel={activeStory}
                          history={history}
                          onSwipeBack={() => goBack()}
                        >
                          {panels.map((panel, idx) => (
                            <Panel
                              key={idx}
                              id={panel.id}
                            >
                              {panel.panelHeader}
                              {panel.obj}
                            </Panel>
                          ))}
                        </View>
                      </Epic>
                    </SplitCol>
                  </>
                }
              </SplitLayout>
            </ConfigProvider>
          )
        } else {
          if (page == "landing") {
            return (
              <View
                id='start_page'
                activePanel='start_page'
              >
                <Panel
                  id='start_page'
                >
                  <StartPage
                    setClub={setClub}
                    token={token}
                    isMobile={isMobile}
                    setPopout={setPopout}
                    setActiveStory={setActiveStory}
                    setIsNew={setIsNew}
                    setGroupId={setGroupId}
                    go={go}
                    activeStory={activeStory}
                    appearance={appearance}
                    setPage={setPage}
                    lastClubID={lastClubID}
                    req={req}
                    group_id={group_id}
                    club_role={club_role}
                    toggleNeedToShowClubStartOnboarding={toggleNeedToShowClubStartOnboarding}
                    toggleShowMenu={toggleShowMenu}
                    apiScheme={apiScheme}
                  />
                </Panel>
              </View>
            );
          } else if (page == "landing_setting") {
            if (club_role == "admin") {
              return <View
                id='start_page'
                activePanel='start_page'
              >
                <Panel
                  id='start_page'
                >
                  <StartPage
                    setClub={setClub}
                    token={token}
                    isMobile={isMobile}
                    setPopout={setPopout}
                    setActiveStory={setActiveStory}
                    setIsNew={setIsNew}
                    setGroupId={setGroupId}
                    go={go}
                    activeStory={activeStory}
                    appearance={appearance}
                    setPage={setPage}
                    req={req}
                    group_id={group_id}
                    club_role={club_role}
                    toggleNeedToShowClubStartOnboarding={toggleNeedToShowClubStartOnboarding}
                    toggleShowMenu={toggleShowMenu}
                    apiScheme={apiScheme}
                  />
                </Panel>
              </View>;
            } else {
              return (
                <Group>
                  <Placeholder header="Ошибка доступа">
                    Настривать приложение могут только администраторы сообщества.
                  </Placeholder>
                </Group>
              )
            }
          } else if (page == "office") {
            return (
              <ConfigProvider platform={platform.current} appearance={appearance}>
                <SplitLayout
                  modal={modal}
                  style={isDesktop ? {
                    justifyContent: "center",
                    paddingTop: "10px",
                    boxSizing: "border-box"
                  } : {
                    justifyContent: "center"
                  }}
                >
                  {menuPosition === "right" ?
                    <>
                      <SplitCol
                        animate={true}
                        spaced={isDesktop}
                        width={isDesktop ? '660px' : '100%'}
                        maxWidth={isDesktop ? '660px' : '100%'}
                      >
                        <Epic activeStory={activeStory} tabbar={!isDesktop && office && showMenu && (
                          <Tabbar>
                            {officeMenuItems.map(menuItem =>
                              menuItem.show &&
                              <TabbarItem
                                key={menuItem.id}
                                onClick={() => go(menuItem.id)}
                                selected={menuItem.triggers.includes(activeStory)}
                                disabled={activeStory === menuItem.id}
                                data-story={menuItem.id}
                                text={menuItem.name}
                                style={menuItem.style ? { ...menuItem.style, color: menuItem.fill } : { color: menuItem.fill }}
                              >
                                {menuItem.before}
                              </TabbarItem>
                            )}
                          </Tabbar>
                        )}>
                          <View
                            id={activeStory}
                            activePanel={activeStory}
                            history={history}
                            onSwipeBack={() => goBack()}
                          >
                            {officePanels.map((panel, idx) => (
                              <Panel
                                key={idx}
                                id={panel.id}
                              >
                                {panel.panelHeader}
                                {panel.obj}
                              </Panel>
                            ))}
                          </View>
                        </Epic>
                      </SplitCol>
                      {isDesktop ? (
                        <SplitCol fixed width="280px" maxWidth="280px">
                          <Panel>
                            {hasHeader && <PanelHeader />}

                            <Group>
                              {office ?
                                <>
                                  <Cell
                                    onClick={() => go("office")}
                                    disabled={activeStory === "office"}
                                    before={
                                      <Avatar
                                        size={28}
                                        src={office.user.photo}
                                        onClick={() => go("office")}
                                        badge={donutStatus ? <img src={DonutIcon} style={{
                                          width: '14px',
                                          height: '14px'
                                        }} alt="" /> : ""}
                                        style={{ cursor: "pointer" }}
                                      />
                                    }
                                    style={activeStory === "office" ? {
                                      backgroundColor: "var(--button_secondary_background)",
                                      borderRadius: 8
                                    } : {}}
                                  >
                                    <div onClick={() => go("office")} style={{ cursor: "pointer" }}>{office.user.first_name}</div>
                                  </Cell>
                                </> : <Spinner />}
                            </Group>

                            <Group>
                              {officeMenuItems.map(menuItem =>
                                menuItem.show &&
                                <>
                                  <Cell
                                    key={menuItem.id}
                                    disabled={activeStory === menuItem.id}
                                    style={menuItem.triggers.includes(activeStory) ? {
                                      backgroundColor: "var(--button_secondary_background)",
                                      borderRadius: 8
                                    } : {}}
                                    data-story={menuItem.id}
                                    onClick={() => go(menuItem.id)}
                                    before={menuItem.before}
                                  >
                                    {menuItem.name}
                                  </Cell>
                                  {menuItem.id === "office-mailings" && <Spacing separator />}
                                </>
                              )}
                            </Group>

                            {false && <Group>
                              <SimpleCell onClick={() => bridge.send("VKWebAppAddToCommunity")} multiline before={<Icon28AddCircleOutline />}>
                                Новое сообщество
                              </SimpleCell>
                            </Group>
                            }

                            <Group>
                              <Link href={"https://vk.me/cloud_apps?ref=" + generateRefSourceString("employee_searching")} target='_blank'>
                                <SimpleCell multiline before={<Avatar src="https://sun1-30.userapi.com/s/v1/ig2/huS_WYDpyzONDEF6thCzF5iJR7tkaemWgqLDELYRZjCs7lEN_Phi-pmYzlp-wGQJC43111s2hgBk_L323Jh6rx4t.jpg?size=100x100&quality=95&crop=0,0,400,400&ava=1" shadow={false} />}>
                                  Команда Cloud Apps ищет сотрудников
                                  <br /><br />
                                  <Button size="s" stretched mode="secondary">Подробнее</Button>
                                </SimpleCell>
                              </Link>
                            </Group>

                            <Footer onClick={() => {
                              activeStory !== "app_info" && go("app_info")
                            }}>
                              v1.1.0-beta
                            </Footer>
                          </Panel>
                        </SplitCol>

                      ) : ""}
                    </> : <>
                      {isDesktop ? (
                        <SplitCol fixed width="280px" maxWidth="280px">
                          <Panel>
                            {hasHeader && <PanelHeader />}

                            <Group>
                              {office ?
                                <>
                                  <Cell
                                    onClick={() => go("office")}
                                    disabled={activeStory === "office"}
                                    before={
                                      <Avatar
                                        size={28}
                                        src={office.user.photo}
                                        onClick={() => go("office")}
                                        badge={donutStatus ? <img src={DonutIcon} style={{
                                          width: '14px',
                                          height: '14px'
                                        }} alt="" /> : ""}
                                        style={{ cursor: "pointer" }}
                                      />
                                    }
                                    style={activeStory === "office" ? {
                                      backgroundColor: "var(--button_secondary_background)",
                                      borderRadius: 8
                                    } : {}}
                                  >
                                    <div onClick={() => go("office")} style={{ cursor: "pointer" }}>{office.user.first_name}</div>
                                  </Cell>
                                </> : <Spinner />}
                            </Group>

                            <Group>
                              {officeMenuItems.map(menuItem =>
                                menuItem.show &&
                                <>
                                  <Cell
                                    key={menuItem.id}
                                    disabled={activeStory === menuItem.id}
                                    style={menuItem.triggers.includes(activeStory) ? {
                                      backgroundColor: "var(--button_secondary_background)",
                                      borderRadius: 8
                                    } : {}}
                                    data-story={menuItem.id}
                                    onClick={() => go(menuItem.id)}
                                    before={menuItem.before}
                                  >
                                    {menuItem.name}
                                  </Cell>
                                  {menuItem.id === "office-mailings" && <Spacing separator />}
                                </>
                              )}
                            </Group>

                            {false && <Group>
                              <SimpleCell onClick={() => bridge.send("VKWebAppAddToCommunity")} multiline before={<Icon28AddCircleOutline />}>
                                Новое сообщество
                              </SimpleCell>
                            </Group>
                            }

                            <Group>
                              <Link href={"https://vk.me/cloud_apps?ref=" + generateRefSourceString("employee_searching")} target='_blank'>
                                <SimpleCell multiline before={<Avatar src="https://sun1-30.userapi.com/s/v1/ig2/huS_WYDpyzONDEF6thCzF5iJR7tkaemWgqLDELYRZjCs7lEN_Phi-pmYzlp-wGQJC43111s2hgBk_L323Jh6rx4t.jpg?size=100x100&quality=95&crop=0,0,400,400&ava=1" shadow={false} />}>
                                  Команда Cloud Apps ищет сотрудников
                                  <br /><br />
                                  <Button size="s" stretched mode="secondary">Подробнее</Button>
                                </SimpleCell>
                              </Link>
                            </Group>

                            <Footer onClick={() => {
                              activeStory !== "app_info" && go("app_info")
                            }}>
                              v1.1.0-beta
                            </Footer>
                          </Panel>
                        </SplitCol>

                      ) : ""}
                      <SplitCol
                        animate={true}
                        spaced={isDesktop}
                        width={isDesktop ? '660px' : '100%'}
                        maxWidth={isDesktop ? '660px' : '100%'}
                      >
                        <Epic activeStory={activeStory} tabbar={!isDesktop && office && showMenu && (
                          <Tabbar>
                            {officeMenuItems.map(menuItem =>
                              menuItem.show &&
                              <TabbarItem
                                key={menuItem.id}
                                onClick={() => go(menuItem.id)}
                                selected={menuItem.triggers.includes(activeStory)}
                                disabled={activeStory === menuItem.id}
                                data-story={menuItem.id}
                                text={menuItem.name}
                                style={menuItem.style ? { ...menuItem.style, color: menuItem.fill } : { color: menuItem.fill }}
                              >
                                {menuItem.before}
                              </TabbarItem>
                            )}
                          </Tabbar>
                        )}>
                          <View
                            id={activeStory}
                            activePanel={activeStory}
                            history={history}
                            onSwipeBack={() => goBack()}
                          >
                            {officePanels.map((panel, idx) => (
                              <Panel
                                key={idx}
                                id={panel.id}
                              >
                                {panel.panelHeader}
                                {panel.obj}
                              </Panel>
                            ))}
                          </View>
                        </Epic>
                      </SplitCol>
                    </>}
                </SplitLayout>
              </ConfigProvider>
            )
          } else if (page == "club") {
            setPopout(null);

            return (
              <ConfigProvider platform={platform.current} appearance={appearance}>
                <SplitLayout
                  modal={modal}
                  style={isDesktop ? {
                    justifyContent: "center",
                    paddingTop: "10px",
                    boxSizing: "border-box"
                  } : {
                    justifyContent: "center"
                  }}
                >
                  <SplitCol
                    animate={true}
                    spaced={isDesktop}
                    width={isDesktop ? '660px' : '100%'}
                    maxWidth={isDesktop ? '660px' : '100%'}
                  >
                    <Epic activeStory={activeStory}>
                      <View
                        id="club-card"
                        activePanel="club-card"
                      >
                        <ClubCard
                          id="club-card"
                          club={clubCard}
                          isDesktop={isDesktop}
                          appearance={appearance}
                          popout={popout}
                          setPopout={setPopout}
                          token={token}
                          parseLinks={parseLinks}
                          createError={createError}
                          formatRole={formatRole}
                          req={req}
                          platform={platform}
                          canAddReport={canAddReport}
                          canViewMailing={canViewMailing}
                        />
                      </View>

                      <View
                        id='clubCard-mailings'
                        activePanel='clubCard-mailings'
                      >
                        <Panel id='clubCard-mailings'>
                          <ClubCardMailings
                            setPopout={setPopout}
                            mailings={clubCardMailings?.items}
                            formatRole={formatRole}
                            token={token}
                            updateMailings={updateCCMailings}
                            createError={createError}
                            req={req}
                          />
                        </Panel>
                      </View>
                    </Epic>
                  </SplitCol>
                </SplitLayout>
              </ConfigProvider>
            )
          } else {
            return <br />
          }
        }

      } else {
        setPopout(null);

        return (
          <View
            id="banned"
            activePanel="banned"
          >
            <Banned req={req} setToken={setToken} changeMode={changeMode} id="banned" {...banned} isDesktop={isDesktop} appearance={appearance} generateRefSourceString={generateRefSourceString} />
          </View>
        )
      }
    } else {
      setPopout(null);
      return (
        <View
          id='sign_error'
          activePanel='sign_error'
        >
          <Panel
            id='sign_error'
          >
            <SignError req={req} isMobile={isMobile} appearance={appearance} platform={platform} />
          </Panel>
        </View>
      )
    }
  }
}


export default Home;
