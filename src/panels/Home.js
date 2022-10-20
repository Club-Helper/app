/*******************************************************
 * Авторское право (C) 2021-2022 Club Helper
 *
 * Этот файл является частью мини-приложения Club Helper, размещенного
 * в сети Интернет по адресу https://www.vk.com/app7938346
 *
 * Несанкционированное копирование, инженерный анализ, передача,
 * распространение кода приложения запрещены
 *******************************************************/

import React, { useState, useEffect } from 'react';

import Group from '@vkontakte/vkui/dist/components/Group/Group';
import { Avatar, Button, Cell, ConfigProvider, PanelHeader, Panel, Placeholder, SplitCol, SplitLayout, Tabbar, TabbarItem, useAdaptivity, View, ViewWidth, VKCOM, Alert, Footer, Link, SimpleCell, Spinner, PanelHeaderBack } from '@vkontakte/vkui';
import { Icon24Linked, Icon28MessagesOutline, Icon28SettingsOutline, Icon28CommentOutline, Icon28AdvertisingOutline, Icon28StatisticsOutline, Icon28ArticlesOutline, Icon36Users3Outline, Icon32AdvertisingOutline, Icon28AddCircleOutline } from '@vkontakte/icons';
import { Epic } from '@vkontakte/vkui/dist/components/Epic/Epic';

import Donut from './features/landings/Donut';

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

import DonutIcon from '../img/donut.png'

import bridge from '@vkontakte/vk-bridge';

