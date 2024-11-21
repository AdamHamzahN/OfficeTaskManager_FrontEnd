'use client';
import React, { useState } from "react";
import { Alert, Spin } from "antd";
import { useParams } from "next/navigation";
import Header from "./header";
import { projectRepository } from "#/repository/project";
import TableTeam from "./tableTeam";
import TableTask from "./tableTask";

const DetailProject: React.FC<{
    nama_team: any,
    idProject: string,
    teamData: string,
    pageTeam: any,
    pageSizeTeam: any,
    handlePageChange: any,
    formatTimeStr: (text: string) => string
    // mutateTeam: any,
    // refreshTable: () => void
}> = ({ nama_team, idProject, teamData,pageTeam,pageSizeTeam,handlePageChange, formatTimeStr }) => {
    return (
        <>
            <TableTeam
                idProject={idProject}
                nama_team={nama_team}
                data={teamData}
                pageTeam={pageTeam}
                pageSizeTeam={pageSizeTeam}
                handlePageChange={handlePageChange}
            // mutate={mutateTeam}
            // refreshTable={refreshTable}
            />
            <TableTask idProject={idProject} formatTimeStr={formatTimeStr} />
        </>
    );
};

const Page = () => {
    const params = useParams();
    const idUser = params?.idUser as string;
    const idProject = params?.idProject as string;
    const [pageTeam, setPageTeam] = useState(1);
    const [pageSizeTeam, setPageSizeTeam] = useState(5);
    const handlePageChange = (newPage: number, newPageSize: number) => {
        setPageTeam(newPage);
        setPageSizeTeam(newPageSize);
    };

    const { data: detailProject, error: errorDetailProject, isValidating: validateDetailProject, mutate: mutateDetailProject }
        = projectRepository.hooks.useDetailProject(idProject);

    const { data: teamProject, error: errorTeam, isValidating: validateTeam, mutate: mutateTeam }
        = projectRepository.hooks.useTeamByProject(idProject, pageTeam, pageSizeTeam);


    const loading = validateDetailProject
    const error = errorDetailProject

    if (loading) {
        return <Spin style={{ textAlign: 'center', padding: 20 }} />
    }
    if (error) {
        return <Alert message="Error fetching data" type="error" />;
    }

    const formatTimeStr = (dateStr: string) => {
        const date = new Date(dateStr);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); //bulan mulai dari 0
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
    };

    const refreshTable = async () => {
        await mutateDetailProject();
    }

    return (
        <>
            <Header
                data={detailProject.data}
                idUser={idUser}
                refreshTable={refreshTable}
                formatTimeStr={formatTimeStr}
            />

            <div style={{ padding: 24, minHeight: '100vh', backgroundColor: '#FFFFFF', borderRadius: 15, marginTop: 30 }}>
                <DetailProject
                    pageTeam={pageTeam}
                    pageSizeTeam={pageSizeTeam}
                    handlePageChange={handlePageChange}
                    nama_team={detailProject?.data.nama_team}
                    idProject={idProject}
                    teamData={teamProject}
                    formatTimeStr={formatTimeStr}
                />
            </div>
        </>
    );
};

export default Page;