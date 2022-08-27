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

import { Text } from "@vkontakte/vkui";

/**
* Серый текст
*
* @param weight - Ширина текста
* @param fontSize - Размер текста (Поумолчанию 13px)
* @param children - Текст
* @returns {JSX.Element}
* @constructor
*/

export const GrayText = ({ weight, fontSize = 13, children }) => {
  return (
    <Text
      className="clubHelper--grayText"
      weight={weight}
      style={{
        color: 'var(--text_secondary)',
        fontSize: fontSize,
      }}
    >{children}</Text>
  );
}
