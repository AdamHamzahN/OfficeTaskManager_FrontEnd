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
		return `/karyawan/${id_karyawan}/update-status-keaktifan`
	},
	updateStatusTugas(id_tugas: string) {
		return `/tugas/${id_tugas}/update-status-tugas`
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
	async createAnggotaTeam(body: any) {
		try {
			console.log('Request body:', body);
			const status = { status: 'inactive' };

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

	async updateStatusTugas(id_tugas: string, body: any) {
		try {
			console.log('Request body:', body);
			const updateTugasResponse = await http.put(url.updateStatusTugas(id_tugas), body);
			return {
				updateTugasResponse: updateTugasResponse.body,
			};
		} catch (error) {
			console.error('Error in update tugas :', error);
			throw new Error('Gagal mengupdate status tugas');

		}
	}
};



export const projectRepository = {
	url, hooks, api
}
