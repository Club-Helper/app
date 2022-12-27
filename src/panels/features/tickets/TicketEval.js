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

import { ConfigProvider, CustomSelectOption, FormItem, FormLayout, Group, Headline, Select, SplitCol, SplitLayout, Title, Textarea, Banner, Link, Button, Alert, AdaptivityProvider, AppRoot, Placeholder, ModalRoot, ModalPage, Div, Spacing, Footer } from '@vkontakte/vkui'
import { Icon28WarningTriangleOutline, Icon56CheckCircleOutline } from '@vkontakte/icons';

import bridge from '@vkontakte/vk-bridge';

import '../../../css/tickets/eval.css';

import { ReactComponent as Bad } from '../../../img/svg/emoji/bad.svg';
import { ReactComponent as BadGray } from '../../../img/svg/emoji/bad_gray.svg';

import { ReactComponent as Normal } from '../../../img/svg/emoji/normal.svg';
import { ReactComponent as NormalGray } from '../../../img/svg/emoji/normal_gray.svg';

import { ReactComponent as Good } from '../../../img/svg/emoji/good.svg';
import { ReactComponent as GoodGray } from '../../../img/svg/emoji/good_gray.svg';

export default class TicketEval extends Component {
  constructor(props) {
    super(props)

    this.state = {
      groupID: window.location.search.indexOf('vk_group_id=') !== -1 ? window.location.search.split('vk_group_id=')[1].split('&')[0] : 0,
      initialMark: null,
      initialError: false,
      initialErrorText: null,
      token: this.props.token,
      mark: null,
      markFormText: null,
      selectedReason: null,
      marks: {
        good: [
          { name: "quick-solution", text: "Мой вопрос был быстро решён" },
          { name: "detailed-response", text: "Объяснения были понятными и подробными" },
          { name: "understands-topic", text: "Администратор отлично разбирается в теме вопроса" },
        ],
        normal: [
          { name: "not-quick-solution", text: "Мой вопрос был решён не сразу" },
          { name: "not-detailed-response", text: "Объяснения были недостаточно подробными" },
          { name: "not-understands-topic", text: "Администратор недостаточно разбирается в теме вопроса" },
          { name: "rude-answers", text: "Ответы были грубыми" },
        ],
        bad: [
          { name: "very-long-consideration", text: "Затянутое обсуждение вопроса" },
          { name: "bad-response", text: "Непонятные объяснения" },
          { name: "bad-understands-topic", text: "Администратор плохо разбирается в теме вопроса" },
          { name: "bad-solution", text: "Меня не устраивает решение администратора" },
          { name: "very-rude-answers", text: "Ответы были грубыми" },
          { name: "other", text: "Другое" },
        ]
      },
      customReasonText: "",
      customReasonValidation: "",
      buttonLoading: false,
      activeModal: null,
    }

    this.setMark = this.setMark.bind(this);
    this.handleReasonChange = this.handleReasonChange.bind(this);
    this.handleReportCustomReasonChange = this.handleReportCustomReasonChange.bind(this);
    this.handleSendReport = this.handleSendReport.bind(this);
    this.openSentModal = this.openSentModal.bind(this);
    this.closeSentModal = this.closeSentModal.bind(this);
    this.getMarkTypeByMarkName = this.getMarkTypeByMarkName.bind(this);
    this.getMarkTextByMarkName = this.getMarkTextByMarkName.bind(this);

    fetch("https://cloud-apps.ru/api/app.marks" + window.location.search + "&ticket=" + window.location.hash.split("/")[1])
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          this.setState({ initialError: true, initialErrorText: data.error.error_msg })
        } else {
          if (!data.response.setMark) {
            this.setState({ initialMark: data.response.mark })
          }
        }
      })
  }

  /**
   * Ставит оценку Плохо, Нормально либо Хорошо и устанавливает
   * заголовок для FormInput с выбором причины
   *
   * @param {string} mark
   */
  setMark(mark) {
    if (this.state.mark != mark) {
      this.setState({
        mark: mark,
        selectedReason: null,
      });

      //let reasons = this.state.formReasons;

      const title = {
        "bad": "Что Вам не понравилось?",
        "normal": "Чего Вам не хватило?",
        "good": "Что Вам понравилось больше всего?"
      }
      this.setState({
        markFormText: title[mark],
        formReasonsFiltered: this.state.marks[mark]
      });
    } else {
      this.setState({ mark: null, selectedReason: null });
    }
  }

  handleReasonChange(e) {
    this.setState({ selectedReason: e.target.value });
  }

  handleReportCustomReasonChange(e) {
    let reason = e.target.value;
    if (reason != '' && reason.length > 10 && /^\s+$/.test(reason) === false && /^[^\s][^_\s]*$/.test(reason) === true) {
      this.setState({ customReasonText: e.target.value, customReasonValidation: "" });
    } else {
      this.setState({ customReasonText: e.target.value, customReasonValidation: "error" });
    }
  }

  setMarks() {
    fetch("https://cloud-apps.ru/api/app.marks" + window.location.search + "&ticket=" + window.location.hash.split("/")[1])
      .then(response => response.json())
      .then(data => {
          console.log(data)
          if (data.error) {
            this.props.createError(data.error.error_msg);
          } else {
            fetch("https://cloud-apps.ru/api/app.setMarks", {
              method: "POST",
              body: JSON.stringify({
                "token": data.response.token,
                "ticket": window.location.hash.split("/")[1],
                "mark": this.state.selectedReason,
                "info": this.state.customReasonText ? this.state.customReasonText : null
              })
            })
              .then(response => response.json())
              .then(data => {
                console.log(data);
                if (data.error) {
                  this.props.createError(data.error.error_msg);
                } else {
                  this.openSentModal();
                }
              });
          }
        }
      );

    this.setState({ buttonLoading: false });
  }

  handleSendReport() {
    this.setState({ buttonLoading: true });

    if (this.state.mark == "bad") {
      bridge.send("VKWebAppAllowMessagesFromGroup", { "group_id": 207049707, "key": this.state.token })
        .then(data => {
          console.log(data)
          this.setMarks();
        })
        .catch(error => {
          this.props.setPopout(
            <Alert
              actions={[
                {
                  title: "Закрыть",
                  autoclose: true,
                  mode: "cancel",
                }
              ]}
              actionsLayout="vertical"
              onClose={() => this.props.setPopout(null)}
              header="Ошибка"
              text="Для отправки жалобы Вы должны разрешить Команде поддержки Club Helper отправлять Вам сообщения"
            />
          )
          this.setState({ buttonLoading: false });

          console.error(error);
        });
    }else {
      this.setMarks();
    }
  }

  openSentModal() {
    this.setState({ activeModal: "sent" })
  }

  closeSentModal() {
    this.setState({ activeModal: null })
  }

  /**
   * Возвращает тип оценки (Плохая, Нормальная, Хорошая) по
   * названию причины оценки
   *
   * @param {string} name - Название причины оценки
   * @returns {string}
   */
  getMarkTypeByMarkName(name) {
    if (this.state.marks.bad.find(item => item.name === name)) {
      return "bad";
    } else if (this.state.marks.normal.find(item => item.name === name)) {
      return "normal"
    } else if (this.state.marks.good.find(item => item.name === name)) {
      return "good";
    } else {
      return "Error";
    }
  }

  /**
   * Возвращает текст причины оценки по её названию
   *
   * @param {string} name - Название причины оценки
   * @returns {{text: *, title: string}}
   */
  getMarkTextByMarkName(name) {
    switch (this.getMarkTypeByMarkName(name)) {
      case "bad":
        return { title: "Что Вам не понравилось?", text: this.state.marks.bad.find(item => item.name === name).text }
      case "normal":
        return { title: "Чего Вам не хватило?", text: this.state.marks.normal.find(item => item.name === name).text }
      case "good":
        return { title: "Что Вам понравилось больше всего?", text: this.state.marks.good.find(item => item.name === name).text }
      default:
        break;
    }
  }

  render() {
    const modal = (
      <ModalRoot activeModal={this.state.activeModal}>
        <ModalPage
          id='sent'
          settlingHeight={100}
        >
          <Placeholder icon={<Icon56CheckCircleOutline fill="#8abf77" />}>
            {this.state.mark != "bad" ? "Спасибо за отзыв! Вы помогаете нам стать лучше" : "Ваша жалоба отправлена Команде поддержки Club Helper."}
          </Placeholder>
        </ModalPage>
      </ModalRoot>
    );

    if (this.state.groupID != 0) {
      if (!this.state.initialError) {
        if (!this.state.initialMark) {
          return (
            <ConfigProvider platform={this.props.platform.current} appearance={this.props.appearance}>
              <AdaptivityProvider>
                <AppRoot>
                  <SplitLayout modal={modal}>
                    {this.props.isMobile == false && <SplitCol width={200} maxWidth={200} />}
                    <SplitCol>
                      {this.props.isMobile == false && <React.Fragment><br /></React.Fragment>}
                      <Group mode='plain' separator='hide'>
                        <div style={!this.props.isMobile ? { padding: "10px" } : {}}>
                          <center>
                            <Title style={!this.props.isMobile ? { marginTop: "10px" } : { marginTop: "100px" }}>Как Вам наш ответ?</Title>
                            <Headline style={{ marginTop: "10px", marginBottom: "20px", maxWidth: "80%" }}>Ваши оценки помогут сообществу{this.props.club ? " «" + this.props.club.name + "»" : ""} стать лучше.</Headline>
                            <br />

                            <div className="clubHelper--marks">
                              <div onClick={() => this.setMark("bad")} className="clubHelper--mark">
                                {this.state.mark == "bad" && <Bad />}
                                {this.state.mark != "bad" && <BadGray />}
                                <div className="clubHelper--mark-text" style={
                                  this.state.mark != "bad" ? {
                                    color: "var(--text_subhead)"
                                  }
                                    : {
                                      color: "var(--text_muted)",
                                      fontWeight: 500,
                                      WebkitFontSmoothing: "subpixel-antialiased"
                                    }
                                }>
                                  Плохо
                                </div>
                              </div>
                              <div onClick={() => this.setMark("normal")} className="clubHelper--mark">
                                {this.state.mark == "normal" && <Normal />}
                                {this.state.mark != "normal" && <NormalGray />}
                                <div className="clubHelper--mark-text" style={
                                  this.state.mark != "normal" ? {
                                    color: "var(--text_subhead)"
                                  }
                                    : {
                                      color: "var(--text_muted)",
                                      fontWeight: 500,
                                      WebkitFontSmoothing: "subpixel-antialiased"
                                    }
                                }>
                                  Нормально
                                </div>
                              </div>
                              <div onClick={() => this.setMark("good")} className="clubHelper--mark">
                                {this.state.mark == "good" && <Good />}
                                {this.state.mark != "good" && <GoodGray />}
                                <div className="clubHelper--mark-text" style={
                                  this.state.mark != "good" ? {
                                    color: "var(--text_subhead)"
                                  }
                                    : {
                                      color: "var(--text_muted)",
                                      fontWeight: 500,
                                      WebkitFontSmoothing: "subpixel-antialiased"
                                    }
                                }>
                                  Хорошо
                                </div>
                              </div>
                            </div>
                          </center>
                        </div>
                      </Group>

                      {this.state.mark &&
                        <Group mode='plain' separator='hide' style={{ marginTop: "35px" }}>
                          <FormLayout>
                            <FormItem
                              top={this.state.markFormText != null ? this.state.markFormText : ""}
                            >
                              <Select
                                placeholder='Выберите причину'
                                options={
                                  this.state.formReasonsFiltered.map((item) => ({
                                    label: item.text,
                                    value: item.name
                                  }))
                                }
                                renderOption={({ option, ...restProps }) => (
                                  <CustomSelectOption
                                    {...restProps}
                                  />
                                )}
                                onChange={
                                  (e) => this.handleReasonChange(e)
                                }
                              />
                            </FormItem>
                            {this.state.selectedReason == "other" &&
                              <FormItem status={this.state.customReasonValidation}>
                                <Textarea
                                  placeholder="Введите причину жалобы"
                                  value={this.state.customReasonText}
                                  onChange={(e) => this.handleReportCustomReasonChange(e)}
                                />
                              </FormItem>
                            }
                            {this.state.mark == "bad" &&
                              <Footer className="clubHelper--mark-footer">Плохую оценку мы рассматриваем как возможное нарушение правил сервиса, поэтому вместе с оценкой будет сформирована жалоба</Footer>
                            }
                            <FormItem>
                              <Button
                                stretched
                                size="l"
                                disabled={
                                  this.state.selectedReason === null ||
                                  this.state.selectedReason == "other" &&
                                  this.state.customReasonText == "" || this.state.customReasonValidation == 'error'}
                                onClick={this.handleSendReport}
                                loading={this.state.buttonLoading}
                              >
                                {this.state.mark == "bad" ? "Отправить жалобу" : "Отправить отзыв"}
                              </Button>
                            </FormItem>
                            {this.state.mark == "bad" &&
                              <Banner
                                before={
                                  <Icon28WarningTriangleOutline fill="#ffb73d" />

                                }
                                header={"Эта жалоба будет рассмотрена Командой Club Helper"}
                                subheader={
                                  <React.Fragment>
                                    Вместе с отправкой жалобы, Вы передадите Команде Club Helper право просмотра данного обращения. В случае одобрения Вашей жалобы мы можем лишь ограничить сообществу использование нашего сервиса.
                                    <br /><br />
                                    Если сообщество нарушает Правила ВКонтакте, Вам следует <Link href="https://vk.com/support?act=faqs_moderation&c=1" target='_blank'>отправить жалобу ВКонтакте</Link>.
                                  </React.Fragment>
                                }
                              />
                            }
                          </FormLayout>
                        </Group>
                      }
                    </SplitCol>
                    {this.props.isMobile == false && <SplitCol width={200} maxWidth={200} />}
                  </SplitLayout>
                </AppRoot>
              </AdaptivityProvider >
            </ConfigProvider >
          )
        } else {
          return (
            <ConfigProvider platform={this.props.platform.current} appearance={this.props.appearance}>
              <AdaptivityProvider>
                <AppRoot>
                  <SplitLayout>
                    <SplitCol>
                      <Placeholder header="Вы уже оценили это обращение">
                        <Div style={{ marginTop: "-20px", marginBottom: "20px" }}>Ваш отзыв помогает сообществу стать лучше</Div>
                        <br />
                        <div className="clubHelper--marks">
                          <div className="clubHelper--mark">
                            <img src={bad} style={this.getMarkTypeByMarkName(this.state.initialMark) != "bad" ? { filter: "grayscale(100%)" } : {}}  alt=""/>
                            <div style={
                              this.getMarkTypeByMarkName(this.state.initialMark) != "bad" ? {
                                color: "var(--text_subhead)"
                              }
                                : {
                                  color: "var(--text_muted)",
                                  fontWeight: 500,
                                  WebkitFontSmoothing: "subpixel-antialiased"
                                }
                            }>
                              Плохо
                            </div>
                          </div>
                          <div className="clubHelper--mark">
                            <img src={normal} style={this.getMarkTypeByMarkName(this.state.initialMark) != "normal" ? { filter: "grayscale(100%)" } : {}}  alt=""/>
                            <div style={
                              this.getMarkTypeByMarkName(this.state.initialMark) != "normal" ? {
                                color: "var(--text_subhead)"
                              }
                                : {
                                  color: "var(--text_muted)",
                                  fontWeight: 500,
                                  WebkitFontSmoothing: "subpixel-antialiased"
                                }
                            }>
                              Нормально
                            </div>
                          </div>
                          <div className="clubHelper--mark">
                            <img src={good} style={this.getMarkTypeByMarkName(this.state.initialMark) != "good" ? { filter: "grayscale(100%)" } : {}}  alt=""/>
                            <div style={
                              this.getMarkTypeByMarkName(this.state.initialMark) != "good" ? {
                                color: "var(--text_subhead)"
                              }
                                : {
                                  color: "var(--text_muted)",
                                  fontWeight: 500,
                                  WebkitFontSmoothing: "subpixel-antialiased"
                                }
                            }>
                              Хорошо
                            </div>
                          </div>
                        </div>
                      </Placeholder>
                      <center>
                        <Spacing size={20} separator style={{ width: "70vw" }} />

                        <Div>
                          <Title level='3'>{this.getMarkTextByMarkName(this.state.initialMark).title}</Title>

                          {this.getMarkTextByMarkName(this.state.initialMark).text}
                        </Div>
                      </center>

                    </SplitCol>
                  </SplitLayout>
                </AppRoot>
              </AdaptivityProvider>
            </ConfigProvider >
          );
        }
      } else {
        return (
          <ConfigProvider platform={this.props.platform.current} appearance={this.props.appearance}>
            <AdaptivityProvider>
              <AppRoot>
                <SplitLayout>
                  <SplitCol>
                    <Placeholder>
                      {this.state.initialErrorText}
                    </Placeholder>
                  </SplitCol>
                </SplitLayout>
              </AppRoot>
            </AdaptivityProvider>
          </ConfigProvider>
        );
      }
    } else {
      <ConfigProvider platform={this.props.platform.current} appearance={this.props.appearance}>
        <AdaptivityProvider>
          <AppRoot>
            <Placeholder>
              Для оценки ответа запустите приложение из сообщества.
            </Placeholder>
          </AppRoot>
        </AdaptivityProvider>
      </ConfigProvider>
    }
  }
}
