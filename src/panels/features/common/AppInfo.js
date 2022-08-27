import { ConfigProvider, Group, Panel, PanelSpinner, SplitCol, SplitLayout } from '@vkontakte/vkui'
import React, { Component } from 'react'

export default class AppInfo extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <ConfigProvider platform={this.props.platform.current} appearance={this.props.appearance}>
        <SplitLayout>
          <SplitCol>
            <Panel>
              {this.props.isLoading ? <PanelSpinner /> :
                <Group>
                  Текст
                </Group>
              }
            </Panel>
          </SplitCol>
        </SplitLayout>
      </ConfigProvider>
    )
  }
}
