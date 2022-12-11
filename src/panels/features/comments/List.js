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
  Avatar,
  Button,
  Cell,
  ConfigProvider,
  FormItem,
  FormLayout,
  Input,
  List,
  ModalPage,
  ModalPageHeader,
  ModalRoot,
  PanelHeaderButton,
  PanelSpinner,
  Placeholder,
  PullToRefresh,
  Snackbar,
  SplitCol,
  SplitLayout,
  Textarea,
  Group,
  Title,
  Div,
  MiniInfoCell,
  Link,
  Alert,
  Footer,
  CellButton,
  Spacing,
  SegmentedControl,
  IconButton
} from '@vkontakte/vkui';
import { Icon16Done, Icon24Dismiss, Icon28CommentOutline, Icon28InfoCircleOutline, Icon56CommentsOutline, Icon16Hashtag, Icon20UserOutline, Icon20CalendarOutline, Icon24AddCircleDottedOutline, Icon20MentionOutline } from '@vkontakte/icons';
import bridge from '@vkontakte/vk-bridge';

export default class CommentsList extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isEnabled: true,
      listLoading: true,
      isFetching: false,
      comments: [],
      availability: [],
      count: null,
      activeModal: "",
      newCommentTitle: "",
      newCommentCommand: "/",
      newCommentPattern: "",
      newCommentButtonWorking: false,
      snackbar: null,
      openedComment: [],
      filter: "all",
      titleValidation: "",
      commandValidation: "",
      patternValidation: "",
      deleteCommentButtonWorking: false,
      filterDisabled: false
    }
  }

  getComments(filter) {
    this.setState({ filterDisabled: true });

    this.setState({ listLoading: true });

    this.props.req("comments.get", {
      token: this.props.token,
      filter: filter
    },
      (data) => {
        this.setState({ comments: data.response.items, count: data.response.count, availability: data.response.availability, isEnabled: true, listLoading: false })
        bridge.send("VKWebAppTapticNotificationOccurred", { "type": "success" });
      },
      (error) => {
        this.setState({ isEnabled: false, listLoading: false });
        this.props.createError(error.error.error_msg);
        bridge.send("VKWebAppTapticNotificationOccurred", { "type": "error" });
      })

    this.getCommentsTimeout = setTimeout(() => {
      this.setState({ filterDisabled: false });
      clearTimeout(this.getCommentsTimeout);
    }, 500);
  }

  onRefresh() {
    this.setState({ listLoading: true });
    this.getComments(this.state.filter);
  }

  getCommentById(id) {
    this.setState({ openedComment: this.state.comments[id], activeModal: "comment-info" })
    bridge.send("VKWebAppTapticNotificationOccurred", { "type": "success" });
  }

  createComment() {
    this.setState({ newCommentButtonWorking: true });

    if (!this.state.newCommentTitle || this.state.newCommentTitle == '') {
      this.setState({ titleValidation: "Поле обязательно для заполнения" });
    } else if (this.state.newCommentTitle.length > 50) {
      this.setState({ titleValidation: "Длина не должна превышать 50 символов" });
    } else if (/^\s+$/.test(this.state.newCommentTitle)) {
      this.setState({ titleValidation: "Неверный формат" });
    } else if (/^[^\s]+(\s+[^\s]+)*$/.test(this.state.newCommentTitle) === false) {
      this.setState({ titleValidation: "Неверный формат" });
    } else {
      this.setState({ titleValidation: "" });
    }

    if (!this.state.newCommentCommand || this.state.newCommentCommand == '') {
      this.setState({ commandValidation: "Поле обязательно для заполнения" });
    } else if (!/^[!|\/].*/.test(this.state.newCommentCommand)) {
      this.setState({ commandValidation: "Команда должна начинаться с ! или /" });
    } else if (/^[^\s]+(\s+[^\s]+)*$/.test(this.state.newCommentCommand) === false) {
      this.setState({ commandValidation: "Неверный формат" });
    } else {
      this.setState({ commandValidation: "" });
    }

    if (!this.state.newCommentPattern || this.state.newCommentPattern == '') {
      this.setState({ patternValidation: "Поле обязательно для заполнения" });
    } else if (this.state.newCommentPattern.length < 10) {
      this.setState({ patternValidation: "Длина текста должна быть не менее 10 символов" });
    } else if (/^\s+$/.test(this.state.newCommentPattern)) {
      this.setState({ patternValidation: "Текст не может состоять только из пробелов" });
    } else if (/^[^\s]+(\s+[^\s]+)*$/.test(this.state.newCommentPattern) === false) {
      this.setState({ patternValidation: "Неверный формат" });
    } else {
      this.setState({ patternValidation: "" });
    }

    if (!this.state.newCommentTitle || !this.state.newCommentCommand || !this.state.newCommentPattern || this.state.titleValidation || this.state.commandValidation || this.state.patternValidation) {
      this.setState({ newCommentButtonWorking: false });
      return false;
    }

    this.props.req("comments.creat", {
      token: this.props.token,
      title: this.state.newCommentTitle,
      comand: this.state.newCommentCommand,
      pattern: this.state.newCommentPattern
    },
      (data) => {
        this.closeModal();
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
              Шаблон создан успешно
            </Snackbar>
          ),
          newCommentButtonWorking: false,
          newCommentTitle: "",
          newCommentCommand: "/",
          newCommentPattern: ""
        });
        this.getComments(this.state.filter);
        bridge.send("VKWebAppTapticNotificationOccurred", { "type": "success" });
      },
      (error) => {
        this.props.createError(error.error.error_msg);
        this.setState({ newCommentButtonWorking: false });
      }
    )
  }

  deleteComment() {
    this.props.req("comments.delete", {
      token: this.props.token,
      id: this.state.openedComment.id
    },
      (data) => {
        this.closeModal();
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
              Шаблон удалён успешно
            </Snackbar>
          )
        });
        bridge.send("VKWebAppTapticNotificationOccurred", { "type": "success" });
        this.getComments(this.state.filter);
        this.setState({ deleteCommentButtonWorking: false });
        this.props.setPopout(null);
      }
    );
  }

  delete() {
    this.setState({ deleteCommentButtonWorking: true });
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
            autoclose: false,
            action: () => { this.deleteComment() }
          }
        ]}
        onClose={() => {
          this.props.setPopout(null)
          this.setState({ deleteCommentButtonWorking: false });
        }}
        actionsLayout="vertical"
        header="Подтвердите действие"
        text="Вы уверены, что хотите удалить этот шаблон? Данное действие необратимо."
      />
    );
  }

  closeModal() { this.setState({ activeModal: "" }); }

  componentDidMount() {
    this.props.setLoading(false);
    this.interval = setInterval(() => this.getComments(this.state.filter), 60000);

    this.getComments(this.state.filter);
  }

  onFilterChange(value) {
    this.setState({ filter: value });
    this.getComments(value);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
    clearTimeout(this.getCommentsTimeout);
  }

  render() {
    const modal = (
      <ModalRoot
        activeModal={this.state.activeModal}
      >
        <ModalPage
          id="create-comment"
          header={<ModalPageHeader right={this.props.isMobile && <PanelHeaderButton onClick={() => this.closeModal()}><Icon24Dismiss /></PanelHeaderButton>}>Создать комментарий</ModalPageHeader>}
          onClose={() => this.closeModal()}
          settlingHeight={100}
        >
          <FormLayout>
            <FormItem
              top="Название шаблона"
              bottom={this.state.titleValidation}
              status={!this.state.titleValidation ? "" : "error"}
            >
              <Input
                type="text"
                name="title"
                placeholder="Название шаблона"
                value={this.state.newCommentTitle}
                onChange={(e) => {
                  this.setState({ newCommentTitle: e.target.value })
                  if (!e.target.value || e.target.value == '') {
                    this.setState({ titleValidation: "Поле обязательно для заполнения" });
                  } else if (e.target.value.length > 50) {
                    this.setState({ titleValidation: "Длина не должна превышать 50 символов" });
                  } else if (/^\s+$/.test(e.target.value)) {
                    this.setState({ titleValidation: "Неверный формат" });
                  } else if (/^[^\s]+(\s+[^\s]+)*$/.test(e.target.value) === false) {
                    this.setState({ titleValidation: "Неверный формат" });
                  } else {
                    this.setState({ titleValidation: "" });
                  }
                }}
                disabled={this.state.newCommentButtonWorking}
              />
            </FormItem>
            <FormItem
              top="Команда"
              bottom={this.state.commandValidation}
              status={!this.state.commandValidation ? "" : "error"}
            >
              <Input
                type="text"
                name="title"
                placeholder="Команда для отправки шаблона"
                value={this.state.newCommentCommand}
                onChange={(e) => {
                  this.setState({ newCommentCommand: e.target.value })
                  if (!e.target.value || e.target.value == '') {
                    this.setState({ commandValidation: "Поле обязательно для заполнения" });
                  } else if (!/^[!|\/].*/.test(e.target.value)) {
                    this.setState({ commandValidation: "Команда должна начинаться с ! или /" });
                  } else if (/^[^\s]+(\s+[^\s]+)*$/.test(e.target.value) === false) {
                    this.setState({ commandValidation: "Неверный формат" });
                  } else {
                    this.setState({ commandValidation: "" });
                  }
                }}
                disabled={this.state.newCommentButtonWorking}
              />
            </FormItem>
            <FormItem
              top="Текст"
              bottom={this.state.patternValidation}
              status={!this.state.patternValidation ? "" : "error"}
            >
              <Textarea
                placeholder={"{greetings}, {user_name}!\n\nСообщение, которое получит пользователь в комментариях при использовании команды."}
                value={this.state.newCommentPattern}
                onChange={(e) => {
                  this.setState({ newCommentPattern: e.target.value })
                  if (!e.target.value || e.target.value == '') {
                    this.setState({ patternValidation: "Поле обязательно для заполнения" });
                  } else if (e.target.value.length < 10) {
                    this.setState({ patternValidation: "Длина текста должна быть не менее 10 символов" });
                  } else if (/^\s+$/.test(e.target.value)) {
                    this.setState({ patternValidation: "Текст не может состоять только из пробелов" });
                  } else if (/^[^\s]+(\s+[^\s]+)*$/.test(e.target.value) === false) {
                    this.setState({ patternValidation: "Неверный формат" });
                  } else {
                    this.setState({ patternValidation: "" });
                  }
                }}
                disabled={this.state.newCommentButtonWorking}
              />
            </FormItem>
            <FormItem>
              <Button
                size="m"
                stretched
                onClick={() => this.createComment()}
                loading={this.state.newCommentButtonWorking}
                disabled={this.state.newCommentButtonWorking || this.state.titleValidation || this.state.commandValidation || this.state.patternValidation}
              >
                Создать шаблон
              </Button>
            </FormItem>
          </FormLayout>
        </ModalPage>

        <ModalPage
          id="comment-info"
          header={<ModalPageHeader right={this.props.isMobile && <PanelHeaderButton aria-label="Скрыть информацию" onClick={() => this.closeModal()}><Icon24Dismiss /></PanelHeaderButton>}>{this.state.openedComment.title}</ModalPageHeader>}
          onClose={() => this.closeModal()}
          settlingHeight={100}
        >
          <Group header={<Title level='3' style={{ marginLeft: "15px", marginTop: "15px" }}>Текст шаблона</Title>}>
            <Div disabled style={{ whiteSpace: "pre-wrap" }}>
              {this.state.openedComment.pattern}
            </Div>
          </Group>

          <Group>
            <MiniInfoCell before={<Icon16Hashtag width={20} height={20} />}>
              {this.state.openedComment?.id}
            </MiniInfoCell>
            <MiniInfoCell before={<Icon20MentionOutline />}>
              {this.state.openedComment?.comand}
            </MiniInfoCell>
            <MiniInfoCell before={<Icon20UserOutline />}>
              <Link href={"https://vk.com/id" + this.state.openedComment?.creat?.user?.id} target="_blank">{this.state.openedComment?.creat?.user?.first_name} {this.state.openedComment?.creat?.user?.last_name}</Link>
            </MiniInfoCell>
            <MiniInfoCell before={<Icon20CalendarOutline />}>
              {this.state.openedComment?.creat?.time?.label}
            </MiniInfoCell>
          </Group>

          <Div style={{ width: "93%", marginTop: "10px" }}>
            <Button
              size="m"
              mode="destructive"
              stretched
              onClick={() => this.delete(this.state.openedComment?.id)}
              loading={this.state.deleteCommentButtonWorking}
              disabled={this.state.deleteCommentButtonWorking}
            >
              Удалить
            </Button>
          </Div>
        </ModalPage>
      </ModalRoot>
    );

    return (
      <ConfigProvider platform={this.props.platform.current} appearance={this.props.appearance}>
        <SplitLayout modal={modal}>
          {this.props.isLoading ? <PanelSpinner /> :
            <>
              {this.state.isEnabled &&
                <SplitCol>
                    <PullToRefresh isFetching={this.state.isFetching} onRefresh={() => this.onRefresh}>
                      <Cell
                          disabled
                          before={<Title level='3' style={{
                            marginLeft: "15px",
                            marginTop: "15px",
                            marginBottom: "0px"
                          }}>Комментарии <span style={{
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
                        {this.state.listLoading ? <PanelSpinner /> :
                          <List>
                            {this.state.comments.length > 0 ?
                              <>
                                {this.state.comments.map((comment, idx) => (
                                  <Cell
                                    className="clubHelper--Cell"
                                    hasHover={false}
                                    hasActive={false}
                                    key={idx}
                                    description={comment.comand}
                                    before={<Icon28CommentOutline />}
                                    after={<IconButton onClick={() => this.getCommentById(idx)}><Icon28InfoCircleOutline/></IconButton>}
                                    onClick={() => this.getCommentById(idx)}
                                  >
                                    {comment.title}
                                  </Cell>
                                ))}
                                {this.state.availability.limit ?
                                  <Footer>
                                    Вы можете создать ещё {this.state.availability.limit + " " + this.props.declOfNum(this.state.availability.limit, ["комментарий", "комментария", "комментариев"])}
                                  </Footer>
                                  : ""}
                                {!this.state.availability.creat &&
                                  <Footer>
                                    Достигнут лимит шаблонов комментариев. Оплатите подписку VK Donut или удалите ненужные шаблоны, чтобы создать больше.
                                  </Footer>
                                }
                                {this.state.availability.creat &&
                                  <div>
                                    <Spacing size={20} separator />
                                    <CellButton
                                      before={<Icon24AddCircleDottedOutline />}
                                      onClick={() => this.setState({ activeModal: "create-comment" })}
                                    >
                                      Создать шаблон
                                    </CellButton>
                                  </div>
                                }
                              </>
                              :
                              <Placeholder
                                action={<Button onClick={() => this.setState({ activeModal: "create-comment" })}>Создать комментарий</Button>}
                              >
                                Не найдено ни одного шаблона комментария.
                              </Placeholder>
                            }
                          </List>
                        }
                    </PullToRefresh>
                </SplitCol>
              }
              {!this.state.isEnabled &&
                <Placeholder
                  icon={<Icon56CommentsOutline />}
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
                  Вам нужно включить Комментарии в Настройках, чтобы использовать этот раздел.
                </Placeholder>
              }
            </>
          }
          {this.state.snackbar}
        </SplitLayout>
      </ConfigProvider>
    )
  }
}
