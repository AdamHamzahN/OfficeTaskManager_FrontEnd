'use client'
import React, { useState } from "react";
import { Alert, Spin, Table, Tabs, TabsProps } from "antd";
import { useParams } from "next/navigation";
import { projectRepository } from "#/repository/project";
import Header from "./pageComponent/header";
import TableTeam from "./pageComponent/tableTeam";
import TableTask from "./pageComponent/tableTask";
import TugasBelumDiselesaikan from "./pageComponent/tugasBelumDiselesaikan";
import DaftarTugasSaya from "./pageComponent/daftarTugasSaya";
import { tugasRepository } from "#/repository/tugas";

const DetailProject: React.FC<{
    nama_team: any,
    idProject: any,
    teamData: any,
    tugasData: any,
    refreshTable: () => void,
    formatTimeStr: (text: string) => string
}> = ({ nama_team, idProject, teamData, tugasData, formatTimeStr }) => {
    return (
        <div>
            <TableTeam idProject={idProject} nama_team={nama_team} data={teamData}/>
            <TableTask data={tugasData} formatTimeStr={formatTimeStr} />
        </div>
    );
};

const TugasSaya: React.FC<{
    daftarTugas: any,
    tugasBelumSelesai:any,
    refreshTable: () => void,
    formatTimeStr: (text: string) => string
}> = ({daftarTugas,tugasBelumSelesai,refreshTable, formatTimeStr }) => {
    return (
        <div>
            <TugasBelumDiselesaikan data={tugasBelumSelesai} formatTimeStr={formatTimeStr}/>
            <DaftarTugasSaya data={daftarTugas} formatTimeStr={formatTimeStr} />
        </div>
    );
};

// Page Component
const Page = () => {
    const params = useParams();
    const idUser = params?.idUser as string;
    const idProject = params?.idProject as string;
    const [activeKey, setActiveKey] = useState<string>('DetailProject');

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

    const { data: tugasBelumSelesai, error: errorTugasBelumSelesai, isValidating: validateTugasBelumSelesai, mutate: mutateTugasBelumSelesai } = tugasRepository.hooks.useGetTugasKaryawanBelumSelesai(idUser);
    
    const { data: daftarTugas, error: errorDaftarTugas, isValidating: validateDaftarTugas, mutate: mutateDaftarTugas } =tugasRepository.hooks.useGetTugasKaryawanByIdUser(idUser);

    const { data: teamProject, error: errorTeam, isValidating: validateTeam, mutate: mutateTeam } = projectRepository.hooks.useTeamByProject(idProject);

    const { data: tugasProject, error: errorTugas, isValidating: validateTugas, mutate: mutateTugas } = tugasRepository.hooks.useGetTugasByProject(idProject);

    const loading = validateDetailProject || validateDaftarTugas || validateTeam || validateTugas || validateTugasBelumSelesai;
    const error = errorDetailProject || errorDaftarTugas || errorTeam || errorTugas || errorTugasBelumSelesai;

    console.log('p',daftarTugas,idUser)
    if (loading) {
        return <Spin style={{ textAlign: 'center', padding: '20px' }} />;
    }
    if (error) {
        return <Alert message="Error fetching data" type="error" />;
    }

    const refreshTable = async () => {
        await mutateDetailProject();
        await mutateDaftarTugas();
        await mutateTeam();
        await mutateTugas();
        await mutateTugasBelumSelesai();
    };

    const onChange: TabsProps['onChange'] = (key) => {
        setActiveKey(key);
    };

    const items: TabsProps['items'] = [
        {
            key: 'DetailProject', label: 'Detail Project', 
            children: <DetailProject
                nama_team={detailProject?.data.nama_team}
                idProject={idProject}
                teamData={teamProject}
                tugasData={tugasProject}
                refreshTable={refreshTable}
                formatTimeStr={formatTimeStr}
            />
        },
        { key: 'TugasSaya', label: 'Tugas Saya',
            children:<TugasSaya
            daftarTugas={daftarTugas} 
            tugasBelumSelesai={tugasBelumSelesai}
            formatTimeStr={formatTimeStr} 
            refreshTable={refreshTable}        
            />
         },
    ];

    return (
        <div>
            <Header
                idUser={idUser}
                status={detailProject?.data.status}
                file_project={detailProject?.data.file_project}
                idProject={detailProject?.data.id}
                nama_project={detailProject?.data.nama_project}
                nama_team={detailProject?.data.nama_team}
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
