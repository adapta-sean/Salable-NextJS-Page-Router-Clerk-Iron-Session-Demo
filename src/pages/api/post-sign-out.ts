import {getIronSession} from 'iron-session';
import type {NextApiRequest, NextApiResponse} from "next";
import {SALABLE_SESSION} from "@/constants";

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

    session.destroy();

    return res.redirect(303, '/');
}