import {GetServerSideProps, InferGetServerSidePropsType} from "next";
import {getIronSession} from "iron-session";
import {SalableSessionData} from "@/pages/api/session";
import {SALABLE_SESSION} from "@/constants";

type PageData = {
    session: { capabilities: string[] } | null
}

export const getServerSideProps = (async ({req, res}) => {
    if (!process.env.SALABLE_SESSION_PASSWORD) throw new Error("Missing session password");

    const session = await getIronSession<SalableSessionData>(req, res, {
        password: process.env.SALABLE_SESSION_PASSWORD,
        cookieName: SALABLE_SESSION
    });

    const props = session.capabilities
        ? {session: {capabilities: session.capabilities}}
        : {session: null};

    return {props}
}) satisfies GetServerSideProps<PageData>;

export default function Home({session}: InferGetServerSidePropsType<typeof getServerSideProps>) {
    return (
        <main className={'flex min-h-screen flex-col py-6 px-24'}>
            <h2 className='text-xl mb-4'>Using SSR</h2>
            {session ? (
                <>
                    <h2 className='text-xl'>Capabilities</h2>
                    <ul>
                        {session.capabilities.map(capability => <li key={capability}>{capability}</li>)}
                    </ul>
                </>
            ) : null}
        </main>
    );
}
