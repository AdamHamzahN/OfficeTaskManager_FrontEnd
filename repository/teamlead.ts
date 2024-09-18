import {http} from "#/utils/http";
import useSWR from "swr";


const url = {
	getStatusKeaktifan(id_user: string) {
		return `/users/${id_user}/update-status-keaktifan`;
	},
}

const hooks = {
	useStatusKeaktifan(id_user: string) {
		return useSWR(url.getStatusKeaktifan(id_user), http.fetcher)
	}
}

const api = {

}

export const teamleadRepository = {
	url, hooks, api
}
