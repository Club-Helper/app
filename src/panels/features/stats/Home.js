/*******************************************************
 * Авторское право (C) 2021-2022 Club Helper
 *
 * Этот файл является частью мини-приложения Club Helper, размещенного
 * в сети Интернет по адресу https://www.vk.com/app7938346
 *
 * Несанкционированное копирование, инженерный анализ, передача,
 * распространение кода приложения запрещены
 *******************************************************/


import React, { Component } from 'react';
import { Icon20BlockOutline, Icon20CommunityName, Icon20Search, Icon20Users3Outline, Icon20WorkOutline, Icon24Linked } from '@vkontakte/icons';
import { ConfigProvider, Group, MiniInfoCell, Panel, PanelSpinner, PullToRefresh, Title } from '@vkontakte/vkui';

export default class StatsHome extends Component {
  constructor(props) {
    super(props)

    this.state = {
      stats: [],
      isStatsLoading: true
    }

    this.getStats = this.getStats.bind(this);
  }

  getStats() {
    this.setState({ isStatsLoading: true });
    fetch("https://ch.n1rwana.ml/api/stats.get?token=" + this.props.token)
      .then(response => response.json())
      .then(data => {
        this.setState({ stats: data.response, isStatsLoading: false })
        this.props.setLoading(false);
      });
  }

  componentDidMount() {
    this.getStats();
  }

  render() {
    return (
      <ConfigProvider platform={this.props.platform.current} appearance={this.props.appearance} >
        {
          this.props.isLoading ? <PanelSpinner /> :
            <Panel>
              <PullToRefresh isFetching={this.state.isStatsLoading} onRefresh={this.getStats}>
                <Group header={<Title level='3' style={{ marginLeft: "10px", marginTop: "15px" }}>Сообщество</Title>}>
                  {this.state.isStatsLoading ?
                    <PanelSpinner /> :
                    <MiniInfoCell before={<Icon20Users3Outline fill="var(--dynamic_violet)" />}>Кол-во администраторов: {this.state.stats.club?.managers}</MiniInfoCell>
                  }
                </Group>
                <Group header={<Title level='3' style={{ marginLeft: "10px", marginTop: "15px" }}>Обращения</Title>}>
                  {this.state.isStatsLoading ? <PanelSpinner /> :
                    <>
                      <MiniInfoCell before={<Icon20CommunityName fill="var(--dynamic_orange)" />}>Всего: {this.state.stats.tickets?.all}</MiniInfoCell>
                      <MiniInfoCell before={<Icon20Search fill="var(--dynamic_blue)" />}>Ожидающих специалиста: {this.state.stats.tickets?.waiting_specialist}</MiniInfoCell>
                      <MiniInfoCell before={<Icon20WorkOutline fill="var(--dynamic_green)" />}>В работе: {this.state.stats.tickets?.work}</MiniInfoCell>
                      <MiniInfoCell before={<Icon20BlockOutline fill="var(--destructive)" />}>Закрытых: {this.state.stats.tickets?.closed}</MiniInfoCell>
                    </>
                  }
                </Group>
                <Group header={<Title level='3' style={{ marginLeft: "10px", marginTop: "15px" }}>Ссылки</Title>}>
                  {this.state.isStatsLoading ?
                    <PanelSpinner /> :
                    <MiniInfoCell before={<Icon24Linked fill="var(--dynamic_raspberry_pink)" />}>Всего: {this.state.stats.links?.all}</MiniInfoCell>
                  }
                </Group>
              </PullToRefresh>
            </Panel>
        }
      </ConfigProvider>

    )
  }
}
