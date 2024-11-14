import {http} from "#/utils/http";
import useSWR from "swr";


const url = {
    getHistoryById(id_user: string , search?:any) {
    return `/team/${id_user}/history`
    }
}

const hooks = {
  useGetHistoryById(id_user: string,search?:any) {
      return useSWR(url.getHistoryById(id_user,search), http.fetcher);
    }
}

const api = {

}

export const historyRepository = {
	url,
    hooks, 
    api
}