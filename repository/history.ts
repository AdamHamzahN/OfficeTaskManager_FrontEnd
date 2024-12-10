import { http } from "#/utils/http";
import useSWR from "swr";


const url = {
    getHistoryById(id_user: string, page: number, page_size: number, search?: any) {
        search = search || ''; //mengecek apakah seacrh null 
        return `/team/${id_user}/history?page=${page}&page_size=${page_size}&search=${search}`
    }
}

const hooks = {
    useGetHistoryById(id_user: string,page:number,page_size:number, search?: any) {
        return useSWR(url.getHistoryById(id_user,page,page_size,search), http.fetcher);
    }
}

const api = {

}

export const historyRepository = {
    url,
    hooks,
    api
}