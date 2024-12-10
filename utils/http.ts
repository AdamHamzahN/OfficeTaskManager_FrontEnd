'use client'
import superagent from "superagent";
//@ts-ignore
import superagentIntercept from 'superagent-intercept';
import { config } from '#/config/app';
import { attachSuperagentLogger } from "./http_logger";
import { TokenUtil } from './token';
import { JwtToken } from "./jwtToken";

/**
 * Mengambil token dari local storage
 */
let token = JwtToken.getAuthData()?.token;

/**
 * Interceptor untuk menangani error 401 Unauthorized
 */
let AuthIntercept = superagentIntercept((err: any, res: any) => {
    if ((res && res.status === 401 && token == 'undifined')) {
        console.log('AuthIntercept 401');
        window.location.href = "/login";
    }
});

export const http = {
    get: (url: string, opts = {}) => {
        let req = superagent.get(config.baseUrl + url)
            .set('Content-Type', 'application/json')
            .use(AuthIntercept)
            .use(attachSuperagentLogger);

        if (token) {
            // req = req.set('Authorization', 'Bearer ' + TokenUtil.accessToken);
            req = req.set('Authorization', 'Bearer ' +  token);

        }

        return req;
    },

    post: (url: string, opts = {}) => {
        let req = superagent.post(config.baseUrl + url)
            .send(opts)
            .set('Content-Type', 'application/json')
            .use(AuthIntercept)
            .use(attachSuperagentLogger);

        if (token) {
            // req = req.set('Authorization', 'Bearer ' + TokenUtil.accessToken);
            req = req.set('Authorization', 'Bearer ' + token);

        }
        return req;
    },

    put: (url: string, opts = {}) => {
        let req = superagent.put(config.baseUrl + url)
            .send(opts)
            .set('Content-Type', 'application/json')
            // .set('Content-Type', 'multipart/form-data')
            .use(AuthIntercept)
            .use(attachSuperagentLogger);

        if (token) {
            // req = req.set('Authorization', 'Bearer ' + TokenUtil.accessToken);
            req = req.set('Authorization', 'Bearer ' + token);

        }

        return req;
    },

    upload: (url: string, opts = {}) => {
        let req = superagent.put(config.baseUrl + url)
            .send(opts)
            .use(AuthIntercept)
            .use(attachSuperagentLogger);

        if (token) {
            // req = req.set('Authorization', 'Bearer ' + TokenUtil.accessToken);
            req = req.set('Authorization', 'Bearer ' + token);

        }

        return req;
    },

    del: (url: string, opts = {}) => {
        let req = superagent.del(config.baseUrl + url)
            .use(AuthIntercept)
            .use(attachSuperagentLogger);

        if (TokenUtil.accessToken) {
            req = req.set('Authorization', 'Bearer ' + TokenUtil.accessToken);
        }
        return req;
    },

    fetcher: async (url: string) => {
        let req = superagent.get(config.baseUrl + url)
            .use(AuthIntercept)
            .use(attachSuperagentLogger)

        if (token) {
            // req = req.set('Authorization', 'Bearer ' + TokenUtil.accessToken);
            req = req.set('Authorization', 'Bearer ' + token);

        }

        const resp = await req
        return resp.body;
    },
};
