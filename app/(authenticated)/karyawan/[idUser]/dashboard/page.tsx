"use client";
import React from "react";
import { Table, Tag, Row, Col, Spin, Alert, Card } from 'antd';
import type { TableProps } from 'antd';
import { format } from "path";
import { title } from "process";
import CardDashboard from "#/component/CardDashboard";
import CardProjectDashboard from "#/component/CardProjectDashboard";
import { dashboardRepository } from "#/repository/dashboard";
import { useParams } from "next/navigation";

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

const data = [
  {
    "updated_at": "2024-09-25T14:23:45Z",
    "nama_project": "Pengembangan Sistem HR",
    "status": "on-progress"
  },
  {
    "updated_at": "2024-09-20T11:15:30Z",
    "nama_project": "Migrasi Database Ke Cloud",
    "status": "pending"
  },
  {
    "updated_at": "2024-09-15T09:42:12Z",
    "nama_project": "Pembuatan Aplikasi Mobile",
    "status": "done"
  }
]

const columnProjectTerbaru = [
  {
    title: 'Waktu Update',
    dataIndex: 'updated_at',
    key: 'updated_at',
    // render: (text: string) => formatTimeStr(text)
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
    // render: (status: string) => {
    //     const getColor = () => {
    //         switch (status) {
    //             case 'pending': return '#FFC107';
    //             case 'on-progress': return '#00BCD4';
    //             case 'redo': return '#F44336';
    //             case 'done': return '#2196F3';
    //             default: return '#4CAF50';
    //         }
    //     };

    //     return <Tag color={getColor()}>{status}</Tag>;
    // }
  },
];


const Page: React.FC = () => {
  const params = useParams();
  const idUser = params?.idUser as string | undefined;

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
          .card-table .ant-table-thead > tr > th {
           background-color: #EEEEEE !important;
          color: #001529 !important;
          }
      `}</style>
      <Row gutter={[16, 10]} style={{ marginBottom: 48, display: 'flex', justifyContent: 'center' }}>
        {/* 3 update Project Terbaru */}
        <Col xs={24} md={12} lg={14} style={{ display: 'flex', flexDirection: 'column' }}>
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
              {/* {loading ? (
                                <Spin style={{ textAlign: 'center', padding: '20px' }} />
                            ) : updateError ? (
                                <Alert message="Error fetching data" type="error" />
                            ) : updateProjectTerbaru !== null ? ( */}
              <Table
                className="card-table"
                dataSource={data}
                columns={columnProjectTerbaru}
                pagination={false}
                style={{ fontSize: '14px', position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
              />
              {/* ) : (
                                <div style={{ textAlign: 'center', padding: '20px' }}>
                                    <p>No data available</p>
                                </div>
                            )} */}
            </div>
          </CardDashboard>
        </Col>
        {/* 3 update Tugas Terbaru */}
        <Col xs={24} md={12} lg={10} style={{ display: 'flex', flexDirection: 'column' }}>
          <Card
            style={{
              width: '100%',
              height: '100%',
              minHeight: 300,
              maxHeight: 400,
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
              overflow: 'hidden',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
              borderRadius: 10,
              padding: 10
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>

              <div style={{ textAlign: 'center', marginRight: 20, }}>
                <h2 style={{ fontSize: 30 }}>{`2 Project`}</h2>
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
                <h2 style={{ fontSize: 30 }}>{`2 Project`}</h2>
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
          <h1>Sedang dalam Pengerjaan</h1>
        </div>


        {/* Project Yang Sedang dikerjakan */}
        <div style={{ display: 'block' }}>
          <Table
            dataSource={data}
            columns={columnProjectTerbaru}
            pagination={false}
            style={{ display: 'block' }}
          />
        </div>

      </div>

    </div>

  )
};


export default Page;
