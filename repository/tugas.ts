import { http } from "#/utils/http";
import useSWR from "swr";


const url = {
	//get
	getTugasKaryawanByIdUser(id_user: string) {
		return `/tugas/${id_user}/karyawan/tugas-karyawan`
	},
	getTugasKaryawanBelumSelesai(id_user: string) {
		return `/tugas/${id_user}/karyawan/tugas-karyawan-belum-selesai`
	},
	getTugasByProject(id_project: string,page: number,page_size: number) {
		return `/tugas/${id_project}/tugas-project?page=${page}&page_size=${page_size}`
	},
	getTugasSelesai(id_project: string) {
		return `/tugas/${id_project}/tugas-selesai`
	},
	getTugasById(id_tugas: string) {
		return `/tugas/${id_tugas}/detail`
	},

	//create
	createTugas() {
		return `/tugas/tambah`
	},

	//Update 
	updateStatusTugas(id_tugas: string) {
		return `/tugas/${id_tugas}/update-status-tugas`
	},
	updateNoteTugas(id_tugas: string) {
		return `/tugas/${id_tugas}/update-note`
	},

	//upload
	uploadFileTugas(id_tugas: string) {
		return `/tugas/${id_tugas}/upload-file-tugas`
	},
	uploadFileBukti(id_tugas: string) {
		return `/tugas/${id_tugas}/upload-file-bukti`
	},



}

const hooks = {
	useGetTugasKaryawanBelumSelesai(id_user: string) {
		return useSWR(url.getTugasKaryawanBelumSelesai(id_user), http.fetcher);
	},
	useGetTugasKaryawanByIdUser(id_user: string) {
		return useSWR(url.getTugasKaryawanByIdUser(id_user), http.fetcher);
	},
	useGetTugasByProject(id_project: string , page: number , page_size: number) {
		return useSWR(url.getTugasByProject(id_project,page,page_size), http.fetcher);
	},
	useTugasSelesai(id_project: string) {
		return useSWR(url.getTugasSelesai(id_project), http.fetcher);
	},
	useGetTugasById(id_project: string) {
		return useSWR(url.getTugasById(id_project), http.fetcher);
	},
}

const api = {
	async createTugas(body: {
		nama_tugas: string,
		deskripsi_tugas: string,
		deadline: string,
		id_project: string,
		id_karyawan: string,
		file_tugas: File | null
	}) {
		const { file_tugas, ...restBody } = body;
		console.log('file_tugas:', file_tugas);

		try {
			const createTugasResponse = await http.post(url.createTugas(), restBody);
			console.log('Response from createTugas:', createTugasResponse); // Log response
			const parsedResponse = JSON.parse(createTugasResponse.text);
			const idTugas = parsedResponse.data.id;
			
			console.log('idTugas:', idTugas);
			console.log(`file :`,file_tugas)

			let updateFileTugasResponse;
			if (file_tugas) {
				const formData = new FormData();
				formData.append('file_tugas', file_tugas);
				updateFileTugasResponse = await http.upload(url.uploadFileTugas(idTugas), formData);
			}

			return {
				updateFileTugasResponse: updateFileTugasResponse ? updateFileTugasResponse : null,
				createTugasResponse: createTugasResponse
			};
		} catch (e) {
			console.error('Error occurred during createTugas:', e);
			return e;
		}
	},
	async updateStatusTugas(id_tugas: string, body: { status: string, note?: string, file_bukti?: File | null }) {
		const { status, note, file_bukti } = body;
		console.log('file bukti tugas :', file_bukti)

		try {
			console.log('Request body:', body);
			const updateTugasResponse = await http.put(url.updateStatusTugas(id_tugas), { status });

			let updateNoteResponse;
			if (note !== undefined && note !== null) {
				updateNoteResponse = await http.put(url.updateNoteTugas(id_tugas), { note });
			}
			let updateFileBuktiResponse;
			if (file_bukti !== undefined && file_bukti !== null) {
				const formData = new FormData();
				formData.append('file_bukti', file_bukti);
				updateFileBuktiResponse = await http.upload(url.uploadFileBukti(id_tugas), formData);
			}
			return {
				updateTugasResponse: updateTugasResponse.body,
				updateNoteResponse: updateNoteResponse ? updateNoteResponse.body : null,
				updateFileBuktiResponse: updateFileBuktiResponse ? updateFileBuktiResponse : null
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
