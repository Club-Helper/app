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
import { ConfigProvider, Group, SplitLayout, SplitCol, List, SimpleCell, Avatar, ButtonGroup, Button, FormLayout, FormItem, Input, Textarea, Footer, ModalRoot, ModalPage, Div, ModalPageHeader, PanelHeaderButton, IconButton, MiniInfoCell, Link, Alert, Placeholder, Title, PanelSpinner, PullToRefresh, CellButton, Spacing, SegmentedControl, Cell, Snackbar } from '@vkontakte/vkui'
import { Icon24Linked, Icon24InfoCircleOutline, Icon24Dismiss, Icon16Hashtag, Icon20UserOutline, Icon20CalendarOutline, Icon48Linked, Icon24AddCircleDottedOutline, Icon16Done } from '@vkontakte/icons';

import bridge from '@vkontakte/vk-bridge';

export default class Links extends Component {
  constructor(props) {
    super(props)

    const initialState = {
      links: [],
      isEnabled: true,
      count: 0,
      availability: {},
      title: localStorage.getItem("links_list_formData_title") ? localStorage.getItem("links_list_formData_title") : "",
      pattern: localStorage.getItem("links_list_formData_pattern") ? localStorage.getItem("links_list_formData_pattern") : "",
      activeModal: null,
      faqInfo: {
        title: null,
        text: null
      },
      openedPattern: {
        id: 0,
        link: null,
        title: null,
        text: null,
        creat: {
          user: {},
          time: {}
        }
      },
      buttonLoading: false,
      deleteButtonLoading: false,
      link_copied: false,
      isLoading: true,
      fetching: false,
      showForm: false,
      linksLoading: true,
      filter: "all",
      snackbar: null,
      formTitleStatus: "default",
      formTitleBottom: "",
      formPatternStatus: "default",
      formPatternBottom: "",
      filterDisabled: false
    }

    this.state = this.props.linksState !== null ? this.props.linksState : initialState

    this.openFAQModal = this.openFAQModal.bind(this);
    this.openPatternModal = this.openPatternModal.bind(this);
    this.openCreateLinkModal = this.openCreateLinkModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.delete = this.delete.bind(this);
    this.deleteLink = this.deleteLink.bind(this);
    this.getLinks = this.getLinks.bind(this);
    this.createLink = this.createLink.bind(this);
    this.updateNewLinkTitle = this.updateNewLinkTitle.bind(this);
    this.updateNewLinkPattern = this.updateNewLinkPattern.bind(this);
    this.copyLink = this.copyLink.bind(this);
    this.onRefresh = this.onRefresh.bind(this);
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

  /**
   * Находит информацию о шаблоне в массиве ссылок по его id
   * и создаёт модальное окно с ней
   *
   * @param {int} id
   */
  openPatternModal(id) {
    let pattern = this.state.links.find(pattern => pattern.id == id)

    this.setState({
      activeModal: "pattern_info",
      openedPattern: {
        id: pattern.id,
        link: pattern.link,
        title: pattern.title,
        text: pattern.pattern,
        creat: {
          user: {
            id: pattern.creat.user.id,
            first_name: pattern.creat.user.first_name,
            last_name: pattern.creat.user.last_name,
            photo: pattern.creat.user.photo
          },
          time: {
            label: pattern.creat.time.label,
            unix: pattern.creat.time.unix
          }
        }
      }
    });
  }

  closeModal() {
    this.setState({
      activeModal: null
    })
  };

  /**
   * Удаление шаблона по его id
   *
   * @param {int} id
   */
  deleteLink(id) {
    this.setState({ deleteButtonLoading: true })
    this.props.req("links.delete", {
      id: id,
      token: this.props.token
    },
      (data) => {
        this.setState({ activeModal: null });
        this.props.req("links.get", {
          token: this.props.token
        },
          (data) => {
            this.setState({ links: data.response.items, count: data.response.count, isEnabled: true, deleteButtonLoading: false, availability: data.response.availability })
            this.props.setPopout(null);
            return true;
          },
          (error) => {
            this.props.createError(error.error.error_msg);
            this.setState({ isEnabled: false, deleteButtonLoading: false });
            this.props.setPopout(null);
          }
        )
      },
      (error) => {
        this.props.createError(error.error.error_msg);
        this.setState({ deleteButtonLoading: false });
      }
    )
  }

  /**
   * Создаёт модальное окно для подтвеждения удаления шаблона
   *
   * @param {int} id
   */
  delete(id) {
    this.props.setPopout(
      <Alert
        actions={[
          {
            title: "Отмена",
            autoclose: true,
            mode: "cancel",
          },
          {
            title: "Удалить",
            mode: "destructive",
            autoclose: true,
            action: () => { this.deleteLink(id) }
          }
        ]}
        onClose={() => this.props.setPopout(null)}
        actionsLayout="vertical"
        header="Подтвердите действие"
        text="Вы уверены, что хотите удалить этот шаблон? Данное действие необратимо."
      />)
  }

  getLinks(filter) {
    this.setState({ linksLoading: true });

    this.props.req("links.get", {
      token: this.props.token,
      filter: filter
    },
      (data) => {
        this.setState({ links: data.response.items, count: data.response.count, availability: data.response.availability, linksLoading: false })
      },
      (error) => {
        this.props.createError(error.error.error_msg);
        this.setState({ isEnabled: false, deleteButtonLoading: false });
        this.props.setPopout(null);
      }
    )

    this.setState({ filterDisabled: true });

    this.getLinksTimeout = setTimeout(() => {
      this.setState({ filterDisabled: false });
      clearTimeout(this.getLinksTimeout);
    }, 500);
  }

  updateNewLinkTitle(e) {
    this.setState({ title: e.target.value })
    if (!e.target.value) {
      this.setState({ formTitleStatus: "error", formTitleBottom: "Поле обязательно для заполнения" });
    } else if (e.target.value.length > 50) {
      this.setState({ formTitleStatus: "error", formTitleBottom: "Заголовок не может быть длиннее 50 символов" });
    } else {
      this.setState({ formTitleStatus: "default", formTitleBottom: "" });
    }
  }

  updateNewLinkPattern(e) {
    this.setState({ pattern: e.target.value })
    if (!e.target.value) {
      this.setState({ formPatternStatus: "error", formPatternBottom: "Поле обязательно для заполнения" });
    } else if (e.target.value.length < 10) {
      this.setState({ formPatternStatus: "error", formPatternBottom: "Шаблон сообщения не может содержать меньше 10 символов" });
    } else {
      this.setState({ formPatternStatus: "default", formPatternBottom: "" })
    }
  }

  openCreateLinkModal() {
    this.setState({
      activeModal: "create-link"
    });
  }

  createLink() {
    if (!this.state.title) {
      this.setState({ formTitleStatus: "error", formTitleBottom: "Поле обязательно для заполнения" });
    } else {
      this.setState({ formTitleStatus: "default", formTitleBottom: "" });
    }

    if (!this.state.pattern) {
      this.setState({ formPatternStatus: "error", formPatternBottom: "Поле обязательно для заполнения" });
    } else if (this.state.title.length > 50) {
      this.setState({ formPatternStatus: "error", formPatternStatus: "Заголовок не может быть длиннее 50 символов" });
    } else if (this.state.pattern.length < 10) {
      this.setState({ formPatternStatus: "error", formPatternBottom: "Шаблон сообщения не может содержать меньше 10 символов" });
    } else {
      this.setState({ formPatternStatus: "default", formPatternBottom: "" })
    }

    if (!this.state.title || !this.state.pattern || this.state.formTitleStatus == "error" || this.state.formPatternStatus == "error") {
      return false;
    }

    if (this.state.title != '' && this.state.pattern != '') {
      if (this.state.title.length > 50) {
        this.props.createError("Заголовок не может быть длиннее 50 символов");
      } else if (this.state.pattern.length < 10) {
        this.props.createError("Шаблон сообщения не может содержать меньше 10 символов")
      } else {
        this.setState({ buttonLoading: true })

        this.props.req("links.creat", {
          title: decodeURI(this.state.title),
          pattern: decodeURI(this.state.pattern),
          token: this.props.token
        },
          (data) => {
            this.setState({ activeModal: "", title: "", pattern: "" });
            this.props.req("links.get", {
              filter: this.state.filter,
              token: this.props.token
            },
              (data) => {
                this.setState({
                  links: data.response.items,
                  count: data.response.count,
                  buttonLoading: false,
                  availability: data.response.availability,
                  snackbar: (
                    <Snackbar
                      onClose={() => this.setState({ snackbar: null })}
                      before={
                        <Avatar
                          size={24}
                          style={{ background: "var(--button_commerce_background)" }}
                        >
                          <Icon16Done fill="#fff" width={14} height={14} />
                        </Avatar>
                      }
                    >
                      Ссылка создана
                    </Snackbar>
                  )
                })
                this.closeModal();
                bridge.send("VKWebAppTapticNotificationOccurred", { "type": "success" });
              }
            )
          },
          (error) => {
            this.setState({ buttonLoading: false })
            this.props.createError(data.error.error_msg);
          }
        )
      }
    } else {
      this.props.createError("Одно из необходимых полей не передано");
    }
  }

  copyLink(link) {
    bridge.send("VKWebAppCopyText", { "text": link });

    this.setState({
      snackbar: (
        <Snackbar
          onClose={() => this.setState({ snackbar: null })}
          before={
            <Avatar
              size={24}
              style={{ background: "var(--button_commerce_background)" }}
            >
              <Icon16Done fill="#fff" width={14} height={14} />
            </Avatar>
          }
        >
          Ссылка скопирована
        </Snackbar>
      )
    });

    bridge.send("VKWebAppTapticNotificationOccurred", { "type": "success" });
  }

  onRefresh() {
    this.setState({ fetching: true });
    this.getLinks(this.state.filter);
    this.setState({ fetching: false });
  }

  componentDidMount() {
    this.props.setLoading(false);
    this.interval = setInterval(() => this.getLinks(this.state.filter), 60000);

    this.getLinks("all");
    localStorage.removeItem("links_list_formData_title");
    localStorage.removeItem("links_list_formData_pattern");
    this.setState({ snackbar: null });
  }

  onFilterChange(value) {
    this.setState({ filter: value });
    this.getLinks(value);
    bridge.send("VKWebAppTapticNotificationOccurred", { "type": "success" });
  }

  componentWillUnmount() {
    localStorage.setItem("links_list_formData_title", this.state.title);
    localStorage.setItem("links_list_formData_pattern", this.state.pattern);
    this.props.setLinksState(this.state);
    clearInterval(this.interval);
    this.setState({ snackbar: null });
    clearTimeout(this.getLinksTimeout);
  }

  render() {
    const modal = (
      <ModalRoot activeModal={this.state.activeModal}>
        <ModalPage
          id="faq"
          header={<ModalPageHeader right={this.props.isMobile && <PanelHeaderButton aria-label="Скрыть информацию" onClick={this.closeModal}><Icon24Dismiss /></PanelHeaderButton>}>{this.state.faqInfo.title}</ModalPageHeader>}
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
          id="pattern_info"
          header={<ModalPageHeader right={this.props.isMobile && <PanelHeaderButton aria-label="Скрыть информацию" onClick={this.closeModal}><Icon24Dismiss /></PanelHeaderButton>}>{this.state.openedPattern.title}</ModalPageHeader>}
          onClose={this.closeModal}
          settlingHeight={100}
        >
          <Group header={<Title level='3' style={{ marginLeft: "15px", marginTop: "15px" }}>Текст шаблона</Title>}>
            <Div disabled style={{ whiteSpace: "pre-wrap" }}>
              {this.state.openedPattern.text}
            </Div>
          </Group>

          <Group>
            <MiniInfoCell before={<Icon16Hashtag width={20} height={20} />}>
              {this.state.openedPattern.id}
            </MiniInfoCell>
            <MiniInfoCell before={<Icon24Linked width={20} height={20} />}>
              <Link href={this.state.openedPattern.link} target="_blank">{this.state.openedPattern.link}</Link>
            </MiniInfoCell>
            <MiniInfoCell before={<Icon20UserOutline />}>
              <Link href={"https://vk.com/id" + this.state.openedPattern.creat.user} target="_blank">{this.state.openedPattern.creat.user.first_name} {this.state.openedPattern.creat.user.last_name}</Link>
            </MiniInfoCell>
            <MiniInfoCell before={<Icon20CalendarOutline />}>
              {this.state.openedPattern.creat.time.label}
            </MiniInfoCell>
          </Group>

          <Div style={{ width: "93%", marginTop: "10px" }}>
            <Button size="m" mode="destructive" stretched onClick={() => this.delete(this.state.openedPattern.id)} loading={this.state.deleteButtonLoading}>
              Удалить
            </Button>
          </Div>
        </ModalPage>

        <ModalPage
          id="create-link"
          header={<ModalPageHeader right={this.props.isMobile && <PanelHeaderButton aria-label="Отменить создание ссылки" onClick={this.closeModal}><Icon24Dismiss /></PanelHeaderButton>}>Создать ссылку</ModalPageHeader>}
          onClose={this.closeModal}
          settlingHeight={100}
        >
          <FormLayout>
            <FormItem
              top="Название шаблона"
              status={this.state.formTitleStatus}
              bottom={this.state.formTitleBottom}
              onChange={this.updateNewLinkTitle}
            >
              <Input
                type={"text"}
                name="title"
                placeholder='Администратор'
                value={this.state.title}
                onChange={this.updateNewLinkTitle}
                disabled={this.state.buttonLoading}
              />
            </FormItem>
            <FormItem
              top="Сообщение"
              bottom={this.state.formPatternBottom}
              status={this.state.formPatternStatus}
            >
              <Textarea
                placeholder={"{greetings}, {user_name}!\n\nСообщение, которое получит пользователь, если напишет Вам по созданной ссылке"}
                value={this.state.pattern}
                onChange={this.updateNewLinkPattern}
                disabled={this.state.buttonLoading}
              />
            </FormItem>
            <FormItem>
              <Button
                size='l'
                stretched
                onClick={this.createLink}
                loading={this.state.buttonLoading}
                disabled={this.state.buttonLoading || (this.state.formPatternStatus === "error" || this.state.formTitleStatus === "error")}
              >Создать ссылку</Button>
            </FormItem>
          </FormLayout>
        </ModalPage>
      </ModalRoot >
    );

    return (
      <ConfigProvider platform={this.props.platform.current} appearance={this.props.appearance}>
        {this.props.isLoading ? <PanelSpinner /> :
          <>
            {this.state.isEnabled && <>
              <SplitLayout modal={modal}>
                <SplitCol>
                  <PullToRefresh
                    onRefresh={this.onRefresh}
                    isFetching={this.state.fetching}
                  >
                    <Group mode='plain'>
                        <Cell
                          disabled
                          before={<Title level='3' style={{
                            marginLeft: "15px",
                            marginTop: "15px",
                            marginBottom: "0px"
                          }}>Ссылки <span style={{
                            color: "var(--text_secondary)",
                            fontSize: "12px"
                          }}>{this.state.count}</span></Title>}
                          style={{ margin: "0 -10px" }}
                        />
                        <Div style={ !this.props.isMobile ? { maxWidth: 300 } : { }}>
                          <SegmentedControl
                            size="m"
                            name="filter"
                            options={[
                              {
                                label: "Все",
                                value: "all",
                                disabled: this.state.filterDisabled
                              },
                              {
                                label: "Мои",
                                value: "my",
                                disabled: this.state.filterDisabled
                              }
                            ]}
                            style={ this.state.filterDisabled ? { height: "35px", padding: "5px", opacity: "0.5" } : { height: "35px", padding: "5px" }}
                            onChange={(value) => this.onFilterChange(value)}
                            value={this.state.filter}
                          />
                        </Div>
                      </Group>
                    {this.state.count == 0 ? <Placeholder action={<Button onClick={this.openCreateLinkModal}>Создать ссылку</Button>}>Не найдено ни одного шаблона ссылки.</Placeholder> : <>
                      <Group mode='plain'>
                        <List>
                          {this.state.linksLoading ? <PanelSpinner /> :
                            this.state.count != 0 ?
                              this.state.links.map(item => (
                                <SimpleCell
                                  multiline
                                  before={<Avatar size={48} src={item.creat.user.photo} />}
                                  key={item.id}
                                  description={item.creat.user.first_name + " " + item.creat.user.last_name}
                                  after={
                                    <div style={{ display: "flex", gridGap: 10 }}>
                                      <IconButton
                                        onClick={() => this.copyLink(item.link)}
                                      >
                                        <Icon24Linked />
                                      </IconButton>
                                      <IconButton
                                        onClick={() => this.openPatternModal(item.id)}
                                      >
                                        <Icon24InfoCircleOutline />
                                      </IconButton>
                                    </div>
                                  }
                                >
                                  {item.title}
                                </SimpleCell>
                              ))
                              :
                              <Footer>Не найдено ни одного шаблона ссылки.</Footer>
                          }
                        </List>
                        {this.state.availability.creat &&
                          <div>
                            <Spacing size={20} separator />
                            <CellButton
                              before={<Icon24AddCircleDottedOutline />}
                              onClick={this.openCreateLinkModal}
                            >
                              Создать ссылку
                            </CellButton>
                          </div>
                        }
                      </Group>
                    </>}
                  </PullToRefresh>

                  {this.state.availability.limit && this.state.count > 0 ?
                    <Footer>
                      Вы можете создать
                      ещё {this.state.availability.limit + " " + this.props.declOfNum(this.state.availability.limit, ["ссылку", "ссылки", "ссылок"])}.
                    </Footer>
                    : ""
                  }
                  {
                    !this.state.availability.creat &&
                    <Footer>
                      Достигнут лимит ссылок переадресации. Оплатите подписку VK Donut или удалите ненужные ссылки,
                      чтобы создать больше.
                    </Footer>
                  }
                </SplitCol>
                {this.state.snackbar}
              </SplitLayout>
            </>}
            {
              !this.state.isEnabled &&
              <Placeholder
                icon={<Icon48Linked width={56} height={56} />}
                action={
                  <Button
                    size="m"
                    onClick={() => {
                      this.props.toggleNeedToOpenSettingsOnClubMount(true);
                      this.props.go("club_info");
                    }}
                  >
                    Перейти в настройки
                  </Button>
                }
              >
                Вам нужно включить Ссылки в Настройках, чтобы использовать этот раздел.
              </Placeholder>
            }
          </>
        }
      </ConfigProvider>
    )
  }
}
