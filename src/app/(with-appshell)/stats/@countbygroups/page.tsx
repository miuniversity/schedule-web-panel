import { Paper, ScrollArea, Stack, Text } from "@mantine/core";
import { GROUPS } from "@/constants/groups";
import { BarChart } from "@mantine/charts";

export default async function CountByGroupsPage() {
    const sp = new URLSearchParams()
    for (const groupId of GROUPS.map(i => i.groupOid)) {
        sp.append('groupsList', String(groupId))
    }

    const stats: {
        groups: Record<`${ FlatArray<typeof GROUPS, 1>['groupOid'] }`, number>
    } = await fetch(`${ process.env.BOT_API_HOST }/users/count?${ sp.toString() }`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${ process.env.BOT_AUTH_TOKEN }`,
        }
    }).then(i => i.json())

    const data = GROUPS.filter(i => `${ i.groupOid }` in stats.groups).map((i) => ({
        group: i.name,
        'Количество': stats.groups[`${ i.groupOid }`]
    }))

    return (
            <Paper withBorder p={ 'sm' }>
                <Stack gap={ 'lg' }>
                    <Text>Пользователей по группам</Text>
                    <ScrollArea offsetScrollbars type={ 'always' }>
                        <BarChart
                                h={ 420 }
                                w={ data.length * 80 }
                                data={ data }
                                dataKey="group"
                                barProps={ { radius: 2 } }
                                series={ [{ name: 'Количество', color: 'brand' }] }
                                minBarSize={ 10 }
                                withBarValueLabel
                                valueLabelProps={ { position: 'inside', fill: 'white' } }
                                tooltipAnimationDuration={ 200 }
                        />
                    </ScrollArea>
                </Stack>
            </Paper>
    )
}