import "@/styles/globals.css";
import type {AppProps} from "next/app";
import {ClerkProvider, SignedIn, SignedOut, SignInButton, SignOutButton, UserButton, useUser} from "@clerk/nextjs";
import {Inter} from "next/font/google";
import useSWR, {SWRConfig} from "swr";
import fetcher from "@/swr/fetcher";
import {SalableSessionData} from "@/pages/api/session";
import {useEffect} from "react";

const inter = Inter({subsets: ["latin"]});

function SalableSessionSwr() {
    const {isSignedIn} = useUser();
    const {mutate} = useSWR<SalableSessionData>('/api/session');

    useEffect(() => {
        if (!isSignedIn) void mutate()
    }, [isSignedIn]);

    return null;
}

export default function App({Component, pageProps}: AppProps) {
    return (
        <ClerkProvider>
            <SWRConfig value={{fetcher}}>
                <SalableSessionSwr/>
                <div className={`flex gap-4 p-24 ${inter.className}`}>
                    <div>
                        <h1 className='text-lg'>Salable NextJS Demos</h1>
                    </div>
                    <div className='ml-auto'>
                        <SignedOut>
                            <SignInButton
                                signUpForceRedirectUrl='http://localhost:3000/api/post-sign-up'
                                forceRedirectUrl='http://localhost:3000/api/post-sign-in'
                            />
                        </SignedOut>
                        <SignedIn>
                            <div className='flex gap-4'>
                                <UserButton/>
                                <SignOutButton redirectUrl='/'/>
                            </div>
                        </SignedIn>
                    </div>
                </div>
                <Component {...pageProps} />
            </SWRConfig>
        </ClerkProvider>
    );
}
