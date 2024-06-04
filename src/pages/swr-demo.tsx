import useSWR from "swr";
import {SalableSessionData} from "@/pages/api/session";

export default function Home() {
    const {data: session, error, isLoading} = useSWR<SalableSessionData>('/api/session');

    return (
        <main className={'flex min-h-screen flex-col py-6 px-24'}>
            <h1 className='text-xl mb-4'>Using SWR</h1>
            {isLoading ? <div>Loading...</div> : null}
            {error ? <div>Failed to load session</div> : null}
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
