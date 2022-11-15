/*******************************************************
 * Авторское право (C) 2021-2022 Club Helper
 *
 * Этот файл является частью мини-приложения Club Helper, размещенного
 * в сети Интернет по адресу https://www.vk.com/app7938346
 *
 * Несанкционированное копирование, инженерный анализ, передача,
 * распространение кода приложения запрещены
 *******************************************************/

import {ConfigProvider, Panel, Spacing, Spinner, Text, Title} from '@vkontakte/vkui'
import React, { Component } from 'react'

import '../../../css/landings/onboarding.css';

export default class Welcome extends Component {
  constructor(props) {
    super(props)

    this.state = {
      content: null,
      loading: true,
    }
  }

  componentDidMount() {
    this.props.setLoading(false);
    this.props.req("utils.welcomeClub", {token: this.props.token},
      (data) => {
        this.setState({
          content: data.response,
          loading: false
        });
      }
    );
  }

  render() {
    const { loading, content } = this.state;

    return (
      <ConfigProvider platform={this.props.platform.current} appearance={this.props.appearance}>
        <Panel className={content ? 'clubHelper-onboarding_panel' : ''}>
          {loading && <div style={{
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            height: "100%",
            width: "100%",
            paddingTop: "calc(var(--safe-area-inset-bottom) + var(--tabbar_height))"
          }}><Spinner size="large" style={{margin: "20px 0"}}/></div>}
          {!loading && <div className="clubHelper--onboarding">
            <Title>Добро пожаловать!</Title>
            <Title level="3">Команда Club Helper рада приведстовать новых пользователелй! Давайте мы коротко напомним о
              функциях сервиса.</Title>
            {this.state.content.map((element) => {
              if (element.type == "icon") {
                return (<div className="clubHelper--onboarding_block">
                  <div className="clubHelper--onboarding_block-icon" dangerouslySetInnerHTML={{__html: element.icon}}/>
                  <div>
                    <div className="clubHelper--onboarding_block-title"
                         dangerouslySetInnerHTML={{__html: this.props.parseLinks(element.title)}}/>
                    {element.subtitle && <div className="clubHelper--onboarding_block-subtitle"
                                              dangerouslySetInnerHTML={{__html: this.props.parseLinks(element.subtitle)}}/>}
                  </div>
                </div>);
              } else if (element.type == "spacing") {
                return (<Spacing size={15}/>);
              } else if (element.type == "note") {
                return (<Text className="clubHelper--onboarding_note"
                              dangerouslySetInnerHTML={{__html: this.props.parseLinks(element.text)}}/>);
              }
            })}
          </div>}
        </Panel>
      </ConfigProvider>
    );
  }
}
