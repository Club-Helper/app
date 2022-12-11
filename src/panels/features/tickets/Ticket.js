/*******************************************************
 * Авторское право (C) 2021-2022 Club Helper
 *
 * Этот файл является частью мини-приложения Club Helper, размещенного
 * в сети Интернет по адресу https://www.vk.com/app7938346
 *
 * Несанкционированное копирование, инженерный анализ, передача,
 * распространение кода приложения запрещены
 *******************************************************/

import React, { Component } from 'react'

import { ConfigProvider, ModalPage, ModalPageHeader, ModalRoot, PanelHeader, PanelHeaderButton, Div, Button, ButtonGroup, Group, SplitLayout, SplitCol, Separator, Cell, PanelHeaderBack, Title, MiniInfoCell, Link, PanelSpinner, PullToRefresh, Spinner, Snackbar, Avatar, ModalCard } from '@vkontakte/vkui'
import { Icon24Dismiss, Icon12Circle, Icon20UserOutline, Icon20ClockOutline, Icon16Done, Icon28AdvertisingOutline } from '@vkontakte/icons';
import bridge from '@vkontakte/vk-bridge';
import { SystemMessage, UserMessage, ClubMessage } from './partials/Message';
import TicketActions from './TicketActions';

export default class TicketsList extends Component {
  constructor(props) {
    super(props)

    this.state = {
      activeModal: null,
      activeTab: "all",
      faqInfo: {
        title: null,
        text: null
      },
      ticket: {},
      ticketOptions: [],
      ticketStatus: {},
      ticketStatusColor: "",
      ticketUser: {},
      ticketHistory: [],
      fetching: false,
      buttonLoading: null,
      fetchingHeader: false,
      snackbar: null,
      sendHelloMsgBtnWorking: false
    }

    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.updateTicket = this.updateTicket.bind(this);
    this.handleOptionClick = this.handleOptionClick.bind(this);
    this.mailingInviteSend = this.mailingInviteSend.bind(this);
  }


  openModal(id) {
    this.setState({
      activeModal: id
    });
  }

  closeModal() {
    this.setState({
      activeModal: null,
    });
  }

  updateTicket() {
    this.setState({ fetchingHeader: true });
    this.props.req("ticket.needUpdate", {
      id: this.props.ticket.id,
      token: this.props.token
    },
      (data) => {
        this.setState(
          {
            ticketStatus: data.response.status,
            ticketOptions: data.response.options,
            ticketHistory: data.response.history.items,
            fetchingHeader: false
          });
      }
    );
  }

  handleOptionClick(actionName) {
    this.setState({ buttonLoading: actionName });
    fetch("https://ch.n1rwana.ml/api/ticket.action?id=" + this.props.ticket.id + "&action=" + actionName + "&token=" + this.props.token)
      .then(response => response.json())
      .then(data => {
        if (!data.response.status) {
          this.props.createError(data.response.error);
          bridge.send("VKWebAppTapticNotificationOccurred", { "type": "error" });
        } else {
          this.updateTicket();
          bridge.send("VKWebAppTapticNotificationOccurred", { "type": "success" });
        }
        this.setState({ buttonLoading: null });
      })
  }

