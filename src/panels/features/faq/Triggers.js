import { Icon12Chevron, Icon28LifebuoyOutline, Icon56CheckCircleOutline } from '@vkontakte/icons';
import { ConfigProvider, Text, Group, Panel, SplitCol, SplitLayout, PanelHeader, PanelHeaderBack, List, Placeholder, PanelHeaderClose, Cell, Avatar, ModalPageHeader, ButtonGroup, Button, Div, Link, Title, ContentCard } from '@vkontakte/vkui';
import React, { Component } from 'react';

export default class FAQTriggers extends Component {
  constructor(props) {
    super(props);

    this.state = {
      btnWorking: false,
      btnSelected: false,
      solution: null,
      getSupport: false,
      getSupportSolution: null
    }
  }

  handleButtonClick(btn, idx) {
    this.setState({ solution: null, btnSelected: false, btnWorking: idx });

    switch (btn.type) {
      case "get_support":
        this.setState({ btnSelected: idx, btnWorking: false, solution: "getSupport" });
        break;

      case "solution":
        this.setState({ btnSelected: idx, solution: btn.solution });
        this.setState({ btnWorking: false });
        break;

      default:
        this.setState({ btnWorking: false });
        break;
    }
  }

  handleGetSupport() {
    this.setState({ btnWorking: "getSupport", solution: "getSupport" });
    this.props.req("support.solutions", {
      superGroupId: this.props.openedProduct.id,
      symptomCategoryId: this.props.openedCategoryId,
      symptomId: this.props.openedSymptom.id,
      token: this.props.token
    }, (response) => {
      console.log("getSupportSolution:", response.response);
      this.props.setOpenedTSolution(response.response);
      this.props.go("faq-tsolution");
      this.setState({ getSupportSolution: response.response });
      this.setState({ btnWorking: false });
    }, (error) => {
      this.props.createError(error.error?.error_msg);
      this.setState({ btnWorking: false });
    }
    );
  }

  componentDidMount() {
    this.props.setPopout(null);
  }

