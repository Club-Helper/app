/*******************************************************
 * Авторское право (C) 2021-2023 Cloud Apps
 *
 * Этот файл является частью мини-приложения Club Helper, размещенного
 * в сети Интернет по адресу https://www.vk.com/app7938346
 *
 * Несанкционированное копирование, инженерный анализ, передача,
 * распространение кода приложения запрещены
 *******************************************************/


import React, { Component } from 'react';

import {
  Cell,
  ConfigProvider,
  Group,
  Panel,
  PanelSpinner,
  List,
  PanelHeaderButton,
  ModalRoot,
  ModalPage,
  ModalPageHeader,
  SimpleCell,
  MiniInfoCell,
  SplitLayout,
  SplitCol,
  Placeholder,
  Title,
  FormLayout,
  FormItem,
  Input,
  Button,
  Snackbar,
  Avatar,
  PullToRefresh,
  Footer,
  Textarea,
  IconButton,
  Alert,
  Div,
  ButtonGroup,
  Separator,
  PanelHeader
} from '@vkontakte/vkui';

import {
  Icon28EditOutline,
  Icon20UserOutline,
  Icon24InfoCircleOutline,
  Icon20CalendarOutline,
  Icon24Dismiss,
  Icon28AddOutline,
  Icon16Done,
  Icon16Hashtag,
  Icon24CancelOutline,
  Icon56AdvertisingOutline
} from '@vkontakte/icons';

import bridge from '@vkontakte/vk-bridge';

export default class MailingList extends Component {
  constructor(props) {
    super(props)

    this.state = {
      activeModal: "",
      openedItem: {},
      editMode: false,
      mailing: {},
      list: [],
      formTitle: "",
      formDescription: "",
      formWorking: false,
      formValidation: "",
      mailingText: "",
      snackbar: null,
      listLoading: true,
      listFetching: false,
      availability: [],
      openedItemCreator: {},
      openedItemTime: {},
      openedItemUsers: {},
      sendBtnWorking: false,
      mailingEditMode: false,
      mailingEditTitle: "",
      mailingEditDescription: "",
      mailingEditSaveButtonWorking: false,
      formValidationDescription: "",
      sendMessageValidation: "",
      isEnabled: true,
      mailingEditTitleValidation: "",
      mailingEditDescriptionValidation: "",
    }

    this.getMailing = this.getMailing.bind(this);
    this.updateList = this.updateList.bind(this);
    this.removeItem = this.removeItem.bind(this);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.onFormSubmit = this.onFormSubmit.bind(this);
  }

  getMailing(reloadNeed) {
    reloadNeed && this.setState({ listLoading: true });

    this.props.req("mailings.get", {
      token: this.props.token
    },
      (data) => {
        this.setState({
          mailing: data.response,
          list: data.response.items,
          availability: data.response.availability,
          isEnabled: true
        });
        this.props.setLoading(false);
        if (this.props.tapticEngineSupport) { bridge.send("VKWebAppTapticNotificationOccurred", { "type": "success" }); }
      },
      (error) => {
        this.props.createError(error.error.error_msg);
        this.setState({ isEnabled: false, deleteButtonLoading: false });
        this.props.setLoading(null);
      }
    )

    reloadNeed && this.setState({ listLoading: false });
  }

  updateList({ from, to }, list) {
    const _list = [...list];
    _list.splice(from, 1);
    _list.splice(to, 0, list[from]);
    this.setState({ list: _list });
  }

  remove(idx) {
    this.props.req("mailings.delete", {
      id: idx,
      token: this.props.token
    },
      (data) => {
        this.getMailing(false);
        if (this.props.tapticEngineSupport) { bridge.send("VKWebAppTapticNotificationOccurred", { "type": "success" }); }
        this.setState({ activeModal: "" });
        this.props.toggleShowMobileMenu(true);
      }
    );
  }

  removeItem(idx) {
    this.props.setPopout(<Alert
      actions={[
        {
          title: "Удалить",
          mode: "destructive",
          autoclose: true,
          action: () => this.remove(idx)
        },
        {
          title: "Отмена",
          autoclose: true,
          mode: "cancel"
        }
      ]}
      actionsLayout="horizontal"
      onClose={() => this.props.setPopout(null)}
      header="Подтвердите действие"
      text={`Вы уверены, что хотите удалить рассылку #${idx}? Это действие необратимо.`}
    />);
  }

