"use client";

import React from "react";
import { Table, Tag, Row, Col, Spin, Alert, Card } from 'antd';
import CardDashboard from "#/component/CardDashboard";
import CardProjectDashboard from "#/component/CardProjectDashboard";
import { dashboardRepository } from "#/repository/dashboard";
import { useParams } from "next/navigation";
import { slugify } from "#/utils/slugify";

const formatTimeStr = (dateStr: string) => {
  const date = new Date(dateStr);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); //bulan mulai dari 0
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
};

const projectTerbaru = [
  {
    title: 'Waktu Update',
    dataIndex: 'updated_at',
    key: 'updated_at',
    render: (text: string) => formatTimeStr(text)
  },
  {
    title: 'Project',
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

  // hook 3 update project terbaru
  const { data: updateProjectTerbaru, error: updateError, isValidating: updateValidating }
    = dashboardRepository.hooks.useUpdateProjectSuperAdminTerbaru();

  // hook jumlah project dalam proses
  const { data: projectDalamProses } = dashboardRepository.hooks.useProjectDalamProses();
  console.log("project:", projectDalamProses?.count);

  // hook jumlah project selesai
  const { data: projectSelesai } = dashboardRepository.hooks.useProjectSelesai();
  console.log("project", projectSelesai?.count);

  //hook project dalm proses 
  const { data: projectOnProgress, error: progressError, isValidating: progressValidating }
    = dashboardRepository.hooks.useProjectOnProgress();

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
      <Row gutter={[16, 10]} style={{ marginBottom: 48, display: 'flex' }}>
        {/* 3 update Project Terbaru */}
        <Col xs={24} md={12} lg={14} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <CardDashboard title="Update Project Terbaru"
            style={{
              width: '100%',
              minHeight: 375,
              maxHeight: 375,
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
              textAlign: 'center'
            }}
          >
            <div style={{ paddingBottom: '75%', position: 'relative' }}>
              {loading ? (
                <Spin style={{ textAlign: 'center' }} />
              ) : updateError ? (
                <Alert message="Error fetching data" type="error" />
              ) : updateProjectTerbaru !== null ? (
                <Table
                  dataSource={updateProjectTerbaru}
                  columns={projectTerbaru}
                  pagination={false}
                  className="card-table"
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
        <Col xs={24} md={12} lg={10} style={{ display: 'flex', flexDirection: 'column' }}>
          <Card style={{
             width: '100%',
             minHeight: 375,
             maxHeight: 375,
             display: 'flex',
             flexDirection: 'column',
             position: 'relative',
             overflow: 'hidden',
             boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
          }}>

            <div style={{ display: 'flex', alignItems: 'center',justifyContent: 'center',margin:50 }}>

              <div style={{ textAlign: 'center', marginRight: 20, }}>
                <h2 style={{ fontSize: 30 }}>{`${projectDalamProses?.count} Project`}</h2>
                <Tag bordered={false} color="processing" style={{ fontSize: 17, lineHeight: '30px', borderRadius: 5 }}>
                  Dalam Proses
                </Tag>
              </div>

              <div className="vertical-line" style={{
                width: 2,
                height: 150,
                backgroundColor: 'black',
                margin: 20,
                borderRadius: 10
              }}></div>

              <div style={{ textAlign: 'center', marginLeft: 20 }}>
                <h2 style={{ fontSize: 30 }}>{`${projectSelesai?.count} Project`}</h2>
                <Tag bordered={false} color="success" style={{ fontSize: 17, lineHeight: '30px', borderRadius: 5 }}>
                  Selesai
                </Tag>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
      <hr style={{ height: '2px', backgroundColor: 'black', border: 'none', borderRadius: 10 }} />

      <div className="project-sedang-dalam-pengerjaan">
        <div className="title" style={{ fontFamily: "Roboto, sans-serif", textAlign: "center", fontSize: 40 }}>
          <h1>Sedang dalam Pengerjan</h1>
        </div>


        {/* Project Yang Sedang dalam pengerjaan */}
        <Row gutter={[16, 16]} justify="center" align="middle" style={{ minHeight: '200px' }}>
          {loading ? (
            <Spin style={{ textAlign: 'center', padding: '20px' }} />
          ) : progressError ? (
            <Alert message="Error fetching data" type="error" />
          ) : projectOnProgress && projectOnProgress.length > 0 ? (
            projectOnProgress.map((project: any, index: number) => (
              <Col xs={24} sm={12} md={8} lg={8} key={project.id || index}>
                <CardProjectDashboard
                  title={<div>{project.nama_project}</div>}
                  link={`/super-admin/project/${project.id}/${slugify.slugify(project.nama_project)}`}
                  teamLead={<>{project.user.nama}</>}
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

  )
};


export default Page;
