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
import { Group, Panel, Gradient, Avatar, Title, List, Placeholder, CellButton, ConfigProvider, SplitLayout, SplitCol, PanelHeader, PanelHeaderButton, ModalRoot, ModalPage, ModalPageHeader, PanelHeaderClose, Div, FormLayout, FormItem, Input, SegmentedControl } from '@vkontakte/vkui';
import { Icon28CheckShieldOutline, Icon28SettingsOutline, Icon56NotificationOutline } from '@vkontakte/icons';
import Notifies from '../common/Notifies';

export default class Office extends Component {
  constructor(props) {
    super(props)

    this.state = {
      activeModal: "",
      color: this.props.color,
      menuPosition: this.props.menuPosition,
      appearance: this.props.appearance
    }

    this.handlePushClick = this.handlePushClick.bind(this);
  }

  componentDidMount() {
    this.props.setPopout(null);
  }

  handlePushClick(push) {
    if (push.action.type == "link") {
      window.open(push.action.target);
    } else if (push.action.type == "page") {
      this.props.go(push.action.target);
    }
  }

  parseBrakesLinks(string) {
    const regex = /\[(.*)\]/g;
    return string.replaceAll(regex, "<span style='color: #2688eb; text-decoration: none;'>$1</span>");
  }

  render() {
    const icons = {
      moderation: <Icon28CheckShieldOutline width={24} height={24} />
    };

    const modal = (
      <ModalRoot activeModal={this.state.activeModal}>
        <ModalPage
          id={"personal-settings"}
          header={
            <ModalPageHeader
              right={this.props.isMobile && <PanelHeaderClose onClick={() => {
                this.setState({ activeModal: "" })
              }} />}
            >
              Настройки
            </ModalPageHeader>
          }
          settlingHeight={100}
          onClose={() => {
            this.setState({ activeModal: "" })
          }}
        >
          <Div>
            <FormLayout>
              <FormItem
                top={"Основной цвет приложения"}
              >
                <Input
                  after={
                    <input
                      type={"color"}
                      style={{ border: "none", background: "none", marginLeft: "-25%" }}
                      onChange={(e) => {
                        this.props.setColor(e.target.value);
                        localStorage.setItem("ch_appearance_color", e.target.value);
                      }}
                      value={this.props.color}
                    />
                  }
                  value={this.props.color}
                />
              </FormItem>
              {this.props.isDesktop &&
                <FormItem
                  top={"Расположение меню"}
                >
                  <SegmentedControl
                    value={this.state.menuPosition}
                    options={[
                      {
                        label: "Слева",
                        value: "left",
                      },
                      {
                        label: "Справа",
                        value: "right",
                      }
                    ]}
                    onChange={(value) => {
                      this.props.setMenuPosition(value);
                      localStorage.setItem("ch_appearance_menu", value);
                    }}
                  />
                </FormItem>
              }
              <FormItem
                top={"Схема оформления"}
              >
                <SegmentedControl
                  value={this.state.appearance}
                  options={[
                    {
                      label: "Светлая",
                      value: "light",
                    },
                    {
                      label: "Тёмная",
                      value: "dark",
                    }
                  ]}
                  onChange={(value) => {
                    this.props.setAppearance(value);
                  }}
                />
              </FormItem>
              <FormItem>
                <CellButton onClick={() => {
                  this.props.setColor("var(--accent)");
                  localStorage.setItem("ch_appearance_color", "var(--accent)");
                }}>Сбросить</CellButton>
              </FormItem>
            </FormLayout>
          </Div>
        </ModalPage>
      </ModalRoot>
    );

    return (
      <ConfigProvider appearance={this.props.appearance} platform={this.props.platform.current}>
        <SplitLayout modal={modal}>
          <SplitCol>
            <Panel id="office">
              <PanelHeader
                left={
                  <PanelHeaderButton onClick={() => {
                    this.setState({ activeModal: "personal-settings" });
                  }}>
                    <Icon28SettingsOutline />
                  </PanelHeaderButton>
                }
              />
              <Group>
                <Gradient
                  style={{
                    margin: this.props.isDesktop ? "-7px -7px -7px -7px" : 0,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                    padding: 32,
                  }}
                  mode=""
                >
                  <Avatar size={96} src={this.props.office?.user.photo} />
                  <Title
                    style={{ marginBottom: 8, marginTop: 20 }}
                    level="2"
                    weight="2"
                  >
                    {this.props.office?.user.first_name} {this.props.office?.user.last_name}
                  </Title>
                </Gradient>
              </Group>
              <Group separator={!this.props.isMobile}>
                <List>
                  {this.props.office?.push.length > 0 ?
                    <Notifies notifies={this.props.office?.push} />
                    :
                    <Placeholder icon={<Icon56NotificationOutline />}>
                      Здесь будут уведомления...
                    </Placeholder>
                  }
                </List>
                {false && <CellButton
                  onClick={() => {
                    this.props.setPage("landing");
                    this.props.setActiveStory("start_app");
                  }}
                >
                  Показать онбординг
                </CellButton>}
              </Group>
            </Panel>
          </SplitCol>
        </SplitLayout>
      </ConfigProvider>
    )
  }
}
