import {http} from "#/utils/http";
import useSWR from "swr";


const url = {
	getAllKaryawan(page:number,page_size:number) {
        return `/karyawan?page=${page}&page_size=${page_size}`
    },
    tambahKaryawan() {
        return '/karyawan/tambah'
    },
    getKaryawanById(id_karyawan: string) {
        return `/karyawan/${id_karyawan}/detail`
    },
    getKaryawanByIdUser(idUser: string) {
        return `/karyawan/${idUser}/karyawan-by-id-user`
    },
    editKaryawanById(idUser:string){
        return `/users/${idUser}/super-admin-update-password`
    },
    editAlamat(idUser:string){
        return `karyawan/${idUser}/update-profile`
    }
}

const hooks = {
	useAllKaryawan(page:number,page_size:number) {
        return useSWR(url.getAllKaryawan(page,page_size), http.fetcher);
    },
    useTambahKaryawan() {
        return useSWR(url.tambahKaryawan(), http.fetcher);
    },
    useGetKaryawanById(id_karyawan: string) {
        return useSWR(url.getKaryawanById(id_karyawan), http.fetcher);
    },
    useGetKaryawanByIdUser(id_user: string) {
        return useSWR(url.getKaryawanByIdUser(id_user), http.fetcher);
    }
}

const api = {
    async tambahKaryawan(body:any) {
        const bodyValue = (body.newKaryawan)
		try {
			const karyawanResponse = await http.post(url.tambahKaryawan(), bodyValue);
			console.log('Response from createAnggotaTeam:', karyawanResponse.body);
			return {
				karyawanResponse: karyawanResponse.body,
			};
		} catch (error) {
			throw new Error('Gagal mengubah nama Karyawan');
		}
	},
    async editPassword(id_user: string, body: any) {
        const bodyValue = (body.newPassword)
        try {
            const userResponse = await http.put(url.editKaryawanById(id_user), bodyValue);
            return {
                userResponse: userResponse.body,
                // status: response.status, // status dari HTTP response
                // data: response.data, // data dari body respons
            };
        } catch (error) {
            throw new Error('Gagal mengubah password');
        }
    },

    async editAlamat(id_user: string, body: any) {
        try {
            const karyawanResponse = await http.put(url.editAlamat(id_user), body);
            return {
                karyawanResponse: karyawanResponse.body,
                // status: response.status, // status dari HTTP response
                // data: response.data, // data dari body respons
            };
        } catch (error) {
            throw new Error('Gagal mengubah password');
        }
    }

}

export const karyawanRepository = {
	url,
    hooks, 
    api
}