"use client";
import React from "react";
import { Table, Row, Col, Alert, Spin, Tag } from "antd";
import CardProjectDashboard from "#/component/CardProjectDashboard";
import CardDashboard from "#/component/CardDashboard";
import { dashboardRepository } from "#/repository/dashboard";
import { useParams } from "next/navigation";


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

const columnProjectTerbaru = [
    {
        title: 'Waktu Update',
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

const columnTugasTerbaru = [
    {
        title: 'Waktu Update',
        dataIndex: 'updated_at',
        key: 'updated_at',
        render: (text: string) => formatTimeStr(text),
    },
    {
        title: 'Project',
        key: 'project.nama_project',
        render: (record: any) => record.project ? record.project.nama_project : 'N/A',
    },
    {
        title: 'Tugas',
        dataIndex: 'nama_tugas',
        key: 'nama_tugas',
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
        },
    },
];


const Page: React.FC = () => {
    const params = useParams();
    const idUser = params?.idUser as string | undefined;

    // Hook 3 update project terbaru
    const { data: updateProjectTerbaru, error: updateError, isValidating: updateValidating } = idUser
        ? dashboardRepository.hooks.useUpdateProjectTeamLeadTerbaru(idUser)
        : { data: null, error: null, isValidating: false };

    // Hook project dalam proses
    const { data: projectOnProgress, error: progressError, isValidating: progressValidating } = idUser
        ? dashboardRepository.hooks.useProjectTeamLeadProgress(idUser)
        : { data: null, error: null, isValidating: false };

    //Hook 3 update tugas terbaru
    const { data: updateTugasTerbaru, error: tugasError, isValidating: tugasValidating } = idUser
        ? dashboardRepository.hooks.useUpdateTugasTeamLeadTerbaru(idUser)
        : { data: null, error: null, isValidating: false };

    const loading = updateValidating || progressValidating || tugasValidating;
    const error = updateError || progressError || tugasError;

    return (
        <div
            style={{
                padding: 24,
                minHeight: '100vh',
                backgroundColor: '#fff',
                borderRadius: 15,
            }}
        >
            <style>{`
                .ant-table-thead > tr > th {
                    background-color: #EEEEEE !important;
                color: #001529 !important;
                 }
            `}</style>

            <Row gutter={[16, 10]} style={{ marginBottom: 48, display: 'flex', justifyContent: 'center' }}>
                {/* 3 update Project Terbaru */}
                <Col xs={24} md={12} lg={10} style={{ display: 'flex', flexDirection: 'column' }}>
                    <CardDashboard title="Update Project Terbaru"
                        style={{
                            width: '100%',
                            minHeight: 400,
                            maxHeight: 400,
                            display: 'flex',
                            flexDirection: 'column',
                            position: 'relative',
                            overflow: 'hidden',
                            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)'
                        }}
                    >
                        <div style={{ paddingBottom: '75%', position: 'relative' }}>
                            {loading ? (
                                <Spin style={{ textAlign: 'center', padding: '20px' }} />
                            ) : error ? (
                                <Alert message="Error fetching data" type="error" />
                            ) : updateProjectTerbaru !== null ? (
                                <Table
                                    dataSource={updateProjectTerbaru}
                                    columns={columnProjectTerbaru}
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
                {/* 3 update Tugas Terbaru */}
                <Col xs={24} md={12} lg={14} style={{ display: 'flex', flexDirection: 'column' }}>
                    <CardDashboard title="Update Tugas Terbaru"
                        style={{
                            width: '100%',
                            minHeight: 400,
                            maxHeight: 400,
                            display: 'flex',
                            flexDirection: 'column',
                            position: 'relative',
                            overflow: 'hidden',
                            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)'
                        }}
                    >
                        <div style={{ paddingBottom: '75%', position: 'relative' }}>
                            {loading ? (
                                <Spin style={{ textAlign: 'center', padding: '20px' }} />
                            ) : error ? (
                                <Alert message="Error fetching data" type="error" />
                            ) : updateTugasTerbaru !== null ? (
                                <Table
                                    dataSource={updateTugasTerbaru}
                                    columns={columnTugasTerbaru}
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
            </Row>
            <hr style={{ height: '2px', backgroundColor: 'black', border: 'none', borderRadius: 10 }} />

            <div className="project-sedang-dikerjakan">
                <div className="title" style={{ fontFamily: "Roboto, sans-serif", textAlign: "center", fontSize: 40 }}>
                    <h1>Sedang Dikerjakan</h1>
                </div>

                {/* Project Yang Sedang dikerjakan */}
                <Row gutter={[16, 16]} justify="center" align="middle" style={{ minHeight: '200px' }}>
                    {loading ? (
                        <Spin style={{ textAlign: 'center', padding: '20px' }} />
                    ) : error ? (
                        <Alert message="Error fetching data" type="error" />
                    ) : projectOnProgress && projectOnProgress.length > 0 ? (
                        projectOnProgress.map((project: any, index: number) => (
                            <Col xs={24} sm={12} md={8} lg={8} key={project.id || index}>
                                <CardProjectDashboard
                                    title={<div>{project.nama_project}</div>}
                                    link={`/team-lead/${idUser}/project/${project.id}/detail-project`}
                                    teamLead={<div>{project.user.nama}</div>}
                                    startDate={project.start_date}
                                    endDate={project.end_date}
                                />
                            </Col>
                        ))
                    ) : (
                        <Col span={24}>
                            <div style={{ textAlign: 'center', padding: '20px' }}>
                                <p style={{ margin: 0 }}>Tidak Ada Project Yang Sedang Dikerjakan</p>
                            </div>
                        </Col>
                    )}
                </Row>
            </div>
        </div>
    );
};

export default Page;
