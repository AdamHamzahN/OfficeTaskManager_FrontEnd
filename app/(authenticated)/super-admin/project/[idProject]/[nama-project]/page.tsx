'use client';
import React, { useState } from "react";
import { Alert, Spin } from "antd";
import { useParams } from "next/navigation";
import Header from "./header";
import { projectRepository } from "#/repository/project";
import TableTeam from "./tableTeam";
import TableTask from "./tableTask";
import Container from "#/component/ContainerComponent";

const DetailProject: React.FC<{
    nama_team: any,
    idProject: string,
    // mutateTeam: any,
    // refreshTable: () => void
}> = ({ nama_team, idProject}) => {
    return (
        <>
            <TableTeam
                idProject={idProject}
                nama_team={nama_team}
            // mutate={mutateTeam}
            // refreshTable={refreshTable}
            />
            <TableTask idProject={idProject} />
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

    const loading = validateDetailProject
    const error = errorDetailProject

    if (loading) {
        return <Spin style={{ textAlign: 'center', padding: 20 }} />
    }
    if (error) {
        return <Alert message="Error fetching data" type="error" />;
    }

    const refreshTable = async () => {
        await mutateDetailProject();
    }

    return (
        <>
            <Header
                data={detailProject.data}
                idUser={idUser}
                refreshTable={refreshTable}
            />
            <Container style={{ marginTop: 30 }}>
                <DetailProject
                    nama_team={detailProject?.data.nama_team}
                    idProject={idProject}
                />
            </Container>
        </>
    );
};

export default Page;