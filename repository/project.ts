import { http } from "#/utils/http";
import { Response } from "superagent";
import useSWR from "swr";

const url = {
	//get
	getProjectTeamLeadByStatus(id_user: string, status: string, page: number, page_size: number) {
		return `/project/team-lead/${id_user}/projects?status=${status}&page=${page}&page_size=${page_size}`
	},
	getDetailProject(id_project: string) {
		return `/project/${id_project}/detail-project`
	},
	getTeamByProject(id_project: string, page?: number, page_size?: number) {
		if (page != null && page_size != null) {
			return `/team/${id_project}/team-project?page=${page}&page_size=${page_size}`
		}else{
			return `/team/${id_project}/team-project`
		}
	},
	getKaryawanAvailable() {
		return `/karyawan/status-available`
	},
	getProjectDikerjakan(id_user: string) {
		return `/project/karyawan/${id_user}/project-dikerjakan`
	},
	getProjectSelesai(id_user: string, page: number, page_size: number) {
		return `/project/karyawan/${id_user}/project-selesai?page=${page}&page_size=${page_size}`
	},
	getProjectByStatus(status: string, page: number, page_size: number) {
		return `/project?status=${status}&page=${page}&page_size=${page_size}`
	},

	//create
	createAnggotaTeam() {
		return `/team/tambah`
	},
	//tambah project (super admin)
	tambahProject() {
		return `/project/tambah`
	},

	//update
	updateStatusProjectKaryawan(id_karyawan: string) {
		return `/karyawan/${id_karyawan}/update-status-project`
	},
	updateNamaTeam(id_project: string) {
		return `/project/${id_project}/update-nama-team`
	},
	updateStatusProject(id_project: string) {
		return `/project/${id_project}/update-status`
	},
	updateNoteProject(id_project: string) {
		return `/project/${id_project}/update-note`
	},
	updateStatusTeamKaryawan(id_project: string) {
		return `/team/${id_project}/update-status-karyawan`
	},

	// upload
	uploadFileProject(id_project: string) {
		return `/project/${id_project}/upload-file-project `
	},
	uploadFileHasiProject(id_project: string) {
		return `/project/${id_project}/upload-file-hasil`
	},

}

const hooks = {
	useProjectTeamLeadByStatus(id_user: any, status: string, page: number, page_size: number) {
		return useSWR(url.getProjectTeamLeadByStatus(id_user, status, page, page_size), http.fetcher);
	},
	useDetailProject(id_project: string) {
		return useSWR(url.getDetailProject(id_project), http.fetcher);
	},
	useTeamByProject(id_project: string,page?:number,page_size?:number) {
		return useSWR(url.getTeamByProject(id_project,page,page_size), http.fetcher);
	},
	useGetKaryawanAvailable() {
		return useSWR(url.getKaryawanAvailable(), http.fetcher);
	},
	useGetProjectDikerjakanKaryawan(id_user: string) {
		return useSWR(url.getProjectDikerjakan(id_user), http.fetcher);
	},
	useGetProjectSelesaiKaryawan(id_project: string, page: number, page_size: number) {
		return useSWR(url.getProjectSelesai(id_project, page, page_size), http.fetcher);
	},
	useGetProjectByStatus(status: string, page: number, page_size: number) {
		return useSWR(url.getProjectByStatus(status, page, page_size), http.fetcher);
	}
}

const api = {
	async createAnggotaTeam(body: any) {
		try {
			console.log('Request body:', body);
			const status = { status_project: 'unavailable' };

			// Request POST untuk menambahkan anggota tim
			const teamResponse = await http.post(url.createAnggotaTeam(), body);
			const id_karyawan = teamResponse.body.id;

			// Request PUT untuk memperbarui status project karyawan
			const statusResponse = await http.put(url.updateStatusProjectKaryawan(id_karyawan), status)

			return {
				teamResponse: teamResponse.body,
				statusResponse: statusResponse.status
			};
		} catch (error) {
			console.error('Error in createAnggotaTeam:', error);
			throw new Error('Gagal menambahkan anggota tim atau memperbarui status.');
		}
	},

	//tambah project (super admin)
	async tambahProject(body: {
		nama_project: string,
		id_team_lead: string,
		nama_team: string,
		start_date: string,
		end_date: string,
		file_project: File | null
	}) {
		const { file_project, ...restBody } = body;
		console.log('file projeect', file_project);

		try {
			const tambahProjectResponse = await http.post(url.tambahProject(), restBody);
			console.log('Respon project:', tambahProjectResponse); // log response
			const parsedResponse = JSON.parse(tambahProjectResponse.text);
			const idProject = parsedResponse.id;
			console.log('id project', idProject, file_project);

			let updateFileProjectResponse;
			if (file_project) {
				const formData = new FormData();
				formData.append('file_project', file_project);
				updateFileProjectResponse = await http.upload(url.uploadFileProject(idProject), formData);
			} else {
				return 'gagal cuy...';
			}

			return {
				updateFileProjectResponse: updateFileProjectResponse ? updateFileProjectResponse : null,
				tambahProjectResponse: tambahProjectResponse
			};
		} catch (error) {
			console.error('Error tambah project:', error); //loog error
			return error;
			// throw new Error('Gagal tambah project');
		}
	},

	async updateNamaTeam(id_project: string, body: any) {
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

	async updateStatusProject(id_project: string, body: { status_project: string, note?: string, file_hasil_project?: File | null }) {
		const { note } = body
		try {
			// Meng-update status proyek
			const updateStatusResponse: Response = await http.put(url.updateStatusProject(id_project), {
				status_project: body.status_project, // Hanya mengirim status_project di sini
			});
			console.log('Response from updateStatusProject:', updateStatusResponse.body);

			let updateNoteProjectResponse;
			if (note !== undefined && note !== null) {
				updateNoteProjectResponse = await http.put(url.updateNoteProject(id_project), { note });
			}

			// Meng-upload file jika ada
			if (body.file_hasil_project) {
				console.log('file hasil project', body.file_hasil_project);
				const formData = new FormData();
				formData.append('file_hasil_project', body.file_hasil_project); // Menambahkan file ke FormData
				console.log('formData :', formData)
				const uploadFileBuktiResponse: Response = await http.upload(url.uploadFileHasiProject(id_project), formData);
				console.log('Response from uploadFileBukti:', uploadFileBuktiResponse.body);
			}

			if (body.status_project == 'approved') {
				const updateStatusKaryawan: Response = await http.put(url.updateStatusTeamKaryawan(id_project));
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
