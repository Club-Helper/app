/*******************************************************
 * Авторское право (C) 2021-2022 Club Helper
 *
 * Этот файл является частью мини-приложения Club Helper, размещенного
 * в сети Интернет по адресу https://www.vk.com/app7938346
 *
 * Несанкционированное копирование, инженерный анализ, передача,
 * публичная демонстрация, распространение кода приложения запрещены
 *******************************************************/


import { Avatar, Cell, Group, List, Panel, PanelHeader, Placeholder, Spacing, IconButton, Snackbar, Alert, Link } from '@vkontakte/vkui'
import {Icon12Lock, Icon16Done, Icon24CancelOutline} from '@vkontakte/icons'
import React, { Component } from 'react'

export default class Mailings extends Component {
  constructor(props) {
    super(props)

    this.state = {
      snackbar: null
    }
  }

  doUnsubscribe(id) {
    fetch(`https://ch.n1rwana.ml/api/mailings.cancellation?id=${id}&token=${this.props.token}`)
      .then(response => response.json())
      .then(data => {
        if (!data.error) {
          this.props.updateOffice();
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
        } else {
          this.props.createError(data.error.error_msg);
        }
      })
  }

  unsubscribe(id) {
    this.props.setPopout(
      <Alert
        actions={[
          {
            title: "Отписаться",
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
        text="Вы уверены, что хотите отписаться от этой рассылки? Данное действие необратимо."
      />
    )
  }

  render() {
    return (
      <Panel>
        <PanelHeader>Мои рассылки</PanelHeader>
        {!this.props?.mailings?.length > 0 ?
          <Group>
            <Placeholder>
              Вы пока не подписаны ни на одну рассылку.
            </Placeholder>
          </Group>
          :
          <List>
            {this.props?.mailings.map((item, idx) => (
              <Group
                header={
                <Link target={"_blank"} href={`https://vk.com/club${item.club.id}`}>
                  <Cell
                    before={<Avatar size={36} src={item.club.photo} />}
                  >
                    {item.club.title}
                  </Cell>
                </Link>
                }
              >
                <Spacing size={20} separator />
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
                        <IconButton onClick={() => this.unsubscribe(mailing.id)}>
                          <Icon24CancelOutline />
                        </IconButton>
                      }
                      description={(this.props?.office?.user.sex == 2 ? "подписался " : "подписалась ") + mailing.subscription.label}
                    >
                      {mailing.title}
                    </Cell>
                  ))}
                </List>
              </Group>
            ))}
          </List>
        }
      </Panel>
    )
  }
}
