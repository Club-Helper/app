/*******************************************************
 * Авторское право (C) 2021-2022 Club Helper
 *
 * Этот файл является частью мини-приложения Club Helper, размещенного
 * в сети Интернет по адресу https://www.vk.com/app7938346
 *
 * Несанкционированное копирование, инженерный анализ, передача,
 * распространение кода приложения запрещены
 *******************************************************/


import { Icon16Block, Icon20DonateCircleFillYellow, Icon12Chevron, Icon28AddCircleOutline, Icon56CheckCircleOutline, Icon56CancelCircleOutline, Icon28CompassCircleFillPurple } from '@vkontakte/icons';
import { Avatar, Cell, Group, Link, List, Panel, PanelHeader, PanelSpinner, Placeholder, PanelHeaderButton, SplitLayout, SplitCol, ModalRoot, ModalCard, Button, Div } from '@vkontakte/vkui'
import React, { Component } from 'react'
import bridge from '@vkontakte/vk-bridge';

export default class Clubs extends Component {
  constructor(props) {
    super(props)

    this.state = {
      activeModal: "",
      bridgeInstallResult: null
    }
  }

  componentDidMount() {
    this.props.setPopout(null);
  }

  handleClick () {
    console.log("handleClick");
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

  render() {
    const modal = (
      <ModalRoot activeModal={this.state.activeModal}>
        <ModalCard
          id="installed"
          header="Приложение установлено"
          actions={
            <Button
              size="l"
              mode="primary"
              onClick={() => window.open("https://vk.com/app7938346_-" + this.state.bridgeInstallResult.group_id, "_blank")}
            >Настроить</Button>
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
            <Group>
              <List>
                {!this.props.office?.clubs ? <PanelSpinner /> :
                  this.props.office.clubs.length > 0 ?
                    this.props.office?.clubs.map((club, idx) => (
                      <Link href={"https://vk.com/app7938346_-" + club.id} target="_blank">
                      <Cell
                        onClick={() => this.handleClick()}
                        key={idx}
                        before={
                          <Avatar
                            size={48}
                            src={club.photo}
                            badge={
                              <React.Fragment>
                                {club.donut && <Avatar size={20} shadow={false} style={{ backgroundColor: "var(--background_content)" }}><Icon20DonateCircleFillYellow /></Avatar>}
                                {club.blocked && <Avatar size={20} shadow={false} style={{ backgroundColor: "var(--background_content)" }}><Icon16Block fill='var(--accent)' width={20} height={20} /></Avatar>}
                              </React.Fragment>
                            }
                          />
                        }
                        description={this.props.formatRole(club.role)}
                        after={<Icon12Chevron width={16} height={16} />}
                      >
                        {club.title}
                        </Cell>
                      </Link>
                  )) : <Placeholder>У вас пока нет ни одного сообщества.</Placeholder>}
              </List>
            </Group>
          </Panel>
        </SplitCol>
      </SplitLayout>
    )
  }
}
