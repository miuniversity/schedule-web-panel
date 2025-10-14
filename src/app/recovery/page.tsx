import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { PAGE_LINKS } from "@/constants/page-links";
import { Container } from "@mantine/core";
import { FormLayout } from "@/layouts";
import { RecoveryForm } from "@/components/recovery/RecoveryForm";
import { ChangePasswordForm } from "@/components/recovery/ChangePasswordForm";

async function fetchRecovery(token: string) {
    const resRecovery = await fetch(process.env.NEXTAUTH_URL + '/api/recovery?token=' + token)
    return {data: await resRecovery.json(), status: resRecovery.ok}
}


async function RecoveryPage(props: { searchParams: Promise<{ token?: string }> }) {
    const session = await getServerSession(authOptions)
    const searchParams = await props.searchParams

    if (!!session?.user) {
        redirect(PAGE_LINKS.HOME)
    }

    let userEmail = '';

    if (searchParams.token) {
        const {data, status} = await fetchRecovery(searchParams.token)
        if (!status) {
            redirect(PAGE_LINKS.LOGIN + (data?.message ? `?message=${encodeURIComponent(data.message)}&messageColor=red` : ''))
        }
        userEmail = data.email
    }

    return (
            <Container p={'xl'}>
                <FormLayout>
                    {
                        !!searchParams.token
                                ? <ChangePasswordForm email={userEmail} token={searchParams.token}/>
                                : <RecoveryForm/>
                    }
                </FormLayout>
            </Container>
    );
}

export default RecoveryPage;