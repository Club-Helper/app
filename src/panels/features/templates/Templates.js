/*******************************************************
 * Авторское право (C) 2021-2022 Club Helper
 *
 * Этот файл является частью мини-приложения Club Helper, размещенного
 * в сети Интернет по адресу https://www.vk.com/app7938346
 *
 * Несанкционированное копирование, инженерный анализ, передача,
 * распространение кода приложения запрещены
 *******************************************************/


import { ConfigProvider, Group, PanelHeader, PanelSpinner, SplitCol, SplitLayout, Tabs, TabsItem } from '@vkontakte/vkui'
import React, { Component } from 'react'

import LinksList from '../links/List';
import CommentsList from '../comments/List';

export default class Templates extends Component {
  constructor(props) {
    super(props)

    this.state = {
      showLinks: true,
      showComments: false,
      activeTab: "links"
    }
  }

  componentDidMount() {
    this.props.setLoading(false);
  }

  render() {
    return (
      <ConfigProvider platform={this.props.platform.current} appearance={this.props.appearance}>
        <PanelHeader>
          <Tabs style={!this.props.isMobile ? { marginLeft: "15px" } : {}}>
            <TabsItem
              onClick={() => this.setState({ activeTab: "links" })}
              selected={this.state.activeTab === "links"}
            >
              Ссылки
            </TabsItem>
            <TabsItem
              onClick={() => this.setState({ activeTab: "comments" })}
              selected={this.state.activeTab === "comments"}
            >
              Комментарии
            </TabsItem>
          </Tabs>
        </PanelHeader>
        {this.props.isLoading ? <PanelSpinner /> :
          <SplitLayout>
            <SplitCol>
              <Group>
                {this.state.activeTab === "links" && <LinksList {...this.props} />}
                {this.state.activeTab === "comments" && <CommentsList {...this.props} />}
              </Group>
            </SplitCol>
          </SplitLayout>
        }
      </ConfigProvider>
    )
  }
}
