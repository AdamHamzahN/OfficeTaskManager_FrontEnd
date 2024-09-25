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
        return `/job/${id_job}/update`
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
    async tambahJobs(body:any) {
        const bodyValue = (body.newJob)
		try {
			const teamResponse = await http.post(url.tambahJobs(), bodyValue);
			console.log('Response from createAnggotaTeam:', teamResponse.body);
			return {
				teamResponse: teamResponse.body,
			};
		} catch (error) {
			throw new Error('Gagal mengubah nama jobss');
		}
	},
    async editJobById(id_job:string ,body:any) {
        const bodyValue = (body.editsJob)
		try {
			const teamResponse = await http.put(url.editJobById(id_job), bodyValue);
			console.log('Response from createAnggotaTeam:', teamResponse.body);
			return {
				teamResponse: teamResponse.body,
			};
		} catch (error) {
			throw new Error('Gagal mengubah nama jobs');
		}
	}
}    

export const jobsRepository = {
	url,
    hooks, 
    api
}