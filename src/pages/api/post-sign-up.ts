import type {NextApiRequest, NextApiResponse} from "next";
import fetch from 'node-fetch';
import {getAuth} from "@clerk/nextjs/server";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    if (req.method !== "GET") return res.status(405).end();

    if (!process.env.SALABLE_SESSION_PASSWORD) return res.status(500).json({
        error: 'Internal Server Error: Missing session password'
    });
    if (!process.env.SALABLE_WRITE_LICENSE) return res.status(500).json({
        error: 'Internal Server Error: Missing write license api key'
    });
    if (!process.env.SALABLE_PRO_PLAN_UUID) return res.status(500).json({
        error: 'Internal Server Error: Missing salable plan UUID'
    });

    const { userId } = getAuth(req);

    try {
        const license = await fetch('https://api.salable.app/licenses', {
            method: "POST",
            body: JSON.stringify({
                planUuid: process.env.SALABLE_PRO_PLAN_UUID,
                member: userId,
                granteeId: userId
            }),
            headers: {
                'x-api-key': process.env.SALABLE_WRITE_LICENSE,
                'version': 'v2',
            }
        });
        console.log('created', await license.json())
    } catch (e) {
        console.log('SIGN UP ERROR');
        console.log(e);
        res.redirect(303, '/?license-generation-failed');
        return;
    }

    res.redirect(303, '/api/post-sign-in');
}