function Home({
  id,
  platform,
  popout,
  setPopout,
  api_url,
  log,
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

  useEffect(() => {
    fetch(api_url + "app.start" + window.location.search)
      .then(response => response.json())
      .then(data => {
        if (data.error == null) {
          setSignCheckStatus(true);
          if (data.response.status == "fail") {
            setBan(data.response)
          } else {
            let queryString = window.location.search;
            let params = new URLSearchParams(queryString);
            let role = params.get("vk_viewer_group_role");
            setGroupId(params.get("vk_group_id"));
            setUserId(params.get("vk_user_id"));
            setRole(role);
            setToken(data.response.token);

            ym(90794548, 'userParams', {
              uid: data.response.uid
            });

            console.log("Session ID", data.response.session_id);

            setLastClubID(data.response.last_club)

            if (data.response.page === "app") {
              setPage("app");
              setRole(role)
              setIsNew(false);

              fetch("https://ch.n1rwana.ml/api/clubs.get?token=" + data.response.token)
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
                        setStartupError(data.response.error)
                        setActiveStory('club_info');
                      } else {
                        setActiveStory('call_admin');
                      }
                    } else {
                      if (data.response.setting.messages.status == false && data.response.setting.links.status == false && data.response.setting.comments.status == false && role != "admin") {
                        setActiveStory('call_admin');
                      } else {
                        setActiveStory('tickets_list');
                      }
                    }
                  } else {
                    setPopout(null);
                    createError(data.error.error_msg);
                  }
                })
            } else if (data.response.page === "landing") {
              setIsNew(true);
              setPage("landing");

            } else if (data.response.page === "landing_setting") {
              setIsNew(true);
              setPage("landing_setting");
            } else if (data.response.page === "office") {
              setIsNew(false);

              fetch("https://ch.n1rwana.ml/api/office.get?token=" + data.response.token)
                .then(response => response.json())
                .then(data => {
                  setOffice(data.response);
                })

              setPage("office");
              setActiveStory("office-clubs");
            } else if (data.response.page === "club") {
              setIsNew(false);
              setToken(data.response.token)

              ym(90794548, 'userParams', {
                uid: data.response.uid
              });

                fetch("https://ch.n1rwana.ml/api/clubs.get?token=" + data.response.token)
                  .then(response => response.json())
                  .then(res => {
                    setClubCard(res.response);
                    fetch(`https://ch.n1rwana.ml/api/mailings.get?token=${data.response.token}&my=true`)
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

  const updateOffice = () => {
    fetch("https://ch.n1rwana.ml/api/office.get?token=" + token)
      .then(response => response.json())
      .then(data => {
        setOffice(data.response);
      })
  }

  const updateCCMailings = () => {
    fetch(`https://ch.n1rwana.ml/api/mailings.get?token=${token}&my=true`)
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
      before: <Icon28MessagesOutline />,
      show: (club_role === "admin" || messages_enabled)
    },
    {
      id: "links",
      triggers: ["links"],
      name: "Ссылки",
      before: <Icon24Linked width={28} height={28} />,
      show: false
    },

    {
      id: "comments",
      triggers: ["comments"],
      name: "Комментарии",
      before: <Icon28CommentOutline />,
      show: false
    },
    {
      id: "templates",
      triggers: ["templates"],
      name: "Шаблоны",
      before: <Icon28ArticlesOutline />,
      show: (club_role === "admin" || links_enabled) || (club_role === "admin" || comments_enabled)
    },
    {
      id: "mailing_list",
      triggers: ["mailing_list", "mailing"],
      name: "Рассылки",
      before: <Icon28AdvertisingOutline />,
      show: true
    },
    {
      id: "settings",
      triggers: ["settings"],
      name: "Настройки",
      before: <Icon28SettingsOutline />,
      // show: (club_role === "admin")
      show: false
    },
    {
      id: "stats_home",
      triggers: ["stats_home"],
      name: "Статистика",
      before: <Icon28StatisticsOutline />,
      // show: (club_role === "admin")
      show: false
    },
    {
      id: "club_info",
      triggers: ["club_info", "settings", "stats_home"],
      name: club?.name,
      before: <Avatar size={28} src={club?.photo} />,
      show: !isDesktop
    },
  ];

  const officeMenuItems = [
    {
      id: "office",
      triggers: ["office"],
      name: office?.user?.first_name + " " + office?.user?.last_name,
      before: <Avatar size={28} src={office?.user?.photo} />,
      show: !isDesktop
    },
    {
      id: "office-clubs",
      triggers: ["office-clubs"],
      name: "Сообщества",
      before: <Icon36Users3Outline width={28} height={28} />,
      show: true
    },
    {
      id: "office-mailings",
      triggers: ["office-mailings"],
      name: "Рассылки",
      before: <Icon32AdvertisingOutline width={28} height={28} />,
      show: true
    }
  ];

  const clubMenuItems = [
    {
      id: "club-card",
      triggers: ["club-card"],
      name: clubCard?.name,
      before: <Avatar src={clubCard?.photo} size={28} />,
      show: !isDesktop
    },
    {
      id: "clubCard-mailings",
      triggers: ["clubCard-mailings"],
      name: "Рассылки",
      before: <Icon32AdvertisingOutline width={28} height={28} />,
      show: true
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
    fetch(`https://ch.n1rwana.ml/api/${method}`, {
      method: "POST",
      body: JSON.stringify(body)
    })
      .then(response => response.json())
      .then(data => {
        if (!data.error) {
          callback(data);
        } else {
          if (!onError) {
            if (data.error?.error_msg) {
              createError(data.error?.error_msg)
            }
          } else {
            onError(data);
          }
        }
      })
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
    parseLinks: parseLinks,
    generateRefSourceString: generateRefSourceString
  };

  const panels = [
    {
      id: "comments_list",
      panelHeader: isMobile && <PanelHeader>Комментарии</PanelHeader>,
      obj: (
        <Comments
          {...basicProps}
          declOfNum={declOfNum}
          commentsState={commentsState}
          setCommentsState={setCommentsState}
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
        />
      )
    },
    {
      id: "tickets_list",
      panelHeader: isMobile && <PanelHeader>Обращения</PanelHeader>,
      obj: (
        <TicketsList
          {...basicProps}
          setCookie={setCookie}
          getCookie={getCookie}
          setTicket={setTicket}
          ticketsState={ticketsState}
          setTicketsState={setTicketsState}
          setActiveStory={setActiveStory}
          setIsNew={setIsNew}
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

        />
      )
    },
    {
      id: "call_admin",
      panelHeader: null,
      obj: (
        <CallAdmin
          {...basicProps}
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
          {...basicProps}
          club={club}
          setActiveStory={setActiveStory}
          setIsNew={setIsNew}
          formatRole={formatRole}
          setAppearance={setAppearance}
          setDonutStatus={setDonutStatus}
          serialize={serialize}
          startupError={startupError}
          setStartupError={setStartupError}
          setPage={setPage}
        />
      )
    }
  ];

  if (/^\#mark-ticket\/(0|[1-9][0-9]*)$/.test(window.location.hash)) {
    return (
      <View
        id='ticket_eval'
        activePanel='ticket_eval'
        style={!isMobile ? { backgroundColor: "var(--background_content)", height: "100vh" } : {}}
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
                header={false && <PanelHeader separator={false} />}
                style={{ justifyContent: "center", marginTop: "10px" }}
              >
                <SplitCol
                  animate={true}
                  spaced={isDesktop}
                  width={isDesktop ? '660px' : '100%'}
                  maxWidth={isDesktop ? '660px' : '100%'}
                >
                  <Epic activeStory={activeStory} tabbar={!isDesktop && club && (
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
                          style={menuItem.style ? menuItem.style : {}}
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
                          id={panel.id}
                        >
                          {panel.panelHeader}
                          {panel.obj}
                        </Panel>
                      ))}
                    </View>
                  </Epic>
                </SplitCol>
                {isDesktop & !(messages_enabled == false && links_enabled == false && comments_enabled == false && club_role != "admin") ? (
                  <SplitCol fixed width="280px" maxWidth="280px">
                    <Panel>
                      {hasHeader && <PanelHeader />}
                      <Group>
                        {club ?
                          <>
                            <Cell
                              disabled
                              before={
                                <Avatar
                                  size={28}
                                  src={club.photo}
                                  onClick={() => go("club_info")}
                                  badge={donutStatus ? <img src={DonutIcon} style={{
                                    width: '14px',
                                    height: '14px'
                                  }} /> : ""}
                                  style={{ cursor: "pointer" }}
                                />
                              }
                            >
                              <div onClick={() => go("club_info")} style={{ cursor: "pointer" }}>{club.name}</div>
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
                        <Link href={"https://vk.me/ch_app?ref_source=" + generateRefSourceString("employee_searching")} target='_blank'>
                          <SimpleCell multiline before={<Avatar src="https://sun1-94.userapi.com/s/v1/ig2/2ZZ91o5aMVUzBqPXSfYoRPSWiUS_obR7Tmp1ZHx02BFU9odQGmFGBNrZpwZwgOKnpJSsRkwBHPBtzCj_DxCXyAmn.jpg?size=50x50&quality=95&crop=9,7,441,441&ava=1" shadow={false} />}>
                            Команда Club Helper ищет сотрудников
                            <br /><br />
                            <Button size="s" stretched mode="secondary">Подробнее</Button>
                          </SimpleCell>
                        </Link>
                      </Group>

                      <Footer onClick={() => go("app_info")}>
                        v1.0.0-beta
                      </Footer>
                    </Panel>
                  </SplitCol>

                ) : ""}
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
                  />
                </Panel>
              </View>
            );
          } else if (page == "landing_setting") {
            console.log(page, isNew, club_role);

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
                  header={false && <PanelHeader separator={false} />}
                  style={{ justifyContent: "center", marginTop: "10px" }}
                >
                  <SplitCol
                    animate={true}
                    spaced={isDesktop}
                    width={isDesktop ? '660px' : '100%'}
                    maxWidth={isDesktop ? '660px' : '100%'}
                  >
                    <Epic activeStory={activeStory} tabbar={!isDesktop && office && (
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
                            style={menuItem.style ? menuItem.style : {}}
                          >
                            {menuItem.before}
                          </TabbarItem>
                        )}
                      </Tabbar>
                    )}>
                      <View
                        id='office'
                        activePanel='office'
                      >
                        <Panel id='office'>
                          <Office setPage={setPage} setActiveStory={setActiveStory} setPopout={setPopout} office={office} req={req} />
                        </Panel>
                      </View>

                      <View
                        id='office-clubs'
                        activePanel='office-clubs'
                      >
                        <Panel id='office-clubs'>
                          <Clubs setPopout={setPopout} office={office} formatRole={formatRole} req={req} />
                        </Panel>
                      </View>

                      <View
                        id='office-mailings'
                        activePanel='office-mailings'
                      >
                        <Panel id='office-mailings'>
                          <Mailings
                            setPopout={setPopout}
                            office={office}
                            mailings={office?.mailings}
                            formatRole={formatRole}
                            token={token}
                            updateOffice={updateOffice}
                            createError={createError}
                            req={req}
                          />
                        </Panel>
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
                                disabled
                                before={
                                  <Avatar
                                    size={28}
                                    src={office.user.photo}
                                    onClick={() => go("club_info")}
                                    badge={donutStatus ? <img src={DonutIcon} style={{
                                      width: '14px',
                                      height: '14px'
                                    }} /> : ""}
                                    style={{ cursor: "pointer" }}
                                  />
                                }
                              >
                                <div onClick={() => go("office")} style={{ cursor: "pointer" }}>{office.user.first_name} {office.user.last_name}</div>
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
                              {/* menuItem.id === "mailing_list" && <Spacing separator /> */}
                            </>
                          )}
                        </Group>

                        <Group>
                          <SimpleCell onClick={() => bridge.send("VKWebAppAddToCommunity")} multiline before={<Icon28AddCircleOutline />}>
                            Новое сообщество
                          </SimpleCell>
                        </Group>

                        <Group>
                          <Link href={"https://vk.me/ch_app?ref_source=" + generateRefSourceString("employee_searching")} target='_blank'>
                            <SimpleCell multiline before={<Avatar src="https://sun1-94.userapi.com/s/v1/ig2/2ZZ91o5aMVUzBqPXSfYoRPSWiUS_obR7Tmp1ZHx02BFU9odQGmFGBNrZpwZwgOKnpJSsRkwBHPBtzCj_DxCXyAmn.jpg?size=50x50&quality=95&crop=9,7,441,441&ava=1" shadow={false} />}>
                              Команда Club Helper ищет сотрудников
                              <br /><br />
                              <Button size="s" stretched mode="secondary">Подробнее</Button>
                            </SimpleCell>
                          </Link>
                        </Group>

                        <Footer onClick={() => go("app_info")}>
                          v1.0.0 beta
                        </Footer>
                      </Panel>
                    </SplitCol>

                  ) : ""}
                </SplitLayout>
              </ConfigProvider>
            )
          } else if (page == "club") {
            setPopout(null);

            return (
              <ConfigProvider platform={platform.current} appearance={appearance}>
                <SplitLayout
                  header={false && <PanelHeader separator={false} />}
                  style={{ justifyContent: "center", marginTop: "10px" }}
                >
                  <SplitCol
                    animate={true}
                    spaced={isDesktop}
                    width={isDesktop ? '660px' : '100%'}
                    maxWidth={isDesktop ? '660px' : '100%'}
                  >
                    <Epic activeStory={activeStory} tabbar={false && clubCard && (
                      <Tabbar>
                        {clubMenuItems.map(menuItem =>
                          menuItem.show &&
                          <TabbarItem
                            key={menuItem.id}
                            onClick={() => go(menuItem.id)}
                            selected={menuItem.triggers.includes(activeStory)}
                            disabled={activeStory === menuItem.id}
                            data-story={menuItem.id}
                            text={menuItem.name}
                            style={menuItem.style ? menuItem.style : {}}
                          >
                            {menuItem.before}
                          </TabbarItem>
                        )}
                      </Tabbar>
                    )}>
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
                  {false && (
                    <SplitCol fixed width="280px" maxWidth="280px">
                      <Panel>
                        {hasHeader && <PanelHeader/>}

                        <Group>
                          {clubCard ?
                            <>
                              <Cell
                                disabled
                                before={
                                  <Avatar
                                    size={28}
                                    src={clubCard.photo}
                                    onClick={() => go("club-card")}
                                    style={{cursor: "pointer"}}
                                  />
                                }
                                style={activeStory === "club-card" ? {
                                  backgroundColor: "var(--button_secondary_background)",
                                  borderRadius: 8
                                } : {}}
                              >
                                <div onClick={() => go("club-card")} style={{cursor: "pointer"}}>{clubCard.name}</div>
                              </Cell>
                            </> : <Spinner/>}
                        </Group>

                        <Group>
                          {clubMenuItems.map(menuItem =>
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
                      </Panel>
                    </SplitCol>)
                  }
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
            <Banned req={req} id="banned" {...banned} isDesktop={isDesktop} appearance={appearance} generateRefSourceString={generateRefSourceString} />
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
