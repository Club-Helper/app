import React, { Component } from 'react'
import { ConfigProvider, Group, Panel, PanelSpinner, SplitCol, SplitLayout, Avatar, Gradient, Title, Text, List, SimpleCell, Link } from '@vkontakte/vkui'
import { Icon24ShareOutline, Icon24Users3Outline, Icon24BugOutline } from '@vkontakte/icons';
import bridge from "@vkontakte/vk-bridge";

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
                  <Gradient mode={this.props.appearance === "dark" ? "dark" : "white"} style={{
                    margin: this.props.isDesktop ? "-7px -7px 0 -7px" : 0,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                    padding: 32,
                  }}>
                    <Avatar size={96} src={"https://sun9-81.userapi.com/impg/1WJhNCxzY5IH0zVlgo-Dx94UY3wlypTy_8Pvgw/_nyEsJVD35g.jpg?size=450x450&quality=95&sign=4b597b57c9c5675d491efb5476c25d43&type=album"} />
                    <Title
                      style={{ marginBottom: 8, marginTop: 20 }}
                      level="2"
                      weight="2"
                    >
                      Club Helper
                    </Title>
                    <Text
                      style={{
                        color: "var(--vkui--color_text_secondary)",
                      }}
                    >
                      v1.0.0-beta
                    </Text>
                  </Gradient>
                  <List>
                    <SimpleCell
                      before={<Icon24ShareOutline />}
                      onClick={() => {
                        bridge.send("VKWebAppShare", {"link": "vk.com/app7938346"});
                      }
                      }
                    >Поделиться</SimpleCell>
                    <a href={"https://vk.com/ch_app"} style={{ textDecoration: "none" }}>
                      <SimpleCell before={<Icon24Users3Outline />}>Перейти в сообщество</SimpleCell>
                    </a>
                    <a href={"https://github.com/Club-Helper/app"} style={{ textDecoration: "none" }} target={"_blank"}>
                      <SimpleCell before={<Icon24BugOutline />}>GitHub</SimpleCell>
                    </a>
                  </List>
                </Group>
              }
            </Panel>
          </SplitCol>
        </SplitLayout>
      </ConfigProvider>
    )
  }
}
