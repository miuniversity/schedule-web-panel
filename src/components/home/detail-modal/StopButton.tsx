'use client';

import { Button } from "@mantine/core";
import { useCallback, useState } from "react";
import { notifications } from "@mantine/notifications";

export function StopButton() {
    const [isLoading, setIsLoading] = useState(false);

    const onClick = useCallback(() => {
        setIsLoading(true)

        fetch('/api/messages/abort', { method: 'POST' })
                .then(res => {
                    if (!res.ok) {
                        console.error(res)
                        return
                    }
                    return res.json()
                })
                .then(data => {
                    console.log(data)
                    if (data) {
                        notifications.show({
                            title: 'Успешно',
                            message: data?.message ?? 'Рассылка остановлена',
                            color: 'green',
                        })
                    } else {
                        notifications.show({
                            title: 'Произошла ошибка',
                            message: 'Не удалось остановить рассылку',
                            color: 'red',
                        })
                    }
                })
                .catch(err => {
                    console.error(err)
                    notifications.show({
                        title: 'Произошла ошибка',
                        message: err?.message ?? 'Не удалось остановить рассылку',
                        color: 'red',
                    })
                })
                .finally(() => {
                    setIsLoading(false)
                })
    }, [])
    return (
            <Button color={ 'red.7' } onClick={ onClick } loading={ isLoading }>{ 'Остановить' }</Button>
    )
}