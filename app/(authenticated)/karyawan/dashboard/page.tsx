"use client";
import React, { useEffect, useState } from "react";
import { Table, Tag, Row, Col, Spin, Alert } from 'antd';
import CardDashboard from "#/component/CardDashboard";
import { dashboardRepository } from "#/repository/dashboard";
import { InboxOutlined } from '@ant-design/icons';
import { tugasRepository } from "#/repository/tugas";
import { JwtToken } from "#/utils/jwtToken";
import TableComponent from "#/component/TableComponent";
import { formatTimeStr } from "#/utils/formatTime";

const columnTugasTerbaru = [
  {
    title: 'Waktu Update',
    dataIndex: 'updated_at',
    key: 'updated_at',
    render: (text: string) => formatTimeStr(text)
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
    }
  },
];

const columnTugasProject = [
  {
    title: 'Tugas',
    dataIndex: 'nama_tugas',
    key: 'nama_tugas',
  },
  {
    title: 'Deadline',
    dataIndex: 'deadline',
    key: 'deadline',
  },
  {
    title: 'Waktu Update',
    dataIndex: 'updated_at',
    key: 'updated_at',
    render: (text: string) => formatTimeStr(text)
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
  const idUser = JwtToken.getPayload().sub;
  const [pageTugas, setPageTugas] = useState(1);
  const [pageSizeTugas, setPageSizeTugas] = useState(5);
  const handlePageChangeTugas = (newPage: number, newPageSize: number) => {
    setPageTugas(newPage);
    setPageSizeTugas(newPageSize);
  };


  const { data: tugasProject, error: tugasProjectError, isValidating: tugasProjectValidating } = dashboardRepository.hooks.useGetTugasKaryawanByProject(idUser);

  const {
    data: daftarTugas = { data: [], count: 0 },
    error: daftarTugasError,
    isValidating: daftarTugasValidate,
  } = tugasRepository.hooks.useGetTugasProjectKaryawanByIdUser(
    idUser,
    tugasProject?.id_project || '', // Gunakan nilai default jika id_project tidak tersedia
    pageTugas,
    pageSizeTugas
  );
  // Mengatur status loading
  const loading = tugasProjectValidating || daftarTugasValidate;

  const { data, count } = daftarTugas || { data: [], count: 0 };

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
        {/* 3 update Tugas Terbaru */}
        <Col xs={24} md={12} lg={14} style={{ display: 'flex', flexDirection: 'column' }}>
          <CardDashboard title="Update Tugas Terbaru"
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
              ) : tugasProjectError ? (
                <Alert message="Error fetching data" type="error" />
              ) : loading !== null ? (
                <TableComponent 
                 data={data}
                 columns={columnTugasProject}
                 loading={loading}
                 page={pageTugas}
                 pageSize={pageSizeTugas}
                 total={count}
                 className={"card-table"}
                 pagination={false}
              />
              ) : (
                <div style={{ textAlign: 'center', padding: '20px' }}>
                  <p>No data available</p>
                </div>
              )}
            </div>
          </CardDashboard>
        </Col>
        {/* Jumlah Tugas */}
        <Col xs={24} md={12} lg={10} style={{ display: 'flex', flexDirection: 'column' }}>
          <CardDashboard title={tugasProject?.nama_project}
            style={{
              width: '100%',
              minHeight: 375,
              maxHeight: 375,
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
            }}
          >
            {tugasProject?.nama_project == null ? (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%',
                  marginTop: 100,
                  marginBottom: 100
                }}
              >
                <InboxOutlined style={{ fontSize: '48px', color: '#ccc' }} />
                <h1>Belum Ada Project</h1>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 30, marginBottom: 40 }}>

                <div style={{ textAlign: 'center', flex: 1 }}>
                  <h2 style={{ fontSize: 30 }}>{tugasProject?.jumlahBelumSelesai} Tugas</h2>
                  <Tag bordered={false} color="red" style={{ fontSize: 17, lineHeight: '30px', borderRadius: 5 }}>
                    Belum Diselesaikan
                  </Tag>
                </div>

                <div className="vertical-line" style={{
                  width: 2,
                  height: 150,
                  backgroundColor: 'black',
                  margin: 20,
                  borderRadius: 10
                }}></div>

                <div style={{ textAlign: 'center', flex: 1 }}>
                  <h2 style={{ fontSize: 30 }}>{tugasProject?.jumlahSelesai} Tugas</h2>
                  <Tag bordered={false} color="success" style={{ fontSize: 17, lineHeight: '30px', borderRadius: 5 }}>
                    Selesai
                  </Tag>
                </div>

              </div>
            )}
          </CardDashboard>
        </Col>
      </Row>

      <hr style={{ height: '2px', backgroundColor: 'black', border: 'none', borderRadius: 10, margin: 40 }} />

      <div className="project-sedang-dalam-pengerjaan" style={{ marginTop: 20 }}>
        {/*Tugas Project Yang Sedang dikerjakan */}
        <div style={{ display: 'block' }}>
          {loading ? (
            <Spin style={{ textAlign: 'center', padding: '20px', display: 'block' }} />
          ) : daftarTugasError ? (
            <div style={{ textAlign: 'center', padding: '20px', fontSize: '30px' }}>
              <h4>Belum Ada Project</h4>
            </div>
          ) : tugasProject?.nama_project !== null ? (
            <div style={{ textAlign: 'center', fontSize: '29px' }}>
              <h3>Tugas {tugasProject?.nama_project}</h3>
              <br />
              <TableComponent 
                 data={data}
                 columns={columnTugasTerbaru}
                 loading={loading}
                 page={pageTugas}
                 pageSize={pageSizeTugas}
                 total={count}
                 pagination={true}
                 onPageChange={handlePageChangeTugas}
              />
            </div>

          ) : (
            <div style={{ textAlign: 'center', padding: '20px', fontSize: '30px' }}>
              <h4>Belum Ada Project</h4>
            </div>
          )}
        </div>
      </div>
    </div>
  )
};

export default Page;
