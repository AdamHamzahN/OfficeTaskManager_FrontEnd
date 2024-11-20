import {http} from "#/utils/http";
import useSWR from "swr";


const url = {
	getNamaTeamLead(page?:number,page_size?:number) {
		if(page && page_size){
			return `/users/team-lead?page=${page}&page_size=${page_size}`;
		}else{
			return `/users/team-lead`;
		}
	},
	getNamaTeamLeadActive() {
		return `/users/team-lead/active`;
	},
	editStatusKeaktifan(id_user: string) {
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
	useNamaTeamLead(page?:number,page_size?:number) {
		if(page && page_size){
			return useSWR(url.getNamaTeamLead(page,page_size), http.fetcher);
		}else{
			return useSWR(url.getNamaTeamLead(), http.fetcher);
		}
	},
	useNamaTeamLeadActive() {
		return useSWR(url.getNamaTeamLeadActive(), http.fetcher)
	}
}

const api = {
	async editStatusKeaktifan(id_user: string, body: {status: string}) {
		try {
			const statusResponse = await http.put(url.editStatusKeaktifan(id_user), body);
			return {
				statusResponse: statusResponse.body
			};
		} catch (error) {
			console.error('Gagal memperbarui status keaktifan:', error);
			throw error;
		}
	},
	async tambahTeamLead(body: any) {
		// const { nama, username, email } = body.nama
		try {
			const tambahTeamLeadResponse = await http.post(url.tambahTeamLead(), body);
			return {
				tambahTeamLeadResponse: tambahTeamLeadResponse.body.response
			};
		} catch (error:any) {
			const errorMessage = error.response.body.message[0];
           	throw new Error(errorMessage);
			
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
