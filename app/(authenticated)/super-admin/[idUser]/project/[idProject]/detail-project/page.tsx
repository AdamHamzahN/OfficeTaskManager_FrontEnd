'use client';
import React from "react";
import { Alert, Spin } from "antd";
import { useParams } from "next/navigation";
import Header from "./header";
import { projectRepository } from "#/repository/project";

const Page = () => {
    const params = useParams();
    const idUser = params?.idUser as string;
    const idProject = params?.idProject as string

    const {data: detailProject, error: errorDetailProject, isValidating: validateDetailProject, mutate: mutateDetailProject}
        = projectRepository.hooks.useDetailProject(idProject);

    const loading = validateDetailProject
    const error = errorDetailProject

    if (loading) {
        return <Spin style={{textAlign: 'center', padding: 20}} />
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

            <div style={{ padding: 24, minHeight: '100vh', backgroundColor: '#FFFFFF', borderRadius: 15, marginTop: 30 }}>

            </div>
        </>
    );
};

export default Page;