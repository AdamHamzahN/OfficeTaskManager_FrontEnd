import {http} from "#/utils/http";
import { get } from "superagent";
import useSWR from "swr";

// const baseURL = process.env.NEXT_PUBLIC_API || 'http://localhost:3222';

const url = {
    getUpdateProjectSuperAdminTerbaru() {   // super admin
        return '/project/update-terbaru';
    },
    getProjectDalamProses() {
        return '/project/count-onprogress';
    },
    getProjectSelesai() {
        return '/project/count-selesai';
    },

    // team lead
    getUpdateProjectTeamLeadTerbaru(id_user: string) {
        return `/project/team-lead/${id_user}/update-terbaru`;
    },
    getUpdateTugasTeamLeadTerbaru(id_user: string) {
        return `/tugas/team-lead/${id_user}/update-terbaru`;
    },
    getUpdateProjectTeamLeadProgress(id_user: string) {
        return `/project/team-lead/${id_user}/data-onprogress`;
    }
}

const hooks = {
    useUpdateProjectSuperAdminTerbaru() {   //super admin
        return useSWR(url.getUpdateProjectSuperAdminTerbaru(), http.fetcher);
    },
    useProjectDalamProses() {
        return useSWR(url.getProjectDalamProses(), http.fetcher);
    },
    useProjectSelesai() {
        return useSWR(url.getProjectSelesai(), http.fetcher);
    },
    
    // team lead
    useUpdateProjectTeamLeadTerbaru(id_user: string) {
        return useSWR(url.getUpdateProjectTeamLeadTerbaru(id_user), http.fetcher);
    },
    useUpdateTugasTeamLeadTerbaru(id_user: string) {
        return useSWR(url.getUpdateTugasTeamLeadTerbaru(id_user), http.fetcher);
    },
    useProjectTeamLeadProgress(id_user: string) {
        return useSWR(url.getUpdateProjectTeamLeadProgress(id_user), http.fetcher);
    }
}

const api = {
    
}

export const dashboardRepository = {
    url,
    hooks,
    api
}
