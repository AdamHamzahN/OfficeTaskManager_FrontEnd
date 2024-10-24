import {http} from "#/utils/http";
import useSWR from "swr";


const url = {
    getHistoryById(id_history: string) {
    return `/team/${id_history}/history`
    }
}

const hooks = {
    useGetHistoryById(id_history: string) {
        return useSWR(url.getHistoryById(id_history), http.fetcher);
    }
}

const api = {

}

export const historyRepository = {
	url,
    hooks, 
    api
}