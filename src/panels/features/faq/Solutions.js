import { Icon28ChatsOutline, Icon28DocumentOutline, Icon28LifebuoyOutline } from '@vkontakte/icons';
import { ConfigProvider, Panel, PanelHeader, PanelHeaderBack, SplitCol, SplitLayout, Group, Link, Button, Title, Placeholder, Avatar, ContentCard, Div, Cell, List, Text, CardScroll, Card, Spacing, Gallery, Banner } from '@vkontakte/vkui';
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
                  <PanelHeaderBack onClick={() => this.props.goBack()} />
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
                  {this.props.openedTSolution.banners.map((banner, idx) => (
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
              {this.props.openedTSolution.solutionsGroups.map((item, idx) => (
                item.groupType === "TILE_GROUP" && (
                  <Group
                    key={idx}
                    header={<Title style={{ marginLeft: "15px" }} level="2">{item.title}</Title>}
                  >
                    {item.subtitle && <Title level="3">{item.subtitle}</Title>}
                    <Spacing separator size={30} />
                    <Gallery style={{ padding: 16 }} withSpaces={true} align="left" size="s" showArrows slideWidth={"80%"}>
                      {item.solutions.map((solution, idx) => (
                        !solution.isHero && (
                          <Card
                            mode="shadow"
                            style={{ padding: 16, marginRight: "3%" }}
                            key={idx}
                            header={solution.title}
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
                            <center>
                              <Avatar
                                src={solution.imgUrl}
                                size={36}
                                mode="image"
                                style={{ background: "none" }}
                                shadow={false}
                              />
                              <Title level="3">{solution.title}</Title>
                              <Text style={{ maxWidth: "90%" }}>{solution.subtitle}</Text>
                              {solution.button && solution.url &&
                                <Link target='_blank' href={solution.url} style={{ marginTop: "5%" }}>
                                  <Button style={{ marginTop: "5%" }}>{solution.button}</Button>
                                </Link>
                              }
                            </center>
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
                            sizes="36"
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
                      <Spacing separator size={30} />
                      <List>
                        {item.solutions.map((solution, idx) => (
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
                    header={<Title style={{ marginLeft: "15px" }} level="2">{item.title}</Title>}
                    key={idx}
                  >
                      <Spacing separator size={30} />
                      <Div>
                        {item.solutions.map((solution, idx) => (
                          <Link href={solution.url ?? undefined} key={idx} target="_blank">
                            <Button
                              before={<Icon28ChatsOutline />}
                            >
                              {solution.title}
                            </Button>
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
