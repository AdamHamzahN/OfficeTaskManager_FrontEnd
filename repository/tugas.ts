import {http} from "#/utils/http";
import useSWR from "swr";


const url = {
    //get
    getTugasKaryawanByIdUser(id_user: string) {
		return `/tugas/${id_user}/karyawan/tugas-karyawan`
	},
	getTugasKaryawanBelumSelesai(id_user: string){
        return `/tugas/${id_user}/karyawan/tugas-karyawan-belum-selesai`
    },
    getTugasByProject(id_project: string) {
		return `/tugas/${id_project}/tugas-project`
	},
    getTugasSelesai(id_project: string) {
		return `/tugas/${id_project}/tugas-selesai`
	},
	getTugasById(id_tugas: string) {
		return `/tugas/${id_tugas}/detail`
	},

    //Update 
    updateStatusTugas(id_tugas: string) {
		return `/tugas/${id_tugas}/update-status-tugas`
	},
    updateNoteTugas(id_tugas: string) {
		return `/tugas/${id_tugas}/update-note`
	},
}

const hooks = {
	useGetTugasKaryawanBelumSelesai(id_user:string){
        return useSWR(url.getTugasKaryawanBelumSelesai(id_user), http.fetcher);
    },
    useGetTugasKaryawanByIdUser(id_user: string) {
		return useSWR(url.getTugasKaryawanByIdUser(id_user), http.fetcher);
	},
    useGetTugasByProject(id_project: string) {
		return useSWR(url.getTugasByProject(id_project), http.fetcher);
	},
    useTugasSelesai(id_project: string) {
		return useSWR(url.getTugasSelesai(id_project), http.fetcher);
	},
	useGetTugasById(id_project: string) {
		return useSWR(url.getTugasById(id_project), http.fetcher);
	},
}

const api = {
    async updateStatusTugas(id_tugas: string, body: { status: string, note?: string }) {
		const { status, note } = body;

		try {
			console.log('Request body:', body);
			const updateTugasResponse = await http.put(url.updateStatusTugas(id_tugas), { status });

			let updateNoteResponse;
			if (note !== undefined && note !== null) {
				updateNoteResponse = await http.put(url.updateNoteTugas(id_tugas), { note });
			}
			return {
				updateTugasResponse: updateTugasResponse.body,
				updateNoteResponse: updateNoteResponse ? updateNoteResponse.body : null,  // Handle optional note response
			};
		} catch (error) {
			console.error('Error in updating tugas:', error);
			throw new Error('Gagal mengupdate status tugas');
		}
	},
}

export const tugasRepository = {
	url, hooks, api
}
