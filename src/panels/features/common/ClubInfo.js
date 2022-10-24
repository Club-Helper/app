/*******************************************************
 * Авторское право (C) 2021-2022 Club Helper
 *
 * Этот файл является частью мини-приложения Club Helper, размещенного
 * в сети Интернет по адресу https://www.vk.com/app7938346
 *
 * Несанкционированное копирование, инженерный анализ, передача,
 * распространение кода приложения запрещены
 *******************************************************/

import {
  ConfigProvider,
  Gradient,
  Group,
  Panel,
  PanelHeader,
  PanelSpinner,
  SplitCol,
  SplitLayout,
  Avatar,
  Title,
  Link,
  MiniInfoCell,
  List,
  ButtonGroup,
  PullToRefresh,
  PanelHeaderButton,
  ModalRoot,
  ModalPage,
  ModalPageHeader,
  Separator,
  Snackbar,
  ContentCard,
  Caption,
  CardScroll,
  Banner,
  Button,
  Div,
  Placeholder,
  CellButton,
  Spacing
} from '@vkontakte/vkui'
import React, { Component } from 'react';
import { Icon16Hashtag, Icon20CalendarOutline, Icon24Dismiss, Icon20BlockOutline, Icon20CommunityName, Icon20Search, Icon20WorkOutline, Icon24Linked, Icon28DonateOutline, Icon28SettingsOutline, Icon16Done, Icon28LifebuoyOutline, Icon56CheckShieldOutline, Icon28Notification, Icon28NotificationAddOutline, Icon24NotificationOutline, Icon20ChevronRightOutline, Icon56NotificationOutline, Icon28UserTagOutline } from '@vkontakte/icons';

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
      isClubLoading: false,
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
      }
    )
  }

  update() {
    this.setState({ isFetching: true });
    this.getClub();
    this.getManagers();
    this.getStats();
    this.setState({ isFetching: false });
  }

  openModal(id) {
    this.setState({ modalLoading: true, activeModal: id });
    document.querySelector("#root > div > section > div > div > div > div").classList.add('clubHelper--show-modal');
  }

  closeModal() {
    this.setState({ activeModal: "" });
    document.querySelector("#root > div > section > div > div > div > div").classList.remove('clubHelper--show-modal');
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

  startupErrorAutofix() {
    this.setState({ autofixBtnWorking: true });

    if (!this.props.startupError.autofix) {
      this.props.createError("Автоисправление для данной ошибки недоступно.");
      this.setState({ autofixBtnWorking: false });
    }

    if (this.state.club.status === 1000) {
      this.setState({ autofixBtnWorking: true });
      bridge
        .send("VKWebAppGetCommunityToken", { "app_id": 7938346, "group_id": Number(this.state.club.id), "scope": "messages,manage,app_widget"})
        .then(data => {
          this.props.req("utils.setToken", {
            access_token: data.access_token,
            token: this.props.token
          },
            (data) => {
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
          this.props.setStartupError(null);
          this.props.setActiveStory("tickets_list");
        }
      );
      this.setState({ autofixBtnWorking: false });
    } else if (this.state.club.status === 5004) {
      this.setState({autofixBtnWorking: true});

      this.props.req("utils.callbackSetting", {
        token: this.props.token
      },
        (data) => {
          this.props.setStartupError(null);
          this.props.setActiveStory("tickets_list");
        }
      );
      this.setState({autofixBtnWorking: false});
    } else {
      this.props.createError("Варианты автоисправления для данной ошибки не найдены. Обратитесь в Поддержку.")
    }
    bridge.send("VKWebAppTapticNotificationOccurred", { "type": "success" });
  }

  getCode() {
    this.setState({ codeBtnWorking: true });
    this.props.req("support.getPin", {
      token: this.props.token
    },
      (data) => {
        this.setState({ supportCode: data.response });
        this.openModal("support_code_result");
        bridge.send("VKWebAppTapticNotificationOccurred", { "type": "success" });
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
        bridge.send("VKWebAppTapticNotificationOccurred", { "type": "success" });
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
  }

  render() {
    const club = this.props.club;

    const modal = (
      <ModalRoot activeModal={this.state.activeModal}>
        <ModalPage
          id="donut"
          header={<ModalPageHeader right={this.props.isMobile && <PanelHeaderButton onClick={this.closeModal}><Icon24Dismiss /></PanelHeaderButton>}>VK Donut</ModalPageHeader>}
          onClose={this.closeModal}
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
          header={<ModalPageHeader right={this.props.isMobile && <PanelHeaderButton onClick={this.closeModal}><Icon24Dismiss /></PanelHeaderButton>}>Поддержка</ModalPageHeader>}
          onClose={this.closeModal}
          settlingHeight={100}
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
          header={<ModalPageHeader right={this.props.isMobile && <PanelHeaderButton onClick={this.closeModal}><Icon24Dismiss /></PanelHeaderButton>}>PIN-код</ModalPageHeader>}
          onClose={this.closeModal}
          settlingHeight={100}
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
            {this.props.isLoading ? <PanelSpinner /> :
              <Panel>
                <PanelHeader
                  left={!this.props.isMobile ?
                    <React.Fragment>
                      <PanelHeaderButton onClick={() => this.openModal("settings")}>
                        <Icon28SettingsOutline />
                      </PanelHeaderButton>
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
                  <Group>
                    {this.state.isClubLoading ? <PanelSpinner /> :
                      <>
                        <Gradient
                          style={{
                            margin: !this.props.isDesktop ? "-7px -7px 0 -7px" : 0,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            textAlign: "center",
                            padding: 32,
                          }}
                          mode={this.props.appearance === "dark" ? 'black' : 'white'}
                        >
                          <Link target="_blank" href={"https://vk.com/club" + this.state.club.id}><Avatar size={96} src={this.state.club.photo} /></Link>
                          <Link target="_blank" href={"https://vk.com/club" + this.state.club.id}>
                            <Title
                              style={{ marginBottom: 8, marginTop: 20, maxWidth: "100%", overflow: "hidden", color: "var(--text_primary)" }}
                              level="2"
                              weight="2"
                            >
                              {this.state.club.name}
                            </Title>
                          </Link>
                        </Gradient>
                        {!this.props.startupError && <Separator wide />}
                        {this.props.startupError &&
                          <Banner
                            before={
                              <Avatar size={28} style={{ backgroundImage: "linear-gradient(90deg, #ffb73d 0%, #ffa000 100%)" }}>
                                <span style={{ color: "#fff" }}>!</span>
                              </Avatar>
                            }
                            header={this.props.startupError.title}
                            subheader={this.props.startupError.text}
                            actions={
                              <Div>
                                <ButtonGroup>
                                  {this.props.startupError.autofix &&
                                    <Button
                                      onClick={() => this.startupErrorAutofix()}
                                      disabled={this.state.autofixBtnWorking}
                                      loading={this.state.autofixBtnWorking}
                                    >
                                      Исправить
                                    </Button>
                                  }
                                  <Link href={"https://vk.me/ch_app?ref_source=" + this.props.generateRefSourceString("callback_error")} target={"_blank"}>
                                    <Button
                                      mode={this.props.startupError.autofix ? "secondary" : "primary"}
                                    >
                                      Обратиться в Поддержку
                                    </Button>
                                  </Link>
                                </ButtonGroup>
                              </Div>
                            }
                          />
                        }
                        <List style={{ paddingTop: "10px" }}>
                          <MiniInfoCell before={<Icon16Hashtag width={20} height={20} />}>ID: {club.id}</MiniInfoCell>
                          <MiniInfoCell before={<Icon20CalendarOutline />}>Дата установки: {club.installation.time.label}</MiniInfoCell>
                          <MiniInfoCell before={<Icon28DonateOutline width={20} height={20} />} onClick={() => this.openModal("donut")} after={<div onClick={() => this.openModal("donut")} style={{ color: "var(--accent)" }}>Что это?</div>}>Подписка {this.props.hasDonut ? "активна" : "неактивна"}</MiniInfoCell>
                        </List>
                      </>}
                  </Group>
                  {this.props.isMobile &&
                    <Group>
                      <CellButton
                        onClick={() => this.openModal("settings")}
                        before={
                          <Icon28SettingsOutline />
                        }
                        after={<Icon20ChevronRightOutline fill="var(--dynamic_gray)" />}
                      >
                        Настройки
                      </CellButton>
                      <CellButton
                        onClick={() => this.openModal("support_code")}
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
                    </Group>
                  }
                  {!this.state.isStatsHidden &&
                    <>
                      <Title level='2' style={{ padding: "10px", marginLeft: "5px", color: "var(--text_primary)"}}>Статистика</Title>
                      {this.props.club_role == "admin" &&
                        <Group header={<Title level='3' style={{padding: "10px", marginLeft: "5px"}}>Руководители</Title>}>
                          <CardScroll>
                            {this.state.isManagersLoading ? <PanelSpinner /> :
                              this.state.managers?.map((item, idx) => (
                                  <ContentCard
                                    mode="tint"
                                    key={idx}
                                    subtitle={<Avatar size={28} src={item.photo} />}
                                  header={<Title style={{ fontSize: "16px", color: "var(--text_secondary)"}} weight="3">{item.first_name} {item.last_name}</Title>}
                                  caption={<Caption style={{ fontSize: "18px"}} weight={1}>{this.props.formatRole(item.role)}</Caption>}
                                  />
                                )
                              )}
                          </CardScroll>
                        </Group>
                      }
                    <Group header={<Title level='3' style={{ padding: "10px", marginLeft: "5px" }}>Обращения</Title>}>
                      {this.state.isStatsLoading ? <PanelSpinner /> :
                        <CardScroll>
                          <ContentCard
                            mode="tint"
                            subtitle={<Icon20CommunityName width={28} height={28} fill="var(--dynamic_orange)" />}
                            header={<Title style={{ fontSize: "16px", color: "var(--text_secondary)"}} weight="3">Всего</Title>}
                            caption={<Caption style={{ fontSize: "18px"}} weight={1}>{this.state.stats?.tickets?.all}</Caption>}
                          />
                          <ContentCard
                            mode="tint"
                            subtitle={<Icon20Search width={28} height={28} fill="var(--dynamic_blue)" />}
                            header={<Title style={{ fontSize: "16px", color: "var(--text_secondary)"}} weight="3">Ожидающих специалиста</Title>}
                            caption={<Caption style={{ fontSize: "18px"}} weight={1}>{this.state?.stats.tickets?.waiting_specialist}</Caption>}
                          />
                          <ContentCard
                            mode="tint"
                            subtitle={<Icon20WorkOutline width={28} height={28} fill="var(--button_commerce_background)" />}
                            header={<Title style={{ fontSize: "16px", color: "var(--text_secondary)"}} weight="3">В работе</Title>}
                            caption={<Caption style={{ fontSize: "18px"}} weight={1}>{this.state.stats?.tickets?.work}</Caption>}
                          />
                          <ContentCard
                            mode="tint"
                            subtitle={<Icon20BlockOutline width={28} height={28} fill="var(--destructive)" />}
                            header={<Title style={{ fontSize: "16px", color: "var(--text_secondary)"}} weight="3">Закрыты</Title>}
                            caption={<Caption style={{fontSize: "18px"}} weight={1}>{this.state.stats?.tickets?.closed}</Caption>}
                          />
                        </CardScroll>
                      }
                      </Group>
                      <Group header={<Title level='3' style={{padding: "10px", marginLeft: "5px"}}>Ссылки</Title>}>
                        {this.state.isStatsLoading ? <PanelSpinner /> :
                          <CardScroll>
                            <ContentCard
                              mode="tint"
                              subtitle={<Icon24Linked width={28} height={28} fill="var(--dynamic_raspberry_pink)" />}
                              header={<Title style={{fontSize: "16px", color: "var(--text_secondary)"}} weight="3">Всего</Title>}
                            caption={<Caption style={{ fontSize: "18px"}} weight={1}>{this.state.stats.links?.all}</Caption>}
                            />
                          </CardScroll>
                        }
                      </Group>
                    </>
                  }
                </PullToRefresh>

                {this.state.snackbar}
              </Panel>
            }
          </SplitCol>
        </SplitLayout>
      </ConfigProvider>
    )
  }
}
