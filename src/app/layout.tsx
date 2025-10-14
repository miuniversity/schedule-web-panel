import './globals.css'

import '@mantine/core/styles.css';
import '@mantine/tiptap/styles.css';
import '@mantine/notifications/styles.css';
import '@mantine/dates/styles.css'
import '@mantine/charts/styles.css';

import { Metadata } from "next";
import { PropsWithChildren, Suspense } from "react";
import { ColorSchemeScript } from '@mantine/core';
import { Providers } from "@/app/providers";
import { NotifyAnywhereLayout } from "@/layouts";

export const metadata: Metadata = {
    title: 'Панель управления рассылкой',
};


export default async function RootLayout({ children }: PropsWithChildren) {

    return (
            <html lang="ru" data-mantine-color-scheme="light">
            <head>
                <meta name={ 'author' } content={ 'danyatochkaru' }/>
                <ColorSchemeScript defaultColorScheme={ 'light' }/>
            </head>
            <body>
            <Providers>
                <Suspense fallback={ 'Загрузка...' }>
                    <NotifyAnywhereLayout>
                        { children }
                    </NotifyAnywhereLayout>
                </Suspense>
            </Providers>
            </body>
            </html>
    );
}
