/*******************************************************
 * Авторское право (C) 2021-2022 Club Helper
 *
 * Этот файл является частью мини-приложения Club Helper, размещенного
 * в сети Интернет по адресу https://www.vk.com/app7938346
 *
 * Несанкционированное копирование, инженерный анализ, передача,
 * распространение кода приложения запрещены
 *******************************************************/

import React, { Component } from 'react'

import { Avatar, CellButton, Gradient, Group, ModalCard, ModalPage, ModalPageHeader, ModalRoot, Panel, PanelHeader, PanelHeaderButton, Spacing, SplitCol, SplitLayout, Title, Card, Cell, Div, PanelSpinner, Text, SimpleCell, PanelHeaderClose, Footer, FormLayout, FormItem, Textarea, Radio, FixedLayout, Button, Placeholder, ConfigProvider } from '@vkontakte/vkui'
import { Icon16Chevron, Icon24ReportOutline, Icon28ReportOutline, Icon56CheckCircleOutline, Icon56ErrorTriangleOutline } from '@vkontakte/icons'
import bridge from '@vkontakte/vk-bridge';
import ClubCardMailings from './ClubCardMailings';

export default class ClubCard extends Component {
  constructor(props) {
    super(props)

    this.state = {
      activeModal: "",
      reportForm: null,
      openedReason: null,
      sendButtonDisabled: true,
      sendButtonLoading: false,
      selectedReason: "",
      comment: "",
      errorText: "",
      clubCardMailings: null
    }

    this.updateCCMailings = this.updateCCMailings.bind(this);
  }

  openActions() {
    this.setState({
      activeModal: "actions"
    });
  }

  openReportForm() {
    this.setState({ activeModal: "report" });

    this.props.req("reports.getReportFormData", {
      token: this.props.token
    },
      (data) => {
        this.setState({ reportForm: data.response })
      }
    )
  }

  openReason(reason) {
    this.setState({ activeModal: "reportReason", openedReason: reason });
  }

  sendReport() {
    this.setState({ sendButtonDisabled: true, sendButtonLoading: true });
    bridge.send("VKWebAppAllowMessagesFromGroup", { "group_id": 207049707, "key": this.props.token })
      .then(data => {

        this.props.req("reports.add", {
          reason: this.state.selectedReason.id || this.state.openedReason?.reasons[0].id,
          comment: this.state.comment,
          token: this.props.token
        },
          (data) => {
            this.setState({ activeModal: "" });
            this.setState({ activeModal: "success" });
          },
          (error) => {
            this.setState({ activeModal: "error", errorText: error.error.error_msg });
          }
        );

        this.setState({ sendButtonDisabled: false, sendButtonLoading: false });
      })
      .catch((error) => {
        this.setState(
          {
            sendButtonDisabled: false,
            sendButtonLoading: false,
            activeModal: "error",
            errorText: "Необходимо разрешить сообщения для отправки жалобы, иначе мы не сможем сообщить Вам о рассмотрении жалобы."
          }
        );
      });
  }

  updateCCMailings () {
    this.props.req("mailings.get", {
      token: this.props.token,
      my: true
    },
      (data) => {
        this.setState({clubCardMailings: data.response});
      }
    );
  }

  componentDidMount() {
    this.props.req("mailings.get", {
      token: this.props.token,
      my: true
    },
      (data) => {
        this.setState({clubCardMailings: data.response})
      }
    );
  }

