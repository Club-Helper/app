import React, { Component } from 'react'
import Linkify from 'react-linkify';
import { Group, Panel, PanelHeader, Title, Text, Card, Cell, Button, SplitLayout, SplitCol, Div, Footer, Link, Avatar, Separator, FormLayout, FormItem, RadioGroup, Radio, ModalRoot, ModalPage, Placeholder, ModalPageHeader, PanelHeaderButton, Gradient } from '@vkontakte/vkui'
import { Icon24Dismiss, Icon56CancelCircleOutline, Icon56CheckCircleOutline } from '@vkontakte/icons';

export default class Banned extends Component {
  constructor(props) {
    super(props)

    this.state = {
      showQuestions: false,
      ban: this.props,
      questions: [],
      answers: [],
      solution: "",
      activeModal: "",
      modalRoot: null,
      club_role: null
    };
  }

  componentDidMount() {
    if (this.state.ban.reason.type == "blocked_user") {
      this.setState({ questions: this.state.ban.reason.questions });
      if (this.state.ban.reason.questions.length > 1) {
        this.setState({ showQuestions: true });
      }
      this.setState({
        modalRoot: (
          <ModalRoot
            activeModal={this.state.activeModal}
          >
            <ModalPage
              id="ban-info"
              header={<ModalPageHeader right={!this.props.isDesktop && <PanelHeaderButton onClick={() => this.setState({ activeModal: "" })}><Icon24Dismiss /></PanelHeaderButton>}>Блокировка</ModalPageHeader>}
              onClose={() => this.setState({ activeModal: "" })}
            >
              <Cell
                before={<Avatar size={48} src={this.state.ban.reason.content.snippet.photo} />}
                description={this.state.ban.reason.content.snippet.time}
                disabled
              >
                {this.state.ban.reason.content.snippet.title}
              </Cell>
              <Div>{this.state.ban.reason.content.snippet.text}</Div>
            </ModalPage>

            <ModalPage
              id="unbanned"
              header={<ModalPageHeader right={!this.props.isDesktop && <PanelHeaderButton onClick={() => this.setState({activeModal: ""})}><Icon24Dismiss/></PanelHeaderButton>}/>}
              onClose={() => this.setState({ activeModal: "" })}
            >
              <Placeholder
                icon={<Icon56CheckCircleOutline fill='var(--button_commerce_background)' />}
                action={<Link href="https://vk.com/app7938346" target='_blank'><Button>Перезапустить</Button></Link>}
              >
                Аккаунт разблокирован.
              </Placeholder>
              <br />
            </ModalPage>

            <ModalPage
              id="error"
              header={<ModalPageHeader right={!this.props.isDesktop && <PanelHeaderButton onClick={() => this.setState({ activeModal: "" })}><Icon24Dismiss /></PanelHeaderButton>}>Ошибка</ModalPageHeader>}
              onClose={() => this.setState({ activeModal: "" })}
            >
              <Placeholder icon={<Icon56CancelCircleOutline fill='#e64646' />}>
                Произошла ошибка. <br /> Обратитесь в Поддержку.
              </Placeholder>
            </ModalPage>
          </ModalRoot>
        )
      })
    }

    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());
    this.setState({ club_role: params.vk_viewer_group_role })
  }

  qParams(i) {
    const searchParams = new URLSearchParams(window.location.search);
    let obj = i;

    for (const [key, value] of searchParams.entries()) {
      obj[key] = value;
    }

    return obj;
  }

  handleAnswerSelect(e) {
    this.props.req("blocked.question", this.qParams({
      question: e.target.name,
      answer: e.target.value
    }),
      (data) => {
        if (!data.response.solution) {
          this.setState({ questions: [...this.state.questions, data.response] });
        } else {
          this.setState({ solution: data.response.solution });
        }
      }
    )
  }

  handleUnbanButton() {
    this.props.req("blocked.unlock", this.qParams({}), () => {
      this.setState({ activeModal: "unbanned" });
    }, () => {
      this.setState({ activeModal: "error" });
    });
  }

  render() {
    return (
      <SplitLayout modal={this.state.modalRoot}>
        {this.props.isDesktop && <SplitCol width={125} maxWidth={125}/>}
        <SplitCol>
          {this.props.isDesktop && <div style={{marginBottom: "50px"}}/>}

          {this.state.ban.reason.type == "blocked_user" &&
            <Panel id="banned">
              {!this.props.isDesktop && <PanelHeader/>}
              <Group>
                <Div>
                  {this.props.isDesktop ?
                    <Title level='2' style={{ marginTop: "5px" }}>{this.state.ban.reason.title}</Title>
                    :
                    <Title level='3' style={{ marginTop: "5px", marginBottom: "10px" }}>{this.state.ban.reason.title}</Title>
                  }
                  {this.props.isDesktop && <Separator wide style={{ margin: "20px 0" }} />}
                  <Text dangerouslySetInnerHTML={{__html: this.state.ban.reason.text}}/>
                </Div>
                <Div>
                  {this.state.ban.reason.content.type == "moderator" &&
                    <>
                      <Text level='3' style={{ marginBottom: "10px" }}>{this.state.ban.reason.content.title}</Text>

                      <Card mode="outline">
                        <Cell multiline disabled>
                          <Linkify
                            componentDecorator={(decoratedHref, decoratedText, key) => (
                              <Link target="blank" href={decoratedHref} key={key}>
                                {decoratedText}
                              </Link>
                            )}
                          >
                            {this.state.ban.reason.content.block.text}
                          </Linkify>
                        </Cell>
                      </Card>
                    </>
                  }
                  {this.state.ban.reason.content.type == "snippet" &&
                    <Card mode="outline">
                      <Cell style={{ width: "100%", padding: "10px 0" }} multiline disabled>
                        {!this.props.isDesktop ?
                          <>
                            <Text level='3' style={{ marginBottom: "10px" }}>Причина блокировки</Text>
                            <Text style={{marginBottom: "10px"}} dangerouslySetInnerHTML={{__html: this.state.ban.reason.content.title}}/>
                            <Button mode="secondary" stretched onClick={() => this.setState({ activeModal: "ban-info" })}>Подробнее</Button>
                          </>
                          :
                          <>
                            <Cell
                              before={<Avatar size={48} src={this.state.ban.reason.content.snippet.photo} />}
                              description={this.state.ban.reason.content.snippet.time}
                              disabled
                            >
                              {this.state.ban.reason.content.snippet.title}
                            </Cell>
                            <Div>{this.state.ban.reason.content.snippet.text}</Div>
                          </>
                        }
                      </Cell>
                    </Card>
                  }
                </Div>
                {this.state.ban.reason.unlock_availability &&
                  <Div>
                    <center>
                      <Button
                        size="l"
                        stretched={!this.props.isDesktop}
                        onClick={() => this.setState({ showQuestions: true })}

                      >
                        Восстановить доступ
                      </Button>
                    </center>
                  </Div>
                }
              </Group>
              {this.state.showQuestions &&
                this.state.questions.map((question) => (
                  <Group>
                    {question.title &&
                      <>
                        <Div>
                          <Title level='3'>{question.title}</Title>
                        </Div>

                        <Separator />
                      </>
                    }
                    <FormLayout>
                      {question.description &&
                        <FormItem>
                          <Text>{question.description}</Text>
                        </FormItem>
                      }
                      <FormItem>
                        <RadioGroup>
                          {question.answers.map((answer, idx) => (
                            <Radio
                              name={question.id}
                              value={idx}
                              onChange={(e) => {
                                this.setState({ answers: [...this.state.answers, question.id] });
                                this.handleAnswerSelect(e);
                              }}
                              disabled={this.state.answers.includes(question.id) || question.answers.some((element) => element.checked == true)}
                              checked={answer.checked}
                            >
                              {answer.label}
                            </Radio>
                          ))}
                        </RadioGroup>
                      </FormItem>
                    </FormLayout>

                    {!question.answers[0] &&
                      <Div>
                        <center>
                          <Button
                            size="l"
                            stretched={!this.props.isDesktop}
                            onClick={() => this.handleUnbanButton()}
                          >
                            Разблокировать себя
                          </Button>
                        </center>
                      </Div>
                    }
                  </Group>
                ))
              }
              {this.state.solution != "" &&
                <Group>
                  <Div><Text>{this.state.solution}</Text></Div>
                  <Div>
                    <center>
                      <Button
                        size="l"
                        stretched={!this.props.isDesktop}
                        onClick={() => this.handleUnbanButton()}
                      >
                        Разблокировать себя
                      </Button>
                    </center>
                  </Div>
                </Group>
              }
              <Group>
                {this.props.isDesktop ?
                  <Footer style={{ fontSize: "14px" }}>Если Вы считаете, что произошла ошибка, попробуйте восстановить доступ <br /> или обратитесь в <Link href={"https://vk.me/ch_app?ref_source=" + this.props.generateRefSourceString("banned_desktop")} target={"_blank"}>Поддержку</Link></Footer>
                  :
                  <Footer style={{ fontSize: "14px" }}>Если Вы считаете, что произошла ошибка, <br />попробуйте восстановить доступ или <br /> обратитесь в <Link href={"https://vk.me/ch_app?ref_source=" + this.props.generateRefSourceString("banned_mobile")} target={"_blank"}>Поддержку</Link></Footer>
                }
              </Group>
            </Panel>
          }

          {this.state.ban.reason.type == "blocked_club" &&
            <Panel id="banned">
              <Group>
                {!this.props.isDesktop && <PanelHeader/>}
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
                  mode={this.state.ban.appearance == "white" ? "white" : "black"}
                >
                  <Avatar size={96} src={this.state.ban.reason.club.photo} />
                  <Title
                    style={{ marginBottom: 8, marginTop: 20 }}
                    level="2"
                    weight="2"
                  >
                    {this.state.ban.reason.club.title}
                  </Title>
                </Gradient>
                <Separator />
                <Div>
                  <Footer style={{ fontSize: "16px", fontWeight: "500" }}>
                    <Linkify
                      componentDecorator={(decoratedHref, decoratedText, key) => (
                        <Link target="blank" href={decoratedHref} key={key}>
                          {decoratedText}
                        </Link>
                      )}
                    >
                      {this.state.ban.reason.reason}
                    </Linkify>
                  </Footer>
                </Div>
              </Group>
              {["moder", "editor", "admin"].includes(this.state.club_role) &&
                <Group>
                  <Footer style={{ fontSize: "14px" }}>
                    За подробной информацией Вы можете <Link href={"https://vk.me/ch_app?ref_source=" + this.props.generateRefSourceString("own_club_banned")} target={"_blank"}>обратиться в Поддержку</Link>
                  </Footer>
                </Group>
              }
            </Panel>
          }

          {this.state.ban.reason.type == "blocked_device" &&
            <Panel id="banned">
              {!this.props.isDesktop && <PanelHeader/>}
              <Group>
                <Div>
                  {this.props.isDesktop ?
                    <Title level='2' style={{ marginTop: "5px" }}>{this.state.ban.reason.title}</Title>
                    :
                    <Title level='3' style={{ marginTop: "5px", marginBottom: "10px" }}>{this.state.ban.reason.title}</Title>
                  }
                  {this.props.isDesktop && <Separator wide style={{ margin: "20px 0" }} />}
                  <Text dangerouslySetInnerHTML={{__html: this.state.ban.reason.text}}/>
                </Div>
              </Group>
              <Group>
                <Footer style={{ fontSize: "14px" }}>
                  За подробной информацией Вы можете <Link href={"https://vk.me/ch_app?ref_source=" + this.props.generateRefSourceString("device_banned")} target={"_blank"}>обратиться в Поддержку</Link>
                </Footer>
              </Group>
            </Panel>
          }
        </SplitCol>
        {this.props.isDesktop && <SplitCol width={125} maxWidth={125}/>}
      </SplitLayout >
    )
  }
}
