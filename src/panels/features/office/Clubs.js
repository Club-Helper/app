/*******************************************************
 * Авторское право (C) 2021-2022 Club Helper
 *
 * Этот файл является частью мини-приложения Club Helper, размещенного
 * в сети Интернет по адресу https://www.vk.com/app7938346
 *
 * Несанкционированное копирование, инженерный анализ, передача,
 * распространение кода приложения запрещены
 *******************************************************/


import { Icon16Block, Icon20DonateCircleFillYellow, Icon12Chevron, Icon28AddCircleOutline, Icon56CheckCircleOutline, Icon56CancelCircleOutline, Icon20LockOutline, Icon12ArrowUpRight } from '@vkontakte/icons';
import { Avatar, Cell, Group, Link, List, Panel, PanelHeader, PanelSpinner, Placeholder, PanelHeaderButton, SplitLayout, SplitCol, ModalRoot, ModalCard, Button, Div, PullToRefresh, ScreenSpinner, ConfigProvider } from '@vkontakte/vkui'
import React, { Component } from 'react'
import bridge from '@vkontakte/vk-bridge';

export default class Clubs extends Component {
  constructor(props) {
    super(props)

    this.state = {
      activeModal: "",
      bridgeInstallResult: null,
      isFetching: false
    }
  }

  componentDidMount() {
    this.props.setPopout(null);
  }

  handleClick(group) {
    if (group.removed) return false;

    let group_id = group.id;

    this.props.setPopout(<ScreenSpinner />);
    this.props.req("app.changeClub", {
      token: this.props.token,
      group_id: group_id
    }, (response) => {
      console.log(response);
      let _role = response.response.group_role;
      this.props.setRole(response.response.group_role);
      this.props.setToken(response.response.token.token);
      this.props.req("clubs.get", {
        token: this.props.token
      }, (response) => {
        console.log(response);
        this.props.setIsNew(false);
        this.props.setClub(response.response);
        this.props.setGroupId(group_id);
        this.props.setDonut(response.response.donut);
        this.props.setDonutStatus(response.response.donut.status);
        this.props.setMessagesStatus(response.response.setting.messages.status);
        this.props.setLinksStatus(response.response.setting.links.status);
        this.props.setCommentsStatus(response.response.setting.comments.status);

        this.props.setPage("app");

        if (response.response.error) {
          if (this.props.club_role == "admin") {
            this.props.setStartupError(response.response.error);
            this.props.setHistory(["club_info"]);
            this.props.setActiveStory("club_info");
          } else {
            this.props.toggleShowMenu(false);
            this.props.setHistory(["call_admin"]);
            this.props.setActiveStory("call_admin");
          }
        } else {
          this.props.setStartupError(null);
          if (response.response.setting.messages.status == false && response.response.setting.links.status == false && response.response.setting.comments.status == false && _role != "admin") {
            this.props.toggleShowMenu(false);
            this.props.setHistory(["call_admin"]);
            this.props.setActiveStory('call_admin');
          } else {
            this.props.setHistory(["club_info"]);
            this.props.setActiveStory('club_info');
          }
        }
      })
    });
  }

  install() {
    bridge.send("VKWebAppAddToCommunity")
      .then((data) => {
        this.setState({ bridgeInstallResult: data });
        console.log("GID", data.group_id);
        this.props.toggleShowMenu(false);
        this.setState({ activeModal: "installed" });
      })
      .catch((error) => {
        this.setState({ bridgeInstallResult: error });
        this.props.toggleShowMenu(false);
        this.setState({ activeModal: "error" });
      })
  }

  startPageInstall() {
    console.log(this.state.bridgeInstallResult.group_id);
    this.props.setRole("admin");
    this.props.setGroupId(this.state.bridgeInstallResult.group_id);
    this.props.setPage("landing_setting");
    this.props.setActiveStory("start_page");
  }

