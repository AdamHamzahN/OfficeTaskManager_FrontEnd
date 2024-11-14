import {http} from "#/utils/http";
import { message } from "antd";
import useSWR from "swr";


const url = {
    getUser(idUser:any){
        return `/users/${idUser}/detail`
    },
    editPassword(idUser: any) {
        return `/users/${idUser}/update-password`
    }
}

const hooks = {
    useGetUser(idUser:any){
        return useSWR(url.getUser(idUser), http.fetcher)
    }
}

const api = {
    async editPassword(id_user: string, body: any) {
        const bodyValue = (body.newPassword)
        try {
            const userResponse = await http.put(url.editPassword(id_user), bodyValue);
            return {
                userResponse: userResponse.body,
            };
        } catch (error:any) {
            const errorMessage = error.response.body.message;
            throw new Error(errorMessage);
        }
    }
}

export const userRepository = {
	url,
    hooks, 
    api
}
