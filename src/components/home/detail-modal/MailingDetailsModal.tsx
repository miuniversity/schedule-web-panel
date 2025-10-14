'use client'

import { Badge, Group, ScrollArea, Stack, Text } from "@mantine/core";
import { Mailing, MailingStatus, Profile } from "@prisma/client";
import useSWR from "swr";
import { useCallback } from "react";
import { MESSAGES_STATUS } from "@/types/swr-responses";
import ModalGroupsList from "@/components/home/detail-modal/ModalGroupsList";
import { formatDuration } from "date-fns/formatDuration";
import { intervalToDuration } from "date-fns/intervalToDuration";
import { ru as ruLocale } from "date-fns/locale/ru";
import { StopButton } from "@/components/home/detail-modal/StopButton";

type Props = {
    recipients: { groupOid: number, name: string }[],
    id: Mailing['id'],
    status: Mailing['status']
    failed: Mailing['failed'],
    total: Mailing['total'],
    sender: Profile,
    createdAt: Mailing['createdAt'],
    statusChangedAt: Mailing['statusChangedAt']
}

const statusText = {
    [MailingStatus.PROCESSING]: 'В процессе',
    [MailingStatus.COMPLETED]: 'Завершено',
    [MailingStatus.CANCELLED]: 'Отменено',
}

export default function MailingDetailsModal({
                                                recipients,
                                                status,
                                                failed,
                                                total,
                                                id,
                                                statusChangedAt,
                                                sender,
                                                createdAt
                                            }: Props) {
    const { data, isLoading } = useSWR<MESSAGES_STATUS>(
            `/api/messages/status`,
            { refreshInterval: 5 * 1000 }
    )

    const getTotal = useCallback(() => {
        return (data && id === data.args?.id && data.isRunning) ? data?.progress?.total : total
    }, [data?.isRunning, data?.progress?.total, total, isLoading, status])

    const getSuccess = useCallback(() => {
        return (data && id === data.args?.id && data?.isRunning) ? data?.progress?.current : (getTotal() - failed)
    }, [data?.isRunning, data?.progress?.current, failed, isLoading, status])

    return <ScrollArea.Autosize mah={ 600 }>
        { isLoading
                ? <Text mb={ 'xs' }>{ 'Загрузка...' }</Text>
                : <Stack gap={ 2 } mb={ 'xs' }>
                    <Text>{ 'Статус: ' }<Badge
                            component={ 'span' }
                            color={ status === 'COMPLETED'
                                    ? 'green' : status === 'CANCELLED'
                                            ? 'red' : 'brand' }
                    >{ statusText[status] }</Badge></Text>
                    <Text title={ sender.email }>{ 'Отправитель: ' + sender.email?.split('@')[0] }</Text>
                    { getTotal() > 0 && <Text>{ 'Всего получателей: ' + getTotal() }</Text> }
                    { status === 'COMPLETED'
                            && getTotal() > 0
                            && <Group display={ 'inline-flex' } align={ 'center' } gap={ 'xs' }>
                                <Text>{ 'Успешных отправок: ' + getSuccess() }</Text>
                                <Badge autoContrast>{ (getSuccess() / getTotal() * 100).toFixed(1) + '%' }</Badge>
                            </Group> }
                    <Text>{ 'Дата и время отправки: ' + new Date(createdAt).toLocaleString('ru', {}) }</Text>
                    { statusChangedAt && new Date(statusChangedAt).getTime() > new Date(createdAt).getTime()
                            && <Text>{ 'Продолжительность рассылки: ' + formatDuration(
                                    intervalToDuration({
                                        start: createdAt,
                                        end: statusChangedAt
                                    }),
                                    { locale: ruLocale }
                            ) }</Text> }
                    { status === 'PROCESSING' && <StopButton/> }
                </Stack> }
        <ModalGroupsList recipients={ recipients } id={ id }/>
    </ScrollArea.Autosize>
}