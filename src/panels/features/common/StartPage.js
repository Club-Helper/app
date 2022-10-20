/*******************************************************
 * Авторское право (C) 2021-2022 Club Helper
 *
 * Этот файл является частью мини-приложения Club Helper, размещенного
 * в сети Интернет по адресу https://www.vk.com/app7938346
 *
 * Несанкционированное копирование, инженерный анализ, передача,
 * публичная демонстрация, распространение кода приложения запрещены
 *******************************************************/

import React from "react";
import {
  Button, Gallery, Link, Progress, Text, Title, getClassName, Spinner, Alert, SplitLayout, ModalRoot, ModalCard, Div, ButtonGroup
} from '@vkontakte/vkui';
import {
  Icon24MessagesOutline,
  Icon24Linked,
  Icon28Settings,
  Icon24LifebuoyOutline,
  Icon28ShoppingCartOutline,
  Icon28UserOutline,
  Icon28KeySquareOutline,
  Icon28LockOutline,
  Icon28DownloadCloudOutline,
  Icon28SettingsOutline,
  Icon28CancelCircleOutline,
} from "@vkontakte/icons";
import bridge from "@vkontakte/vk-bridge";

import '../../../css/startPage.css';
import { localStorage } from "@vkontakte/vkjs";

const URL = window.location.search;

const groupID = URL.indexOf('vk_group_id=') !== -1 ? URL.split('vk_group_id=')[1].split('&')[0] : 0;
const roleUser = URL.indexOf('vk_viewer_group_role=') !== -1 ? URL.split('vk_viewer_group_role=')[1].split('&')[0] : "none";

let newGroupID = 0;
let typeStartPage = !(groupID === 0 || roleUser !== 'admin');

const maxPage = 5;
let countPageStart = typeStartPage ? maxPage : (maxPage - 1);

const textButton = ['Далее', 'Есть что-то ещё?', 'Хорошо, буду ждать', (typeStartPage ? 'Предоставить права доступа' : 'Установить'), 'Приступим к работе'];

const SlideStart = ({ children, platform }) => {
  const baseClassNames = getClassName('clubHelper--slideStart', platform);

  return (
    <div className={baseClassNames}>
      {children}
    </div>
  );
}

class StartPage extends React.Component {
  constructor(props) {
    super(props);

    let activeSlide = localStorage.getItem('checkEduceation') === groupID ? (typeStartPage ? countPageStart - 2 : countPageStart - 1) : 0;
    this.props.setGroupId(URL.indexOf('vk_group_id=') !== -1 ? URL.split('vk_group_id=')[1].split('&')[0] : 0);

    this.state = {
      slideIndex: activeSlide,
      isDraggable: true,
      showArrows: true,
      textNextButton: textButton[activeSlide],
      textNoButton: false,
      noButton: false,
      load: {
        isLoad: false,
        isError: false,
        textError: "",
        codeError: 0,
        msgError: ""
      },
      access_token: null,
      activeModal: ""
    }

    if (localStorage.getItem('checkToken') === 'true' && localStorage.getItem('checkEduceation') === groupID) {
      console.log('setting');
      this.props.setIsNew(false);
      this.props.setActiveStory("tickets_list")
    }
  }


  settingClub(clubID, token) {
    this.props.req("clubs.startSetting", {
      token: token
    },
      (response) => {
        if (response['response']) {
          this.setState({
            load: {
              isLoad: false
            }
          });

          if (response['response'] === 1) {
            this.props.reCheckState();
          }
        } else {
          this.setState({
            load: {
              isLoad: false,
              isError: true,
              codeError: response['error']['error_code'],
              msgError: response['error']['error_msg'],
              textError: response['error']['error_info']
            }
          });
          this.props.setPopout(
            <Alert
              actions={[
                {
                  title: "Закрыть",
                  mode: "cancel",
                }
              ]}
              actionsLayout="vertical"
              onClose={() => { }}
              header="Ошибка"
              text={"Сообщество не удалось настроить: " + response['error']['error_msg']}
            />
          )
        }

        this.props.req("clubs.get", {
          token: this.props.token
        },
          (data) => {
            this.props.setClub(data.response);
          }
        )

        this.props.setPage("app");
        this.props.setIsNew(false);
        this.props.setActiveStory("tickets_list")
      },
      () => {
        this.setState({
            load: {
              isLoad: false,
              isError: true
            }
          }
        )
      })
  }

