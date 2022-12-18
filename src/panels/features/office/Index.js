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
import { Group, Panel, Gradient, Avatar, Title, List, Placeholder, CellButton, ConfigProvider, SplitLayout, SplitCol } from '@vkontakte/vkui';
import { Icon28CheckShieldOutline, Icon56NotificationOutline } from '@vkontakte/icons';
import Notifies from '../common/Notifies';

export default class Office extends Component {
  constructor(props) {
    super(props)

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

    return (
      <ConfigProvider appearance={this.props.appearance} platform={this.props.platform.current}>
        <SplitLayout>
          <SplitCol>
            <Panel id="office">
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
                  <Avatar size={96} src={this.props.office.user.photo} />
                  <Title
                    style={{ marginBottom: 8, marginTop: 20 }}
                    level="2"
                    weight="2"
                  >
                    {this.props.office.user.first_name} {this.props.office.user.last_name}
                  </Title>
                </Gradient>
              </Group>
              <Group separator={!this.props.isMobile}>
                <List>
                  {this.props.office.push.length > 0 ?
                    <Notifies notifies={this.props.office.push} />
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
