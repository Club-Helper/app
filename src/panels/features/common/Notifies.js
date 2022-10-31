import React, { Component } from 'react';
import { List, RichCell, Avatar } from '@vkontakte/vkui';
import { Icon28LockOutline, Icon28CheckShieldOutline, Icon24NotificationOutline } from '@vkontakte/icons';

export default class Notifies extends Component {
  constructor(props) {
    super(props);

    this.state = {}

    this.handlePushClick = this.handlePushClick.bind(this);
    this.parseBrakesLinks = this.parseBrakesLinks.bind(this);
  }

  handlePushClick(push) {
    if (!push.action) return false;

    if (push.action.type == "link") {
      window.open(push.action.target);
    } else if (push.action.type == "page") {
      this.props.go(push.action.target);
    }
  }

  parseBrakesLinks(string) {
    const regex = /\[(.*)\]/g;
    return string.replaceAll(regex, "<span style='color: #2688eb; text-decoration: none;'>$1</span>");
  }

  render() {
    const icons = {
      moderation: <Icon28CheckShieldOutline width={24} height={24} />,
      blocked: <Icon28LockOutline width={24} height={24} />
    };

    return (
      <List>
        {this.props.notifies.map((item, idx) => (
          <RichCell
            disabled={!item.action}
            onClick={() => this.handlePushClick(item)}
            key={idx}
            before={
              <Avatar size={48}>
                {icons[item.type] ? icons[item.type] : <Icon24NotificationOutline />}
              </Avatar>
            }
            text={<div dangerouslySetInnerHTML={{__html: this.parseBrakesLinks(item.text)}}/>}
            subtitle={item.title}
            multiline
            caption={item.time.label}
          >
            {item.title}
          </RichCell>
        ))}
      </List>
    )
  }
}
