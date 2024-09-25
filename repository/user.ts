import {http} from "#/utils/http";
import useSWR from "swr";


const url = {
    getUser(idUser:any){
        return `/users/${idUser}/detail`
    }
}

const hooks = {
    useGetUser(idUser:any){
        return useSWR(url.getUser(idUser), http.fetcher)
    }
}

const api = {
}

export const userRepository = {
	url,
    hooks, 
    api
}
