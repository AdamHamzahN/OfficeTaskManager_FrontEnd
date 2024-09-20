import {http} from "#/utils/http";
import useSWR from "swr";


const url = {
	getAllKaryawan() {
        return '/karyawan'
    }
}

const hooks = {
	useAllKaryawan() {
        return useSWR(url.getAllKaryawan(), http.fetcher);
    }
}

const api = {

}

export const karyawanRepository = {
	url,
    hooks, 
    api
}