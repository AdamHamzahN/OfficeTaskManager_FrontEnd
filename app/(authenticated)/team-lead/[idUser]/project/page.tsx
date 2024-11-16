"use client";
import { useState } from "react";
import { projectRepository } from "#/repository/project";
import { Alert, Col, Pagination, Row, Spin, Tabs, TabsProps } from "antd";
import ProjectList from "#/component/ProjectList";
import { JwtToken } from "#/utils/jwtToken";
import { slugify } from "#/utils/slugify";

const ProjectListComponent: React.FC<{ idUser: string, data: any, loading: any, error: any }> = ({ idUser, data, loading, error }) => {
    if (loading) return (
        <Col span={24}>
            <div style={{ textAlign: 'center', padding: '20px' }}>
                <Spin size="large" style={{ padding: '20px' }} />
            </div>
        </Col>
    );
    if (error) return <Alert message="Error fetching data" type="error" />;
    if (!data || data.length === 0) return (
        <Col span={24}>
            <div style={{ textAlign: 'center', padding: '20px' }}>
                <p style={{ margin: 0 }}>Tidak Ada Data</p>
            </div>
        </Col>
    );
    console.log(data)

    return (
        <>
            {data.map((project: any, index: number) => (
                <ProjectList
                    key={index}
                    title={project.nama_project}
                    link={`/team-lead/${idUser}/project/${project.id}/${slugify.slugify(project.nama_project)}`}
                    teamLead={project.user.nama}
                    startDate={project.start_date}
                    endDate={project.end_date}
                />
            ))}
        </>
    );
};  

const Page: React.FC = () => {
    const idUser = JwtToken.getPayload().sub;
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [activeKey, setActiveKey] = useState<string>('pending');

    const handlePageChange = (newPage: number, newPageSize: number) => {
        setPage(newPage);
        setPageSize(newPageSize);
    };

    const { data: projectData, error, isValidating } = projectRepository.hooks.useProjectTeamLeadByStatus(idUser, activeKey, page, pageSize);
    const { data, count } = projectData || { data: [], count: 0 };

    const onChange: TabsProps['onChange'] = (key) => {
        setActiveKey(key);
    };

    const items: TabsProps['items'] = [
        { key: 'pending', label: 'Pending' },
        { key: 'redo', label: 'Redo' },
        { key: 'on-progress', label: 'On Progress' },
        { key: 'done', label: 'Done' },
        { key: 'approved', label: 'Approved' },
    ];

    if (!idUser) return <div>Invalid user</div>;

    return (
        <div style={{ position: 'relative' }}>
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
                    <Tabs defaultActiveKey="pending" items={items} onChange={onChange} />
                </div>
                <Row className='listProject' style={{ marginTop: '20px' }}>
                    <ProjectListComponent idUser={idUser} data={data} loading={isValidating} error={error} />
                </Row>
                <div style={{
                    position: 'absolute',
                    bottom: '20px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                }}>
                    {count >= 5 && (
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
