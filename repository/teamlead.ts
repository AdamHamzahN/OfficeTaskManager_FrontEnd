import {http} from "#/utils/http";
import useSWR from "swr";


const url = {
	getNamaTeamLead() {
		return `/users/team-lead`;
	},
	getStatusKeaktifan(id_user: string) {
		return `/users/${id_user}/update-status-keaktifan`;
	},
	tambahTeamLead() {
		return 	`/users/tambah-team-lead`;
	},
	//super admin update password team lead
	editPassword(id_user: string) {
		return `/users/${id_user}/super-admin-update-password`
	}
}

const hooks = {
	useNamaTeamLead() {
		return useSWR(url.getNamaTeamLead(), http.fetcher)
	},
	useStatusKeaktifan(id_user: string) {
		return useSWR(url.getStatusKeaktifan(id_user), http.fetcher)
	},
}

const api = {
	async tambahTeamLead(body: any) {
		// const { nama, username, email } = body.nama
		console.log(body)
		try {
			const tambahTeamLeadResponse = await http.post(url.tambahTeamLead(), body);
			
			return {
			tambahTeamLeadResponse: tambahTeamLeadResponse.body
			};
		} catch (error) {
			console.error('Error tambah team lead:', error);
			throw new Error('Gagal menambah team lead');
		}
	},

	async editPassword(id_user: string, body: any) {
		const bodyValue = (body.newPassword)
		try {
			const teamResponse = await http.put(url.editPassword(id_user), bodyValue);
			// console.log('lo', teamResponse.body);
			return {
				teamResponse: teamResponse.body,
			};
		} catch (error) {
			throw new Error('Gagal mengubah password');
		}

	}
}

export const teamleadRepository = {
	url, hooks, api
}
