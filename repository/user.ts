import {http} from "#/utils/http";
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
                // status: response.status, // status dari HTTP response
                // data: response.data, // data dari body respons
            };
        } catch (error) {
            throw new Error('Gagal mengubah password');
        }
    }
}

export const userRepository = {
	url,
    hooks, 
    api
}
