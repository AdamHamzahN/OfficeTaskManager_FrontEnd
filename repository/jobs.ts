import {http} from "#/utils/http";
import useSWR from "swr";


const url = {
	getAllJobs() {
        return '/job'
    },
    tambahJobs() {
        return '/job/tambah'
    },
    getJobById(id_job:string){
		return `/job/${id_job}/detail`
	},
    editJobById(id_job:string){
        return 'job/${id_job}/update'
    }
}

const hooks = {
	useAllJobs() {
        return useSWR(url.getAllJobs(), http.fetcher);
    },
    useTambahJobs() {
        return useSWR(url.tambahJobs(), http.fetcher);
    },
    useGetJobById(id_job: string) {
        return useSWR(url.getJobById(id_job), http.fetcher);
    },
    useEditJobById(id_job: string) {
        return useSWR(url.editJobById(id_job), http.fetcher);
    }

}

const api = {

}

export const jobsRepository = {
	url,
    hooks, 
    api
}