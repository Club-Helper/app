/*******************************************************
 * Авторское право (C) 2021-2022 Club Helper
 *
 * Этот файл является частью мини-приложения Club Helper, размещенного
 * в сети Интернет по адресу https://www.vk.com/app7938346
 *
 * Несанкционированное копирование, инженерный анализ, передача,
 * публичная демонстрация, распространение кода приложения запрещены
 *******************************************************/

/**
 * Встраиваемая панель отправки жалобы. В будущем пригодится.
 */

import { Icon16Chevron, Icon24ReportOutline, Icon28ReportOutline } from '@vkontakte/icons'
import { Avatar, CellButton, Gradient, Group, ModalCard, ModalPage, ModalPageHeader, ModalRoot, Panel, PanelHeader, PanelHeaderButton, Link, Spacing, SplitCol, SplitLayout, Title, Card, Cell, Div, PanelSpinner, Text, List, SimpleCell, PanelHeaderClose, Footer, FormLayout, FormItem, Textarea, Radio, FixedLayout, Button } from '@vkontakte/vkui'
import React, { Component } from 'react'


export default class ClubCard extends Component {
  constructor(props) {
    super(props)

    this.state = {
      activeModal: "",
      reportForm: null,
      openedReason: null,
      sendButtonDisabled: true,
      sendButtonLoading: false,
      selectedReason: "",
      comment: ""
    }
  }

  openActions() {
    this.setState({
      activeModal: "actions"
    });
  }

  openReportForm() {
    this.setState({ activeModal: "report" });
    fetch("https://ch.n1rwana.ml/api/reports.getReportFormData?token=" + this.props.token)
      .then(response => response.json())
      .then(data => {
        this.setState({ reportForm: data.response })
      })
  }

  openReason(reason) {
    this.setState({ activeModal: "reportReason", openedReason: reason });
  }

  componentDidMount() {
    this.openReportForm();
  }


}