  render() {
    return (
      <ConfigProvider appearance={this.props.appearance} platform={this.props.platform.current}>
        <SplitLayout>
          <SplitCol>
            <Panel>
              {this.props.triggerMode == "modal" ?
                <ModalPageHeader
                  left={
                    <PanelHeaderClose
                      onClick={() => {
                        this.props.openedTriggerTitle.pop();
                        this.props.closeModal()
                      }}
                    />
                  }
                >
                  {this.props.openedTriggerTitle[this.props.openedTriggerTitle.length - 1]}
                </ModalPageHeader>
                :
                <PanelHeader
                  left={
                      <PanelHeaderBack
                        onClick={() => {
                          this.props.openedTriggerTitle.pop();
                          this.props.goBack(2)
                        }}
                      />
                  }
                >
                  {this.props.openedTriggerTitle[this.props.openedTriggerTitle.length - 1]}
                </PanelHeader>
              }
              {this.props.isMobile
                ?
                    <List>
                      {this.props.openedTrigger ?
                      this.props.openedTrigger?.count > 0 ?
                      this.props.openedTrigger.items.map((item, idx) => (
                        <Group
                          key={idx}
                        >
                          <Div>
                            <Text>{item.text}</Text>
                            <br />
                            {item.buttons &&
                              <ButtonGroup
                                style={{ width: "100%" }}
                                gap="space"
                                mode="horizontal"
                              >
                                {
                                  item.buttons.map((btn, idx) => (
                                    <>
                                      <Button
                                        key={idx}
                                        style={{ marginRight: ".5em" }}
                                        disabled={this.state.btnWorking === idx}
                                        loading={this.state.btnWorking === idx}
                                        onClick={() => this.handleButtonClick(btn, idx)}
                                        mode={this.state.btnSelected === idx ? "primary" : "outline"}
                                      >
                                        {btn.text}
                                      </Button>
                                    </>
                                  ))
                                }
                              </ButtonGroup>
                            }
                          </Div>
                        </Group>
                      ))
                        :
                      this.props.openedTrigger?.items?.length == 0 ?
                        <Group>
                          <Placeholder
                            icon={<Icon28LifebuoyOutline width={56} height={56} />}
                          >
                            Здесь пока ничего нет.
                          </Placeholder>
                        </Group>
                          :
                        <Cell
                          multiline
                          before={
                            this.props.openedTrigger[0]?.icon ?
                              <Avatar
                                src={this.props.openedTrigger[0]?.icon}
                                size={36}
                                mode="image"
                                style={{ background: "none" }}
                                withBorder={false}
                              />
                              : null
                          }
                          after={<Icon12Chevron width={16} height={16} />}
                        >
                          {this.props.openedTrigger[0]?.name}
                        </Cell>
                      : <Placeholder
                        icon={<Icon28LifebuoyOutline width={56} height={56} />}
                      >
                        Здесь пока ничего нет.
                    </Placeholder>}
                  {this.state.solution && this.state.solution !== "getSupport" && (
                    <Group>
                      <Placeholder
                        title={this.state.solution.title}
                        icon={
                          this.state.solution.icon === "complete" && <Icon56CheckCircleOutline fill="var(--button_commerce_background)" />
                        }
                        action={
                          this.state.solution.link &&
                          <Link href={this.state.solution.link.url} target="_blank">
                            {this.state.solution.link.text}
                          </Link>
                        }
                      >
                        {this.state.solution.text}
                      </Placeholder>
                    </Group>
                  )}
                  {this.state.solution === "getSupport" && (
                    <Group>
                      <Div>
                        Узнайте доступные варианты поддержки
                        <br /><br />
                        <Button
                          onClick={() => { this.handleGetSupport() }}
                          disabled={this.state.btnWorking === "getSupport"}
                          loading={this.state.btnWorking === "getSupport"}
                        >
                          Продолжить
                        </Button>
                      </Div>
                    </Group>
                  )}
                  {this.state.solution === "getSupport" && this.state.getSupportSolution?.solutionsGroups && this.state.getSupportSolution.solutionsGroups.map((item, idx) => (
                    item.groupType === "TILE_GROUP" && (
                      <Group
                        mode="plain"
                        key={idx}
                        header={<Title level="2">{item.title}</Title>}
                      >
                        {item.subtitle && <Title level="3">{item.subtitle}</Title>}
                        {item.solutions.map((solution, idx) => (
                          !solution.isHero && (
                            <Group>
                              <Placeholder
                                key={idx}
                                header={solution.title}
                                icon={
                                  <Avatar
                                    src={solution.imgUrl}
                                    size={36}
                                    mode="image"
                                    style={{ background: "none" }}
                                    withBorder={false}
                                  />
                                }
                                action={solution.button && solution.url &&
                                  <Link target='_blank' href={solution.ur}>
                                    <Button>{solution.button}</Button>
                                  </Link>
                                }
                              >
                                {solution.subtitle}
                              </Placeholder>
                            </Group>
                          )
                          ||
                          solution.isHero && (
                            <ContentCard
                              src={solution.imgUrl}
                              header={solution.title}
                              text={solution.subtitle}
                              caption={solution.button && solution.url &&
                                <Link target='_blank' href={solution.ur}>
                                  <Button>{solution.button}</Button>
                                </Link>
                              }
                            />
                          )
                        ))}
                      </Group>
                    )
                  ))}
                    </List>
                :
                    <List>
                      {this.props.openedTrigger ?
                    this.props.openedTrigger?.count > 0 ?
                      this.props.openedTrigger.items.map((item, idx) => (
                        <Group
                          key={idx}
                        >
                          <Div>
                            <Text>{item.text}</Text>
                            <br />
                            {item.buttons &&
                              <ButtonGroup
                                style={{ width: "100%" }}
                                gap="space"
                                mode="horizontal"
                              >
                                {
                                  item.buttons.map((btn, idx) => (
                                    <>
                                      <Button
                                        key={idx}
                                        style={{ marginRight: ".5em" }}
                                        disabled={this.state.btnWorking === idx}
                                        loading={this.state.btnWorking === idx}
                                        onClick={() => this.handleButtonClick(btn, idx)}
                                        mode={this.state.btnSelected === idx ? "primary" : "outline"}
                                      >
                                        {btn.text}
                                      </Button>
                                    </>
                                  ))
                                }
                              </ButtonGroup>
                            }
                          </Div>
                        </Group>
                      ))
                        :
                      this.props.openedTrigger?.items?.length == 0 ?
                        <Group>
                          <Placeholder
                            icon={<Icon28LifebuoyOutline width={56} height={56} />}
                          >
                            Здесь пока ничего нет.
                          </Placeholder>
                        </Group>
                          :
                        <Cell
                          multiline
                          before={
                            this.props.openedTrigger[0]?.icon ?
                            <Avatar
                              src={this.props.openedTrigger[0].icon}
                              size={36}
                              mode="image"
                              style={{ background: "none" }}
                              withBorder={false}
                              />
                              : null
                          }
                          after={<Icon12Chevron width={16} height={16} />}
                        >
                          {this.props.openedTrigger[0]?.name}
                        </Cell>
                      : <Placeholder
                        icon={<Icon28LifebuoyOutline width={56} height={56} />}
                      >
                          Здесь пока ничего нет.
                    </Placeholder>}
                  {this.state.solution && this.state.solution !== "getSupport" && (
                    <Group>
                      <Placeholder
                        title={this.state.solution.title}
                        icon={
                          this.state.solution.icon === "complete" && <Icon56CheckCircleOutline fill="var(--button_commerce_background)" />
                        }
                        action={
                          this.state.solution.link &&
                          <Link href={this.state.solution.link.url} target="_blank">
                              {this.state.solution.link.text}
                          </Link>
                        }
                      >
                        {this.state.solution.text}
                      </Placeholder>
                    </Group>
                  )}
                  {this.state.solution === "getSupport" && (
                    <Group>
                      <Div>
                        Узнайте доступные варианты поддержки
                        <br /><br />
                        <Button
                          onClick={() => { this.handleGetSupport() }}
                          disabled={this.state.btnWorking === "getSupport"}
                          loading={this.state.btnWorking === "getSupport"}
                        >
                          Продолжить
                        </Button>
                      </Div>
                    </Group>
                  )}
                  {this.state.solution === "getSupport" && this.state.getSupportSolution?.solutionsGroups && this.state.getSupportSolution.solutionsGroups.map((item, idx) => (
                    item.groupType === "TILE_GROUP" && (
                      <Group
                        mode="plain"
                        key={idx}
                        header={<Title level="2">{item.title}</Title>}
                      >
                        {item.subtitle && <Title level="3">{item.subtitle}</Title>}
                        {item.solutions.map((solution, idx) => (
                          !solution.isHero && (
                            <Group>
                              <Placeholder
                                key={idx}
                                header={solution.title}
                                icon={
                                  <Avatar
                                    src={solution.imgUrl}
                                    size={36}
                                    mode="image"
                                    style={{ background: "none" }}
                                    withBorder={false}
                                  />
                                }
                                action={solution.button && solution.url &&
                                  <Link target='_blank' href={solution.ur}>
                                    <Button>{solution.button}</Button>
                                  </Link>
                                }
                              >
                                {solution.subtitle}
                              </Placeholder>
                            </Group>
                          )
                          ||
                          solution.isHero && (
                            <ContentCard
                              src={solution.imgUrl}
                              header={solution.title}
                              text={solution.subtitle}
                              caption={solution.button && solution.url &&
                                <Link target='_blank' href={solution.ur}>
                                  <Button>{solution.button}</Button>
                                </Link>
                              }
                            />
                          )
                        ))}
                      </Group>
                    )
                  ))}
                    </List>
              }
            </Panel>
          </SplitCol>
        </SplitLayout>
      </ConfigProvider>
    );
  }
}
