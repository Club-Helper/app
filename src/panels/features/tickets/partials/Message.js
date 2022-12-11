/*******************************************************
 * Авторское право (C) 2021-2022 Club Helper
 *
 * Этот файл является частью мини-приложения Club Helper, размещенного
 * в сети Интернет по адресу https://www.vk.com/app7938346
 *
 * Несанкционированное копирование, инженерный анализ, передача,
 * распространение кода приложения запрещены
 *******************************************************/

import React from 'react';

import { GrayText } from '../../common/partials/GrayText';
import { Gallery } from '@vkontakte/vkui';
import { AttachmentsProvider } from './AttachmentsProvider';

/**
* Системное сообщение
*
* @param noLast - Последнее ли это системное сообщение в блоке
* @param children - Текст сообщения
* @returns {JSX.Element}
* @constructor
*/

export const SystemMessage = ({ noLast, children }) => {
  return (
    <div className={noLast ? "clubHelper--systemMessage no--last" : "clubHelper--systemMessage"}>
      <GrayText fontSize={14}>{children}</GrayText>
    </div>);
};

/**
* Сообщение от пользователя
*
* @param key - порядковый номер сообщения в рамках обращения
* @param user - ID пользователя
* @param noLast - Последнее ли это сообщение в блоке от этого пользователя
* @param photoUser - Фотография автора собщения
* @param time - Время отправки
* @param sticker - Сообщение - стикер
* @param children - Содержимое сообщения
*/

export const UserMessage = ({ key, user, noLast, photoUser, time, sticker, children, attachments }) => {
  if (!sticker && !children[0] && attachments.lenght === 0) return false;

  return (
    <div className="clubHelper--userMessage" key={key}>

      <div className={noLast ? "clubHelper--contentMessage no--last" : "clubHelper--contentMessage"}>
        <a href={"https://vk.com/id" + user} target="_blank"><img className="clubHelper--photoMessage" src={photoUser} alt="" /></a>
        {sticker ?
          <div className="clubHelper--textContentMessage no--background" style={{ maxWidth: "90%" }} >
            <div className="clubHelper--textMessage"><img src={children} alt="" width={128} /></div>
            <GrayText fontSize={11}>{time}</GrayText>
          </div>
          :
          <div className="clubHelper--textContentMessage" style={{ maxWidth: "90%" }}>
            <div className="clubHelper--textMessage">
              {children}
              {attachments.length > 0 &&
                <Gallery align="center" slideWidth="100%" bullets={attachments.length > 1 ? "dark" : "none"} showArrows
                style={
                  children != null ?
                  { marginTop: "1vh" }
                  : {}
                }>
                  {attachments.map((item, idx) => (
                    <center style={{ width:"100%" }}>
                      <AttachmentsProvider key={idx} item={item} />
                    </center>
                  ))}
                </Gallery>
              }
            </div>
            <GrayText fontSize={11}>{time}</GrayText>
          </div>
        }
      </div>
    </div>);
};

/**
* Сообщение сотрудника
*
* @param key - порядковый номер сообщения в рамках обращения
* @param user - ID пользователя
* @param noLast - Последнее ли это сообщение в блоке от этого сотрудника
* @param photoUser - Фотография автора сообщения
* @param time - Время отправки
* @param sticker - Сообщение - стикер
* @param children - Содержимое сообщения
*/
export const ClubMessage = ({ key, user, noLast, photoUser, time, sticker, children, attachments }) => {
  if (!sticker && !children) return false;

  return (
    <div className="clubHelper--clubMessage" key={key}>
      <div className={noLast ? "clubHelper--contentMessage no--last" : "clubHelper--contentMessage"}>
        {sticker ?
          <div className="clubHelper--textContentMessage no--background" style={{ maxWidth: "90%" }} >
            <div className="clubHelper--textMessage"><img src={children} alt="" width={128} /></div>
            <GrayText fontSize={11}>{time}</GrayText>
          </div>
          :
          <div className="clubHelper--textContentMessage" style={{ maxWidth: "90%" }}>
            <div className="clubHelper--textMessage">
              {children}
              {attachments.length > 0 &&
                <Gallery slideWidth="100%" bullets={attachments.length > 1 ? "dark" : "none"} showArrows
                style={
                  children != null ?
                  { marginTop: "1vh", width: "100% !important" }
                  : {width: "100% !important"}
                }>
                  {attachments.map((item, idx) => (
                    <center>
                      <AttachmentsProvider key={idx} item={item} />
                    </center>
                  ))}
                </Gallery>
              }
            </div>
            <GrayText fontSize={11}>{time}</GrayText>
          </div>
        }
        <a href={"https://vk.com/id" + user} target="_blank"><img className="clubHelper--photoMessage" src={photoUser} alt="" /></a>
      </div>
    </div>);
}
