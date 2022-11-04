import { Icon12Chevron, Icon28LifebuoyOutline } from '@vkontakte/icons';
import { Avatar, Cell, ConfigProvider, Group, List, Panel, PanelHeader, PanelHeaderBack, ScreenSpinner, PanelHeaderClose, Placeholder, SplitCol, SplitLayout, ModalPageHeader } from '@vkontakte/vkui';
import React, { Component } from 'react';

export default class FAQSymptoms extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeModal: ""
    }
  }

  getTrigger(symptom) {
    this.props.setOpenedSymptom(symptom);
    this.props.setPopout(<ScreenSpinner />);
    this.props.req("support.triggers", {
      superGroupId: this.props.openedProduct.id,
      symptomCategoryId: this.props.openedCategoryId,
      symptomId: symptom.id,
      token: this.props.token
    }, (response) => {
      if (response.response.count > 0) {
        this.props.setPopout(null);
        this.props.setOpenedTriggerTitle([...this.props.openedTriggerTitle, symptom.name]);
        this.props.setOpenedTrigger(response.response);
        this.props.setTriggerMode("panel");
        this.props.go("faq-triggers");
      } else {
        this.props.req("support.solutions", {
          superGroupId: this.props.openedProduct.id,
          symptomCategoryId: symptom.id,
          symptomId: symptom.id,
          token: this.props.token
        }, (response => {
          this.props.setOpenedTSolution(response.response);
          this.props.setOpenedTriggerTitle([...this.props.openedTriggerTitle, symptom.name]);
          this.props.setPopout(null);
          this.props.go("faq-tsolution");
        }))
      }
    }, (error) => {
      this.props.setPopout(null);
      this.props.createError(error.error?.error_msg);
    })
  }

  render() {
    return (
      <ConfigProvider appearance={this.props.appearance} platform={this.props.platform.current}>
        <SplitLayout>
          <SplitCol>
            <Panel>
              {this.props.triggerMode == "modal" ?
                <ModalPageHeader
                  left={<PanelHeaderClose onClick={() => {
                    this.props.openedTriggerTitle.pop();
                    this.props.closeModal()
                  }
                  } />}
                >
                  {this.props.openedTriggerTitle[this.props.openedTriggerTitle.length - 1]}
                </ModalPageHeader>
                :
                <PanelHeader left={
                  <PanelHeaderBack onClick={() => {
                    this.props.openedTriggerTitle.pop();
                    this.props.goBack()
                  }} />
                }>
                  {this.props.openedTriggerTitle[this.props.openedTriggerTitle.length - 1]}
                </PanelHeader>}
              {this.props.isMobile
                ?
                    <List>
                      {this.props.symptoms.length > 0 ?
                      this.props.symptoms.map((item, idx) => (
                        <Cell
                          multiline
                          key={idx}
                          before={item.icon ?
                            <Avatar
                              src={item.icon && item.icon}
                              size={36}
                              mode="image"
                              style={{ background: "none" }}
                              shadow={false}
                            /> : undefined}
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
                      }
                    </List>
                :
                <Group>
                  <List>
                    {this.props.symptoms.length > 0 ?
                      this.props.symptoms.map((item, idx) => (
                        <Cell
                          multiline
                          key={idx}
                          before={item.icon ?
                            <Avatar
                              src={item.icon && item.icon}
                              size={36}
                              mode="image"
                              style={{ background: "none" }}
                              shadow={false}
                            /> : undefined}
                          after={<Icon12Chevron width={16} height={16} />}
                          onClick={() => this.getTrigger(item)}
                        >
                          {item.name}
                        </Cell>
                      )) : <Placeholder
                        icon={<Icon28LifebuoyOutline width={56} height={56} />}
                      >
                        Здесь пока ничего нет.
                      </Placeholder>}
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
