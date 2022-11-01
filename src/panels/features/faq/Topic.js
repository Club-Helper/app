import React, { Component } from 'react';
import { ConfigProvider, Panel, PanelHeader, SplitCol, SplitLayout, List, Cell, Avatar, Group, PanelSpinner, PanelHeaderBack, PullToRefresh, ModalRoot, ModalPage, ScreenSpinner, Div, Title, Spacing, Placeholder } from '@vkontakte/vkui';
import { Icon12Chevron, Icon28LifebuoyOutline } from '@vkontakte/icons';
import FAQTriggers from './Triggers';
import FAQSymptoms from './Symptoms';

export default class FAQTopic extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isFetching: false,
      activeModal: "",
      chooseSymptoms: [],
      choosedSymptom: null
    }

    this.closeModal = this.closeModal.bind(this);
  }

  onRefresh() {
    this.setState({ isFetching: true });
    this.props.req("support.topics", {
      superGroupId: this.props.openedProduct.id,
      token: this.props.token
    }, (response) => {
      this.props.setOpenedSolution(response.response);
      this.setState({ isFetching: false });
    }, (error) => {
      this.props.createError(error.error?.error_msg);
      this.setState({ isFetching: false });
    })
  }

  closeModal() {
    this.setState({ activeModal: "" });
  }

  getTrigger(symptom) {
    console.log("GETTRIGGER SYM", symptom);
    this.props.setOpenedCategoryId(symptom.id);
    this.props.setPopout(<ScreenSpinner />);
    if (symptom.symptoms.length == 1) {
      this.props.req("support.triggers", {
        superGroupId: this.props.openedProduct.id,
        symptomCategoryId: symptom.id,
        token: this.props.token
      }, (response) => {
        if (response.count > 0) {
          this.props.setOpenedTrigger(response.response);
          console.log("1 sym", symptom.symptoms);
          this.props.setOpenedTriggerTitle([...this.props.openedTriggerTitle, symptom.symptoms[0].name]);
          this.props.setTriggerMode("panel");
          this.props.go("faq-triggers");
        } else {
          this.props.req("support.solutions", {
            superGroupId: this.props.openedProduct.id,
            symptomCategoryId: symptom.id,
            symptomId: symptom.symptoms[0].id,
            token: this.props.token
          }, (response => {
            this.props.setOpenedTSolution(response.response);
            this.props.setOpenedTriggerTitle([...this.props.openedTriggerTitle, symptom.symptoms[0].name]);
            this.props.setPopout(null);
            this.props.go("faq-tsolution");
          }))
        }
      }, (error) => {
        this.props.setPopout(null);
        this.props.createError(error.error?.error_msg);
      })
    } else {
      this.props.setPopout(null);
      this.props.setOpenedTriggerTitle([...this.props.openedTriggerTitle, symptom.name]);
      if (!this.props.isMobile) {
        this.props.setChooseSymptoms(symptom.symptoms);
        this.props.setTriggerMode("panel");
        this.props.go("faq-symptoms");
      } else {
        this.props.setTriggerMode("modal");
        this.setState({
          activeModal: "symptoms",
          chooseSymptoms: symptom.symptoms
        });
      }
    }
  }

  chooseSymptom(symptom) {
    this.setState({ choosedSymptom: symptom });
  }

  componentDidMount() {
    this.props.setPopout(null);

  }

  componentWillUnmount() {
    this.props.setOpenedSolution(null);
    // this.props.setOpenedProduct(null);
  }

  render() {
    const modal = (
      <ModalRoot activeModal={this.state.activeModal}>
        <ModalPage
          id={"triggers"}
          onClose={() => this.setState({ activeModal: "" })}
        >
          <FAQTriggers {...this.props} closeModal={this.closeModal} openedTrigger={this.props.openedTrigger} triggerMode={this.props.triggerMode} />
        </ModalPage>
        <ModalPage
          id={"symptoms"}
          onClose={() => this.setState({ activeModal: "" })}
        >
          <FAQSymptoms {...this.props} symptoms={this.state.chooseSymptoms} closeModal={this.closeModal} getTrigger={this.getTrigger} triggerMode={this.props.triggerMode} />
        </ModalPage>
      </ModalRoot>
    );

    return (
      <ConfigProvider appearance={this.props.appearance} platform={this.props.platform.current}>
        <SplitLayout modal={modal}>
          <SplitCol>
            <Panel>
              <PanelHeader
                left={<PanelHeaderBack onClick={() => this.props.goBack()} />}
              >
                {this.props.openedProduct?.name?.length > 0 ? this.props.openedProduct.name : "Загрузка..."}
              </PanelHeader>
              <PullToRefresh isFetching={this.state.isFetching} onRefresh={() => this.onRefresh()}>
                <Group
                  header={
                    <Title
                      level="2"
                      style={{ marginLeft: "15px", marginTop: "10px" }}
                    >
                      Расскажите нам больше о проблеме
                    </Title>
                  }
                >
                  <Spacing size={30} separator />
                  {this.state.isLoading ? <PanelSpinner /> :
                    <List>
                      {this.props.topic ?
                        this.props.topic.count > 0 ?
                          this.props.topic.items.map((item, idx) => (
                            <Cell
                              key={idx}
                              before={item.icon ?
                                <Avatar
                                  src={item.icon && item.icon}
                                  size={36}
                                  mode="image"
                                  style={{ background: "none" }}
                                  shadow={false}
                                />
                              : undefined}
                              after={<Icon12Chevron width={16} height={16} />}
                              onClick={() => this.getTrigger(item)}
                            >
                              {item.name}
                            </Cell>
                          )) :
                          <Placeholder
                              icon={<Icon28LifebuoyOutline width={56} height={56} />}
                          >
                            Здесь пока ничего нет.
                          </Placeholder>
                        : <PanelSpinner />}
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
