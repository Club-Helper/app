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

import {
  ConfigProvider,
  ModalPage,
  ModalPageHeader,
  ModalRoot,
  Panel,
  PanelHeader,
  PanelHeaderButton,
  Div,
  Button,
  ButtonGroup,
  Group,
  SplitLayout,
  SplitCol,
  Tabs,
  TabsItem,
  Placeholder,
  List,
  Avatar,
  SimpleCell,
  Search,
  ScreenSpinner,
  PullToRefresh,
  HorizontalScroll,
  Spacing,
  Cell,
  PanelSpinner,
  Link,
  Spinner,
  Text,
  Title
} from '@vkontakte/vkui'
import { Icon24Dismiss, Icon24MoreHorizontal, Icon56MessagesOutline, Icon28RecentOutline, Icon56InboxOutline } from '@vkontakte/icons';

import '../../../css/tickets/list.css';
import '../../../css/landings/onboarding.css';

import bridge from '@vkontakte/vk-bridge';

export default class TicketsList extends Component {
  constructor(props) {
    super(props)

    const initialState = {
      activeModal: null,
      activeTab: localStorage.getItem("tickets_list_activeTab") ? localStorage.getItem("tickets_list_activeTab") : "waiting_specialist",
      faqInfo: {
        title: null,
        text: null
      },
      messages: [],
      count: 1,
      isEnabled: true,
      fetching: false,
      popout: null,
      options: [],
      ticketsLoading: false,
      ticketButtonsID: 0,
      currentMessages: [],
      onboarding: []
    }

    this.state = this.props.ticketsState !== null ? this.props.ticketsState : initialState

    this.openFAQModal = this.openFAQModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.getTickets = this.getTickets.bind(this);
    this.onRefresh = this.onRefresh.bind(this);
    this.openTicketButtonsModal = this.openTicketButtonsModal.bind(this);
    this.closeTicketButtonsModal = this.closeTicketButtonsModal.bind(this);
    this.performAction = this.performAction.bind(this);
  }


  openFAQModal() {
    this.setState({
      activeModal: "faq",
      faqInfo: {
        title: "Название",
        text: "АбобаАбобаАбобаАбобаАбобаАбобаАбоба"
      }
    });
  }

  closeModal() {
    this.setState({
      activeModal: null,
    });
  }

  /**
   * Возвращает список обращений с фильтром filter
   *
   * @param {string} filter
   * @param needLoading
   */
  getTickets(filter, needLoading) {
    this.setState({ fetching: true });
    needLoading ? this.setState({ ticketsLoading: true }) : this.setState({ fetching: true });
    let timeout = setTimeout(() => this.props.setPopout(<ScreenSpinner />), 10000);

    this.props.req("tickets.get", {
      token: this.props.token,
      filter: filter
    },
      (data) => {
        this.setState({ messages: data.response.items, count: data.response.count, isEnabled: true })
      },
      (error) => {
        this.setState({ isEnabled: false });
      }
    );

    this.props.setPopout(null);
    clearTimeout(timeout);
    needLoading ? this.setState({ ticketsLoading: false }) : this.setState({ fetching: false });
    bridge.send("VKWebAppTapticNotificationOccurred", { "type": "success" });
  }

  performAction(id, action) {
    this.props.req("ticket.action", {
      id: id,
      action: action,
      token: this.props.token
    },
      (data) => {
        this.closeTicketButtonsModal();
        bridge.send("VKWebAppTapticNotificationOccurred", { "type": "success" });
      }
    );
  }

  onRefresh() {
    this.getTickets(this.state.activeTab, false);
  }

  componentDidMount() {
    this.setState({ ticketsLoading: true });
    this.props.req("tickets.get", {
        token: this.props.token,
        filter: this.state.activeTab
    },
      (data) => {
        this.setState({ messages: data.response.items, count: data.response.count, isEnabled: true })
      },
      (error) => {
        this.setState({ isEnabled: false });
      }
    );

    this.props.setLoading(false);
    this.setState({ ticketsLoading: false });
    this.props.setPopout(null);

    this.interval = setInterval(() => this.getTickets(this.state.activeTab, false), 60000);

    if (this.props.needToShowClubStartOnboarding) {
      this.props.req("utils.welcomeClub", {
        token: this.props.token
      }, (response) => {
        this.setState({ onboarding: response.response });
      })
      this.setState({ activeModal: "onboarding" });
    }
  }

  openTicketButtonsModal(id, options) {
    this.setState({
      options: options,
      ticketButtonsID: id,
      activeModal: "buttons"
    });
  }

  closeTicketButtonsModal() {
    this.setState({
      activeModal: null
    });
  }