  render() {
    const modal = (
      <ModalRoot
        activeModal={this.state.activeModal}
      >
        <ModalCard
          id="actions"
          actionsLayout={"vertical"}
          onClose={() => this.setState({ activeModal: "" })}
        >
          <CellButton before={<Icon28ReportOutline />}>Пожаловаться</CellButton>
          <Spacing size={20} separator />
          <CellButton mode="danger" onClick={() => this.setState({ activeModal: "" })}>Закрыть</CellButton>
        </ModalCard>

        <ModalPage
          id="report"
          header={<ModalPageHeader right={!this.props.isDesktop && <PanelHeaderClose onClick={() => this.setState({ activeModal: "" })} />}>Пожаловаться</ModalPageHeader>}
          onClose={() => this.setState({ activeModal: "" })}
          settlingHeight={100}
        >
          {this.state.reportForm ?
            <>
              <Div>
                <Card mode="shadow">
                  <Cell
                    after={<Avatar size={48} src={this.state.reportForm.snippet?.photo} />}
                    style={{ padding: "10px 0" }}
                    multiline
                    disabled
                    description={this.state.reportForm.snippet?.text}
                  >
                    {this.state.reportForm.snippet?.name}
                  </Cell>
                </Card>
                <br />
                <Title level='3' weight='2'>{this.state.reportForm?.header}</Title>
              </Div>
              <Spacing size={15} separator />
              {this.state.reportForm?.reason_categories.map((reason, idx) => (
                <SimpleCell
                  key={idx}
                  onClick={() => this.openReason(this.state.reportForm?.reason_categories[idx])}
                  after={<Icon16Chevron fill='var(--text_secondary)' />}
                >
                  {reason.breadcrumb_label}
                </SimpleCell>
              ))}
              {!this.props.isDesktop &&
                <FixedLayout vertical='bottom'>
                  <Div>
                    <Footer style={{ textAlign: "left" }} dangerouslySetInnerHTML={{ __html: this.props.parseLinks(this.state.reportForm?.more) }} />
                  </Div>
                </FixedLayout>
              }

              {this.props.isDesktop &&
                <Div>
                  <Footer style={{ textAlign: "left" }} dangerouslySetInnerHTML={{ __html: this.props.parseLinks(this.state.reportForm?.more) }} />
                </Div>
              }
            </>
            :
            <PanelSpinner />
          }
        </ModalPage>

        <ModalPage
          id="reportReason"
          header={
            <ModalPageHeader
              left={
                this.props.isDesktop &&
                <PanelHeaderClose onClick={() => this.setState({ activeModal: "report" })} />
              }
              right={
                !this.props.isDesktop &&
                <PanelHeaderClose onClick={() => this.setState({ activeModal: "report" })} />
              }
            >
              {this.state.openedReason?.breadcrumb_label}
            </ModalPageHeader>}
          onClose={() => this.setState({ activeModal: "report" })}
          settlingHeight={100}
        >
          {this.state.reportForm &&
            <Div>
              <Card mode="shadow">
                <Cell
                  after={<Avatar size={48} src={this.state.reportForm?.snippet?.photo} />}
                  style={{ padding: "10px 0" }}
                  multiline
                  disabled
                  description={this.state.reportForm?.snippet?.text}
                >
                  {this.state.reportForm.snippet?.name}
                </Cell>
              </Card>
            </Div>
          }
          {this.state.openedReason?.reasons.length > 1 &&
            <Div>
              <Title level='3' weight='2'>{this.state.openedReason?.explanation}</Title>
            </Div>
          }
          {this.state.openedReason?.reasons.length > 1 ?
            this.state.openedReason?.reasons.map((reason, idx) => (
              <Radio
                name="reason_value"
                value={reason.id}
                key={idx}
                description={reason.description}
                onChange={() => this.setState({ selectedReason: reason })}
              >
                {reason.label}
              </Radio>
            ))
            :
            <Div>
              <Title level='3' weight='2'>{this.state.openedReason?.reasons[0].label}</Title>
              <Text style={{ marginTop: "10px" }}>{this.state.openedReason?.reasons[0].description}</Text>
            </Div>
          }

          {this.state.openedReason?.comment_field &&
            <FormLayout>
              <FormItem top={this.state.openedReason?.comment_field.label}>
                <Textarea
                  value={this.state.comment}
                  onChange={(e) => this.setState({ comment: e.target.value })}
                  rows={this.state.openedReason?.comment_field.is_multiline ? 5 : 1}
                  required={this.state.openedReason?.comment_field.is_required}
                  placeholder={this.state.openedReason?.comment_field.placeholder}
                />
              </FormItem>
            </FormLayout>
          }

          <Div>
            <Button
              size="l"
              stretched
              disabled={
                !Boolean(
                  this.state.openedReason?.comment_field?.is_required
                    ? this.state.openedReason?.reasons?.length > 1
                      ? this.state.comment && this.state.selectedReason
                      : this.state.comment
                    : this.state.selectedReason
                )
              }
              loading={this.state.sendButtonLoading}
              onClick={() => this.sendReport()}
            >
              Отправить
            </Button>
          </Div>

          {this.state.openedReason?.more && !this.props.isDesktop &&
            <FixedLayout vertical='bottom'>
              <Div>
                <Footer style={{ textAlign: "left" }} dangerouslySetInnerHTML={{ __html: this.props.parseLinks(this.state.openedReason?.more) }} />
              </Div>
            </FixedLayout>
          }

          {this.state.openedReason?.more && this.props.isDesktop &&
            <Div>
              <Footer style={{ textAlign: "left" }} dangerouslySetInnerHTML={{ __html: this.props.parseLinks(this.state.openedReason?.more) }} />
            </Div>
          }
        </ModalPage>

        <ModalCard
          id="success"
          actionsLayout={"vertical"}
          onClose={() => this.setState({ activeModal: "" })}
        >
          <Placeholder
            icon={<Icon56CheckCircleOutline fill='var(--button_commerce_background)' />}
          >
            Жалоба отправлена модераторам <br />Команды Club Helper.
          </Placeholder>
        </ModalCard>

        <ModalCard
          id="error"
          actionsLayout={"vertical"}
          onClose={() => this.setState({ activeModal: "" })}
        >
          <Placeholder
            icon={<Icon56ErrorTriangleOutline fill='var(--dynamic_red)' />}
          >
            {this.state.errorText}
          </Placeholder>
        </ModalCard>
      </ModalRoot>
    )

    return (
      <ConfigProvider appearance={this.props.appearance} platform={this.props.platform.current}>
        <SplitLayout modal={modal}>
        <SplitCol>
          <Panel id="club-card">
            <PanelHeader left={<PanelHeaderButton onClick={() => this.openReportForm()}><Icon24ReportOutline /></PanelHeaderButton>} />
            <Group>
              {this.props.club ?
                <>
                <Gradient
                  style={{
                    margin: this.props.isDesktop ? "-7px -7px 0 -7px" : 0,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                    padding: 32,
                  }}
                  mode={this.props.appearance == "white" ? "white" : "black"}
                >
                  <Avatar size={96} src={this.props.club?.photo} />
                  <Title
                    style={{ marginBottom: 8, marginTop: 20 }}
                    level="2"
                    weight="2"
                  >
                    {this.props.club?.name}
                  </Title>
                  <Cell
                    after={
                      <svg color="var(--dynamic_orange)" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 12 12"><path fill="currentcolor" d="M5.5.5c.3-.7.7-.7 1 0l1.5 3.5 3.3.3c.7.1.9.5.3 1l-2.6 2.3 1 3.7c.2.7-.1.9-.7.5l-3.3-2.4-3.3 2.4c-.6.4-.9.2-.7-.5l1-3.7-2.6-2.3c-.6-.5-.4-.9.3-1l3.3-.3 1.5-3.5z"/></svg>
                    }
                  >
                    <b>{this.props.club?.rating}</b>&nbsp;
                  </Cell>
                </Gradient>
                  <Spacing size={20} separator />
                  <ClubCardMailings
                    setPopout={this.props.setPopout}
                    mailings={this.state.clubCardMailings?.items}
                    formatRole={this.props.formatRole}
                    token={this.props.token}
                    updateMailings={this.updateCCMailings}
                    createError={this.props.createError}
                    req={this.props.req}
                  />
                </>
                : <PanelSpinner />}
            </Group>
          </Panel>
        </SplitCol>
        </SplitLayout>
      </ConfigProvider>
    )
  }
}
