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
import { Group, Panel, Gradient, Avatar, Title, List, Placeholder, Cell, CellButton, RichCell } from '@vkontakte/vkui';
import { Icon28LaptopOutline, Icon56AndroidDeviceOutline, Icon56AppleDeviceOutline, Icon28CheckShieldOutline, Icon56NotificationOutline } from '@vkontakte/icons';

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
    } else {
      this.props.setActiveStory(push.action.target);
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
      <Panel id="office">
        <Group>
          <Gradient
            style={{
              margin: !this.props.isDesktop ? "-7px -7px -7px -7px" : 0,
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
              this.props.office.push.map((item, idx) => (
                <RichCell
                  onClick={() => this.handlePushClick(item)}
                  key={idx}
                  before={
                    <Avatar size={48}>
                      {icons[item.type]}
                    </Avatar>
                  }
                  text={<div dangerouslySetInnerHTML={{ __html: this.parseBrakesLinks(item.text) }}></div>}
                  subtitle={item.title}
                  multiline
                  caption={item.time.label}
                >
                  {item.title}
                </RichCell>
              ))
              :
              <Placeholder icon={<Icon56NotificationOutline />}>
                Здесь будут уведомления...
              </Placeholder>
            }
            {/*this.props.office.activity_history.length > 0 ?
              this.props.office.activity_history.map((item, idx) => (
                <Cell
                  key={idx}
                  description={item.time.label}
                  before={
                    <React.Fragment>
                      {item.type == "laptop" && <Icon28LaptopOutline />}
                      {item.type == "ios" && <Icon56AppleDeviceOutline width={28} height={28} />}
                      {item.type == "android" && <Icon56AndroidDeviceOutline width={28} height={28} />}
                    </React.Fragment>
                  }
                >
                  {item.platform} {item.browser && "· " + item.browser}
                </Cell>
              ))
              :
                <Placeholder>Здесь будет история активности</Placeholder>*/}
          </List>
          <CellButton
            onClick={() => {
              this.props.setPage("landing");
              this.props.setActiveStory("start_app");
            }}
          >
            Показать онбординг
          </CellButton>
        </Group>
      </Panel>
    )
  }
}
