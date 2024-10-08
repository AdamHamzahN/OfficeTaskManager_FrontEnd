import { http } from "#/utils/http";
import { Response } from "superagent";
import useSWR, { mutate } from "swr";


const url = {
	//get
	getProjectTeamLeadByStatus(id_user: string, status: string) {
		return `/project/team-lead/${id_user}/projects?status=${status}`
	},
	getDetailProject(id_project: string) {
		return `/project/${id_project}/detail-project`
	},
	getTeamByProject(id_project: string) {
		return `/team/${id_project}/team-project`
	},
	getKaryawanAvailable() {
		return `/karyawan/status-available`
	},
	getProjectDikerjakan(id_user: string){
		return `/project/karyawan/${id_user}/project-dikerjakan`
	},
	getProjectSelesai(id_user: string){
        return `/project/karyawan/${id_user}/project-selesai`
    },

	//create
	createAnggotaTeam() {
		return `/team/tambah`
	},
	
	//update
	updateStatusProjectKaryawan(id_karyawan: string) {
		return `/karyawan/${id_karyawan}/update-status-project`
	},
	updateNamaTeam(id_project: string){
		return`/project/${id_project}/update-nama-team`
	},
	updateStatusProject(id_project: string){
		return `/project/${id_project}/update-status`
	},
	uploadFileHasiProject(id_project: string){
		return `/project/${id_project}/upload-file-hasil`
	},

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
	useGetKaryawanAvailable() {
		return useSWR(url.getKaryawanAvailable(), http.fetcher);
	},
	useGetProjectDikerjakanKaryawan(id_user: string) {
		return useSWR(url.getProjectDikerjakan(id_user), http.fetcher);
	},
	useGetProjectSelesaiKaryawan(id_project: string) {
		return useSWR(url.getProjectSelesai(id_project), http.fetcher);
	},
}

const api = {  
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

	async updateStatusProject(id_project: string, body: { status_project: string, file_hasil_project?: File | null }) {
		try {
			// Meng-update status proyek
			const updateStatusResponse: Response = await http.put(url.updateStatusProject(id_project), {
				status_project: body.status_project, // Hanya mengirim status_project di sini
			});
			console.log('Response from updateStatusProject:', updateStatusResponse.body);
			
	
			// Meng-upload file jika ada
			if (body.file_hasil_project) {
				console.log('file hasil project',body.file_hasil_project);
				const formData = new FormData();
				formData.append('file_hasil_project', body.file_hasil_project); // Menambahkan file ke FormData
				console.log('formData :', formData)
				const uploadFileBuktiResponse: Response = await http.upload(url.uploadFileHasiProject(id_project), formData);
				console.log('Response from uploadFileBukti:', uploadFileBuktiResponse.body);
			}
	
			return {
				updateStatusResponse: updateStatusResponse.body,
			};
		} catch (error) {
			console.error('Error:', error);
			throw new Error('Gagal mengubah status project');
		}
	}
	


};



export const projectRepository = {
	url, hooks, api
}
