/*******************************************************
 * Авторское право (C) 2021-2022 Club Helper
 *
 * Этот файл является частью мини-приложения Club Helper, размещенного
 * в сети Интернет по адресу https://www.vk.com/app7938346
 *
 * Несанкционированное копирование, инженерный анализ, передача,
 * публичная демонстрация, распространение кода приложения запрещены
 *******************************************************/

import React from 'react'
import { Group, Placeholder, ConfigProvider, SplitLayout, SplitCol } from '@vkontakte/vkui'
import { Icon56CancelCircleOutline } from '@vkontakte/icons';

export default function SignError(props) {
  return (
    <ConfigProvider platform={props.platform.current} appearance={props.appearance}>
      <SplitLayout styles={props.isMobile == false && { marginTop: "10px" }}>
        {props.isMobile == false && <SplitCol width={100} maxWidth={100} />}
        <SplitCol>
          <Group>
            <Placeholder
              icon={<Icon56CancelCircleOutline fill='#e64646' />}
              header={"Ошибка"}
            >
              При проверке подписи произошла ошибка.
            </Placeholder>
          </Group>
        </SplitCol>
        {props.isMobile == false && <SplitCol width={100} maxWidth={100} />}
      </SplitLayout>
    </ConfigProvider>
  )
}
