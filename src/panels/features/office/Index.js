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
import { Group, Panel, Gradient, Avatar, Title, List, Placeholder, Cell, CellButton } from '@vkontakte/vkui';
import { Icon28LaptopOutline, Icon56AndroidDeviceOutline, Icon56AppleDeviceOutline } from '@vkontakte/icons';

export default class Office extends Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    this.props.setPopout(null);
  }

  render() {
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
            {this.props.office.activity_history.length > 0 ?
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
              <Placeholder>Здесь будет история активности</Placeholder>}
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
