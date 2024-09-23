import { http } from "#/utils/http";
import useSWR, { mutate } from "swr";


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
	},
	getTugasSelesai(id_project: string) {
		return `/tugas/${id_project}/tugas-selesai`
	},
	getTugasById(id_tugas: string) {
		return `/tugas/${id_tugas}/detail`
	},
	getKaryawanAvailable() {
		return `/karyawan/status-available`
	},
	createAnggotaTeam() {
		return `/team/tambah`
	},
	updateStatusProjectKaryawan(id_karyawan: string) {
		return `/karyawan/${id_karyawan}/update-status-project`
	},
	updateStatusTugas(id_tugas: string) {
		return `/tugas/${id_tugas}/update-status-tugas`
	},
	updateNoteTugas(id_tugas: string) {
		return `/tugas/${id_tugas}/update-note`
	},
	updateNamaTeam(id_project: string){
		return`/project/${id_project}/update-nama-team`
	},
	updateStatusProject(id_project: string){
		return `/project/${id_project}/update-status`
	},
	uploadFileHasiProject(id_project: string){
		return `/project/${id_project}/upload-file-hasil`
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
	},
	useTugasSelesai(id_project: string) {
		return useSWR(url.getTugasSelesai(id_project), http.fetcher);
	},
	useGetTugasById(id_project: string) {
		return useSWR(url.getTugasById(id_project), http.fetcher);
	},
	useGetKaryawanAvailable() {
		return useSWR(url.getKaryawanAvailable(), http.fetcher);
	},

}

const api = {
	//perlu perbaikan
	async createAnggotaTeam(body: any) {
		try {
			console.log('Request body:', body);
			const status = { status_project: 'unavailable' };

			// Request POST untuk menambahkan anggota tim
			const teamResponse = await http.post(url.createAnggotaTeam(), body);
			console.log('Response from createAnggotaTeam:', teamResponse.body);

			const id_karyawan = teamResponse.body.data.karyawan;
			console.log('id karyawan :', teamResponse.body.data.karyawan)

			// Request PUT untuk memperbarui status project karyawan
			const statusResponse = await http.put(url.updateStatusProjectKaryawan(id_karyawan), status);
			console.log('Response from updateStatusProjectKaryawan:', statusResponse.status);

			return {
				teamResponse: teamResponse.body,
				statusResponse: statusResponse.status
			};
		} catch (error) {
			console.error('Error in createAnggotaTeam:', error);
			throw new Error('Gagal menambahkan anggota tim atau memperbarui status.');
		}
	},

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

	async updateNamaTeam(id_project: string, body:any) {
		try {
			const teamResponse = await http.put(url.updateNamaTeam(id_project), body);
			console.log('Response from createAnggotaTeam:', teamResponse.body);
			return {
				teamResponse: teamResponse.body,
			};
		} catch (error) {
			throw new Error('Gagal mengubah nama team');
		}
	},

	async updateStatusProject(id_project: string, body:{status_project:string,file_bukti?:any}) {
		try{
			const updateStatusResponse = await http.put(url.updateStatusProject(id_project),body);
			console.log('Response from updateStatusProject:', updateStatusResponse.body);
			const uploadFileBuktiResponse = '';
			if(body.file_bukti !== null && body.file_bukti !== undefined){
				const uploadFileBuktiResponse = await http.put(url.uploadFileHasiProject(id_project),body.file_bukti);
			}
			
			return{
				updateStatusResponse: updateStatusResponse.body,
			}
		}catch (error) {
			throw new Error('Gagal mengubah status project');
		}
	}


};



export const projectRepository = {
	url, hooks, api
}
