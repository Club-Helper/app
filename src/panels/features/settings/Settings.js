/*******************************************************
 * Авторское право (C) 2021-2022 Club Helper
 *
 * Этот файл является частью мини-приложения Club Helper, размещенного
 * в сети Интернет по адресу https://www.vk.com/app7938346
 *
 * Несанкционированное копирование, инженерный анализ, передача,
 * распространение кода приложения запрещены
 *******************************************************/

import { Group, SplitLayout, SplitCol, SimpleCell, Avatar, ButtonGroup, Button, ModalRoot, ModalPage, Div, ModalPageHeader, PanelHeaderButton, Cell, Separator, Header, Link, Switch, Banner, PanelSpinner, Spacing, FormItem, Textarea } from '@vkontakte/vkui'
import React, { Component } from 'react'
import { Icon24Linked, Icon28CommentOutline, Icon24Dismiss, Icon28ChatsOutline, Icon28DonateOutline, Icon28PaletteOutline } from '@vkontakte/icons';
import '../../../css/settings.css';
import bridge from '@vkontakte/vk-bridge';

export default class Settings extends Component {
  constructor(props) {
    super(props)

    this.state = {
      activeModal: null,
      error: {
        title: null,
        text: null,
        autofix: null,
        button: null
      },
      faqInfo: {
        title: null,
        text: null
      },
      features: {
        messages: {
          status: true,
          blocked: true
        },
        links: {
          status: true,
          blocked: true
        },
        comments: {
          status: true,
          blocked: true
        }
      },
      helloText: "",
      answerTime: 0,
      isLoading: true,
      changes: [],
      saveButtonDisabled: true,
      saveButtonLoading: false
    };

    this.openFAQModal = this.openFAQModal.bind(this);
    this.closeFAQModal = this.closeFAQModal.bind(this);
    this.handleCheckboxChanged = this.handleCheckboxChanged.bind(this);
    this.handleSaveButton = this.handleSaveButton.bind(this);
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

  closeFAQModal() {
    this.setState({
      activeModal: null,
    });
  }

  handleCheckboxChanged(e) {
    this.setState({ saveButtonDisabled: false });
    e.target.name !== "donut" ? this.state.changes[e.target.name] = e.target.checked ? "1" : "0" : this.state.changes[e.target.name] = e.target.checked ? "2" : "0";
  }

  handleHelloTextChanged(e)
  {
    this.setState({ saveButtonDisabled: false });
    this.state.changes["hello_text"] = e.target.value;
    this.setState({ helloText: e.target.value });
  }

  qParams(i, s) {
    const searchParams = new URLSearchParams(s);
    let obj = i;

    for (const [key, value] of searchParams.entries()) {
      obj[key] = value;
    }

    return obj;
  }

  handleSaveButton() {
    this.setState({ saveButtonDisabled: true, saveButtonLoading: true });

    this.props.req("clubs.setSetting", this.qParams({token: this.props.token}, this.props.serialize(this.state.changes)), (data) => {
      this.setState({ saveButtonDisabled: false, saveButtonLoading: false });
      bridge.send("VKWebAppTapticNotificationOccurred", { "type": "success" });
      this.props.isEmbedded && this.props.close();
      this.props.isEmbedded && this.props.settingsWasChanged();
    },
      (error) => {
        this.setState({ saveButtonDisabled: false, saveButtonLoading: false });
        this.props.isEmbedded && this.props.close();
        this.props.createError(error.error.error_msg);
    })
  }

  componentDidMount() {
    fetch("https://ch.n1rwana.ml/api/clubs.get?token=" + this.props.token)
      .then(response => response.json())
      .then(data => {
        let features = [];

        features.push(
          {
            messages: {
              status: data.response.setting.messages.status,
              blocked: data.response.setting.messages.blocked
            },
            links: {
              status: data.response.setting.links.status,
              blocked: data.response.setting.links.blocked
            },
            comments: {
              status: data.response.setting.comments.status,
              blocked: data.response.setting.comments.blocked
            }
          }
        );

        if (data.response.error) {
          features.push({
            error: {
              title: data.response.error.title,
              text: data.response.error.text,
              autofix: data.response.error.autofix,
              button: data.response.error.button
            }
          })
        }

        this.setState({ features: features[0], helloText: data.response.hello_text });
        this.props.setLoading(false);
        this.props.setPopout(null);
      })
  }

  render() {
    const modal = (
      <ModalRoot activeModal={this.state.activeModal}>
        <ModalPage
          id="faq"
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
      </ModalRoot>
    );


    return (
      this.props.isLoading ? <PanelSpinner /> :
        <Group>
          {this.state.error.text != null && this.props.isMobile &&
            <Banner
              style={{
                marginLeft: !this.props.isMobile ? -15 : 0,
                marginRight: !this.props.isMobile ? -15 : 0,
                marginTop: !this.props.isMobile ? -1 : 10
              }}
              before={
                <Avatar size={28} style={{ backgroundImage: 'linear-gradient(90deg, #ffb73d 0%, #ffa000 100%)' }}>
                  <span style={{ lineHeight: 28, color: '#fff', userSelect: "none" }}>!</span>
                </Avatar>
              }
              header={this.state.error.title}
              subheader={<React.Fragment>{this.state.error.text}</React.Fragment>}
              actions={
                <div style={{ marginTop: 10, marginBottom: 10 }}>
                  {this.state.error.autofix && <Button style={{ marginRight: 10 }}>{this.state.error.button}</Button>}
                  <Link style={{ fontSize: 14 }}>Связяться с нами</Link>
                </div>
              }
            />
          }
          {this.state.error.text != null && !this.props.isMobile &&
            <>
              <SimpleCell
                multiline
                before={
                  <Avatar size={28} style={{ backgroundImage: 'linear-gradient(90deg, #ffb73d 0%, #ffa000 100%)' }}>
                    <span style={{ lineHeight: 28, color: '#fff', userSelect: "none" }}>!</span>
                  </Avatar>
                }
                description={this.state.error.text}
              >
                <span style={{ fontWeight: 600 }}>{this.state.error.title}</span>
              </SimpleCell>
              <Div style={{ marginLeft: "40px", marginTop: "-10px" }}>
                {this.state.error.autofix && <Button style={{ marginRight: 10 }}>{this.state.error.button}</Button>}
                <Link style={{ fontSize: 14 }}>Связяться с нами</Link>
              </Div>
              <Separator style={{ margin: "10px 0 10px 0" }} />
            </>
          }
          <SplitLayout modal={modal}>
            <SplitCol>
              <Header style={!this.props.isMobile ? { marginBottom: "-20px", marginTop: "-15px" } : {}}><b>Приложение</b></Header>
              <Cell
                multiline
                disabled
                after={
                  <Switch
                    name="theme"
                    defaultChecked={this.props.appearance === "dark"}
                    onClick={() => this.props.appearance === "light" ? this.props.setAppearance("dark") : this.props.setAppearance("light")} />
                }
                before={<Icon28PaletteOutline />}
              >
                Тёмная тема
              </Cell>
              <Spacing size={20} separator />
              <Header style={!this.props.isMobile ? { marginBottom: "-20px", marginTop: "-15px" } : {}}><b>Возможности сообщества</b></Header>
              <Cell
                multiline
                disabled
                after={
                  <Switch
                    name="messages"
                    defaultChecked={this.state.features.messages.status}
                    disabled={this.state.features.messages.blocked}
                    onClick={(e) => this.handleCheckboxChanged(e)} />
                }
                {...this.state.features.messages.blocked && { description: "Эта настройка заблокирована для этого сообщества" }}
                before={<Icon28ChatsOutline />}
              >
                Чат
              </Cell>
              <Cell
                multiline
                disabled
                after={
                  <Switch
                    name="links"
                    defaultChecked={this.state.features.links.status}
                    disabled={this.state.features.links.blocked}
                    onClick={(e) => this.handleCheckboxChanged(e)} />
                }
                {...this.state.features.links.blocked && { description: "Эта настройка заблокирована для этого сообщества" }}
                before={<Icon24Linked width={28} height={28} />}
              >
                Ссылки
              </Cell>
              <Cell
                multiline
                disabled
                after={
                  <Switch
                    name="comments"
                    defaultChecked={this.state.features.comments.status}
                    disabled={this.state.features.comments.blocked}
                    onClick={(e) => this.handleCheckboxChanged(e)} />
                }
                {...this.state.features.comments.blocked && { description: "Эта настройка заблокирована для этого сообщества" }}
                before={<Icon28CommentOutline />}
              >
                Запросы в комментариях
              </Cell>
              <FormItem
                top="Приветственное сообщение"
              >
                <Textarea
                  value={this.state.helloText}
                  onChange={(e) => this.handleHelloTextChanged(e)}
                />

              </FormItem>
              <Spacing size={20} separator />
              <Header style={!this.props.isMobile ? { marginBottom: "-20px", marginTop: "-15px" } : {}}><b>Для тестирования</b></Header>
              <Cell
                multiline
                disabled
                after={
                  <Switch
                    name="donut"
                    defaultChecked={this.props.hasDonut}
                    disabled={false}
                    onClick={
                      (e) => {
                        this.handleCheckboxChanged(e);
                      }
                    }
                  />
                }
                before={<Icon28DonateOutline />}
                description="Потребуется перезапустить сервис"
              >
                VK Donut
              </Cell>
              <br />
              <Div>
                <Button
                  onClick={this.handleSaveButton}
                  stretched
                  size="l"
                  disabled={this.state.saveButtonDisabled}
                  loading={this.state.saveButtonLoading}
                >
                  Сохранить
                </Button>
              </Div>
              <br/><br/>
            </SplitCol>
          </SplitLayout>
        </Group>

    )
  }
}
