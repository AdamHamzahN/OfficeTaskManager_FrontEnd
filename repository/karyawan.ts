import {http} from "#/utils/http";
import useSWR from "swr";


const url = {
	getAllKaryawan() {
        return '/karyawan'
    },
    tambahKaryawan() {
        return '/karyawan/tambah'
    },
    getKaryawanById(id_karyawan: string) {
        return `/karyawan/${id_karyawan}/detail`
    }
}

const hooks = {
	useAllKaryawan() {
        return useSWR(url.getAllKaryawan(), http.fetcher);
    },
    useTambahKaryawan() {
        return useSWR(url.tambahKaryawan(), http.fetcher);
    },
    useGetKaryawanById(id_karyawan: string) {
        return useSWR(url.getKaryawanById(id_karyawan), http.fetcher);
    }
}

const api = {

}

export const karyawanRepository = {
	url,
    hooks, 
    api
}