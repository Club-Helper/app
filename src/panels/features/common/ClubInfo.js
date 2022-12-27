/*******************************************************
 * Авторское право (C) 2021-2022 Club Helper
 *
 * Этот файл является частью мини-приложения Club Helper, размещенного
 * в сети Интернет по адресу https://www.vk.com/app7938346
 *
 * Несанкционированное копирование, инженерный анализ, передача,
 * распространение кода приложения запрещены
 *******************************************************/

import { ConfigProvider, Gradient, Group, Panel, PanelHeader, PanelSpinner, SplitCol, SplitLayout, Avatar, Title, Link, MiniInfoCell, List, PullToRefresh, PanelHeaderButton, ModalRoot, ModalPage, ModalPageHeader, Separator, Snackbar, ContentCard, Caption, CardScroll, Banner, Button, Div, Placeholder, CellButton, Spacing, Cell, SimpleCell, Card, Gallery } from '@vkontakte/vkui'
import React, { Component } from 'react';
import {
  Icon16Hashtag,
  Icon20CalendarOutline,
  Icon24Dismiss,
  Icon20BlockOutline,
  Icon20CommunityName,
  Icon20Search,
  Icon20WorkOutline,
  Icon24Linked,
  Icon28DonateOutline,
  Icon28SettingsOutline,
  Icon16Done,
  Icon28LifebuoyOutline,
  Icon56CheckShieldOutline,
  Icon24NotificationOutline,
  Icon20ChevronRightOutline,
  Icon56NotificationOutline,
  Icon28UserTagOutline,
  Icon24Error,
  Icon24Comment, Icon24CommentOutline
} from '@vkontakte/icons';

import Donut from '../landings/Donut';
import Settings from '../settings/Settings';
import StatsHome from '../stats/Home';
import bridge from "@vkontakte/vk-bridge";
import Notifies from './Notifies';

export default class ClubInfo extends Component {
  constructor(props) {
    super(props);

    this.state = {
      club: {},
      isClubLoading: true,
      managers: [],
      isManagersLoading: true,
      activeModal: "",
      modalLoading: true,
      stats: [],
      isStatsLoading: true,
      isStatsHidden: false,
      snackbar: null,
      isFetching: false,
      autofixBtnWorking: false,
      codeBtnWorking: false,
      supportCode: null,
      notifiesFetching: false,
      notifies: {}
    }

    this.getManagers = this.getManagers.bind(this);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.getStats = this.getStats.bind(this);
    this.settingsWasChanged = this.settingsWasChanged.bind(this);
    this.update = this.update.bind(this);
    this.getClub = this.getClub.bind(this);
    this.getCode = this.getCode.bind(this);
  }

  getManagers() {
    if (this.props.club_role != "admin") return false;

    this.setState({ isManagersLoading: true });

    this.props.req("clubs.getManagers", {
      token: this.props.token
    },
      (data) => {
        this.setState({ managers: data.response, isManagersLoading: false });
      }
    )
  }

  getStats() {
    this.setState({ isStatsLoading: true });

    this.props.req("clubs.getStats", {
      token: this.props.token
    },
      (data) => {
        this.setState({ stats: data.response, isStatsLoading: false })
        this.props.setLoading(false);
      },
      (error) => {
        this.setState({ isStatsHidden: true });
        this.props.createError(error.error.error_msg);
      }
    )
  }

  getClub() {
    this.setState({ isClubLoading: true });

    this.props.req("clubs.get", {
      token: this.props.token
    },
      (data) => {
        this.setState({ club: data.response, isClubLoading: false });
        window.scrollTo(0, 0);
      }
    )
  }

  update() {
    if (!this.props.startupError) {
      this.setState({ isFetching: true });
      this.getClub();
      this.getManagers();
      this.getStats();
      this.setState({ isFetching: false });
    } else {
      this.setState({ isFetching: false });
    }
  }

