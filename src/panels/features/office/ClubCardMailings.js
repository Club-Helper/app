/*******************************************************
 * Авторское право (C) 2021-2022 Club Helper
 *
 * Этот файл является частью мини-приложения Club Helper, размещенного
 * в сети Интернет по адресу https://www.vk.com/app7938346
 *
 * Несанкционированное копирование, инженерный анализ, передача,
 * распространение кода приложения запрещены
 *******************************************************/


import { Avatar, Cell, Group, List, Placeholder, IconButton, Snackbar, Alert, Header } from '@vkontakte/vkui'
import {Icon12Lock, Icon16Done, Icon24CancelOutline} from '@vkontakte/icons'
import React, { Component } from 'react'

export default class ClubCardMailings extends Component {
  constructor(props) {
    super(props)

    this.state = {
      snackbar: null
    }
  }

  doUnsubscribe(id) {
    this.props.req("mailings.cancellation", {
      id: id,
      token: token
    },
      (data) => {
        this.props.updateMailings();
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
              Вы отписались от рассылки.
            </Snackbar>
          )
        });
      }
    );
  }

  unsubscribe(id) {
    this.props.setPopout(
      <Alert
        actions={[
          {
            title: "Отмена",
            autoclose: true,
            mode: "cancel",
          },
          {
            title: "Отписаться",
            mode: "destructive",
            autoclose: true,
            action: () => { this.doUnsubscribe(id) }
          }
        ]}
        onClose={() => this.props.setPopout(null)}
        actionsLayout="vertical"
        header="Подтвердите действие"
        text="Вы уверены, что хотите отписаться от этой рассылки? Данное действие необратимо."
      />
    )
  }

  render() {
    return (
        !this.props?.mailings?.length > 0 ?
            <Placeholder>
              Вы пока не подписаны ни на одну рассылку в этом сообществе.
            </Placeholder>
          :
          <List>
            {this.props?.mailings.map((item, idx) => (
              <Group mode={"plain"} header={<Header>Рассылки</Header>}>
                <List>
                  {item.items.map((mailing, idx) => (
                    <Cell
                      before={
                        <React.Fragment>
                          {mailing.lock && (
                            <Avatar size={28}>
                              <Icon12Lock />
                            </Avatar>
                          )}
                        </React.Fragment>
                      }
                      after={
                        <IconButton onClick={() => this.doUnsubscribe(mailing.subscriptions_id)}>
                          <Icon24CancelOutline />
                        </IconButton>
                      }
                      description={mailing.description}
                    >
                      {mailing.title}
                    </Cell>
                  ))}
                </List>
              </Group>
            ))}
          </List>

  )
  }
}

