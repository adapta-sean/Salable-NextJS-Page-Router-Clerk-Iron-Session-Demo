import useSWR, {SWRConfig} from "swr";
import {SalableSessionData} from "@/pages/api/session";
import {getIronSession} from "iron-session";
import {SALABLE_SESSION} from "@/constants";
import {GetServerSideProps, InferGetServerSidePropsType} from "next";

const sessionPath = '/api/session';

type SessionData = { [sessionPath]: { capabilities: string[] } | null };

type SwrPageData = {
    fallback: SessionData
}

export const getServerSideProps = (async ({req, res}) => {
    if (!process.env.SALABLE_SESSION_PASSWORD) throw new Error("Missing session password");

    const session = await getIronSession<SalableSessionData>(req, res, {
        password: process.env.SALABLE_SESSION_PASSWORD,
        cookieName: SALABLE_SESSION
    });

    const fallback = session.capabilities
        ? {[sessionPath]: {capabilities: session.capabilities}}
        : {[sessionPath]: null};

    return {props: {fallback}}
}) satisfies GetServerSideProps<SwrPageData>;

function HomeContent() {
    const {data: session, error, isLoading} = useSWR<SalableSessionData>(sessionPath);

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Failed to load session</div>;

    return (
        <>
            {session ? (
                <>
                    <h2 className='text-xl'>Capabilities</h2>
                    <ul>
                        {session.capabilities.map(capability => <li key={capability}>{capability}</li>)}
                    </ul>
                </>
            ) : null}
        </>
    );
}

export default function HomePage(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
    return (
        <main className={'flex min-h-screen flex-col py-6 px-24'}>
            <h1 className='text-xl mb-4'>Using SWR and SSR</h1>
            <SWRConfig value={props}>
                <HomeContent/>
            </SWRConfig>
        </main>
    )


}
