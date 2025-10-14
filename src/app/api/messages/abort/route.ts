import {NextResponse} from "next/server";
import checkSession from "@/utils/checkSession";
import type {MESSAGES_STATUS} from "@/types/swr-responses";
import db from "@/lib/db";

export async function POST() {
    try {
        const session = await checkSession()
        if (!session.data) {
            return NextResponse.json(session.error, {status: session.status})
        }

        const res = await fetch(`${process.env.BOT_API_HOST}/notifications/status`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.BOT_AUTH_TOKEN}`,
            }
        })

        if (!res?.ok) {
            console.error(res)
            return NextResponse.json({message: 'Что-то пошло не так...'}, {status: res?.status || 500})
        }

        const data = await res.json() as MESSAGES_STATUS

        if (!data.isRunning) {
            return NextResponse.json({message: 'Нет активной рассылки'}, {status: 400})
        }

        const abortRes = await fetch(`${process.env.BOT_API_HOST}/notifications/abort`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.BOT_AUTH_TOKEN}`,
            }
        })

        if (!abortRes?.ok) {
            console.error(abortRes)
            return NextResponse.json({message: 'Что-то пошло не так...'}, {status: abortRes?.status || 500})
        }

        if (data.args?.id) {
            await db.mailing.update({
                data: {
                    status: "CANCELLED",
                    statusChangedAt: new Date()
                },
                where: {
                    id: data.args.id
                }
            })
        }

        return NextResponse.json({message: 'Рассылка отменена'}, {status: 200})
    } catch (e) {
        console.error(e)
        return NextResponse.json({message: 'Что-то пошло не так...'}, {status: 500})
    }
}