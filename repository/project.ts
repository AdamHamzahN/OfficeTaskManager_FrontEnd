import {http} from "#/utils/http";
import useSWR from "swr";


const url = {
	getProjectTeamLeadByStatus(id_user:string, status: string){
       return `/project/team-lead/${id_user}/projects?status=${status}`
    }
}

const hooks = {
	useProjectTeamLeadByStatus(id_user:any ,status: string) {
        return useSWR(url.getProjectTeamLeadByStatus(id_user,status), http.fetcher);
	}
}

const api = {

}

export const projectRepository = {
	url, hooks, api
}
