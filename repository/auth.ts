import { http } from "#/utils/http";
import useSWR from "swr";


const url = {
    getLogin() {
        return `/auth/login`;
    },
    getUser() {
        return `http://localhost:3222/users`
    }
}

const hooks = {
    useGetUser() {
        return useSWR(url.getUser(), http.fetcher)
    }
}

const api = {
    async login(body: { username: any; password: any }) {
        try {
            const response = await http.post(url.getLogin(), body);
            console.log(response.body)
            return response.body;
        } catch (error) {
            return 'Login gagal';
        }
    },
}

export const authRepository = {
    url,
    hooks,
    api
}
