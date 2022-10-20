/*******************************************************
 * Авторское право (C) 2021-2022 Club Helper
 *
 * Этот файл является частью мини-приложения Club Helper, размещенного
 * в сети Интернет по адресу https://www.vk.com/app7938346
 *
 * Несанкционированное копирование, инженерный анализ, передача,
 * распространение кода приложения запрещены
 *******************************************************/


import { Icon16Block, Icon20DonateCircleFillYellow, Icon12Chevron, Icon28AddCircleOutline } from '@vkontakte/icons';
import { Avatar, Cell, Group, Link, List, Panel, PanelHeader, PanelSpinner, Placeholder, PanelHeaderButton } from '@vkontakte/vkui'
import React, { Component } from 'react'
import bridge from '@vkontakte/vk-bridge';

export default class Clubs extends Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    this.props.setPopout(null);
  }

  handleClick () {
    console.log("handleClick");
  }

  render() {
    return (
      <Panel>
        <PanelHeader
          left={
            <PanelHeaderButton onClick={() => bridge.send("VKWebAppAddToCommunity")}>
              <Icon28AddCircleOutline />
            </PanelHeaderButton>
          }
        >
          Мои сообщества
          </PanelHeader>
        <Group>
          <List>
            {!this.props.office?.clubs ? <PanelSpinner /> :
              this.props.office.clubs.length > 0 ?
                this.props.office?.clubs.map((club, idx) => (
                  <Link href={"https://vk.com/app7938346_-" + club.id} target="_blank">
                  <Cell
                    onClick={() => this.handleClick()}
                    key={idx}
                    before={
                      <Avatar
                        size={48}
                        src={club.photo}
                        badge={
                          <React.Fragment>
                            {club.donut && <Avatar size={20} shadow={false} style={{ backgroundColor: "var(--background_content)" }}><Icon20DonateCircleFillYellow /></Avatar>}
                            {club.blocked && <Avatar size={20} shadow={false} style={{ backgroundColor: "var(--background_content)" }}><Icon16Block fill='var(--accent)' width={20} height={20} /></Avatar>}
                          </React.Fragment>
                        }
                      />
                    }
                    description={this.props.formatRole(club.role)}
                    after={<Icon12Chevron width={16} height={16} />}
                  >
                    {club.title}
                    </Cell>
                  </Link>
              )) : <Placeholder>У вас пока нет ни одного сообщества.</Placeholder>}
          </List>
        </Group>
      </Panel>
    )
  }
}
