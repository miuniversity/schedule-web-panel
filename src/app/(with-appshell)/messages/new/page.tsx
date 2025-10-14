import LoadingNewMessage from "@/app/(with-appshell)/messages/new/loading";
import PrintingModule from "@/components/messages/printing/PrintingModule"
import FilteringModule from "@/components/messages/filtering/FilteringModule"
import { Suspense } from "react";
import { GROUPS } from "@/constants/groups";

export default async function NewMessagePage(props: { searchParams: Promise<{ step?: string }> }) {
    const searchParams = await props.searchParams
    switch (searchParams.step) {
        case 'printing': {
            return <PrintingModule/>
        }
        case 'filtering':
        default: {
            let groups = GROUPS
            try {
                const groupsResponse = await fetch(`${ process.env.NEXT_PUBLIC_API_HOST }/dictionary/groups/`, {
                    headers: {
                        Authorization: `Basic ${ Buffer.from(process.env.NEXT_PUBLIC_API_AUTH ?? '').toString('base64') }`,
                    },
                    cache: 'force-cache'
                })
                if (groupsResponse.ok) {
                    groups = await groupsResponse.json()
                }
            } catch (error) {
                console.error(error)
            }
            return <Suspense fallback={ <LoadingNewMessage/> }>
                <FilteringModule groups={ groups }/>
            </Suspense>
        }
    }
}