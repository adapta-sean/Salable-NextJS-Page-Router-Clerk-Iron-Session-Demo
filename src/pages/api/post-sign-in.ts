import type {NextApiRequest, NextApiResponse} from "next";
import {getAuth} from "@clerk/nextjs/server";
import {getIronSession} from "iron-session";
import {SalableSessionData} from "@/pages/api/session";
import {SALABLE_SESSION} from "@/constants";

type License = { capabilities: string[] }

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    if (req.method !== "GET") return res.status(405).end();

    if (!process.env.SALABLE_SESSION_PASSWORD) return res.status(500).json({
        error: 'Internal Server Error: Missing session password'
    });
    if (!process.env.SALABLE_PRODUCT_UUID) return res.status(500).json({
        error: 'Internal Server Error: Missing salable product UUID'
    });
    if (!process.env.SALABLE_READ_LICENSE) return res.status(500).json({
        error: 'Internal Server Error: Missing read license api key'
    });

    const {userId} = getAuth(req);

    try {
        const response = await fetch(
            `https://api.salable.app/licenses/check?productUuid=${process.env.SALABLE_PRODUCT_UUID}&granteeIds=${userId}`, {
                headers: {
                    'x-api-key': process.env.SALABLE_READ_LICENSE,
                    'version': 'v2'
                }
            });

        // Note: 204 empty response check successful, no licenses found for the grantee/s
        if (response.status === 204) {
            res.redirect(303, '/');
            return;
        }

        const license = await response.json() as License;

        const session = await getIronSession<SalableSessionData>(req, res, {
            password: process.env.SALABLE_SESSION_PASSWORD,
            cookieName: SALABLE_SESSION
        });

        session.capabilities = license.capabilities;

        await session.save();

        console.log('license', license)
    } catch (e) {
        console.log('SIGN IN ERROR');
        console.log(e);
        res.redirect(303, '/?license-check-failed');
        return;
    }

    res.redirect(303, '/');
}
