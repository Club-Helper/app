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
import { Avatar, Button, Cell, ConfigProvider, FormItem, FormLayout, Input, List, ModalPage, ModalPageHeader, ModalRoot, PanelHeaderButton, PanelSpinner, Placeholder, PullToRefresh, Snackbar, SplitCol, SplitLayout, Textarea, Group, Title, Div, MiniInfoCell, Link, Alert, Footer, CellButton, Spacing, SegmentedControl } from '@vkontakte/vkui';
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
      newCommentCommand: "",
      newCommentPattern: "",
      newCommentButtonWorking: false,
      snackbar: null,
      openedComment: [],
      filter: "all",
      titleValidation: "",
      commandValidation: "",
      patternValidation: ""
    }
  }

  getComments(filter) {
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
    if (!this.state.newCommentTitle || this.state.newCommentTitle == '') {
      this.setState({ titleValidation: "Поле обязательно для заполнения" });
      return false;
    } else {
      this.setState({ titleValidation: "" });
    }
    if (this.state.newCommentTitle > 50) {
      this.setState({ titleValidation: "Длина не должна превышать 50 символов" });
      return false;
    } else {
      this.setState({ titleValidation: "" });
    }
    if (/^\s+$/.test(this.state.newCommentTitle)) {
      this.setState({ titleValidation: "Неверный формат" });
      return false;
    } else {
      this.setState({ titleValidation: "" });
    }
    if (/^[^\s]+(\s+[^\s]+)*$/.test(this.state.newCommentTitle) === false) {
      this.setState({ titleValidation: "Неверный формат" });
      return false;
    } else {
      this.setState({ titleValidation: "" });
    }

    if (!this.state.newCommentCommand || this.state.newCommentCommand == '') {
      this.setState({ commandValidation: "Поле обязательно для заполнения" });
      return false;
    } else {
      this.setState({ commandValidation: "" });
    }
    if (!/^[!|\/].*/.test(this.state.newCommentCommand)) {
      this.setState({ commandValidation: "Команда должна начинаться с ! или /" });
      return false;
    } else {
      this.setState({ commandValidation: "" });
    }
    if (/^[^\s]+(\s+[^\s]+)*$/.test(this.state.newCommentCommand) === false) {
      this.setState({ commandValidation: "Неверный формат" });
      return false;
    } else {
      this.setState({ commandValidation: "" });
    }

    if (!this.state.newCommentPattern || this.state.newCommentPattern == '') {
      this.setState({ patternValidation: "Поле обязательно для заполнения" });
      return false;
    } else {
      this.setState({ patternValidation: "" });
    }
    if (this.state.newCommentPattern.length < 10) {
      this.setState({ patternValidation: "Длина текста должна быть не менее 10 символов" });
      return false;
    } else {
      this.setState({ patternValidation: "" });
    }
    if (/^\s+$/.test(this.state.newCommentPattern)) {
      this.setState({ patternValidation: "Текст не может состоять только из пробелов" });
      return false;
    } else {
      this.setState({ patternValidation: "" });
    }
    if (/^[^\s]+(\s+[^\s]+)*$/.test(this.state.newCommentPattern) === false) {
      this.setState({ patternValidation: "Неверный формат" });
      return false;
    } else {
      this.setState({ patternValidation: "" });
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
          )
        });
        this.getComments(this.state.filter);
        bridge.send("VKWebAppTapticNotificationOccurred", { "type": "success" });
    })
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
      }
    );
  }

  delete() {
    this.props.setPopout(
      <Alert
        actions={[
          {
            title: "Удалить",
            mode: "destructive",
            autoclose: true,
            action: () => { this.deleteComment() }
          },
          {
            title: "Отмена",
            autoclose: true,
            mode: "cancel",
          },
        ]}
        onClose={() => this.props.setPopout(null)}
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
                onChange={(e) => this.setState({ newCommentTitle: e.target.value })}
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
                onChange={(e) => this.setState({ newCommentCommand: e.target.value })}
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
                onChange={(e) => this.setState({ newCommentPattern: e.target.value })}
                disabled={this.state.newCommentButtonWorking}
              />
            </FormItem>
            <FormItem>
              <Button
                size="m"
                stretched
                onClick={() => this.createComment()}
                loading={this.state.newCommentButtonWorking}
                disabled={this.state.newCommentButtonWorking}
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
              <Link href={"https://vk.com/id" + this.state.openedComment?.creat?.user} target="_blank">{this.state.openedComment?.creat?.user?.first_name} {this.state.openedComment?.creat?.user?.last_name}</Link>
            </MiniInfoCell>
            <MiniInfoCell before={<Icon20CalendarOutline />}>
              {this.state.openedComment?.creat?.time?.label}
            </MiniInfoCell>
          </Group>

          <Div style={{ width: "93%", marginTop: "10px" }}>
            <Button size="m" mode="destructive" stretched onClick={() => this.delete(this.state.openedComment?.id)} loading={this.state?.deleteButtonLoading}>
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
                  {this.state.listLoading ? <PanelSpinner /> :
                    <PullToRefresh isFetching={this.state.isFetching} onRefresh={() => this.onRefresh}>
                      {this.state.comments.length > 0 ?
                        <Div style={{ maxWidth: 300 }}>
                          <SegmentedControl
                            size="m"
                            name="filter"
                            options={[
                              {
                                label: "Все",
                                value: "all"
                              },
                              {
                                label: "Мои",
                                value: "my"
                              }
                            ]}
                            style={{ height: "35px", padding: "5px" }}
                            onChange={(value) => this.onFilterChange(value)}
                            value={this.state.filter}
                          />
                        </Div> : ""}
                      <List>
                        {this.state.comments.length > 0 ?
                          <>
                            {this.state.comments.map((comment, idx) => (
                              <Cell
                                key={idx}
                                description={comment.comand}
                                before={<Icon28CommentOutline />}
                                after={<Icon28InfoCircleOutline onClick={() => this.getCommentById(idx)} />}
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
                            В этом сообществе ещё нет ни одного шаблона комментария.
                          </Placeholder>
                        }
                      </List>
                    </PullToRefresh>

                  }
                </SplitCol>
              }
              {!this.state.isEnabled &&
                <Placeholder
                  icon={<Icon56CommentsOutline />}
                  action={<Button size="m" onClick={() => this.props.go("settings")}>Перейти в настройки</Button>}
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