  handleBackClick() {
    const { slideIndex } = this.state;
    const newSlideIndex = (slideIndex - 1) % countPageStart;

    if (newSlideIndex < 0) return false;

    this.setState({
      slideIndex: newSlideIndex,
      textNextButton: textButton[newSlideIndex]
    });
  }

  handleClick(isArrow) {
    const { slideIndex } = this.state;
    const newSlideIndex = (slideIndex + 1) % countPageStart

    if (slideIndex < 3) {
      this.setState({
        slideIndex: newSlideIndex,
        textNextButton: textButton[newSlideIndex]
      });
    } else if (!isArrow && slideIndex === 3) {
      if (this.state.load.isLoad) return;

      if (typeStartPage) {
        this.setState({
          load: {
            isLoad: true,
          }
        });

        bridge
          .send("VKWebAppGetCommunityToken", { "app_id": 7938346, "group_id": Number(URL.indexOf('vk_group_id=') !== -1 ? URL.split('vk_group_id=')[1].split('&')[0] : 0), "scope": "messages,manage,wall" })
          .then(data => {
            console.log('Получено разрешение на права доступа', this.props.token);

            this.props.req("clubs.creat", {
              'access_token': data.access_token,
              'token': this.props.token
            },
              (response) => {
                if (response.error == null) {
                  console.log('Сообщество создано в базе');
                  console.log(response);

                  this.props.setIsNew(false);
                  console.log(this.props.activeStory)

                  this.setState({
                    load: {
                      isLoad: false
                    }
                  });

                  localStorage.setItem('checkEduceation', groupID);
                  localStorage.setItem('checkToken', 'true');

                  if (response['response']) {
                    this.setState({
                      slideIndex: newSlideIndex,
                      noButton: true
                    });

                    this.settingClub(groupID, this.props.token);
                  }

                  this.props.setActiveStory("tickets_list")
                } else {
                  console.log('Сообщество не удалось создать в базе');
                  console.log(response.error)

                  this.setState({
                    load: {
                      isLoad: false,
                      isError: true
                    }
                  });

                  console.log(window.token);

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
                      text={response.error.error_msg}
                    />
                  )
                }
              },
              (error) => {
                console.log('Сообщество неудалось создать в базе');

                this.setState({
                  load: {
                    isLoad: false,
                    isError: true
                  }
                });
              });
          })
          .catch((error) => {
            console.log('Разрешение не было получено');

            this.setState({
              load: {
                isLoad: false,
              }
            });
          });
      } else {
        if (this.state.load.isLoad) return;

        this.setState({
          load: {
            isLoad: true,
          }
        });

        bridge
          .send("VKWebAppAddToCommunity")
          .then(data => {
            newGroupID = data.group_id;

            localStorage.setItem('checkEduceation', newGroupID);

            this.setState({
              textNoButton: true,
              noButton: true,
              load: {
                isLoad: false,
              }
            });
          })
          .catch(() => {
            this.setState({
              load: {
                isLoad: false,
              }
            });
          });
      }
    } else if (slideIndex === 4) {

    }
  }

  componentDidMount() {
    this.props.setPopout(null);
    this.props.lastClubID && this.setState({ activeModal: "openLastGroup" });
  }

  render() {
    const { slideIndex, textNextButton } = this.state;
    const { platform } = this.props;
    const slideIndexProgress = slideIndex === 0 ? 1 : slideIndex + 1;

    const modal = (
      <ModalRoot activeModal={this.state.activeModal}>
        <ModalCard
          id="openLastGroup"
          actions={
            (
              <ButtonGroup stretched>
                <Link style={{ width: "50%" }} href={"https://vk.com/app7938346_-" + this.props.lastClubID?.id} target="_blank"><Button size="m" style={{ width: "100%" }}>Перейти</Button></Link>
                <Button size="m" style={{ width: "50%" }} mode="secondary" onClick={() => this.setState({ activeModal: "" })}>Отмена</Button>
              </ButtonGroup>)
          }
          actionsLayout="horizontal"
          onClose={() => this.setState({ activeModal: "" })}
        >
          <Div>
            Вы недавно запускали приложение в сообществе <b>{this.props.lastClubID?.title}</b>. Хотите перейти в него?
          </Div>
        </ModalCard>
      </ModalRoot>
    );

    return (
      <div style={{ width: "100%", height: "100%", position: "fixed" }}>
        <SplitLayout modal={modal}>
          <Gallery
            slideWidth="100%"
            align="center"
            slideIndex={slideIndex}
            isDraggable={false}
            showArrows={false}
          >
            <SlideStart platform={platform}>
              <div className="clubHelper--gearImage clubHelper--gearImage__1"><Icon28Settings width={280} height={280} /></div>
              <div className="clubHelper--gearImage clubHelper--gearImage__2"><Icon28Settings width={400} height={400} /></div>

              <Title level="1" weight="bold" className="clubHelper--title clubHelper--title__1">Club Helper</Title>
              <Text weight="regular" className="clubHelper--description clubHelper--description__1">Поможет давать фидбек подписчикам</Text>

              <ul className="clubHelper--flexIconInfoBlcok">
                <li className="clubHelper--info">
                  <Icon24MessagesOutline width={46} height={46} fill="#FFFFFF" />
                  <Text weight="medium" style={{ fontSize: 18, color: "#FFFFFF" }}>Автоматизируйте процесс запроса информации через комментарии</Text>
                  <Text weight="medium" style={{ marginTop: 5, opacity: .5 }}>Вы отправялете команду, а всё остальное сделает робот</Text>
                </li>
                <li className="clubHelper--imageInfo">
                  <div className="clubHelper--comment clubHelper--comment__user">
                    <div className="clubHelper--comment__avatar">
                      <Icon28UserOutline />
                    </div>
                    <div className="clubHelper--comment__content">
                      <Text weight="semibold">Иван Сергеев</Text>
                      <Text weight="regular">Почему при использовании промокода на вашем сайте пишет промокод уже использован!?</Text>
                    </div>
                  </div>
                  <div className="clubHelper--comment clubHelper--comment__club clubHelper--comment__1">
                    <div className="clubHelper--comment__avatar">
                      <Icon28ShoppingCartOutline />
                    </div>
                    <div className="clubHelper--comment__content">
                      <Text weight="semibold">Магазин</Text>
                      <Text weight="regular">/Запрос промокод</Text>
                    </div>
                  </div>
                  <div className="clubHelper--comment clubHelper--comment__club clubHelper--comment__2">
                    <div className="clubHelper--comment__avatar">
                      <Icon28ShoppingCartOutline />
                    </div>
                    <div className="clubHelper--comment__content">
                      <Text weight="semibold">Магазин</Text>
                      <Text weight="regular">Добрый день, Иван!<br />Пожалуйста, напишите нам в личные сообщения Ваш промокод, проверим, что могло пойти не так</Text>
                    </div>
                  </div>
                </li>
              </ul>
            </SlideStart>
            <SlideStart platform={platform}>
              <Title level="1" weight="bold" className="clubHelper--title clubHelper--title__2">Ускорьте сортировку</Title>
              <Text weight="regular" className="clubHelper--description clubHelper--description__2">Если у Вас несколько сотрудников, отвечающих на вопросы</Text>

              <ul className="clubHelper--flexIconInfoBlcok">
                <li className="clubHelper--info">
                  <Icon24Linked width={46} height={46} fill="#FFFFFF" />
                  <Text weight="medium" style={{ fontSize: 18, color: "#FFFFFF" }}>Автоматически направляйте сообщения пользователей к нужному сотруднику сообщества</Text>
                  <Text weight="medium" style={{ marginTop: 5, opacity: .5 }}>Нужно всего лишь, чтобы пользователь написал через специальную ссылку</Text>
                </li>
                <li className="clubHelper--imageInfo">
                  <div className="clubHelper--URL">
                    <Text weight="regular" style={{ color: "#FFFFFF" }}>vk.com</Text>
                  </div>
                  <div className="clubHelper--message">
                    <div className="clubHelper--message__avatar">
                      <Icon28UserOutline fill="#2787f5" />
                    </div>
                    <div className="clubHelper--message__content">
                      <Text weight="regular">Здраствуйте, я хотела заказть платье в вашем интернет-магазине. Но нужного размера не оказалось, мне предложили связаться с Вами, чтобы подобрать похожую модель по цвету и материалу ткани</Text>
                    </div>
                  </div>
                  <div className="clubHelper--message clubHelper--message__club">
                    <div className="clubHelper--message__content">
                      <Text weight="regular">Добрый день, Мария!<br />Нам жаль, что не нашлось нужного Вам размера. В ближайшее время с Вами свяжется наш консультант по подбору и поможет подобрать идеальный вариант ;)</Text>
                    </div>
                    <div className="clubHelper--message__avatar">
                      <Icon28ShoppingCartOutline fill="#2787f5" />
                    </div>
                  </div>
                </li>
              </ul>
              <br/><br/>
            </SlideStart>
            <SlideStart platform={platform}>
              <div class="clubHelper--bottom">
                <div className="clubHelper--gearImage clubHelper--gearImage__3"><Icon28Settings width={280} height={280} /></div>
                <div className="clubHelper--gearImage clubHelper--gearImage__4"><Icon28Settings width={380} height={380} /></div>
                <div className="clubHelper--gearImage clubHelper--gearImage__5"><Icon28Settings width={380} height={380} /></div>

                <Title level="1" weight="bold" className="clubHelper--title clubHelper--title__3">Улучшите фидбек</Title>

                <ul className="clubHelper--flexIconInfoBlcok" style={{ justifyContent: "center", marginBottom: "250px !important" }}>
                  <li className="clubHelper--info" style={{ maxWidth: "80%" }}>
                    <Icon24LifebuoyOutline width={46} height={46} fill="#FFF" />
                    <Text weight="medium" style={{ fontSize: 18, color: "#FFFFFF" }}>Чат с поддержкой</Text>
                    <Text weight="medium" style={{ marginTop: 5, opacity: .5 }}>Ваши сотрудники будут общаться с подписичками также, через личные сообщения сообщества. Но в дополнение к обычным возможностям диалога, Club Helper дополнит диалог множеством полезных функций для обработки обращений<br /><br />Вы сможете присваивать статус обращениям, использовать умные шаблоны, переадресовывать обращение другим сотрудникам и многое другое!</Text>
                  </li>
                </ul>
              </div>
            </SlideStart>
            {typeStartPage && <SlideStart platform={platform}>
              <div class="clubHelper--bottom">
                <div className="clubHelper--gearImage clubHelper--gearImage__6"><Icon28Settings width={280} height={280} /></div>
                <div className="clubHelper--hpIconSymbol"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 56 56"><path fill="currentColor" xmlns="http://www.w3.org/2000/svg" d="M 1.1883 43.4869 L 13.6935 43.4869 C 13.4483 44.4300 13.3162 45.3542 13.3162 46.2030 C 13.3162 49.2397 15.0138 51.4088 18.5786 51.4088 C 22.9168 51.4088 26.4250 48.3532 28.6884 43.4869 L 54.8118 43.4869 C 55.4719 43.4869 56 42.9777 56 42.3175 C 56 41.6574 55.4719 41.1670 54.8118 41.1670 L 29.6315 41.1670 C 30.6877 38.0737 31.3290 34.4523 31.4611 30.5290 C 32.6494 30.2650 33.8941 30.1329 35.1769 30.1329 C 35.8371 30.1329 36.2141 30.4159 36.2141 30.9063 C 36.2141 32.5472 35.3276 33.8298 35.3276 35.4708 C 35.3276 36.9043 36.3841 37.7719 37.7608 37.7719 C 41.5896 37.7719 46.2108 31.2269 47.7385 31.2269 C 49.1342 31.2269 47.3990 37.1117 52.1522 37.1117 C 52.9256 37.1117 53.9253 36.9043 54.6986 36.4139 C 55.1513 36.0932 55.4719 35.6405 55.4719 35.0558 C 55.4719 34.3391 55.0192 33.7544 54.2648 33.7544 C 53.6046 33.7544 53.0577 34.3013 52.4164 34.3013 C 50.3792 34.3013 52.3218 28.0393 48.5687 28.0393 C 45.2868 28.0393 40.1561 34.4145 38.8548 34.4145 C 38.6852 34.4145 38.5531 34.3202 38.5531 34.0939 C 38.5531 33.4149 39.4017 31.8871 39.4017 30.3593 C 39.4017 28.4732 37.8361 27.2660 35.3844 27.2660 C 34.0451 27.2660 32.7248 27.3980 31.4611 27.6432 C 31.0461 17.7032 26.3307 9.8756 19.1256 9.8756 C 14.2782 9.8756 10.5436 14.0063 10.5436 19.2687 C 10.5436 25.4176 14.5423 30.6799 19.5217 34.1693 C 17.3149 36.3384 15.5985 38.8093 14.5423 41.1670 L 1.1883 41.1670 C .5281 41.1670 0 41.6574 0 42.3175 C 0 42.9777 .5281 43.4869 1.1883 43.4869 Z M 13.4106 19.2687 C 13.4106 15.5907 15.9003 12.7426 19.1256 12.7426 C 24.7841 12.7426 28.4432 19.7780 28.6130 28.4166 C 26.0101 29.3219 23.6335 30.6988 21.5776 32.3397 C 17.6544 29.6237 13.4106 25.1347 13.4106 19.2687 Z M .6413 37.1495 C 1.1317 37.6399 1.8673 37.6210 2.3765 37.1495 L 4.7342 34.7918 L 7.0919 37.1495 C 7.5823 37.6399 8.3368 37.6399 8.8272 37.1495 C 9.3176 36.6591 9.3176 35.9046 8.8272 35.4142 L 6.4695 33.0754 L 8.8272 30.7177 C 9.3176 30.2273 9.3176 29.4917 8.8272 29.0012 C 8.3368 28.4920 7.5823 28.5109 7.0919 29.0012 L 4.7342 31.3401 L 2.3765 29.0012 C 1.8673 28.4920 1.1317 28.4920 .6413 29.0012 C .1509 29.4917 .1509 30.2461 .6413 30.7177 L 2.9990 33.0754 L .6413 35.4142 C .1509 35.9235 .1509 36.6591 .6413 37.1495 Z M 23.6335 36.5459 C 23.8787 36.6591 24.1051 36.7156 24.3314 36.7156 C 25.1047 36.7156 25.6517 36.1121 25.6517 35.4708 C 25.6517 34.9992 25.4254 34.5466 24.8784 34.2825 C 24.6143 34.1505 24.3503 34.0184 24.0674 33.8675 C 25.4254 32.9056 26.9343 32.0568 28.5564 31.4155 C 28.3300 35.0558 27.6322 38.4132 26.5571 41.1670 L 17.5790 41.1670 C 18.5597 39.3185 20.0309 37.3758 21.8982 35.6594 C 22.4641 35.9800 23.0488 36.2630 23.6335 36.5459 Z M 16.2586 45.6560 C 16.2586 44.9959 16.3718 44.2603 16.6170 43.4869 L 25.4820 43.4869 C 23.7844 46.6180 21.5022 48.5418 18.8993 48.5418 C 17.0886 48.5418 16.2586 47.3536 16.2586 45.6560 Z" /></svg></div>

                <Title level="1" weight="bold" className="clubHelper--title clubHelper--title__4">Пара формальностей</Title>
                <Text weight="regular" className="clubHelper--description clubHelper--description__4">Нам необходимо уладить несколько формальностей</Text>

                <ul className="clubHelper--flexIconInfoBlcok">
                  <li className="clubHelper--info">
                    <Icon28KeySquareOutline width={46} height={46} fill="#FFF" />
                    <Text weight="medium" style={{ fontSize: 18, color: "#FFFFFF" }}>Управление сообществом</Text>
                    <Text weight="medium" style={{ marginTop: 5, opacity: .5 }}>Приложение будет взаимодейстовать с подписчиками от имени Вашего сообщества, поэтому нам необходимо получить от Вас право управления сообществом. Это единоразовая процедура, необходимая только при установке приложения</Text>
                  </li>
                  <li className="clubHelper--info">
                    <Icon28LockOutline width={46} height={46} fill="#FFF" />
                    <Text weight="medium" style={{ fontSize: 18, color: "#FFFFFF" }}>Беспокоиться не о чем</Text>
                    <Text weight="medium" style={{ marginTop: 5, opacity: .5 }}>После того, как Вы разрешите нам управлять сообществом, мы получим уникальный ключ, который мы надёжно сохраним и обещаем использовать только для выбранных Вами возможностей</Text>
                  </li>
                </ul>
              </div>
            </SlideStart>}
            {!typeStartPage && <SlideStart platform={platform}>
              <div class="clubHelper--bottom">
                <div className="clubHelper--gearImage clubHelper--gearImage__6"><Icon28Settings width={280} height={280} /></div>
                <div className="clubHelper--hpIconSymbol"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 28 28"><path d="M18.316 1.051a1 1 0 00-1.265.633l-.146.44a3.7 3.7 0 00.2 2.823 1.7 1.7 0 01.093 1.297l-.147.44a1 1 0 001.898.632l.146-.44a3.7 3.7 0 00-.2-2.823 1.699 1.699 0 01-.093-1.297l.147-.44a1 1 0 00-.633-1.265zm-10 0a1 1 0 00-1.265.633l-.146.44a3.7 3.7 0 00.2 2.823 1.7 1.7 0 01.093 1.297l-.147.44a1 1 0 001.898.632l.146-.44a3.7 3.7 0 00-.2-2.823 1.7 1.7 0 01-.093-1.297l.147-.44a1 1 0 00-.633-1.265zM13.268.036a1 1 0 00-1.232.696l-.222.801a4 4 0 00.162 2.609l.202.485a2 2 0 01.08 1.305l-.222.8a1 1 0 101.927.536l.223-.801a4 4 0 00-.162-2.609l-.202-.485a2 2 0 01-.08-1.305l.221-.8a1 1 0 00-.695-1.232zm6.95 9.999C19.804 10 19.297 10 18.704 10H7.297c-.593 0-1.101 0-1.515.035-.434.037-.866.12-1.272.346a3 3 0 00-1.32 1.501c-.173.432-.2.871-.181 1.306.018.415.082.918.158 1.507l.385 2.994.025.192c.242 1.892.394 3.072.843 4.047a7 7 0 004.264 3.752C9.71 26 10.9 26 12.806 26h.388c1.907 0 3.097 0 4.122-.32a7 7 0 004.264-3.752c.092-.2.172-.409.243-.63l2.421-.727A3.867 3.867 0 0023.134 13h-.138c.003-.373-.037-.749-.185-1.118a3 3 0 00-1.321-1.5c-.406-.227-.838-.31-1.272-.347zm2.23 7.654l-.025.192c-.055.434-.106.83-.157 1.195l1.404-.42A1.867 1.867 0 0023.133 15h-.339zm-16.495-5.66c-.309.026-.418.07-.467.098a1 1 0 00-.44.5c-.021.053-.052.167-.039.476.014.32.067.737.149 1.378l.38 2.953c.276 2.148.396 2.997.7 3.658a5 5 0 003.047 2.68c.694.217 1.551.228 3.717.228 2.166 0 3.023-.011 3.717-.229a5 5 0 003.047-2.68c.304-.66.424-1.51.7-3.657l.38-2.953c.083-.641.135-1.059.15-1.378.012-.31-.019-.423-.04-.475a1 1 0 00-.44-.5c-.049-.028-.158-.073-.466-.1-.319-.027-.74-.028-1.386-.028H7.338c-.646 0-1.067 0-1.385.028z" clipRule="evenodd" fill="currentColor" fillRule="evenodd" /></svg></div>

                <Title level="1" weight="bold" className="clubHelper--title clubHelper--title__4">Давайте приступим</Title>
                <Text weight="regular" className="clubHelper--description clubHelper--description__4">Для начала нужно установить приложение</Text>

                <ul className="clubHelper--flexIconInfoBlcok">
                  <li className="clubHelper--info">
                    <Icon28DownloadCloudOutline width={46} height={46} fill="#FFF" />
                    <Text weight="medium" style={{ fontSize: 18, color: "#FFFFFF" }}>Установите</Text>
                    <Text weight="medium" style={{ marginTop: 5, opacity: .5 }}>Club Helper живет в сообществах. Давайте поселим его в Ваше сообщество, и завершим настройку сервиса прямо там!</Text>
                  </li>
                  <li className="clubHelper--info">
                    <Icon28SettingsOutline width={46} height={46} fill="#FFF" />
                    <Text weight="medium" style={{ fontSize: 18, color: "#FFFFFF" }}>Или сразу настройте</Text>
                    <Text weight="medium" style={{ marginTop: 5, opacity: .5 }}>Если Club Helper уже есть в Вашем сооществе, его можно просто настроить</Text>
                  </li>
                </ul>
              </div>
            </SlideStart>}
            <SlideStart platform={platform}>
              <div className="clubHelper--hpIconSymbol__2"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><path d="M10 11.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zm-.277 3.873a.85.85 0 011.185-.205 1.878 1.878 0 001.092.345 1.888 1.888 0 001.092-.345.85.85 0 01.979 1.39 3.587 3.587 0 01-2.07.655 3.587 3.587 0 01-2.072-.655.85.85 0 01-.206-1.185zm5.103-2.917a.643.643 0 01.648 0 .652.652 0 01.11.08.85.85 0 001.133-1.267 2.346 2.346 0 00-3.134 0 .85.85 0 001.134 1.266.66.66 0 01.109-.079z" fill="currentColor" /><path fillRule="evenodd" clipRule="evenodd" d="M14 3a2 2 0 01-1.1 1.787V6.1h2.338c.808 0 1.469 0 2.006.044.556.045 1.058.142 1.527.381a3.9 3.9 0 011.704 1.704c.239.47.336.971.381 1.527.044.537.044 1.198.044 2.006v3.476c0 .808 0 1.469-.044 2.006-.045.556-.142 1.058-.381 1.526a3.9 3.9 0 01-1.704 1.705c-.47.239-.971.336-1.527.381-.537.044-1.198.044-2.006.044H8.762c-.808 0-1.469 0-2.006-.044-.556-.045-1.058-.142-1.527-.381a3.9 3.9 0 01-1.704-1.705c-.239-.468-.336-.97-.381-1.526-.044-.537-.044-1.198-.044-2.006v-3.476c0-.808 0-1.469.044-2.006.045-.556.142-1.058.381-1.527A3.9 3.9 0 015.23 6.525c.47-.239.971-.336 1.527-.381C7.293 6.1 7.954 6.1 8.762 6.1H11.1V4.787A2 2 0 1114 3zM6.903 7.938c-.445.036-.684.103-.856.19a2.1 2.1 0 00-.918.919c-.088.172-.155.411-.191.856-.037.455-.038 1.042-.038 1.897v3.4c0 .855 0 1.442.038 1.897.036.445.103.683.19.856a2.1 2.1 0 00.919.918c.172.088.411.155.856.191.455.037 1.042.038 1.897.038h6.4c.855 0 1.442 0 1.897-.038.445-.036.683-.103.856-.19a2.1 2.1 0 00.918-.919c.088-.172.155-.411.191-.856.037-.455.038-1.042.038-1.897v-3.4c0-.855 0-1.442-.038-1.897-.036-.445-.103-.684-.19-.856a2.1 2.1 0 00-.919-.918c-.172-.088-.411-.155-.856-.191C16.642 7.9 16.055 7.9 15.2 7.9H8.8c-.855 0-1.442 0-1.897.038z" fill="currentColor" /></svg></div>

              <Title level="1" weight="bold" className="clubHelper--title clubHelper--title__4">Пара формальностей</Title>
              <Text weight="regular" className="clubHelper--description clubHelper--description__4">Наши роботы настраивают Ваше сообщество</Text>

              {this.state.load.isLoad && <div className="clubHelper--settingSpinner">
                <Spinner size="medium" style={{ margin: 0, width: 32 }} />
                <div className="clubHelper--settingSpinner__content">
                  <Text weight="medium" style={{ fontSize: 18 }}>Подождите...</Text>
                  <Text weight="medium" style={{ marginTop: 5, opacity: .5 }}>Пожалуйста, не закрывайте и не презагружайте страницу</Text>
                </div>
              </div>}

              {this.state.load.isError && <div className="clubHelper--settingSpinner">
                <Icon28CancelCircleOutline width={32} height={32} />
                <div className="clubHelper--settingSpinner__content">
                  <Text weight="medium" style={{ fontSize: 18 }}>{this.state.load.codeError === "5001" ? this.state.load.textError : this.state.load.msgError}</Text>
                  <Text weight="medium" style={{ marginTop: 5, opacity: .5 }}>Пожалуйста, попробуйте повторить попытку или свяжитесь с нами</Text>
                </div>
              </div>}

            </SlideStart>
          </Gallery>
        </SplitLayout>
        <div className="clubHelper--nextSlideStart">
          {!this.state.noButton && <div>
            <Button size='l' mode="overlay_primary" stretched onClick={() => this.handleClick()} loading={this.state.load.isLoad}>
              {textNextButton}
            </Button>
            <Progress style={{ height: 7, borderRadius: 5, color: "#333" }} value={(slideIndexProgress * 100 / countPageStart)} />
          </div>}
          <Button mode="overlay_secondary" onClick={() => this.handleBackClick()}>
            {"<"}
          </Button>
          <Button mode="overlay_secondary" onClick={() => this.handleClick(true)}>
            {">"}
          </Button>
          <Button mode="overlay_outline" onClick={() => {
            typeStartPage = !typeStartPage;
            this.state.slideIndex < 3
              ? this.handleClick(true)
              : this.handleBackClick();
          }}>
            is {typeStartPage ? "group" : "user"}
          </Button>
          {this.state.textNoButton && <div className="clubHelper--instalApp">
            <Text weight="medium">Club Helper установлен!</Text>
            <Text>Завершите настройки в <Link href={"https://vk.com/app7938346_-" + newGroupID} target="_blank">сообществе</Link></Text>
          </div>}
        </div>
      </div>
    )
  }
}

export default StartPage;
