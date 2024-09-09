"use client";
import React from "react";
import { Table, Row, Col, Alert, Spin, Tag } from "antd";
import CardProjectDashboard from "#/app/component/CardProjectDashboard";
import CardDashboard from "#/app/component/CardDashboard";
import { projectRepository } from "#/repository/project";
import { useParams } from "next/navigation";

// Data dummy untuk tabel
const dataSource2 = [
    { key: '1', name: '04-03-2024 14:55:98', project: 'Project Aplikasi Perpustakaan', address: '10 Downing Street' },
    { key: '2', name: '04-03-2024 14:55:98', project: 'Project Aplikasi Perpustakaan', address: '10 Downing Street' },
    { key: '3', name: '04-03-2024 14:55:98', project: 'Project Aplikasi Perpustakaan', address: '10 Downing Street' },
];

const columns2 = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Project', dataIndex: 'project', key: 'project' },
    { title: 'Address', dataIndex: 'address', key: 'address' },
];

const formatTimeStr = (dateStr: string) => {
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Bulan dimulai dari 0
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
};

const columnProject = [
    {
        title: 'Tanggal Update',
        dataIndex: 'updated_at',
        key: 'updated_at',
        render: (text: string) => formatTimeStr(text)
    },
    {
        title: 'Nama Project',
        dataIndex: 'nama_project',
        key: 'nama_project',
    },
    {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        render: (status: string) => {
            const getColor = () => {
                switch (status) {
                    case 'pending': return '#FFC107';
                    case 'on-progress': return '#00BCD4';
                    case 'redo': return '#F44336';
                    case 'done': return '#2196F3';
                    default: return '#4CAF50';
                }
            };

            return <Tag color={getColor()}>{status}</Tag>;
        }
    },
];

const Page: React.FC = () => {
    const params = useParams();
    const idUser = params?.idUser as string | undefined;

    // Hook 3 update project terbaru
    const { data: updateProject, error: updateError, isValidating: updateValidating } = idUser
        ? projectRepository.hooks.useUpdateProjectTeamLeadTerbaru(idUser)
        : { data: null, error: null, isValidating: false };

    // Hook project dalam proses
    const { data: projectOnProgress, error: progressError, isValidating: progressValidating } = idUser
        ? projectRepository.hooks.useProjectTeamLeadProgress(idUser)
        : { data: null, error: null, isValidating: false };

    const loading = updateValidating || progressValidating;

    return (
        <div
            style={{
                padding: 24,
                minHeight: '100vh',
                backgroundColor: '#fff',
                borderRadius: 15,
            }}
        >
            <Row gutter={[16, 10]} style={{ marginBottom: 48, display: 'flex', justifyContent: 'center' }}>
                <Col xs={24} md={12} lg={10} style={{ display: 'flex', flexDirection: 'column' }}>
                    <CardDashboard title="Update Project Terbaru"
                        style={{
                            width: '100%',
                            minHeight: 400,
                            maxHeight: 400,
                            display: 'flex',
                            flexDirection: 'column',
                            position: 'relative',
                            overflow: 'hidden'
                        }}
                    >
                        <div style={{ paddingBottom: '75%', position: 'relative' }}>
                            {loading ? (
                                <Spin style={{ textAlign: 'center', padding: '20px' }} />
                            ) : updateError ? (
                                <Alert message="Error fetching data" type="error" />
                            ) : updateProject !== null ? (
                                <Table
                                    dataSource={updateProject}
                                    columns={columnProject}
                                    pagination={false}
                                    style={{ fontSize: '14px', position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                                />
                            ) : (
                                <div style={{ textAlign: 'center', padding: '20px' }}>
                                    <p>No data available</p>
                                </div>
                            )}
                        </div>
                    </CardDashboard>
                </Col>
                <Col xs={24} md={12} lg={14} style={{ display: 'flex', flexDirection: 'column' }}>
                    <CardDashboard title="Update Tugas Terbaru"
                        style={{
                            width: '100%',
                            minHeight: 400,
                            maxHeight: 400,
                            display: 'flex',
                            flexDirection: 'column',
                            position: 'relative',
                            overflow: 'hidden'
                        }}
                    >
                        <div style={{ paddingBottom: '75%', position: 'relative' }}>
                            <Table dataSource={dataSource2} columns={columns2} pagination={false} style={{ fontSize: '14px', position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }} />
                        </div>
                    </CardDashboard>
                </Col>
            </Row>

            <hr style={{ height: '2px', backgroundColor: 'black', border: 'none' }} />

            <div className="project-sedang-dikerjakan">
                <div className="title" style={{ fontFamily: "revert", textAlign: "center", fontSize: 40 }}>
                    <h1>Sedang Dikerjakan</h1>
                </div>

                {/* Grid untuk Card Project */}
                <Row gutter={[16, 16]}>
                    {(projectOnProgress || []).map((project: any, index: number) => (
                        <Col xs={24} sm={12} md={8} lg={8} key={project.id || index}>
                            <CardProjectDashboard
                                title={<div>{project.nama_project}</div>}
                                link={`/project/${project.id}`}
                                teamLead={<div>{project.user.username}</div>}
                                startDate={project.start_date}
                                endDate={project.end_date}
                            />
                        </Col>
                    ))}
                </Row>
            </div>
        </div>
    );
};

export default Page;
