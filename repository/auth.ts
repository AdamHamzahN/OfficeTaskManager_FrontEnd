import {http} from "#/utils/http";
import useSWR from "swr";


const url = {
	getLogin() {
		return `/auth/login`;
	},
}

const hooks = {
	useLogin() {
		return useSWR(url.getLogin(), http.fetcher)
	}
}

const api = {
    async login(authData: {username: string; password: string}) {
        try {
            const response = await http.post(url.getLogin(), authData);
            return response.data;
        } catch (error) {
            throw new Error('Login gagal');
        }
    },
}

export const sampleRepository = {
	url,
    hooks, 
    api
}
