import {http} from "#/utils/http";
import useSWR from "swr";


const url = {
    getHistoryById(id_user: string) {
    return `/team/${id_user}/history`
    }
}

const hooks = {
  useGetHistoryById(id_user: string) {
      return useSWR(url.getHistoryById(id_user), http.fetcher);
    }
}

const api = {

}

export const historyRepository = {
	url,
    hooks, 
    api
}