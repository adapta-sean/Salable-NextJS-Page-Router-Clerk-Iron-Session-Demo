import {getIronSession} from 'iron-session';
import type {NextApiRequest, NextApiResponse} from "next";
import {SALABLE_SESSION} from "@/constants";
import {getAuth} from "@clerk/nextjs/server";

export type SalableSessionData = {
    capabilities: string[]
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    if (req.method !== "GET") return res.status(405).end();

    if (!process.env.SALABLE_SESSION_PASSWORD) return res.status(500).json({
        error: 'Internal Server Error: Missing session password'
    });

    const session = await getIronSession(req, res, {
        password: process.env.SALABLE_SESSION_PASSWORD,
        cookieName: SALABLE_SESSION
    });

    const {userId} = getAuth(req);

    if (!userId) {
        session.destroy();
        return res.status(401).end();
    }

    return res.status(200).json(session);
}