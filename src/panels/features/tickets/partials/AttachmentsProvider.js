import React from 'react';

import { Card, Placeholder, RichCell, Title, Spacing } from '@vkontakte/vkui';
import { Icon48PictureOutline, Icon56MicrophoneOutline, Icon56MusicOutline, Icon56VideoOutline } from '@vkontakte/icons';

export const AttachmentsProvider = ({ item }) => {
    if (!item) return null;

    if (item.type === "photo") {
        if (item.photo.url) {
            return (
                <Card>
                    <img src={item.photo.url} style={{
                        display: "block",
                        maxHeight: "20vh",
                        borderRadius: "10px"
                    }} alt=""/>
                </Card>
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
                <Card>
                    <RichCell
                        text={<Title style={{ marginBottom: '1vh' }} level={'2'}>{`${item.audio.artist} — ${item.audio.title}`}</Title>}
                        bottom={<audio style={{ maxWidth: "99%" }} src={item.audio.url} controls />}
                        disabled
                        multiline
                    >
                    </RichCell>
                </Card>
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
                <Card>
                    <RichCell
                        text={<Title style={{ marginBottom: '1vh' }} level={'2'}>Голосовое сообщение</Title>}
                        bottom={<audio style={{ maxWidth: "99%" }} src={item.audio_message.link_ogg} controls />}
                        disabled
                        multiline
                    >
                    </RichCell>
                </Card>
            )
        } else if (item.audio_message.link_mp3) {
            return (
                <Card>
                    <RichCell
                        text={<Title style={{ marginBottom: '1vh' }} level={'2'}>Голосовое сообщение</Title>}
                        bottom={<audio style={{ maxWidth: "99%" }} src={item.audio_message.link_mp3} controls />}
                        disabled
                        multiline
                    >
                    </RichCell>
                </Card>
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
    } else {
        return (
            <Card>
                <Placeholder>
                    Неподдерживаемый тип вложения
                </Placeholder>
            </Card>
        );
    }
}