  openModal(id) {
    if (id == "donut") setTimeout(() => {
      document.querySelector("#root > .AppRoot > .vkuiSplitLayout > .vkuiSplitLayout__inner > .vkuiSplitLayout").classList.add('clubHelper--show-modal')
    }, 100);

    this.setState({ modalLoading: true, activeModal: id });
  }

  closeModal() {
    let id = this.state.activeModal;
    this.setState({ activeModal: "" });

    if (id == "donut") document.querySelector("#root > .AppRoot > .vkuiSplitLayout > .vkuiSplitLayout__inner > .vkuiSplitLayout").classList.remove('clubHelper--show-modal');
  }

  settingsWasChanged() {
    this.setState({
      snackbar: (
        <Snackbar
          onClose={() => this.setState({ snackbar: null })}
          before={
            <Avatar
              size={24}
              style={{ background: "var(--button_commerce_background)" }}
            >
              <Icon16Done fill="#FFF" width={14} height={14} />
            </Avatar>
          }
        >
          Изменения применены
        </Snackbar>
      )
    });
  }

  startupErrorAutofix(error) {
    this.setState({ autofixBtnWorking: true });

    if (error) {
      if (this.state.club.error) {
        error = this.state.club.error;
      } else {
        this.props.createError("Произошла ошибка при автоисправлении. Откройте приложение в сообществе заново.");
      }
    }

    if (!error.autofix) {
      this.props.createError("Автоисправление для данной ошибки недоступно.");
      this.setState({ autofixBtnWorking: false });
    }

    if (this.state.club.status === 1000) {
      this.setState({ autofixBtnWorking: true });
      bridge
        .send("VKWebAppGetCommunityToken", { "app_id": 7938346, "group_id": Number(this.state.club.id), "scope": "messages,manage,wall" })
        .then(data => {
          this.props.req("utils.setToken", {
            access_token: data.access_token,
            token: this.props.token
          },
            (data) => {
              this.props.toggleShowMenu(true);
              this.props.setStartupError(null);
              this.props.setActiveStory("tickets_list");
            }
          );
          this.setState({ autofixBtnWorking: false });
        }
        )
        .catch(error => {
          this.props.createError(error.error_data?.error_reason);
          this.setState({ autofixBtnWorking: false });
        })
      return true;
    } else if (this.state.club.status === 5002 || this.state.club.status === 5003) {
      this.setState({ autofixBtnWorking: true });

      this.props.req("utils.callbackAdd", {
        token: this.props.token
      },
        (data) => {
          this.props.toggleShowMenu(true);
          this.props.setStartupError(null);
          this.props.setActiveStory("tickets_list");
          this.setState({ autofixBtnWorking: false });
        }, (error) => {
          this.props.createError(error.error_data?.error_reason);
          this.setState({ autofixBtnWorking: false });
        }
      );
    } else if (this.state.club.status === 5004) {
      this.setState({ autofixBtnWorking: true });

      this.props.req("utils.callbackSetting", {
        token: this.props.token
      },
        (data) => {
          this.props.toggleShowMenu(true);
          this.props.setStartupError(null);
          this.setState({ autofixBtnWorking: false });
          this.props.setActiveStory("tickets_list");
        }, (error) => {
          this.props.createError(error.error_data?.error_reason);
          this.setState({ autofixBtnWorking: false });
        }
      );
    } else if (this.props.club.error.api) {
      this.props.req(this.props.club.error.api, {
        token: this.props.token
      }, (response) => {
        this.props.toggleShowMenu(true);
        this.props.setStartupError(null);
        this.setState({ autofixBtnWorking: false });
        this.props.setActiveStory("tickets_list");
      }), (error) => {
        this.props.createError(error.error_data?.error_reason);
        this.setState({ autofixBtnWorking: false });
      }
    } else {
      this.props.createError("Варианты автоисправления для данной ошибки не найдены. Обратитесь в Поддержку.")
    }
    if (this.props.isMobile) { bridge.send("VKWebAppTapticNotificationOccurred", { "type": "success" }); }
    this.setState({ autofixBtnWorking: false });
  }

