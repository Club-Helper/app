/*******************************************************
 * Авторское право (C) 2021-2022 Club Helper
 *
 * Этот файл является частью мини-приложения Club Helper, размещенного
 * в сети Интернет по адресу https://www.vk.com/app7938346
 *
 * Несанкционированное копирование, инженерный анализ, передача,
 * публичная демонстрация, распространение кода приложения запрещены
 *******************************************************/

import { Avatar, Cell, Group, Header, Link, Panel, SimpleCell } from '@vkontakte/vkui'
import React from 'react'

import '../../../css/landings/donut.css';

export default function Donut(props) {
  props.setPopout(null);

  const donut = props.club.donut;

  return (
    <Panel>
      <Group header={<Header className='faq-title'><b>Что такое VK Donut?</b></Header>}>
        <Cell multiline disabled>
          <b>VK Donut</b> — это платная подписка от ВКонтакте. В нашем приложении она даёт множество возможностей, например, создание больше 5 ссылок. Более подробно Вы можете прочитать о подписке <Link href="https://vk.com/@donut-faq-dlya-donov" target='_blank'>в этой статье</Link>.
        </Cell>
      </Group>
      <Group header={<Header className='faq-title'><b>Как оформить подписку?</b></Header>}>
        <Cell multiline disabled>
          Офрмить подписку VK Donut Вы можете в нашем <Link href="https://vk.com/ch_app" target='_blank'>официальном сообществе</Link>, нажав на кнопку "Поддержать". Или же просто перейдте по <Link href="https://vk.com/donut/ch_app" target='_blank'>этой ссылке</Link>.
        </Cell>
      </Group>
      <Group header={<Header className='faq-title'><b>Что будет происходить после оформления подписки?</b></Header>}>
        <Cell multiline disabled>
          Мы увидим активную подписку и засчитаем её на Ваш аккаунт. Теперь на период оплаты подписки все сообщества, которые подключены Вами, будут иметь возможности, предоставляемые подпиской.
        </Cell>
      </Group>
      <Group header={<Header className='faq-title'><b>Как часто нужно оплачивать подписку?</b></Header>}>
        <Cell multiline disabled>
          Подписку нужно оплачивать раз в месяц. Средства списываются автоматически, но автооплату можно отменить (см. <Link href='https://vk.com/@donut-faq-dlya-donov?anchor=kak-otmenit-podpisku' target='_blank'>эту статью</Link>).
        </Cell>
      </Group>
      <Group
        header={<Header className='faq-title'><b>Кто может оплатить подписку?</b></Header>}
        description={donut.count > 1 ? "Мы автоматически отслеживаем наличие подписки по вышеперечисленным пользователям" : "Мы автоматически отслеживаем наличие подписки у этого пользователя" + ". Изменить платёжного пользователя может только Команда Поддержки Club Helper."}
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
      </Group>
    </Panel>
  )
}
