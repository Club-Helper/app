/*******************************************************
 * Авторское право (C) 2021-2022 Club Helper
 *
 * Этот файл является частью мини-приложения Club Helper, размещенного
 * в сети Интернет по адресу https://www.vk.com/app7938346
 *
 * Несанкционированное копирование, инженерный анализ, передача,
 * распространение кода приложения запрещены
 *******************************************************/


import { Avatar, Cell, Group, List, Panel, PanelHeader, Placeholder, Spacing, IconButton, Snackbar, Alert, Link, ConfigProvider, SplitLayout, SplitCol } from '@vkontakte/vkui'
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
    this.props.req("mailings.cancellation", {
      id: id,
      token: this.props.token
    },
      (data) => {
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
      }
    );
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
        header={this.props.t("confirm")}
        text="Вы уверены, что хотите отписаться от этой рассылки? Данное действие необратимо."
      />
    )
  }

  render() {
    return (
      <ConfigProvider appearance={this.props.appearance} platform={this.props.platform.current}>
        <SplitLayout>
          <SplitCol>
            <Panel>
              <PanelHeader>{this.props.t("office_subscribed_mailings")}</PanelHeader>
              {!this.props?.mailings?.length > 0 ?
                <Group>
                  <Placeholder>
                    {this.props.t("office_no_mailings_found")}
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
                            description={(this.props?.office?.user.sex == 2 ? `${this.props.t("office_subscribed_m")}` : `${this.props.t("office_subscribed_f")}`) + mailing.subscription.label}
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
          </SplitCol>
        </SplitLayout>
      </ConfigProvider>
    )
  }
}
