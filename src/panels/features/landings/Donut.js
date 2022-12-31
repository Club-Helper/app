/*******************************************************
 * Авторское право (C) 2021-2022 Club Helper
 *
 * Этот файл является частью мини-приложения Club Helper, размещенного
 * в сети Интернет по адресу https://www.vk.com/app7938346
 *
 * Несанкционированное копирование, инженерный анализ, передача,
 * распространение кода приложения запрещены
 *******************************************************/

import {Avatar, Button, Group, Header, Panel, SimpleCell, Spacing, Spinner, Text, Title} from '@vkontakte/vkui'
import React, { useState } from 'react'

import '../../../css/landings/donut.css';

export default function Donut(props) {
  props.setPopout(null);

  const donut = props.club.donut;
  const [content, setContent] = useState(false);
  const [loading, setLoading] = useState(true);

  if (!content) {
    props.req("utils.donut", {token: props.token},
      (data) => {
        setContent(data.response);
        setLoading(false);
        return true;
      }
    );
}

  return (
    <Panel className={content ? "clubHelper-donut_panel" : ""}>
      {loading && <div style={{ display: "flex", alignItems: "center", flexDirection: "column", height: "100%", width: "100%", paddingTop: "calc(var(--safe-area-inset-bottom) + var(--tabbar_height))" }}><Spinner size="large" style={{ margin: "20px 0" }} /></div>}
      {!loading && <div className="clubHelper--donut">
        <Title>VK Donut</Title>
        <Title level="3">Улучшите доступные возможности Club Helper</Title>
        {content.map((element) => {
          if (element.type == "icon") {
            return (<div className="clubHelper--donut_block">
              <div className="clubHelper--donut_block-icon" dangerouslySetInnerHTML={{__html: element.icon}}/>
              <div>
                <div className="clubHelper--donut_block-title" dangerouslySetInnerHTML={{__html: props.parseLinks(element.title)}}/>
                {element.subtitle && <div className="clubHelper--donut_block-subtitle" dangerouslySetInnerHTML={{__html: props.parseLinks(element.subtitle)}}/>}
              </div>
            </div>);
          }else if (element.type == "spacing") {
            return (<Spacing size={15}/>);
          }else if (element.type == "users_pay") {
            return (<Group
              header={<><Header>{element.header}</Header><Header mode="secondary">{donut.count > 1 ? element.description[0] : element.description[1]}</Header></>}
            >
              {donut.users_pay.items.map(item =>
                <SimpleCell
                  multiline
                  disabled
                  before={<Avatar size={36} src={item.photo} />}
                  key={item.id}
                  style={{ padding: "15px" }}
                >{item.first_name} {item.last_name}</SimpleCell>
              )}
            </Group>);
          }else if (element.type == "note") {
            return (<Text className="clubHelper--donut_note" dangerouslySetInnerHTML={{__html: props.parseLinks(element.text)}}/>);
          }
        })}
        <a href="https://vk.com/donut/cloud_apps" target="_blank" className="clubHelper--donut_button"><Button sizeY="regular" stretched={true} appearance="overlay">Подключить</Button></a>
        <br /><br />
      </div>}
    </Panel>
  )
}
