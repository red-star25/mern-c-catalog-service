import type { Request } from "express";
import { expressjwt, type GetVerificationKey } from "express-jwt";
import jwkClient from "jwks-rsa";
import config from "config";
import { AuthCookie } from "../types";

export default expressjwt({
    secret: jwkClient.expressJwtSecret({
        jwksUri: config.get<string>("auth.jwksUri"),
        cache: true,
        rateLimit: true,
    }) as GetVerificationKey,
    algorithms: ["RS256"],
    getToken(req: Request): string | undefined {
        const authHeader = req.headers.authorization;

        if (authHeader && authHeader.split(" ")[1] !== "undefined") {
            const token = authHeader.split(" ")[1];
            if (token) {
                return token;
            }
        }

        const { accessToken } = req.cookies as AuthCookie;

        return accessToken;
    },
});
