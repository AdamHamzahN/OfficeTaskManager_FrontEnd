"use client";
import { useState } from "react";
import { projectRepository } from "#/repository/project";
import { Alert, Col, Pagination, Row, Spin, Tabs, TabsProps } from "antd";
import { useParams } from "next/navigation";
import ProjectList from "#/component/ProjectList";

const ProjectListComponent: React.FC<{
    idUser: string,
    status: string,
    data: any
    loading: any,
    error: any
}> = ({ idUser, status, data, loading, error }) => {
    if (loading) {
        return (
            <Col span={24}>
                <div style={{ textAlign: 'center', padding: '20px' }}>
                    <Spin size="large" style={{ padding: '20px' }} />
                </div>
            </Col>
        );
    }
    if (error) {
        return <Alert message="Error fetching data" type="error" />;
    }

    if (!data || data.length === 0) {
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
    return (
        <>
            {data.map((project: any, index: number) => (
                <ProjectList
                    key={index}
                    title={project.nama_project}
                    link={`/karyawan/${idUser}/project/${project.id}/detail-project`}
                    teamLead={project.user?.nama}
                    startDate={project?.start_date}
                    endDate={project?.end_date}
                />
            ))}
        </>
    );
};

const Page: React.FC = () => {
    const [activeKey, setActiveKey] = useState<string>('projectDikerjakan');
    const params = useParams();
    const idUser = params?.idUser as string | undefined;
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const handlePageChange = (newPage: number, newPageSize: number) => {
        setPage(newPage);
        setPageSize(newPageSize);
    }
    
    const { data: projectDikerjakan, error: errorDikerjakan, isValidating: projectDikerjakanValidating } = projectRepository.hooks.useGetProjectDikerjakanKaryawan(idUser!);
    const { data: projectSelesai, error: errorSelesai, isValidating: projectSelesaiValidating } = projectRepository.hooks.useGetProjectSelesaiKaryawan(idUser!,page,pageSize);

    let projects;
    if (activeKey === "projectDikerjakan") {
        projects = projectDikerjakan;
    } else if (activeKey === "projectSelesai") {
        projects = projectSelesai;
    }

    const error = errorDikerjakan || errorSelesai;
    const loading = projectDikerjakanValidating || projectSelesaiValidating;
    
    const { data, count } = projects || {data: [], count:0};
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
                    position: 'relative',
                }}
            >
                <div>
                    <Tabs defaultActiveKey="projectDikerjakan" items={items} onChange={onChange} />
                </div>
                <Row className="listProject" style={{ marginTop: '20px' }}>
                    <ProjectListComponent
                        idUser={idUser || ''}
                        status={activeKey}
                        data={data}
                        loading={loading}
                        error={error} />
                </Row>
                <div style={{
                    position: 'absolute',
                    bottom: '20px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                }}>
                    {activeKey === "projectSelesai" && count > 10 && (
                        <Pagination
                            current={page}
                            pageSize={pageSize}
                            total={count}
                            onChange={handlePageChange}
                        />
                    )} 
                </div>
            </div>
        </div>
    );
};

export default Page;
