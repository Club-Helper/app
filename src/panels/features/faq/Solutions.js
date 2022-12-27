import { Icon28ChatsOutline, Icon28DocumentOutline, Icon28LifebuoyOutline } from '@vkontakte/icons';
import { ConfigProvider, Panel, PanelHeader, PanelHeaderBack, SplitCol, SplitLayout, Group, Link, Button, Title, Placeholder, Avatar, ContentCard, Div, Cell, List, Text, Card, Gallery, Banner } from '@vkontakte/vkui';
import React, { Component } from 'react';

import './GalleryFix.css';

export default class FAQSolutions extends Component {
  constructor(props) {
    super(props);

    this.state = {

    };
  }

  render() {
    return (
      <ConfigProvider appearance={this.props.appearance} platform={this.props.platform.current}>
        <SplitLayout>
          <SplitCol>
            <Panel>
              <PanelHeader
                left={
                  <PanelHeaderBack onClick={() => this.props.goBack(2)} />
                }
              >
                {this.props.openedTriggerTitle[this.props.openedTriggerTitle.length - 1]}
              </PanelHeader>
              {this.props.openedTSolution.banners.length === 0 && this.props.openedTSolution.solutionsGroups.length === 0 &&
                <Group>
                  <Placeholder
                    icon={<Icon28LifebuoyOutline width={56} height={56} />}
                  >
                    Здесь пока ничего нет.
                  </Placeholder>
                </Group>
              }
              {this.props.openedTSolution.banners.length > 0 &&
                <Group>
                  {this.props.openedTSolution.banners?.map((banner, idx) => (
                    <Banner
                      header={banner.title}
                      subheader={banner.body}
                      before={banner.img ?
                        <Avatar
                          src={banner.img}
                          size={36}
                          mode="image"
                          style={{ background: "none" }}
                          shadow={false}
                        />
                      : undefined}
                    />
                  ))}
                </Group>
              }
              {this.props.openedTSolution.solutionsGroups?.map((item, idx) => (
                item.groupType === "TILE_GROUP" && (
                  <Group
                    key={idx}
                    header={<Title style={{ marginLeft: "15px", marginTop: "15px" }} level="2">{item.title}</Title>}
                  >
                    {item.subtitle && <Title level="3">{item.subtitle}</Title>}
                    <Gallery className="clubHelper--solutions" withSpaces={true} showArrows slideWidth={"90%"}>
                      {item.solutions?.map((solution, idx) => (
                        !solution.isHero && (
                          <Card
                            mode="outline"
                            key={idx}
                            icon={
                              <Avatar
                                src={solution.imgUrl}
                                size={36}
                                mode="image"
                                style={{ background: "none" }}
                                shadow={false}
                              />
                            }
                          >
                            <Placeholder
                              icon={
                                <Avatar
                                  src={solution.imgUrl}
                                  size={36}
                                  mode="image"
                                  style={{ background: "none" }}
                                  shadow={false}
                                />
                              }
                              header={<Title style={{ maxWidth: "80%", marginLeft: "9.5%" }} level="3">{solution.title}</Title>}
                              action={solution.button && solution.url &&
                                <Link target='_blank' href={solution.url} style={{ marginTop: "5%" }}>
                                  <Button style={{ marginTop: "5%" }}>{solution.button}</Button>
                                </Link>
                            }
                            >
                              <Text style={{ maxWidth: "90%", padding: 16 }}>{solution.subtitle}</Text>
                            </Placeholder>
                          </Card>
                        )
                        ||
                        solution.isHero && (
                          <ContentCard
                            key={idx}
                            src={solution.imgUrl}
                            header={solution.title}
                            text={solution.subtitle}
                            caption={solution.button && solution.url &&
                              <Link target='_blank' href={solution.ur}>
                                <Button>{solution.button}</Button>
                              </Link>
                            }
                            height={150}
                            mode="outline"
                          />
                        )
                    ))}
                    </Gallery>
                  </Group>
                )
                ||
                item.groupType === "ARTICLE_GROUP" && (
                  <Group
                    header={<Title style={{ marginLeft: "15px" }} level="2">{item.title}</Title>}
                    key={idx}
                  >
                      <List>
                        {item.solutions?.map((solution, idx) => (
                          <Link
                            key={idx}
                            href={solution.url ? solution.url : undefined}
                            target="_blank"
                          >
                            <Cell
                              before={
                                solution.imgUrl ?
                                  <Avatar
                                    src={solution.imgUrl}
                                    size={36}
                                    mode="image"
                                    style={{ background: "none" }}
                                    shadow={false}
                                  />
                                :
                                <Icon28DocumentOutline />
                              }
                              description={solution.subtitle}
                              multiline
                            >
                              {solution.title}
                            </Cell>
                          </Link>
                        ))}
                      </List>
                  </Group>
                )
                ||
                item.groupType === "CONTACT_GROUP" && (
                  <Group
                    header={<Title style={{ marginLeft: "15px", marginTop: "15px", marginBottom: "5px" }} level="2">{item.title}</Title>}
                    key={idx}
                  >
                      <Div>
                        {item.solutions?.map((solution, idx) => (
                          <Link href={solution.url ?? undefined} key={idx} target="_blank">
                            <Card
                              className="clubHelper--solution-contact"
                              mode="outline"
                              key={idx}
                              icon={
                                <Icon28ChatsOutline width={40} height={40} />
                              }
                            >
                              <Placeholder
                                icon={
                                  <Icon28ChatsOutline width={40} height={40} />
                                }
                                style={{padding: "0"}}
                                header={<Title style={{ maxWidth: "80%", marginLeft: "9.5%" }} level="3">{solution.title}</Title>}
                              />
                            </Card>
                          </Link>
                        ))}
                      </Div>
                  </Group>
                )
              ))}
            </Panel>
          </SplitCol>
        </SplitLayout>
      </ConfigProvider>
    )
  }
}
