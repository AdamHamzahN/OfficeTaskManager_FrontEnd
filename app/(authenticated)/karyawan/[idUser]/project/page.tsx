"use client";
import { useState } from "react";
import { projectRepository } from "#/repository/project";
import { Alert, Col, Row, Spin, Tabs, TabsProps } from "antd";
import { useParams } from "next/navigation";
import ProjectList from "#/component/ProjectList";

const ProjectListComponent: React.FC<{ idUser: string, status: string }> = ({ idUser, status }) => {
    // Hooks untuk mendapatkan data proyek
    const { data: projectDikerjakan, error: errorDikerjakan, isValidating: projectDikerjakanValidating } = projectRepository.hooks.useGetProjectDikerjakanKaryawan(idUser);
    const { data: projectSelesai, error: errorSelesai, isValidating: projectSelesaiValidating } = projectRepository.hooks.useGetProjectSelesaiKaryawan(idUser);

    const error = errorDikerjakan || errorSelesai;
    const loading = projectDikerjakanValidating || projectSelesaiValidating;

    // Loading state
    if (loading) {
        return (
            <Col span={24}>
                <div style={{ textAlign: 'center', padding: '20px' }}>
                    <Spin size="large" style={{ padding: '20px' }} />
                </div>
            </Col>
        );
    }

    // Error state
    if (error) {
        return <Alert message="Error fetching data" type="error" />;
    }

    // Menentukan proyek berdasarkan status yang dipilih
    let projects;
    if (status === "projectDikerjakan") {
        projects = projectDikerjakan;
    } else if (status === "projectSelesai") {
        projects = projectSelesai;
    }

    if (!projects || projects.length === 0) {
        let message = "Tidak Ada Data";
        if (status === "projectDikerjakan") {
            message = "Tidak Ada Project Yang Sedang Dikerjakan";
        } else if (status === "projectSelesai") {
            message = "Belum Ada Project Yang Diselesaikan";
        }

        return (
            <Col span={24}>
                <div style={{ textAlign: "center", padding: "20px" }}>
                    <p style={{ margin: 0 }}>{message}</p>
                </div>
            </Col>
        );
    }
    // Menampilkan data project
    return (
        <>
            {projects.map((project: any, index: number) => (
                <ProjectList
                    key={index}
                    title={project.nama_project}
                    link={`/karyawan/${idUser}/project/${project.id}/detail-project`}
                    teamLead={project.user.username}
                    startDate={project.start_date}
                    endDate={project.end_date}
                />
            ))}
        </>
    );
};

const Page: React.FC = () => {
    const [activeKey, setActiveKey] = useState<string>('projectDikerjakan');
    const params = useParams();
    const idUser = params?.idUser as string | undefined;

    const onChange: TabsProps['onChange'] = (key) => {
        setActiveKey(key);
    };

    // Items untuk tab
    const items: TabsProps['items'] = [
        { key: 'projectDikerjakan', label: 'Sedang Dikerjakan' },
        { key: 'projectSelesai', label: 'Selesai' },
    ];

    return (
        <div>
            <div
                style={{
                    paddingRight: 24,
                    paddingBottom: 24,
                    paddingLeft: 24,
                    minHeight: '100vh',
                    backgroundColor: '#fff',
                    borderRadius: 15,
                }}
            >
                <div>
                    <Tabs defaultActiveKey="projectDikerjakan" items={items} onChange={onChange} />
                </div>
                <Row className="listProject" style={{ marginTop: '20px' }}>
                    <ProjectListComponent idUser={idUser || ''} status={activeKey} />
                </Row>
            </div>
        </div>
    );
};

export default Page;
