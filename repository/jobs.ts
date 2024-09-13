import {http} from "#/utils/http";
import useSWR from "swr";


const url = {
	getAllJobs() {
        return '/job'
    },
    tambahJobs() {
        return '/job/tambah'
    }
}

const hooks = {
	useAllJobs() {
        return useSWR(url.getAllJobs(), http.fetcher);
    },
    useTambahJobs() {
        return useSWR(url.tambahJobs(), http.fetcher);
    }
}

const api = {

}

export const jobsRepository = {
	url,
    hooks, 
    api
}