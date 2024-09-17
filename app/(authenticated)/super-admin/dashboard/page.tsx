"use client";

import React from "react";
import {Table, Tag, Row, Col, Spin, Alert, Card } from 'antd';
import type { TableProps } from 'antd';
import { format } from "path";
import { title } from "process";
import CardDashboard from "#/component/CardDashboard";
import { dashboardRepository } from "#/repository/dashboard";

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
  const { data: updateProjectTerbaru, error: updateError, isValidating: updateValidating }
  =  dashboardRepository.hooks.useUpdateProjectSuperAdminTerbaru();

  const loading = updateValidating

  const { data: projectDalamProses } = dashboardRepository.hooks.useProjectDalamProses();
    console.log("Data:", projectDalamProses);

  const { data: projectSelesai } = dashboardRepository.hooks.useProjectSelesai();
  console.log("project", projectSelesai);
  
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
          <Col xs={24} md={12} lg={10} style={{ display: 'flex', flexDirection: 'column' }}>
            <CardDashboard title="Update Project Terbaru"
                style={{
                    width: 535,
                    // minHeight: 400,
                    maxHeight: 325,
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
                    ) : updateProjectTerbaru !== null ? (
                        <Table 
                            dataSource={updateProjectTerbaru} 
                            columns={projectTerbaru} 
                            pagination={false} 
                            />
                    ) :  (
                      <div style={{ textAlign: 'center', padding: '20px' }}>
                          <p>No data available</p>
                      </div>
                  )}
                </div>
            </CardDashboard>
          </Col>
            <Row gutter={[16, 10]} style={{ marginBottom: 48, display: 'flex', justifyContent: 'center' }}>
              <Col xs={24} md={12} lg={10} style={{ display: 'flex', flexDirection: 'column' }}>
                <Card style={{ width: 410, height: 325, marginLeft: 50, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{display: 'flex', alignItems: 'center'}}>

                      <div style={{textAlign: 'center', marginRight: 20,}}>
                        <h2 style={{fontSize: 30}}>{projectDalamProses}Project</h2>
                        <Tag bordered={false} color="processing">
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
                        
                      <div style={{textAlign: 'center', marginLeft: 20}}>
                        <h2 style={{fontSize: 30}}>{projectSelesai}Project</h2>
                        <Tag bordered={false} color="success">
                          Selesai
                        </Tag>
                      </div>
                    </div>
                </Card>

              </Col>
          </Row>
        </Row>
        <hr style={{ height: '2px', backgroundColor: 'black', border: 'none', borderRadius: 10 }} />

    </div>
    
  )
};


export default Page;