  getCode() {
    this.setState({ codeBtnWorking: true });
    this.props.req("support.getPin", {
      token: this.props.token
    },
      (data) => {
        this.props.toggleShowMobileMenu(false);
        this.setState({ supportCode: data.response });
        this.openModal("support_code_result");
        if (this.props.isMobile) { bridge.send("VKWebAppTapticNotificationOccurred", { "type": "success" }); }
      }
    );
    this.setState({ codeBtnWorking: false });
  }

  openNotifies() {
    this.setState({ notifiesFetching: true });
    this.openModal("notifies");
    this.props.req("clubs.getNotifications", {
      token: this.props.token
    },
      (data) => {
        this.setState({ notifiesFetching: false, notifies: data.response });
        if (this.props.isMobile) { bridge.send("VKWebAppTapticNotificationOccurred", { "type": "success" }); }
      }, (error) => {
        this.setState({ activeModal: "" });
        this.props.createError(error.error.error_msg);
      })
  }

  componentDidMount() {
    this.props.setLoading(false);
    this.props.setPopout(null);
    this.getClub();
    if (!this.props.startupError) {
      this.getManagers();
      this.getStats();
    } else {
      this.setState({ isStatsHidden: true })
    }

    if (this.props.needToOpenSettingsOnClubMount) {
      this.setState({ activeModal: "settings" });
      this.props.toggleNeedToOpenSettingsOnClubMount(false);
    }
  }