  onRefresh() {
    this.setState({ isFetching: true });
    this.props.req("office.get", { token: this.props.token }, (response) => {
      this.props.setOffice(response.response);
      this.setState({ isFetching: false });
    }, (error) => {
      this.props.createError(error.error?.error_msg);
      this.setState({ isFetching: false });
    });
  }

  render() {
    const modal = (
      <ModalRoot activeModal={this.state.activeModal}>
        <ModalCard
          id="installed"
          header="Приложение установлено"
          actions={
            <Link style={{ width: "96.8%" }} href={"https://vk.com/app7938346_-" + this.state.bridgeInstallResult?.group_id} target="_blank">
              <Button
                size="l"
                mode="primary"
                style={{ width: "100%" }}
              >
                Настроить
              </Button>
            </Link>
          }
          icon={<Icon56CheckCircleOutline />}
          onClose={() => {
            this.setState({ activeModal: "" });
            this.props.toggleShowMenu(true);
          }}
        >
          <Div>
            <center>
              Завершите настройку в сообществе
            </center>
          </Div>
        </ModalCard>
        <ModalCard
          id="error"
          header="Ошибка"
          icon={<Icon56CancelCircleOutline fill='var(--destructive)' />}
          onClose={() => {
            this.setState({ activeModal: "" });
            this.props.toggleShowMenu(true);
          }}
        >
          <Div>
            <center>
              {this.state.bridgeInstallResult?.error_data?.error_reason ?
                <>При установке произошла ошибка: <br />
                  {this.state.bridgeInstallResult?.error_data?.error_reason}
                </>
                : <>При установке произошла неизвестная ошибка</>
              }
            </center>
          </Div>
        </ModalCard>
      </ModalRoot>
    )

    return (
      <ConfigProvider appearance={this.props.appearance} platform={this.props.platform.current}>
        <SplitLayout modal={modal}>
          <SplitCol>
            <Panel>
              <PanelHeader
                left={
                  <PanelHeaderButton onClick={() => this.install()}>
                    <Icon28AddCircleOutline />
                  </PanelHeaderButton>
                }
              >
                Мои сообщества
              </PanelHeader>
              <PullToRefresh isFetching={this.state.isFetching} onRefresh={() => this.onRefresh()}>
                <Group>
                  {this.state.isFetching ? <PanelSpinner /> :
                    <List>
                      {!this.props.office?.clubs ? <PanelSpinner /> :
                        this.props.office.clubs.length > 0 ?
                          this.props.office?.clubs.map((club, idx) => (
                            <a style={{ textDecoration: "none" }} target='_blank' href={club.removed && "https://vk.com/app7938346_-" + club.id}>
                              <Cell
                                onClick={() => this.handleClick(club)}
                                key={idx}
                                before={
                                  <Avatar
                                    size={48}
                                    src={club.photo}
                                    badge={
                                      <React.Fragment>
                                          {club.donut && !club.removed && <Avatar size={20} shadow={false} style={{ backgroundColor: "var(--background_content)" }}><Icon20DonateCircleFillYellow /></Avatar>}
                                          {club.blocked && <Avatar size={20} shadow={false} style={{ backgroundColor: "var(--background_content)" }}><Icon16Block fill='var(--accent)' width={20} height={20} /></Avatar>}
                                          {club.removed && <Avatar size={20} shadow={false} style={{ backgroundColor: "var(--background_content)" }}><Icon20LockOutline /></Avatar>}
                                      </React.Fragment>
                                    }
                                  />
                                }
                                description={this.props.formatRole(club.role) + (club.blocked ? " · Заблокировано" : "") + (club.removed ? " · Удалено" : "")}
                                after={club.removed ? <Icon12ArrowUpRight /> : <Icon12Chevron width={16} height={16} />}
                              >
                                {club.title}
                              </Cell>
                            </a>
                              )) : <Placeholder>У вас пока нет ни одного сообщества.</Placeholder>}

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
