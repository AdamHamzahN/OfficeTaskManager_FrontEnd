'use client'
import React, { useState } from "react";
import { Alert, Spin } from "antd";
import { useParams } from "next/navigation";
import { projectRepository } from "#/repository/project";
import Header from "./pageComponent/header";
import TableTeam from "./pageComponent/tableTeam";
import TugasComponent from "./pageComponent/tugas";
import { JwtToken } from "#/utils/jwtToken";


// Page Component
const Page = () => {
    const params = useParams();
    const idUser = JwtToken.getPayload().sub;
    const idProject = params?.idProject as string;
    const [pageTeam, setPageTeam] = useState(1);
    const [pageSizeTeam, setPageSizeTeam] = useState(5);
    const handlePageChange = (newPage: number, newPageSize: number) => {
        setPageTeam(newPage);
        setPageSizeTeam(newPageSize);
    };

    const { data: detailProject, error: errorDetailProject, isValidating: validateDetailProject } = projectRepository.hooks.useDetailProject(idProject);

    const { data: teamProject, error: errorTeam, isValidating: validateTeam, mutate: mutateTeam } = projectRepository.hooks.useTeamByProject(idProject, pageTeam, pageSizeTeam);

    const loading = validateDetailProject || validateTeam;
    const error = errorDetailProject || errorTeam;

    const formatTimeStr = (dateStr: string) => {
        const date = new Date(dateStr);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');

        return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
    };

    if (loading) {
        return <Spin style={{ textAlign: 'center', padding: '20px' }} />;
    }
    if (error) {
        return <Alert message="Error fetching data" type="error" />;
    };

    return (
        <div>
            <Header
                data={detailProject.data}
                idUser={idUser}
            />
            <div
                style={{
                    padding: 24,
                    backgroundColor: '#fff',
                    borderRadius: 15,
                    marginTop: 10,
                }}
            >
                <TableTeam
                    idProject={idProject}
                    nama_team={detailProject?.data.nama_team}
                    data={teamProject}
                    pageTeam={pageTeam}
                    pageSizeTeam={pageSizeTeam}
                    handlePageChange={handlePageChange}
                    loading={validateTeam}
                    />
            </div>
            <TugasComponent idUser={idUser} id_project={idProject} status={detailProject.data.status} formatTimeStr={formatTimeStr} />
        </div>
    );
};

export default Page;
