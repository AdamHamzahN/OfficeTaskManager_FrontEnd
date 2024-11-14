'use client'
import React, { useState } from "react";
import { Alert, Spin, Table, Tabs, TabsProps } from "antd";
import { useParams } from "next/navigation";
import { projectRepository } from "#/repository/project";
import Header from "./pageComponent/header";
import TableTeam from "./pageComponent/tableTeam";
import TableTask from "./pageComponent/tableTask";
import TugasDiselesaikan from "./pageComponent/tugasDiselesaikan";
import { tugasRepository } from "#/repository/tugas";

const DetailProject: React.FC<{
    nama_team: any,
    status: any,
    idProject: any,
    teamData: any,
    pageTeam: any,
    pageSizeTeam: any,
    handlePageChange: any,
    mutateTeam: any,
    refreshTable: () => void,
    formatTimeStr: (text: string) => string
}> = ({ nama_team, status, idProject, teamData, pageTeam, pageSizeTeam, handlePageChange, mutateTeam, refreshTable, formatTimeStr }) => {
    const [pageTugas, setPageTugas] = useState(1);
    const [pageSizeTugas, setPageSizeTugas] = useState(5);
    const tugasProject = tugasRepository.hooks.useGetTugasByProject(idProject, pageTugas, pageSizeTugas);
    const handlePageChangeTugas = (newPage: number, newPageSize: number) => {
        setPageTugas(newPage);
        setPageSizeTugas(newPageSize);
    };
    return (
        <div>
            <TableTeam
                status_project={status}
                dataTugas={tugasProject}
                idProject={idProject}
                nama_team={nama_team}
                data={teamData}
                mutate={mutateTeam}
                refreshTable={refreshTable}
                handlePageChange={handlePageChange}
                page={pageTeam}
                pageSize={pageSizeTeam}
            />
            <TableTask
                status_project={status}
                dataTugas={tugasProject}
                idProject={idProject}
                pageTugas={pageTugas}
                pageSizeTugas={pageSizeTugas}
                handlePageChangeTugas={handlePageChangeTugas}
                refreshTable={refreshTable}
                formatTimeStr={formatTimeStr} />
        </div>
    );
};

// Page Component
const Page = () => {
    const params = useParams();
    const idUser = params?.idUser as string;
    const idProject = params?.idProject as string;
    const [activeKey, setActiveKey] = useState<string>('DetailProject');
    const [pageTeam, setPageTeam] = useState(1);
    const [pageSizeTeam, setPageSizeTeam] = useState(5);
    const handlePageChange = (newPage: number, newPageSize: number) => {
        setPageTeam(newPage);
        setPageSizeTeam(newPageSize);
    };
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

    const { data: detailProject, error: errorDetailProject, isValidating: validateDetailProject, mutate: mutateDetailProject } = projectRepository.hooks.useDetailProject(idProject);

    const { data: tugasSelesai, error: errorTugasSelesai, isValidating: validateTugasSelesai, mutate: mutateTugasSelesai } = tugasRepository.hooks.useTugasSelesai(idProject);

    const { data: teamProject, error: errorTeam, isValidating: validateTeam, mutate: mutateTeam } = projectRepository.hooks.useTeamByProject(idProject, pageTeam, pageSizeTeam);

    const loading = validateDetailProject || validateTugasSelesai || validateTeam;
    const error = errorDetailProject || errorTugasSelesai || errorTeam;

    if (loading) {
        return <Spin style={{ textAlign: 'center', padding: '20px' }} />;
    }
    if (error) {
        return <Alert message="Error fetching data" type="error" />;
    }

    const refreshTable = async () => {
        await mutateDetailProject();
        await mutateTugasSelesai();
    };

    const onChange: TabsProps['onChange'] = (key) => {
        setActiveKey(key);
    };

    const items: TabsProps['items'] = [
        {
            key: 'DetailProject', label: 'Detail Project', children: <DetailProject
                pageTeam={pageTeam}
                pageSizeTeam={pageSizeTeam}
                handlePageChange={handlePageChange}
                nama_team={detailProject?.data.nama_team}
                idProject={idProject}
                teamData={teamProject}
                refreshTable={refreshTable}
                mutateTeam={mutateTeam}
                formatTimeStr={formatTimeStr}
                status={detailProject.data.status}
            />
        },
        { key: 'TugasDiselesaikan', label: 'Tugas Diselesaikan', children: <TugasDiselesaikan data={tugasSelesai} refreshTable={refreshTable} formatTimeStr={formatTimeStr} /> },
    ];

    return (
        <div>
            <Header
                data={detailProject.data}
                idUser={idUser}
                refreshTable={refreshTable}
            />
            <div
                style={{
                    paddingRight: 24,
                    paddingBottom: 24,
                    paddingLeft: 24,
                    minHeight: '100vh',
                    backgroundColor: '#fff',
                    borderRadius: 15,
                    marginTop: 10,
                }}
            >
                <Tabs activeKey={activeKey} items={items} onChange={onChange} />
            </div>
        </div>
    );
};

export default Page;