  render() {
    const { club, isClubLoading } = this.state;

    const modal = (
      <ModalRoot activeModal={this.state.activeModal}>
        <ModalPage
          id="donut"
          header={<ModalPageHeader right={this.props.isMobile && <PanelHeaderButton onClick={() => {
            this.props.toggleShowMobileMenu(true);
            this.closeModal();
          }}><Icon24Dismiss /></PanelHeaderButton>}>VK Donut</ModalPageHeader>}
          onClose={() => {
            this.props.toggleShowMobileMenu(true);
            this.closeModal();
          }}
          settlingHeight={100}
        >
          <Donut {...this.props} />
        </ModalPage>
        <ModalPage
          id="settings"
          header={<ModalPageHeader right={this.props.isMobile && <PanelHeaderButton onClick={this.closeModal}><Icon24Dismiss /></PanelHeaderButton>}>Настройки</ModalPageHeader>}
          onClose={this.closeModal}
          settlingHeight={100}
        >
          <Settings {...this.props} isLoading={this.state.modalLoading} setLoading={() => this.setState({ modalLoading: !this.state.modalLoading })} close={this.closeModal} settingsWasChanged={this.settingsWasChanged} isEmbedded={true} />
        </ModalPage>
        <ModalPage
          id="stats_home"
          header={<ModalPageHeader right={this.props.isMobile && <PanelHeaderButton onClick={this.closeModal}><Icon24Dismiss /></PanelHeaderButton>}>Статистика</ModalPageHeader>}
          onClose={this.closeModal}
          settlingHeight={100}
        >
          <StatsHome {...this.props} isLoading={this.state.modalLoading} setLoading={() => this.setState({ modalLoading: !this.state.modalLoading })} />
        </ModalPage>
        <ModalPage
          id="support_code"
          header={<ModalPageHeader right={this.props.isMobile && <PanelHeaderButton onClick={() => {
            this.closeModal();
            this.props.toggleShowMobileMenu(true);
          }}><Icon24Dismiss /></PanelHeaderButton>}>Поддержка</ModalPageHeader>}
          onClose={() => {
            this.closeModal();
            this.props.toggleShowMobileMenu(true);
          }}
        >
          <Div>
            При обращении в <b>Службу Поддержки Club Helper</b> Вам может понадобиться 4-значный PIN-код для подтверждения личности.
            <br /><br />
            <Button
              size="m"
              stretched
              onClick={this.getCode}
              loading={this.state.codeBtnWorking}
              disabled={this.state.codeBtnWorking}
            >
              Получить код
            </Button>
          </Div>
        </ModalPage>
        <ModalPage
          id="support_code_result"
          header={<ModalPageHeader right={this.props.isMobile && <PanelHeaderButton onClick={() => {
            this.closeModal();
            this.props.toggleShowMobileMenu(true);
          }}><Icon24Dismiss /></PanelHeaderButton>}>PIN-код</ModalPageHeader>}
          onClose={() => {
            this.closeModal();
            this.props.toggleShowMobileMenu(true);
          }}
        >
          <Placeholder icon={<Icon56CheckShieldOutline fill="var(--button_commerce_background)" />} header="Ваш PIN-код">
            {this.state.supportCode?.code}
          </Placeholder>
          <Separator />
          <Div>
            <center>PIN-код действителен до <b>{this.state.supportCode?.deactivation?.label}</b>.</center>
          </Div>
        </ModalPage>
        <ModalPage
          id="notifies"
          header={<ModalPageHeader right={this.props.isMobile && <PanelHeaderButton onClick={this.closeModal}><Icon24Dismiss /></PanelHeaderButton>}>Уведомления</ModalPageHeader>}
          onClose={this.closeModal}
          settlingHeight={100}
        >
          {this.state.notifiesFetching ? <PanelSpinner /> :
            this.state.notifies.count > 0 ?
              <Notifies notifies={this.state.notifies.items} />
              : <Placeholder icon={<Icon56NotificationOutline />}>
                Здесь будут уведомления...
              </Placeholder>
          }
        </ModalPage>
      </ModalRoot>

    );

    return (
      <ConfigProvider platform={this.props.platform.current} appearance={this.props.appearance}>
        <SplitLayout modal={modal}>
          <SplitCol>
            <Panel>
              <PanelHeader
                left={!this.props.isMobile && !isClubLoading && !(this.props.startupError || club.error) ?
                  <React.Fragment>
                    {this.props.club_role === "admin" &&
                      <PanelHeaderButton onClick={() => this.openModal("settings")}>
                        <Icon28SettingsOutline />
                      </PanelHeaderButton>
                    }
                    <PanelHeaderButton onClick={() => this.openModal("support_code")}>
                      <Icon28LifebuoyOutline />
                    </PanelHeaderButton>
                    <PanelHeaderButton>
                      <Icon24NotificationOutline onClick={() => this.openNotifies()} width={28} height={28} />
                    </PanelHeaderButton>
                  </React.Fragment>
                  : <></>
                }
              >
                Сообщество
              </PanelHeader>
              <PullToRefresh
                onRefresh={this.update}
                isFetching={this.state.isFetching}
              >
                {isClubLoading ?
                  <Group>
                    <Placeholder>
                      <PanelSpinner />
                    </Placeholder>
                  </Group>
                  :
                  <>
                    <Group>
                      <Gradient
                        style={{
                          margin: this.props.isMobile ? "-7px -7px 0 -7px" : 0,
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          textAlign: "center",
                          padding: 32,
                        }}
                        mode={this.props.appearance === "dark" ? 'black' : 'white'}
                      >
                        <Link target="_blank" href={"https://vk.com/club" + club.id}><Avatar size={96} src={club.photo} /></Link>
                        <center>
                          <Link target="_blank" href={"https://vk.com/club" + club.id}>
                            <Title
                              style={{ marginBottom: 8, marginTop: 20, color: "var(--text_primary)" }}
                              level="2"
                              weight="2"
                            >
                              {club.name.slice(0, 35)}
                              {club.name.length > 35 ? "..." : ""}
                            </Title>
                          </Link>
                        </center>
                      </Gradient>
                      {!club.error && <Separator wide />}
                      {club.error &&
                        <Banner
                          before={
                            <Avatar size={28} style={{ backgroundImage: "linear-gradient(90deg, #ffb73d 0%, #ffa000 100%)" }}>
                              <span style={{ color: "#fff", fontWeight: 600 }}><Icon24Error width={18} height={18} /></span>
                            </Avatar>
                          }
                          header={club.error.title}
                          subheader={club.error.text}
                          actions={
                            <div style={{ margin: "10px 0px", display: "flex", flexWrap: "wrap", columnGap: "10px", rowGap: "10px" }}>
                              {club.error.autofix &&
                                <Button
                                  onClick={() => this.startupErrorAutofix(club.error)}
                                  disabled={this.state.autofixBtnWorking}
                                  loading={this.state.autofixBtnWorking}
                                  stretched={this.props.isMobile}
                                >
                                  {club.error.button ? club.error.button : "Исправить"}
                                </Button>
                              }
                              <Link href={"https://vk.me/cloud_apps?ref=" + this.props.generateRefSourceString("callback_error")} target={"_blank"} style={{ width: "100%" }}>
                                <Button
                                  mode={club.error.autofix ? "secondary" : "primary"}
                                  stretched={this.props.isMobile}
                                >
                                  Обратиться в Поддержку
                                </Button>
                              </Link>
                            </div>
                          }
                        />
                      }
                      <List style={{ paddingTop: "10px" }}>
                        <MiniInfoCell before={<Icon16Hashtag width={20} height={20} />}>ID: {club.id}</MiniInfoCell>
                        <MiniInfoCell before={<Icon20CalendarOutline />}>Дата установки: {club.installation?.time.label}</MiniInfoCell>
                        <MiniInfoCell before={<Icon28DonateOutline width={20} height={20} />} onClick={() => {
                          if (!this.props.startupError && !club.error) {
                            this.props.toggleShowMobileMenu(false);
                            this.openModal("donut");
                          }
                        }} after={(!this.props.startupError && !club.error) ? <div onClick={() => {
                          if (!this.props.startupError) {
                            this.props.toggleShowMobileMenu(false);
                            this.openModal("donut");
                          }
                        }} style={{ color: "var(--accent)" }}>Что это?</div> : ""} disabled={this.props.startupError || club.error}>Подписка {this.props.hasDonut ? "активна" : "неактивна"}</MiniInfoCell>
                      </List>
                    </Group>
                    {!this.props.isMobile && !this.props.showMenu &&
                      <Group>
                        <CellButton
                          onClick={() => this.props.changeMode("office")}
                          before={<Icon28UserTagOutline />}
                          after={<Icon20ChevronRightOutline fill="var(--dynamic_gray)" />}
                        >
                          Личный кабинет
                        </CellButton>
                      </Group>
                    }
                    {!this.props.isMobile &&
                      <Group>
                        <CellButton
                          onClick={() => this.props.go("faq")}
                          before={<Icon28LifebuoyOutline />}
                          after={<Icon20ChevronRightOutline fill="var(--dynamic_gray)" />}
                        >
                          Поддержка
                        </CellButton>
                      </Group>
                    }
                    {this.props.isMobile && !isClubLoading && !(this.props.startupError || club.error) &&
                      <Group>
                        {this.props.club_role === "admin" &&
                          <CellButton
                            onClick={() => this.openModal("settings")}
                            before={
                              <Icon28SettingsOutline />
                            }
                            after={<Icon20ChevronRightOutline fill="var(--dynamic_gray)" />}
                          >
                            Настройки
                          </CellButton>
                        }
                        <CellButton
                          onClick={() => {
                            this.props.toggleShowMobileMenu(false);
                            this.openModal("support_code");
                          }}
                          before={
                            <Icon28LifebuoyOutline />
                          }
                          after={<Icon20ChevronRightOutline fill="var(--dynamic_gray)" />}
                        >
                          PIN-код для Поддержки
                        </CellButton>
                        <CellButton
                          onClick={() => this.openNotifies()}
                          before={
                            <Icon24NotificationOutline width={28} height={28} />
                          }
                          after={<Icon20ChevronRightOutline fill="var(--dynamic_gray)" />}
                        >
                          Уведомления
                        </CellButton>
                        <Spacing separator />
                        <CellButton
                          onClick={() => this.props.changeMode("office")}
                          before={<Icon28UserTagOutline />}
                          after={<Icon20ChevronRightOutline fill="var(--dynamic_gray)" />}
                        >
                          Личный кабинет
                        </CellButton>
                        <CellButton
                          onClick={() => this.props.go("faq")}
                          before={<Icon28LifebuoyOutline />}
                          after={<Icon20ChevronRightOutline fill="var(--dynamic_gray)" />}
                        >
                          Поддержка
                        </CellButton>
                      </Group>
                    }
                  </>
                }
                {!this.state.isStatsHidden &&
                  <>
                    <Title level='2' style={{ padding: "10px", marginLeft: "5px", color: "var(--text_primary)" }}>Статистика</Title>
                    {this.props.club_role == "admin" &&
                      <Group header={<Title level='3' style={{ padding: "10px", marginLeft: "5px" }}>Руководители</Title>}>
                        <div className='clubHelper--ListStats'>
                          {this.state.isManagersLoading ? <PanelSpinner /> :
                            this.state.managers?.map((item, idx) => (
                              <Link href={`https://vk.com/id${item.id}`} target="_blank">
                                <SimpleCell
                                  before={<Avatar size={28} src={item.photo} />}
                                  description={this.props.formatRole(item.role)}
                                >
                                  {item.first_name} {item.last_name}
                                </SimpleCell>
                              </Link>
                            )
                            )}
                        </div>
                      </Group>
                    }
                    <Group header={<Title level='3' style={{ padding: "10px", marginLeft: "5px" }}>Обращения</Title>}>
                      {this.state.isStatsLoading ? <PanelSpinner /> :
                        <div className='clubHelper--ListStats'>
                          <SimpleCell
                            onClick={() => {
                              localStorage.setItem("tickets_list_activeTab", "all");
                              this.props.go("tickets_list");
                            }}
                            before={<Icon20CommunityName width={28} height={28} fill="var(--dynamic_orange)" />}
                            description={this.state.stats?.tickets?.all}
                          >
                            Всего
                          </SimpleCell>
                          <SimpleCell
                            onClick={() => {
                              localStorage.setItem("tickets_list_activeTab", "waiting_specialist");
                              this.props.go("tickets_list");
                            }}
                            before={<Icon20Search width={28} height={28} fill="var(--dynamic_blue)" />}
                            description={this.state.stats?.tickets?.waiting_specialist}
                          >
                            Ожидающих специалиста
                          </SimpleCell>
                          <SimpleCell
                            onClick={() => {
                              localStorage.setItem("tickets_list_activeTab", "work");
                              this.props.go("tickets_list");
                            }}
                            before={<Icon20WorkOutline width={28} height={28} fill="var(--button_commerce_background)" />}
                            description={this.state.stats?.tickets?.work}
                          >
                            В работе
                          </SimpleCell>
                          <SimpleCell
                            onClick={() => {
                              localStorage.setItem("tickets_list_activeTab", "closed");
                              this.props.go("tickets_list");
                            }}
                            before={<Icon20BlockOutline width={28} height={28} fill="var(--destructive)" />}
                            description={this.state.stats?.tickets?.closed}
                          >
                            Закрыты
                          </SimpleCell>
                        </div>
                      }
                    </Group>
                    <Group header={<Title level='3' style={{ padding: "10px", marginLeft: "5px" }}>Шаблоны</Title>}>
                      {this.state.isStatsLoading ? <PanelSpinner /> :
                        <div className='clubHelper--ListStats'>
                          <SimpleCell
                            onClick={() => this.props.go("templates")}
                            before={<Icon24Linked width={28} height={28} fill="var(--dynamic_raspberry_pink)" />}
                            description={this.state.stats?.links?.all}
                          >
                            Ссылки
                          </SimpleCell><SimpleCell
                            onClick={() => this.props.go("templates")}
                            before={<Icon24CommentOutline width={28} height={28}/>}
                            description={this.state.stats?.comments?.all}
                          >
                            Комментарии
                          </SimpleCell>
                        </div>
                      }
                    </Group>
                  </>
                }
              </PullToRefresh>

              {this.state.snackbar}
            </Panel>
          </SplitCol></SplitLayout></ConfigProvider >)
  }
}