  mailingInviteSend(id) {
    this.props.req("ticket.action", {
      id: this.state.ticket.id,
      action: "mailing",
      mailing: id,
      token: this.props.token
    },
      (data) => {
        if (data.response.status) {
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
                Приглашение отправлено
              </Snackbar>
            ),
            activeModal: "",
            buttonLoading: ""
          });
          bridge.send("VKWebAppTapticNotificationOccurred", { "type": "success" });
        } else {
          this.props.createError(data.response.error);
          this.setState({ buttonLoading: "" });
        }
      }
    );
  }

  sendHelloMsg() {
    this.setState({ sendHelloMsgBtnWorking: true });
    this.props.req("ticket.action", {
      id: this.state.ticket.id,
      action: "hello",
      token: this.props.token
    },
      (data) => {
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
              Сообщение отправлено
            </Snackbar>
          ),
          activeModal: "",
          sendHelloMsgBtnWorking: false
        });
        this.updateTicket();
        bridge.send("VKWebAppTapticNotificationOccurred", { "type": "success" });
      },
      (error) => {
        this.setState({
          activeModal: "",
          sendHelloMsgBtnWorking: false
        });
      }
    );
  }

  componentDidMount() {
    this.props.req("ticket.get", {
      id: this.props.ticket.id,
      token: this.props.token
    },
      (data) => {
        let color;
        switch (data.response.status.color) {
          case "green":
            color = "#32b332"
            break;

          case "gray":
            color = "#99a2ad"
            break;

          case "red":
            color = "#ff3347"
            break;

          case "yellow":
            color = "#ffa000"
            break;

          default:
            break;
        }
        this.setState(
          {
            ticket: data.response,
            ticketStatus: data.response.status,
            ticketOptions: data.response.options,
            ticketStatusColor: color,
            ticketUser: data.response.user,
            ticketHistory: data.response.history.items
          })
        this.props.setLoading(false);
        if (data.response.history.items.length <= 2) {
          this.setState({ activeModal: "send-hello-msg" });
        }
      }
    );

    this.props.setPopout(null);
    this.interval = setInterval(() => this.updateTicket(), 5000)
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    const modal = (
      <ModalRoot activeModal={this.state.activeModal}>
        <ModalPage
          id='faq'
          header={<ModalPageHeader right={this.props.isMobile && <PanelHeaderButton onClick={this.closeFAQModal}><Icon24Dismiss /></PanelHeaderButton>}>{this.state.faqInfo.title}</ModalPageHeader>}
          onClose={this.closeFAQModal}
          settlingHeight={100}
        >
          <Div>{this.state.faqInfo.text}</Div>
          <Div>
            <ButtonGroup style={{ width: "100%" }}>
              <Button size="m" appearance="accent" stretched>
                Написать в Поддержку
              </Button>
            </ButtonGroup>
          </Div>
        </ModalPage>
        <ModalPage
          id="actions"
          header={<ModalPageHeader right={this.props.isMobile && <PanelHeaderButton onClick={this.closeModal}><Icon24Dismiss /></PanelHeaderButton>}>Приглашение в рассылку</ModalPageHeader>}
          onClose={() => {
            this.setState({
              activeModal: "",
              buttonLoading: null
            })
          }}
          settlingHeight={100}
        >
          <TicketActions {...this.props} close={() => {
            this.setState({
              activeModal: "",
              buttonLoading: null
            })
          }} send={this.mailingInviteSend} />
        </ModalPage>
        <ModalCard
          id={"send-hello-msg"}
          onClose={this.closeModal}
          actions={
            <ButtonGroup stretched>
              <Button mode={"secondary"} onClick={this.closeModal}>Нет</Button>
              <Button onClick={() => this.sendHelloMsg()} disabled={this.state.sendHelloMsgBtnWorking} loading={this.state.sendHelloMsgBtnWorking}>Да</Button>
            </ButtonGroup>
          }
        >
          <span style={{ textAlign: "center", padding: "10px" }}>
            Похоже, Вы впервые подключились к обращению. Хотите поприветствовать пользователя?
          </span>
        </ModalCard>
      </ModalRoot>
    );

    return (
      <ConfigProvider platform={this.props.platform.current} appearance={this.props.appearance}>
        <PanelHeader
          left={
            <React.Fragment>
              <PanelHeaderBack onClick={() => this.props.go("tickets_list")} />
              <PanelHeaderButton onClick={() => this.openModal("actions")}><Icon28AdvertisingOutline /></PanelHeaderButton>
              {this.state.fetchingHeader && <PanelHeaderButton><Spinner /></PanelHeaderButton>}
            </React.Fragment>
          }

        >
        </PanelHeader>

        {this.props.isLoading ? <PanelSpinner /> :

          <SplitLayout modal={modal}>
            <SplitCol>
              <PullToRefresh
                onRefresh={this.updateTicket}
                isFetching={this.state.fetching}
              >
                <Group>
                  <Cell
                    disabled
                    description={this.state.ticketStatus.label}
                    before={<Icon12Circle fill={this.state.ticketStatusColor} />}
                    after={<Link href={"https://vk.com/gim" + this.props.group_id + "?sel=" + this.state.ticketUser.id} target="_blank"><Button mode="secondary">Перейти в диалог</Button></Link>}
                  >
                    <Title level="1">Обращение #{this.props.ticket.id}</Title>
                  </Cell>

                  <Separator style={{ margin: "10px 0 10px 0" }} />

                  <MiniInfoCell before={<Icon20UserOutline />}>
                    <Link href={"https://vk.com/id" + this.state.ticketUser.id} target="_blank">{this.state.ticketUser.first_name} {this.state.ticketUser.last_name}</Link>
                  </MiniInfoCell>
                  <MiniInfoCell before={<Icon20ClockOutline />}>
                    {this.state.ticket.time}
                  </MiniInfoCell>
                  {this.state.ticketOptions != [] &&
                    <>
                      <Separator style={{ margin: "10px 0 10px 0" }} />
                    <ButtonGroup style={{ marginLeft: "15px", marginBottom: "10px" }}>
                      {this.state.ticketOptions.includes("received_information") &&
                        <Button
                          onClick={() => this.handleOptionClick("received_information")}
                          loading={this.state.buttonLoading === "received_information"}
                          mode="commerce"
                        >
                          Информация получена
                          </Button>
                        }
                        {this.state.ticketOptions.includes("request_information") &&
                          <Button
                            onClick={() => this.handleOptionClick("request_information")}
                            loading={this.state.buttonLoading === "request_information"}>
                            Ожидается информация
                          </Button>
                        }
                        {this.state.ticketOptions.includes("cancel_request_information") &&
                          <Button
                            mode="destructive"
                            onClick={() => this.handleOptionClick("cancel_request_information")}
                            loading={this.state.buttonLoading === "cancel_request_information"}
                          >
                            Отменить ожидание информации
                          </Button>}
                        {this.state.ticketOptions.includes("close") &&
                          <Button
                            mode="destructive"
                            onClick={() => this.handleOptionClick("close")}
                            loading={this.state.buttonLoading === "close"}
                          >
                            Закрыть обращение
                        </Button>}
                        {this.state.ticketOptions.includes("invitation_mailing") &&
                          <Button
                            mode="outline"
                            onClick={() => this.setState({
                              activeModal: "actions",
                              buttonLoading: "invitation_mailing"
                            })}
                            loading={this.state.buttonLoading === "invitation_mailing"}
                            disabled={this.state.buttonLoading === "invitation_mailing"}
                          >
                            Пригласить в рассылку
                          </Button>
                        }
                        {this.state.ticketOptions.includes("get_support") &&
                          <Link href={"https://vk.me/ch_app?ref=" + this.props.generateRefSourceString("ticket_get_support") + "&ref=" + this.state.ticket.id}>
                            <Button
                              mode="secondary"
                              size="m"
                            >
                              Написать в Поддержку
                            </Button>
                          </Link>}
                      </ButtonGroup>
                    </>
                  }
                </Group>

                <Group mode="plain">
                  {this.state.fetching ? <PanelSpinner /> :

                    this.state.ticketHistory.map((item, id) => {
                      switch (item.type) {
                        case "message":
                          if (!item.message.is_club) {
                            return (
                              <UserMessage
                                key={id}
                                user={item.message.user.id}
                                photoUser={item.message.user.photo}
                                time={item.time}
                                sticker={item.message?.sticker}
                                attachments={item.message.attachments ?? []}
                              >
                                {item.message.text ?
                                  item.message.text :
                                    item.message.sticker ?
                                      item.message.sticker
                                    : false
                                }
                              </UserMessage>
                            );
                          } else {
                            return (
                              <ClubMessage
                                key={id}
                                user={item.message.user.id}
                                photoUser={item.message.user.photo}
                                time={item.time}
                                sticker={item.message?.sticker}
                                attachments={item.message.attachments ?? []}
                              >
                                {item.message.text ?
                                  item.message.text :
                                    item.message.sticker ?
                                      item.message.sticker
                                    : false
                                }
                              </ClubMessage>
                            )
                          }

                        case "log":
                          return (
                            <SystemMessage>
                              {item.log.map(item => {
                                if (item.type == "text") {
                                  return (item.text)
                                } else if (item.type == "link") {
                                  return (<Link href={item.link} target="_blank">{item.text}</Link>)
                                }
                              })}
                            </SystemMessage>
                          );

                        default:
                          break;
                      }
                    })
                  }
                </Group>

                {this.state.snackbar}
              </PullToRefresh>
            </SplitCol>
          </SplitLayout>
        }
      </ConfigProvider>
    )
  }
}
