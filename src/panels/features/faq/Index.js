import React, { Component } from 'react';
import { Avatar, Cell, ConfigProvider, Div, Group, Header, List, ModalPage, ModalPageHeader, ModalRoot, Panel, PanelHeader, PanelHeaderBack, PanelHeaderButton, PanelSpinner, Placeholder, PullToRefresh, ScreenSpinner, Spacing, SplitCol, SplitLayout, Title } from '@vkontakte/vkui';
import { Icon12Chevron, Icon24Dismiss, Icon28LifebuoyOutline } from '@vkontakte/icons';
import FAQTopic from './Topic';

export default class FAQIndex extends Component {
  constructor(props) {
    super(props)

    this.state = {
      activeModal: "",
      product: {},
      isFetching: false,
      activeProduct: {},
      activeTopics: []
    }
  }

  getProduct(reloadNeed) {
    reloadNeed ? this.props.setLoading(true) : this.setState({ isFetching: true });
    this.props.req("support.product", {
      token: this.props.token
    }, (response) => {
      console.log(response.response);
      this.setState({ product: response.response, isFetching: false });
      reloadNeed && this.props.setLoading(false);
    })
  }

  getTopic(product) {
    this.props.setPopout(<ScreenSpinner />);
    this.props.req("support.topics", {
      superGroupId: product.id,
      token: this.props.token
    }, (response) => {
      this.props.setOpenedProduct(product);
      this.props.setOpenedSolution(response.response);
      this.props.go("faq-solution");
    }, (error) => {
      this.props.setPopout(null);
      this.props.createError(error.error?.error_msg);
    });
  }

  componentDidMount() {
    this.getProduct(true);
  }

  render() {
    const modal = (
      <ModalRoot activeModal={this.state.activeModal}>
        <ModalPage
          id="topic"
          header={
            <ModalPageHeader
              right={
                this.props.isMobile &&
                  <PanelHeaderButton
                    onClick={() => this.setState({
                      activeTopic: null,
                      activeModal: ""
                    })}
                  >
                      <Icon24Dismiss />
                  </PanelHeaderButton>
              }
            >
              {this.state.activeProduct.title}
            </ModalPageHeader>
          }
          onClose={() => { this.setState({ activeTopic: null, activeModal: "" }) }}
          settlingHeight={100}
        >
          <Div>
            <List>
              {this.state.activeTopics.count > 0
                ?
                <FAQTopic {...this.props} title={this.state.activeProduct.title} topic={this.state.activeTopics} setTriggerMode={this.props.setTriggerMode} />
                :
                <Placeholder
                  icon={<Icon28LifebuoyOutline width={56} height={56} />}
                >
                  Здесь пока ничего нет.
                </Placeholder>
              }
            </List>
          </Div>
        </ModalPage>
      </ModalRoot>
    )

    return (
      <ConfigProvider platform={this.props.platform.current} appearance={this.props.appearance}>
        <SplitLayout modal={modal}>
          <SplitCol>
            <Panel>
              <PanelHeader
                left={
                  !this.props.showMenu && <PanelHeaderBack onClick={() => this.props.goBack()} />
                }
              >
                Помощь
              </PanelHeader>
              <PullToRefresh
                onRefresh={() => this.getProduct(true)}
                isFetching={this.state.isFetching}
              >
                  <Group
                    header={
                    <Title
                      level="2"
                      style={{ marginLeft: "15px", marginTop: "10px" }}
                    >
                        Выберите раздел, с которым Вам требуется помощь
                      </Title>
                    }
                  >
                    <Spacing size={30} separator />
                    {this.props.isLoading ? <PanelSpinner /> :
                      <List>
                        {this.state.product.count > 0 ?
                          this.state.product.items.map((item, idx) => (
                            <Cell
                              key={idx}
                              before={
                                <Avatar
                                  src={item.icon}
                                  size={36}
                                  mode="image"
                                  style={{ background: "none" }}
                                  shadow={false}
                                />
                              }
                              after={<Icon12Chevron width={16} height={16} />}
                              onClick={() => this.getTopic(item)}
                            >
                              {item.name}
                            </Cell>
                          ))
                          :
                          <Placeholder
                            icon={<Icon28LifebuoyOutline width={56} height={56} />}
                          >
                            Здесь пока ничего нет.
                          </Placeholder>}
                      </List>
                    }
                  </Group>
                </PullToRefresh>
            </Panel>
          </SplitCol>
        </SplitLayout>
      </ConfigProvider>
    )
  }
}