  search(e) {
    if (!e.target.value) {
      this.setState({ currentMessages: [] });
    } else {
      this.setState({ currentMessages: this.state.messages.filter(({ preview }) => preview.toLowerCase().indexOf(e.target.value) > -1)
    })
    }
  }

  componentWillUnmount() {
    localStorage.setItem("tickets_list_activeTab", this.state.activeTab);
    this.props.setTicketsState(this.state);
    clearInterval(this.interval);
  }

  render() {
    const modal = (
      <ModalRoot activeModal={this.state.activeModal}>
        <ModalPage
          id='faq'
          header={<ModalPageHeader right={this.props.isMobile && <PanelHeaderButton onClick={this.closeModal}><Icon24Dismiss /></PanelHeaderButton>}>{this.state.faqInfo.title}</ModalPageHeader>}
          onClose={this.closeModal}
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
          id='buttons'
          header={<ModalPageHeader right={this.props.isMobile && <PanelHeaderButton onClick={this.closeModal}><Icon24Dismiss /></PanelHeaderButton>}>Действия с обращением</ModalPageHeader>}
          onClose={this.closeTicketButtonsModal}
          settlingHeight={100}
        >
          <Div>
            <ButtonGroup style={{ width: "100%" }}>
              {this.state.options.includes("request_information") && <Button mode="secondary" size="m" stretched onClick={() => this.performAction(this.state.ticketButtonsID, "request_information")}>Ожидается информация</Button>}
              {this.state.options.includes("cancel_request_information") && <Button mode="destructive" size="m" stretched onClick={() => this.performAction(this.state.ticketButtonsID, "cancel_request_information")}>Отменить запрос информации</Button>}
              {this.state.options.includes("get_support") && <Button mode="secondary" size="m" stretched>Написать в Поддержку</Button>}
            </ButtonGroup>
          </Div>
        </ModalPage>

        <ModalPage
          id="onboarding"
          header={<ModalPageHeader right={this.props.isMobile && <PanelHeaderButton onClick={this.closeModal}><Icon24Dismiss /></PanelHeaderButton>}>Добро пожаловать!</ModalPageHeader>}
          onClose={this.closeModal}
          settlingHeight={100}
        >
          <Panel className='clubHelper-onboarding_panel'>
            <div className="clubHelper--onboarding">
              <Title>Добро пожаловать!</Title>
              <Title level="3">Команда Club Helper рада приведстовать новых пользователелй! Давайте мы коротко напомним о функциях сервиса.</Title>
              {this.state.onboarding.map((element) => {
                if (element.type == "icon") {
                  return (<div className="clubHelper--onboarding_block">
                    <div className="clubHelper--onboarding_block-icon" dangerouslySetInnerHTML={{__html: element.icon}}/>
                    <div>
                      <div className="clubHelper--onboarding_block-title" dangerouslySetInnerHTML={{__html: this.props.parseLinks(element.title)}}/>
                      {element.subtitle && <div className="clubHelper--onboarding_block-subtitle" dangerouslySetInnerHTML={{__html: this.props.parseLinks(element.subtitle)}}/>}
                    </div>
                  </div>);
                }else if (element.type == "spacing") {
                  return (<Spacing size={15}/>);
                }else if (element.type == "note") {
                  return (<Text className="clubHelper--onboarding_note" dangerouslySetInnerHTML={{__html: this.props.parseLinks(element.text)}}/>);
                }
              })}
            </div>
          </Panel>
        </ModalPage>
      </ModalRoot>
    );

    if (!this.state.isEnabled) {
      return (
        <ConfigProvider platform={this.props.platform.current} appearance={this.props.appearance}>
          <Group>
            <Placeholder
              icon={<Icon56MessagesOutline />}
              action={<Button size='m' onClick={() => this.props.go('settings')}>Перейти в настройки</Button>}
            >
              Вам нужно включить Сообщения в Настройках, чтобы использовать этот раздел.
            </Placeholder>
          </Group>
        </ConfigProvider>
      )
    }

    return (
      <ConfigProvider platform={this.props.platform.current} appearance={this.props.appearance}>
        <SplitLayout>
          <SplitCol>
            {this.props.isLoading ? <PanelSpinner /> :
              <PullToRefresh
                onRefresh={this.onRefresh}
                isFetching={this.state.fetching}
              >
              <Panel>
                {!this.props.isMobile &&
                  <PanelHeader>
                    <Tabs mode="default" style={{ padding: "0 15px 0 15px" }}>
                      <TabsItem
                        onClick={() => { this.getTickets("all", false); this.setState({ activeTab: "all" }) }}
                        selected={this.state.activeTab === "all"}
                      >
                        Все
                      </TabsItem>
                      <TabsItem
                        onClick={() => { this.getTickets("waiting_specialist", false); this.setState({ activeTab: "waiting_specialist" }) }}
                        selected={this.state.activeTab === "waiting_specialist"}
                      >
                        Ожидают специалиста
                      </TabsItem>
                      <TabsItem
                        onClick={() => { this.getTickets("work", false); this.setState({ activeTab: "work" }) }}
                        selected={this.state.activeTab === "work"}
                      >
                        В работе
                      </TabsItem>
                      <TabsItem
                        onClick={() => { this.getTickets("closed", false); this.setState({ activeTab: "closed" }) }}
                        selected={this.state.activeTab === "closed"}
                      >
                        Закрыты
                      </TabsItem>
                      {this.state.fetching &&
                        <TabsItem
                          style={{
                            position: "absolute",
                            right: 15
                          }}
                        >
                          <Spinner />
                        </TabsItem>
                      }
                    </Tabs>
                  </PanelHeader>
                }
                <Group>

                  {this.props.isMobile &&
                    <Tabs mode="default">
                      <HorizontalScroll>
                        <TabsItem
                          onClick={() => { this.getTickets("all", true); this.setState({ activeTab: "all" }) }}
                          selected={this.state.activeTab === "all"}
                        >
                          Все
                        </TabsItem>
                        <TabsItem
                          onClick={() => { this.getTickets("waiting_specialist", true); this.setState({ activeTab: "waiting_specialist" }) }}
                          selected={this.state.activeTab === "waiting_specialist"}
                        >
                          Ожидают специалиста
                        </TabsItem>
                        <TabsItem
                          onClick={() => { this.getTickets("work", true); this.setState({ activeTab: "work" }) }}
                          selected={this.state.activeTab === "work"}
                        >
                          В работе
                        </TabsItem>
                        <TabsItem
                          onClick={() => { this.getTickets("closed", true); this.setState({ activeTab: "closed" }) }}
                          selected={this.state.activeTab === "closed"}
                        >
                          Закрыты
                        </TabsItem>
                      </HorizontalScroll>
                    </Tabs>
                  }

                    <Group mode='plain'>
                      <SplitLayout modal={modal} popout={this.state.popout}>
                        <SplitCol>
                          <Search onChange={(e) => this.search(e)} />
                          {this.state.ticketsLoading ? <PanelSpinner /> :
                            <List>
                              {this.state.activeTab && this.state.count != 0 &&
                                this.state.currentMessages.length <= 0 ?
                                this.state.messages.map((item, id) => (
                                  <div key={item.id}>
                                    {this.props.isMobile &&
                                      <div>
                                        <Cell
                                          disabled
                                          multiline
                                          before={<Avatar size={36} src={item.user.photo} />}
                                          after={<Icon28RecentOutline />}
                                          description={item.time.label}
                                        >
                                          {item.user.first_name} {item.user.last_name}
                                        </Cell>
                                      </div>
                                    }
                                    {!this.props.isMobile &&
                                      <SimpleCell
                                        onClick={() => { this.props.setTicket(item); this.props.go('ticket') }}
                                        multiline
                                        disabled
                                        description={item.status.label}
                                        after={
                                          !this.props.isMobile &&
                                          <Cell
                                            disabled
                                            multiline
                                            before={<Avatar size={36} src={item.user.photo} />}
                                            description={item.time.label}
                                          >
                                            {item.user.first_name} {item.user.last_name}
                                          </Cell>
                                        }
                                        before={<Icon28RecentOutline />}
                                        key={item.id}
                                      >
                                        Обращение #{item.id}
                                      </SimpleCell>
                                    }
                                    <SimpleCell
                                      multiline
                                      disabled
                                      style={{
                                        backgroundColor: "var(--button_muted_background)",
                                        borderRadius: "8px",
                                        color: !this.props.isMobile ? "var(--button_muted_foreground)" : "var(--text_subhead)",
                                        whiteSpace: "pre-wrap",
                                        margin: "0 15px 0 15px"
                                      }}
                                    >
                                      {item.preview}
                                    </SimpleCell>
                                    {item.options.length != 0 &&
                                      <>
                                        <SimpleCell
                                          multiline
                                          disabled
                                          style={{
                                            marginBottom: "10px"
                                          }}
                                        >
                                          <HorizontalScroll
                                            showArrows
                                            getScrollToLeft={(i) => i - 120}
                                            getScrollToRight={(i) => i + 120}
                                          >
                                            <ButtonGroup>
                                              {item.options.includes("watch") && <Button onClick={() => { this.props.setTicket(item); this.props.go('ticket') }}>Посмотреть обращение</Button>}
                                              {item.options.includes("assign") && <Button onClick={() => { this.props.setTicket(item); this.props.go('ticket') }}>Взять обращение</Button>}
                                              {item.options.includes("get_support") && <Link href={"https://vk.me/ch_app?ref_source=" + this.props.generateRefSourceString("tickets_get_support") + "&ref=" + item.id}><Button mode="secondary" size="m">Написать в Поддержку</Button></Link>}
                                              {item.options.includes("request_information") || item.options.includes("cancel_request_information") || item.options.includes("get_support") ?
                                                <Button mode="secondary" onClick={() => this.openTicketButtonsModal(item.id, item.options)}><Icon24MoreHorizontal /></Button>
                                                : ""}
                                            </ButtonGroup>
                                          </HorizontalScroll>
                                        </SimpleCell>
                                      </>
                                    }
                                    {this.state.messages.length != id + 1 && <Spacing separator size={10} style={{ marginTop: "10px" }} />}

                                  </div>
                                )) : this.state.currentMessages.map((item, id) => (
                                  <div key={item.id}>
                                    {this.props.isMobile &&
                                      <div>
                                        <Cell
                                          disabled
                                          multiline
                                          before={<Avatar size={36} src={item.user.photo} />}
                                          after={<Icon28RecentOutline />}
                                          description={item.time.label}
                                        >
                                          {item.user.first_name} {item.user.last_name}
                                        </Cell>
                                      </div>
                                    }
                                    {!this.props.isMobile &&
                                      <SimpleCell
                                        onClick={() => { this.props.setTicket(item); this.props.go('ticket') }}
                                        multiline
                                        disabled
                                        description={item.status.label}
                                        after={
                                          !this.props.isMobile &&
                                          <Cell
                                            disabled
                                            multiline
                                            before={<Avatar size={36} src={item.user.photo} />}
                                            description={item.time.label}
                                          >
                                            {item.user.first_name} {item.user.last_name}
                                          </Cell>
                                        }
                                        before={<Icon28RecentOutline />}
                                        key={item.id}
                                      >
                                        Обращение #{item.id}
                                      </SimpleCell>
                                    }
                                    <SimpleCell
                                      multiline
                                      disabled
                                      style={{
                                        backgroundColor: "var(--button_muted_background)",
                                        borderRadius: "8px",
                                        color: !this.props.isMobile ? "var(--button_muted_foreground)" : "var(--text_subhead)",
                                        whiteSpace: "pre-wrap",
                                        margin: "0 15px 0 15px"
                                      }}
                                    >
                                      {item.preview}
                                    </SimpleCell>
                                    {item.options.length != 0 &&
                                      <>
                                        <SimpleCell
                                          multiline
                                          disabled
                                          style={{
                                            marginBottom: "10px"
                                          }}
                                        >
                                          <HorizontalScroll
                                            showArrows
                                            getScrollToLeft={(i) => i - 120}
                                            getScrollToRight={(i) => i + 120}
                                          >
                                            <ButtonGroup>
                                              {item.options.includes("watch") && <Button onClick={() => { this.props.setTicket(item); this.props.go('ticket') }}>Посмотреть обращение</Button>}
                                              {item.options.includes("assign") && <Button onClick={() => { this.props.setTicket(item); this.props.go('ticket') }}>Взять обращение</Button>}
                                              {item.options.includes("get_support") && <Link href={"https://vk.me/ch_app?ref_source=" + this.props.generateRefSourceString("tickets_get_support") + "&ref=" + item.id}><Button mode="secondary" size="m">Написать в Поддержку</Button></Link>}
                                              {item.options.includes("request_information") || item.options.includes("cancel_request_information") || item.options.includes("get_support") ?
                                                <Button mode="secondary" onClick={() => this.openTicketButtonsModal(item.id, item.options)}><Icon24MoreHorizontal /></Button>
                                                : ""}
                                            </ButtonGroup>
                                          </HorizontalScroll>
                                        </SimpleCell>
                                      </>
                                    }
                                    {this.state.messages.length != id + 1 && <Spacing separator size={10} style={{ marginTop: "10px" }} />}

                                  </div>
                                ))}
                              {this.state.count == 0 &&
                                <Placeholder
                                  icon={<Icon56InboxOutline />}
                                >
                                  Не найдено ни одного обращения.
                                </Placeholder>
                              }
                            </List>
                          }
                        </SplitCol>
                      </SplitLayout>
                    </Group>
                </Group>
              </Panel>
              </PullToRefresh>
            }
          </SplitCol>
        </SplitLayout>
      </ConfigProvider >
    )
  }
}