  openModal(id) {
    this.props.toggleShowMobileMenu(false);
    this.setState({ activeModal: id });
  }

  closeModal() {
    this.props.toggleShowMobileMenu(true);
    this.setState({ activeModal: "" });
  }

  onFormSubmit() {
    if (this.state.formTitle.length < 5) {
      this.setState({ formValidation: "Название рассылки должно содержать не менее 5 символов." });
    } else if (this.state.formTitle.length > 15) {
      this.setState({ formValidation: "Длина названия рассылки не должна превышать 15 символов." });
    } else if (this.state.formTitle.match(/^[ ]+$/)) {
      this.setState({ formValidation: "Название не может состоять только из пробелов" });
    } else {
      this.setState({ formValidation: "" });
    }

    if (this.state.formDescription.length < 10) {
      this.setState({ formValidationDescription: "Описание рассылки должно содержать не менее 10 символов" });
    } else if (this.state.formDescription.length > 15) {
      this.setState({ formValidationDescription: "Длина описания рассылки не должна превышать 15 символов." });
    } else if (this.state.formDescription.match(/^[ ]+$/)) {
      this.setState({ formValidationDescription: "Описание не может состоять только из пробелов" });
    } else {
      this.setState({ formValidationDescription: "" });
    }

    if (!this.state.formTitle || !this.state.formDescription || this.state.formValidation || this.state.formValidationDescription) {
      return false;
    }

    this.setState({ formValidation: "", formWorking: true });

    this.props.req("mailings.creat", {
      title: this.state.formTitle,
      description: this.state.formDescription,
      token: this.props.token
    },
      (data) => {
        this.closeModal();
        this.getMailing(true);
        this.setState({
          formWorking: false,
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
              Рассылка создана
            </Snackbar>
          ),
          formTitle: "",
          formDescription: "",
          formValidationTitle: "",
          formValidationDescription: ""
        });
        if (this.props.tapticEngineSupport) { bridge.send("VKWebAppTapticNotificationOccurred", { "type": "success" }); }
      },
      (error) => {
        this.closeModal();
        this.setState({ formWorking: false });
        this.props.createError(error.error.error_msg);
      }
    )

  }

  getMailingUsers(id) {
    this.props.req("mailings.getUsers", {
      id: id,
      token: this.props.token
    },
      (data) => {
        this.setState({ openedItemUsers: data.response });
      }
    )
  }

  doUnsubscribe(id) {
    this.props.req("mailings.cancellation", {
      id: id,
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
              Пользователь отписан от рассылки.
            </Snackbar>
          )
        });
        if (this.props.tapticEngineSupport) { bridge.send("VKWebAppTapticNotificationOccurred", { "type": "success" }); }
        this.getMailingUsers(this.state.openedItem?.id);
      }
    )
  }

  unsubscribe(id) {
    this.props.setPopout(
      <Alert
        actions={[
          {
            title: "Отписать",
            mode: "destructive",
            autoclose: true,
            action: () => { this.doUnsubscribe(id) }
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
        text="Вы уверены, что хотите отписать пользователя от этой рассылки? Данное действие необратимо."
      />
    )
  }

  sendMailing() {
    this.setState({ sendBtnWorking: true });

    if (!this.state.mailingText) {
      this.setState({ sendMessageValidation: "Поле обязательно для заполнения" });
      this.setState({ sendBtnWorking: false });
    } else if (this.state.mailingText.length < 40) {
      this.setState({ sendMessageValidation: "Текст рассылки должен содержать не менее 40 символов" });
      this.setState({ sendBtnWorking: false });
    } else if (this.state.mailingText.length > 600) {
      this.setState({ sendMessageValidation: "Текст рассылки должен содержать не более 600 символов" });
      this.setState({ sendBtnWorking: false });
    } else if (this.state.mailingText.match(/^[ ]+$/)) {
      this.setState({ sendMessageValidation: "Текст рассылки не может состоять только из пробелов" });
      this.setState({ sendBtnWorking: false });
    } else {
      this.setState({ sendMessageValidation: "" });
    }

    if (!this.state.mailingText || this.state.mailingText.length < 40) {
      return false;
    }

    this.props.req("mailings.send", {
      id: this.state.openedItem.id,
      message: this.state.mailingText,
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
              Рассылка отправлена подписанным пользователям.
            </Snackbar>
          ),
          activeModal: "",
          mailingText: "",
          sendBtnWorking: false
        });
        if (this.props.tapticEngineSupport) { bridge.send("VKWebAppTapticNotificationOccurred", { "type": "success" }); }
      },
      (error) => {
        this.props.createError(error.error.error_msg);
        this.setState({ sendBtnWorking: false });
      }
    );

  }

  toggleEditMode() {
    if (!this.state.mailingEditMode) {
      if (this.state.mailingEditTitle.length < 5) {
        this.setState({ mailingEditTitleValidation: "Название рассылки должно содержать не менее 5 символов." });
      } else if (this.state.mailingEditTitle.length > 15) {
        this.setState({ mailingEditTitleValidation: "Длина названия рассылки не должна превышать 15 символов." });
      } else if (this.state.mailingEditTitle.match(/^[ ]+$/)) {
        this.setState({ mailingEditTitleValidation: "Название не может состоять только из пробелов" });
      } else {
        this.setState({ mailingEditTitleValidation: "" });
      }

      if (this.state.mailingEditDescription.length < 10) {
        this.setState({ mailingEditDescriptionValidation: "Описание рассылки должно содержать не менее 10 символов" });
      } else if (this.state.mailingEditDescription.length > 15) {
        this.setState({ mailingEditDescriptionValidation: "Длина описания рассылки не должна превышать 15 символов." });
      } else if (this.state.mailingEditDescription.match(/^[ ]+$/)) {
        this.setState({ mailingEditDescriptionValidation: "Описание не может состоять только из пробелов" });
      } else {
        this.setState({ mailingEditDescriptionValidation: "" });
      }
    }

    this.setState({ mailingEditMode: !this.state.mailingEditMode });
  }

  save() {
    this.setState({ mailingEditSaveButtonWorking: true });

    this.props.req("mailings.edit", {
      id: this.state.openedItem.id,
      title: this.state.mailingEditTitle,
      description: this.state.mailingEditDescription,
      token: this.props.token
    },
      (data) => {
        this.setState({
          mailingEditTitle: "",
          mailingEditDescription: "",
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
              Изменения сохранены.
            </Snackbar>
          ),
          activeModal: "",
          mailingEditMode: false,
          mailingEditTitleValidation: false,
          mailingEditDescriptionValidation: false
        });
        if (this.props.tapticEngineSupport) { bridge.send("VKWebAppTapticNotificationOccurred", { "type": "success" }); }
        this.getMailing();
        this.props.toggleShowMobileMenu(true);
      }
    );

    this.setState({ mailingEditSaveButtonWorking: false });
  }

  componentDidMount() {
    this.getMailing(true);
    this.props.toggleShowMobileMenu(true);
  }

  render() {
    const modal = (
      <ModalRoot activeModal={this.state.activeModal}>
        <ModalPage
          id="mailingListItem"
          header={
            <ModalPageHeader
              right={this.props.isMobile &&
                <PanelHeaderButton onClick={() => {
                  this.closeModal();
                  if (this.state.mailingEditMode) {
                    this.toggleEditMode();
                    this.setState({
                      mailingEditTitleValidation: false,
                      mailingEditDescriptionValidation: false
                    })
                  }
                }}><Icon24Dismiss /></PanelHeaderButton>
              }
            >
              {this.state.mailingEditMode ?
                <Div style={{ padding: "10%" }}>
                  <FormItem
                    onChange={(e) => {
                      this.setState({ mailingEditTitle: e.target.value })
                      if (e.target.value.length < 5) {
                        this.setState({ mailingEditTitleValidation: "Название рассылки должно содержать не менее 5 символов." });
                      } else if (e.target.value.length > 15) {
                        this.setState({ mailingEditTitleValidation: "Длина названия рассылки не должна превышать 15 символов." });
                      } else if (e.target.value.match(/^[ ]+$/)) {
                        this.setState({ mailingEditTitleValidation: "Название не может состоять только из пробелов" });
                      } else {
                        this.setState({ mailingEditTitleValidation: "" });
                      }
                    }}
                    status={this.state.mailingEditTitleValidation ? "error" : "default"}
                  >
                    <Input
                      type={"text"}
                      value={this.state.mailingEditTitle}
                    />
                  </FormItem>
                </Div>
                :
                this.state.openedItem.title
              }
            </ModalPageHeader>
          }
          onClose={() => {
            this.closeModal();
            if (this.state.mailingEditMode) {
              this.toggleEditMode();
              this.toggleEditMode();
              this.setState({
                mailingEditTitleValidation: false,
                mailingEditDescriptionValidation: false,
                mailingEditTitle: "",
                mailingEditDescription: ""
              })
            }
          }}
          settlingHeight={100}
        >
          <Group>
            {this.state.mailingEditTitleValidation &&
              <center>
                <Div>
                  {this.state.mailingEditTitleValidation}
                </Div>
                <Separator />
              </center>
            }
            <MiniInfoCell before={<Icon16Hashtag width={20} height={20} />}>{this.state.openedItem.id}</MiniInfoCell>
            <MiniInfoCell before={<Icon20CalendarOutline />}>{this.state.openedItemTime.label}</MiniInfoCell>
            <MiniInfoCell before={<Icon20UserOutline />}>Автор: {this.state.openedItemCreator.first_name} {this.state.openedItemCreator.last_name}</MiniInfoCell>
            {this.state.openedItem.description ?
              this.state.mailingEditMode ?
                <FormItem
                  top={"Описание"}
                  onChange={(e) => {
                    this.setState({ mailingEditDescription: e.target.value })
                    if (e.target.value.length < 10) {
                      this.setState({ mailingEditDescriptionValidation: "Описание рассылки должно содержать не менее 10 символов" });
                    } else if (e.target.value.length > 15) {
                      this.setState({ mailingEditDescriptionValidation: "Длина описания рассылки не должна превышать 15 символов." });
                    } else if (e.target.value.match(/^[ ]+$/)) {
                      this.setState({ mailingEditDescriptionValidation: "Описание не может состоять только из пробелов" });
                    } else {
                      this.setState({ mailingEditDescriptionValidation: "" });
                    }
                  }}
                  status={this.state.mailingEditDescriptionValidation ? "error" : "default"}
                  bottom={this.state.mailingEditDescriptionValidation}
                >
                  <Textarea value={this.state.mailingEditDescription} />
                </FormItem>
                :
                <Div>
                  {this.state.openedItem?.description}
                </Div>
              :
              this.state.mailingEditMode &&
              <FormItem
                top={"Описание"}
                onChange={(e) => {
                  this.setState({ mailingEditDescription: e.target.value })
                  if (e.target.value.length < 10) {
                    this.setState({ mailingEditDescriptionValidation: "Описание рассылки должно содержать не менее 10 символов" });
                  } else if (e.target.value.length > 15) {
                    this.setState({ mailingEditDescriptionValidation: "Длина описания рассылки не должна превышать 15 символов." });
                  } else if (e.target.value.match(/^[ ]+$/)) {
                    this.setState({ mailingEditDescriptionValidation: "Описание не может состоять только из пробелов" });
                  } else {
                    this.setState({ mailingEditDescriptionValidation: "" });
                  }
                }}
                status={this.state.mailingEditDescriptionValidation ? "error" : "default"}
                bottom={this.state.mailingEditDescriptionValidation}
              >
                <Textarea value={this.state.mailingEditDescription} />
              </FormItem>
            }
            <Div>
              {!this.state.mailingEditMode ?
                <ButtonGroup stretched>
                  <Button
                    onClick={() => this.toggleEditMode()}
                    mode={"secondary"}
                    stretched
                  >
                    Редактировать
                  </Button>
                  <Button
                    onClick={() => this.removeItem(this.state.openedItem.id)}
                    mode={"destructive"}
                    stretched
                  >
                    Удалить
                  </Button>
                </ButtonGroup>
                :
                <ButtonGroup
                  stretched
                >
                  <Button
                    onClick={() => {
                      this.toggleEditMode()
                      this.setState({
                        mailingEditTitleValidation: false,
                        mailingEditDescriptionValidation: false
                      })
                    }}
                    mode={"secondary"}
                    stretched
                  >
                    Отменить
                  </Button>
                  <Button
                    onClick={() => this.save()}
                    mode={"commerce"}
                    stretched
                    disabled={
                      this.state.mailingEditSaveButtonWorking
                      || (this.state.mailingEditTitleValidation || this.state.mailingEditDescriptionValidation)
                      || !this.state.mailingEditDescription
                      || !this.state.mailingEditTitle
                    }
                    loading={this.state.mailingEditSaveButtonWorking}
                  >
                    Сохранить
                  </Button>
                  <Button
                    onClick={() => this.removeItem(this.state.openedItem.id)}
                    mode={"destructive"}
                    stretched
                  >
                    Удалить
                  </Button>
                </ButtonGroup>
              }
            </Div>
          </Group>
          <Group header={<Title level='3' style={{ marginLeft: "15px", marginTop: "15px" }}>Отправить рассылку</Title>}>
            {this.state.openedItem?.availability?.send ?
              <FormLayout>
                <FormItem
                  value={this.state.mailingText}
                  onChange={(e) => {
                    this.setState({ mailingText: e.target.value })
                    if (!e.target.value) {
                      this.setState({ sendMessageValidation: "Поле обязательно для заполнения" });
                      this.setState({ sendBtnWorking: false });
                    } else if (e.target.value.length < 40) {
                      this.setState({ sendMessageValidation: "Текст рассылки должен содержать не менее 40 символов" });
                      this.setState({ sendBtnWorking: false });
                    } else if (e.target.value.length > 600) {
                      this.setState({ sendMessageValidation: "Текст рассылки должен содержать не более 600 символов" });
                      this.setState({ sendBtnWorking: false });
                    } else if (e.target.value.match(/^[ ]+$/)) {
                      this.setState({ sendMessageValidation: "Текст рассылки не может состоять только из пробелов" });
                      this.setState({ sendBtnWorking: false });
                    } else {
                      this.setState({ sendMessageValidation: "" });
                    }
                  }}
                  bottom={this.state.sendMessageValidation}
                  status={this.state.sendMessageValidation ? "error" : "default"}
                >
                  <Textarea placeholder="Введите текст" rows="4" />
                </FormItem>
                <FormItem>
                  <Button
                    stretched
                    size="l"
                    onClick={() => this.sendMailing()}
                    disabled={this.state.sendBtnWorking}
                    loading={this.state.sendBtnWorking}
                    style={{ backgroundColor: this.props.color }}
                  >Отправить</Button>
                </FormItem>
              </FormLayout>
              :
              <Placeholder>
                Возможность отправки рассылки отключена Командой Club Helper.
              </Placeholder>
            }
          </Group>
          <Group header={<Title level='3' style={{ marginLeft: "15px", marginTop: "15px" }}>Подписанные пользователи</Title>}>
            {this.state.openedItemUsers?.count > 0 ?
              this.state.openedItemUsers?.items.map(user => (
                <SimpleCell
                  disabled
                  key={user.id}
                  before={<Avatar src={user.photo_200} />}
                  description={user.status}
                  after={
                    <IconButton
                      onClick={() => this.unsubscribe(user.subscriptions_id)}
                    >
                      <Icon24CancelOutline fill={this.props.color} />
                    </IconButton>
                  }
                >
                  {`${user.first_name} ${user.last_name}`}
                </SimpleCell>
              )
              )
              : <Placeholder>
                Ни один пользователь не подписан на эту рассылку.
              </Placeholder>}
          </Group>
        </ModalPage>
        <ModalPage
          id="createMailing"
          header={<ModalPageHeader right={this.props.isMobile && <PanelHeaderButton onClick={this.closeModal}><Icon24Dismiss /></PanelHeaderButton>}>Создать рассылку</ModalPageHeader>}
          onClose={this.closeModal}
          settlingHeight={100}
        >
          <Group>
            <FormLayout>
              <FormItem
                top="Название рассылки"
                value={this.state.formTitle}
                onChange={(e) => {
                  this.setState({ formTitle: e.target.value })
                  if (e.target.value.length < 5) {
                    this.setState({ formValidation: "Название рассылки должно содержать не менее 5 символов." });
                  } else if (e.target.value.length > 15) {
                    this.setState({ formValidation: "Длина названия рассылки не должна превышать 15 символов." });
                  } else if (e.target.value.match(/^[ ]+$/)) {
                    this.setState({ formValidation: "Название не может состоять только из пробелов" });
                  } else {
                    this.setState({ formValidation: "" });
                  }
                }}
                status={this.state.formValidation ? "error" : "default"}
                bottom={this.state.formValidation}
              >
                <Textarea placeholder='Видят пользователи при получении приглашения' type="text" required minLength={10} maxLength={50} />
              </FormItem>
              <FormItem
                top={"Описание рассылки"}
                value={this.state.formDescription}
                onChange={(e) => {
                  this.setState({ formDescription: e.target.value })
                  if (e.target.value.length < 10) {
                    this.setState({ formValidationDescription: "Описание рассылки должно содержать не менее 10 символов" });
                  } else if (e.target.value.length > 15) {
                    this.setState({ formValidationDescription: "Длина описания рассылки не должна превышать 15 символов." });
                  } else if (e.target.value.match(/^[ ]+$/)) {
                    this.setState({ formValidationDescription: "Описание не может состоять только из пробелов" });
                  } else {
                    this.setState({ formValidationDescription: "" });
                  }
                }}
                required={false}
                status={this.state.formValidationDescription ? "error" : "default"}
                bottom={this.state.formValidationDescription}
              >
                <Textarea placeholder='Его тоже видят пользователи' />
              </FormItem>
              <FormItem>
                <Button
                  stretched
                  size="l"
                  onClick={this.onFormSubmit}
                  disabled={this.state.formWorking || this.state.formValidation || this.state.formValidationDescription}
                  loading={this.state.formWorking}
                  style={{ backgroundColor: this.props.color }}
                >
                  Создать
                </Button>
              </FormItem>
            </FormLayout>
          </Group>
        </ModalPage>
      </ModalRoot>
    );

    return (
      <ConfigProvider platform={this.props.platform.current} appearance={this.props.appearance}>
        <SplitLayout modal={modal}>
          <SplitCol>
            {this.props.isLoading ? <Group><PanelSpinner /></Group> :
              this.state.isEnabled ?
                <Panel>
                  <PanelHeader left={
                    <React.Fragment>
                      {this.state.list.length > 0 && <PanelHeaderButton onClick={() => {
                        this.setState({ editMode: !this.state.editMode })
                      }
                      }>
                        <Icon28EditOutline fill={this.state.editMode ? this.props.color : ""} />
                      </PanelHeaderButton>}
                      {this.state.availability.creat && <PanelHeaderButton onClick={() => this.openModal("createMailing")}>
                        <Icon28AddOutline />
                      </PanelHeaderButton>}
                    </React.Fragment>
                  }>Рассылки</PanelHeader>
                  <Group>
                    <List>
                      <PullToRefresh
                        isFetching={this.state.listFetching}
                        onRefresh={() => this.getMailing(true)}
                      >
                        {
                          this.state.listLoading ? <Group><PanelSpinner /></Group> :
                            this.state.list.length != 0 ?
                              this.state.list.map((item, idx) => (
                                <Cell
                                  key={idx}
                                  disabled
                                  multiline
                                  description={"#" + item.id}
                                  {...this.state.editMode && { "mode": "removable" }}
                                  onDragFinish={({ from, to }) =>
                                    this.updateList({ from, to }, this.state.list)
                                  }
                                  className="clubHelper--Cell"
                                  hasHover={false}
                                  hasActive={false}
                                  onRemove={() => this.removeItem(item.id)}
                                  after={
                                    <IconButton
                                      onClick={() => {
                                        this.getMailingUsers(this.state.list[idx].id);
                                        this.setState(
                                          {
                                            openedItem: this.state.list[idx],
                                            openedItemCreator: this.state.list[idx].creator,
                                            openedItemTime: this.state.list[idx].time,
                                            mailingEditTitle: this.state.list[idx].title,
                                            mailingEditDescription: this.state.list[idx]?.description
                                          }); this.openModal("mailingListItem")
                                      }}
                                    >
                                      <Icon24InfoCircleOutline fill={this.props.color} />
                                    </IconButton>}
                                >
                                  {item.title}
                                </Cell>
                              )) :
                              <Placeholder>
                                Здесь пока ничего нет...
                              </Placeholder>}
                      </PullToRefresh>
                    </List>
                    {(this.state.availability.limit && this.state.list.length != 0) &&
                      <Footer>
                        Вы можете создать ещё {this.state.availability.limit + " " + this.props.declOfNum(this.state.availability.limit, ["рассылку", "рассылки", "рассылок"])}.
                      </Footer>
                    }
                    {!this.state.availability.creat &&
                      <Footer>
                        Достигнут лимит рассылок. {this.props.canViewDonut ? "Оплатите подписку VK Donut или удалите" : "Удалите"} ненужные рассылки, чтобы создать больше.
                      </Footer>
                    }
                  </Group>
                  {this.state.snackbar}
                </Panel>
                : <Panel>
                  <Group>
                    <Placeholder
                      icon={<Icon56AdvertisingOutline />}
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
                      Вам нужно включить Рассылки в Настройках, чтобы использовать этот раздел.
                    </Placeholder>
                  </Group>
                </Panel>
            }
          </SplitCol>
        </SplitLayout>
      </ConfigProvider>
    )
  }
}

