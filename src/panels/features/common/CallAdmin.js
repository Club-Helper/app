/*******************************************************
 * Авторское право (C) 2021-2022 Club Helper
 *
 * Этот файл является частью мини-приложения Club Helper, размещенного
 * в сети Интернет по адресу https://www.vk.com/app7938346
 *
 * Несанкционированное копирование, инженерный анализ, передача,
 * распространение кода приложения запрещены
 *******************************************************/

import React from 'react'
import { ConfigProvider, Group, Placeholder, Footer, Link, Separator, SimpleCell, Button } from '@vkontakte/vkui'
import { Icon28UserTagOutline, Icon56FaceIdOutline } from '@vkontakte/icons';

export default function CallAdmin(props) {
  props.setPopout(null);
  return (
    <ConfigProvider platform={props.platform.current} appearance={props.appearance}>
      <Group style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "90vh",
        width: "100%",
        cursor: "default"
      }}>
        <Placeholder
          icon={<Icon56FaceIdOutline width={96} height={96} style={{ marginBottom: "10px" }} fill="var(--vkui--color_background_accent)" />}
          header="Нужен администратор"
          key="error-info"
          action={
            <Button
              before={<Icon28UserTagOutline />}
              onClick={() => props.changeMode("office")}
            >
              Личный кабинет
            </Button>
          }
        >
          Это сообщество ещё не настроено. Попросите администратора настроить его в нашем приложении.
        </Placeholder>
        <Separator />
        <Footer>
          Если Вы уверены, что так не должно быть, пожалуйста, <Link href={"https://vk.me/cloud_apps?ref=" + props.generateRefSourceString("call_admin")} target='_blank'>свяжитесь с нами</Link>
        </Footer>
      </Group>
    </ConfigProvider>
  )
}
