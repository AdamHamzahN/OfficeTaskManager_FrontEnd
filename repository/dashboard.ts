import {http} from "#/utils/http";
import useSWR from "swr";


const url = {
    // super admin
    getUpdateProjectSuperAdminTerbaru() {   
        return '/project/update-terbaru';
    },
    getProjectDalamProses() {
        return '/project/count-onprogress';
    },
    getProjectSelesai() {
        return '/project/count-selesai';
    },
    getProjectOnProgress() {
        return '/project/data-onprogress'
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
    },

    //Karyawan
        getTugasKaryawanByProject(id_user:string) {
        return `/tugas/${id_user}/karyawan/tugas-project`
    }
}

const hooks = {
    //super admin
    useUpdateProjectSuperAdminTerbaru() {   
        return useSWR(url.getUpdateProjectSuperAdminTerbaru(), http.fetcher);
    },
    useProjectDalamProses() {
        return useSWR(url.getProjectDalamProses(), http.fetcher);
    },
    useProjectSelesai() {
        return useSWR(url.getProjectSelesai(), http.fetcher);
    },
    useProjectOnProgress() {
        return useSWR(url.getProjectOnProgress(), http.fetcher);
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
    },

    //Karyawan
    useGetTugasKaryawanByProject(id_user: string) {
        return useSWR(url.getTugasKaryawanByProject(id_user), http.fetcher);
    }
}

const api = {
    
}

export const dashboardRepository = {
    url,
    hooks,
    api
}
