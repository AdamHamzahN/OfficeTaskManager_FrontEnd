import {http} from "#/utils/http";
import useSWR from "swr";

// const baseURL = process.env.NEXT_PUBLIC_API || 'http://localhost:3222';

const url = {
    getUpdateProjectTerbaru() {
        return `/project/update-terbaru`;
    },
    getUpdateProjectTeamLeadTerbaru(id_user: string) {
        return `/project/team-lead/${id_user}/update-terbaru`;
    },
    getUpdateProjectTeamLeadProgress(id_user: string) {
        return `/project/team-lead/${id_user}/data-onprogress`;
    }
}

const hooks = {
    useProjectTerbaru() {
        return useSWR(url.getUpdateProjectTerbaru(), http.fetcher);
    },
    useUpdateProjectTeamLeadTerbaru(id_user: string) {
        return useSWR(url.getUpdateProjectTeamLeadTerbaru(id_user), http.fetcher);
    },
    useProjectTeamLeadProgress(id_user: string) {
        return useSWR(url.getUpdateProjectTeamLeadProgress(id_user), http.fetcher);
    }
}

const api = {
    // Implementasikan fungsi API lain jika diperlukan
}

export const projectRepository = {
    url,
    hooks,
    api
}
