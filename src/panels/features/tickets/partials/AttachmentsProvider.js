import React from 'react';

import { Gallery, Spinner, Card, Placeholder, Cell, RichCell, Title, Div, Spacing, Link } from '@vkontakte/vkui';
import { Icon48PictureOutline, Icon48Video, Icon56MicrophoneOutline, Icon56MusicOutline, Icon56VideoOutline } from '@vkontakte/icons';
import { render } from 'react-dom';

export const AttachmentsProvider = ({ attachments }) => {
    if (!attachments || attachments.length === 0) return false;

    return (
        attachments.map((item, idx) => {
            if (item.type === "photo") {
                if (item.photo.url) {
                    return (
                        <img key={idx} src={item.photo.url} style={{
                            maxHeight: "20vh",
                            borderRadius: "10px"
                        }} />
                    );
                } else {
                    return (
                        <Card mode={"shadow"}>
                            <Placeholder icon={<Icon48PictureOutline />} />
                        </Card>
                    );
                }
            } else if (item.type === "audio") {
                if (item.audio.url) {
                    return (
                        <RichCell
                            text={<Title style={{ marginBottom: '1vh' }} level={'2'}>{`${item.audio.artist} — ${item.audio.title}`}</Title>}
                            bottom={<audio style={{ maxWidth: "99%" }} src={item.audio.url} controls />}
                            disabled
                            multiline
                        >
                        </RichCell>
                    );
                } else {
                    return (
                        <Card mode={"shadow"}>
                            <Placeholder icon={<Icon56MusicOutline width={48} height={48} />} />
                        </Card>
                    );
                }
            } else if (item.type === "audio_message") {
                if (item.audio_message.link_ogg) {
                    return (
                        <RichCell
                            text={<Title style={{ marginBottom: '1vh' }} level={'2'}>Голосовое сообщение</Title>}
                            bottom={<audio style={{ maxWidth: "99%" }} src={item.audio_message.link_ogg} controls />}
                            disabled
                            multiline
                        >
                        </RichCell>
                    )
                } else if (item.audio_message.link_mp3) {
                    return (
                        <RichCell
                            text={<Title style={{ marginBottom: '1vh' }} level={'2'}>Голосовое сообщение</Title>}
                            bottom={<audio style={{ maxWidth: "99%" }} src={item.audio_message.link_mp3} controls />}
                            disabled
                            multiline
                        >
                        </RichCell>
                    )
                } else {
                    return (
                        <Card mode={"shadow"}>
                            <Placeholder icon={<Icon56MicrophoneOutline width={48} height={48} />} />
                        </Card>
                    );
                }
            } else if (item.type === "video") {
                return (
                    <div>
                        <Title level={'2'}>Видео</Title>
                        <Spacing />
                        <Card mode={"shadow"}>
                            <Placeholder icon={<Icon56VideoOutline width={48} height={48} />} />
                        </Card>
                    </div>
                )
            }
        })
    )
}
