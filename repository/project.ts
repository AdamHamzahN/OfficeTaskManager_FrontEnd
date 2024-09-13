import { http } from "#/utils/http";
import useSWR from "swr";


const url = {
	getProjectTeamLeadByStatus(id_user: string, status: string) {
		return `/project/team-lead/${id_user}/projects?status=${status}`
	},
	getDetailProject(id_project: string) {
		return `/project/${id_project}/detail-project`
	},
	getTeamByProject(id_project: string) {
		return `/team/${id_project}/team-project`
	},
	getTugasByProject(id_project: string) {
		return `/tugas/${id_project}/tugas-project`
	}
}

const hooks = {
	useProjectTeamLeadByStatus(id_user: any, status: string) {
		return useSWR(url.getProjectTeamLeadByStatus(id_user, status), http.fetcher);
	},
	useDetailProject(id_project: string) {
		return useSWR(url.getDetailProject(id_project), http.fetcher);
	},
	useTeamByProject(id_project: string) {
		return useSWR(url.getTeamByProject(id_project), http.fetcher);
	},
	useGetTugasByProject(id_project: string) {
		return useSWR(url.getTugasByProject(id_project), http.fetcher);
	}
}



const api = {

}

export const projectRepository = {
	url, hooks, api
}
