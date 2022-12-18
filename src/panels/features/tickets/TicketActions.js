/*******************************************************
 * Авторское право (C) 2021-2022 Club Helper
 *
 * Этот файл является частью мини-приложения Club Helper, размещенного
 * в сети Интернет по адресу https://www.vk.com/app7938346
 *
 * Несанкционированное копирование, инженерный анализ, передача,
 * распространение кода приложения запрещены
 *******************************************************/


import { Icon24BlockOutline, Icon56AdvertisingOutline } from '@vkontakte/icons';
import { Button, CustomSelectOption, PanelSpinner, Placeholder, Spacing, Title } from '@vkontakte/vkui'
import React, { Component } from 'react'

export default class TicketActions extends Component {
  constructor(props) {
    super(props)

    this.state = {
      mailingList: [],
      modalLoading: true
    }

    this.getMailing = this.getMailing.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.send = this.props.send;
    this.close = this.props.close;
  }

  getMailing() {
    this.props.req("mailings.get", {
      token: this.props.token
    },
      (data) => {
        this.setState({ mailingList: data.response.items, modalLoading: false });
      }
    );
  }

  handleClick(id) {
    console.log(id);
    this.send(id);
    this.close();
  }

  componentDidMount() {
    this.getMailing();
  }

  render() {
    return (
      this.state.modalLoading ? <PanelSpinner /> :
        <>
          <Spacing size={15} />
          {this.state.mailingList.length > 0 ?
            <>
              <Title level='3' style={{ marginLeft: "15px" }}>Доступные для подписки</Title>
              {this.state.mailingList.map((item) => {
                if (item.status === "open") {
                  return (
                    <CustomSelectOption
                      key={item.id}
                      onClick={() => this.handleClick(item.id)}
                      after={
                        <Button mode="secondary">Пригласить</Button>
                      }
                    >
                      {item.title}
                    </CustomSelectOption>
                  )
                }
              })}
            </>
            :
            <Placeholder
              icon={<Icon56AdvertisingOutline />}
              action={<Button
                onClick={() => {
                  this.props.setActiveStory("mailing_list");
                  this.props.close();
                }}
              >
                Создать рассылку
              </Button>}
            >
              Здесь пока ничего нет...
            </Placeholder>}
          {this.state.mailingList.find(item => item.status !== "open")?.length > 0 ? (
            <div>
              <Spacing size={35} separator />
              <Title level='3' style={{ marginLeft: "15px" }}>Недоступные для подписки</Title>
              {this.state.mailingList.map((item) => {
                if (item.status !== "open") {
                  return (
                    <CustomSelectOption
                      key={item.id}
                      after={
                        <Button disabled style={{ width: "100.34px" }} mode="tertiary">
                          <Icon24BlockOutline fill="var(--destructive)" />
                        </Button>
                      }
                    >
                      {item.title}
                    </CustomSelectOption>
                  )
                }
              })}
            </div>) : ""
          }
          <Spacing size={15} />
        </>
    )
  }
}
