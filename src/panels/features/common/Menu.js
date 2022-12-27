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
  Panel,
  Group,
  Cell,
  Avatar,
  Spinner,
  Link,
  SimpleCell,
  Button,
  Footer
} from '@vkontakte/vkui';
import Dount from '../../../img/donut.png';

export default class Menu extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <Panel>
        <Group>
          {this.props.club ?
            <>
              <Cell
                disabled
                before={
                  <Avatar
                    size={28}
                    src={this.props.club.photo}
                    onClick={() => go("club_info")}
                    badge={this.props.donutStatus ? <img src={Dount} style={{
                      width: '14px',
                      height: '14px'
                    }} alt=""/> : ""}
                    style={{ cursor: "pointer" }}
                  />
                }
              >
                <div onClick={() => this.props.go("club_info")} style={{ cursor: "pointer" }}>{this.props.club.name}</div>
              </Cell>
            </> : <Spinner />}
        </Group>

        <Group>
          {this.props.menuItems.map(menuItem =>
            menuItem.show &&
            <>
              <Cell
                key={menuItem.id}
                disabled={this.props.activeStory === menuItem.id}
                style={menuItem.triggers.includes(this.props.activeStory) ? {
                  backgroundColor: "var(--button_secondary_background)",
                  borderRadius: 8
                } : {}}
                data-story={menuItem.id}
                onClick={() => go(menuItem.id)}
                before={menuItem.before}
              >
                {menuItem.name}
              </Cell>
              {/* menuItem.id === "mailing_list" && <Spacing separator /> */}
            </>
          )}
        </Group>

        <Group>
          <Link href='https://vk.me/cloud_apps' target='_blank'>
            <SimpleCell multiline before={<Avatar src="https://sun1-30.userapi.com/s/v1/ig2/huS_WYDpyzONDEF6thCzF5iJR7tkaemWgqLDELYRZjCs7lEN_Phi-pmYzlp-wGQJC43111s2hgBk_L323Jh6rx4t.jpg?size=100x100&quality=95&crop=0,0,400,400&ava=1" shadow={false} />}>
              Команда Cloud Apps ищет сотрудников
              <br /><br />
              <Button size="s" stretched mode="secondary">Подробнее</Button>
            </SimpleCell>
          </Link>
        </Group>

        <Footer onClick={() => this.props.go("app_info")}>
          v1.0.9-beta
        </Footer>
      </Panel>
    )
  }
}
