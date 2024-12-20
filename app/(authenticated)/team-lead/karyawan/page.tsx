"use client";
import React, { useEffect, useState } from 'react';
import { Table, Alert, Spin, Button, Switch } from 'antd';
import { karyawanRepository } from '#/repository/karyawan'; // Ganti dengan jalur yang sesuai jika berbeda
import { EyeOutlined } from "@ant-design/icons";
import ModalComponent from '#/component/ModalComponent';
import ModalDetailKaryawan from './modalDetailKaryawan';

interface KaryawanData {
  id: string;
  user: { nama: string ,status: string};
  nik: string;
  job: { nama_job: string };
  status_project: string;
}

const columnKaryawan = [
  {
    title: 'Nama Karyawan',
    key: 'user',
    render: (record: KaryawanData) => record.user ? record.user.nama : 'N/A'
  },
  {
    title: 'NIK',
    key: 'nik',
    dataIndex: 'nik'
  },
  {
    title: 'Job',
    key: 'nama_job',
    render: (record: KaryawanData) => record.job ? record.job.nama_job : 'N/A'
  },
  {
    title: 'Status Keaktifan',
    key: 'status',
    render:  (record: KaryawanData) => record?.user ? record.user.status : 'N/A'
  },
  {
    title: 'Status Project',
    key: 'status_project',
    dataIndex: 'status_project'
  },
  {
    title: 'Aksi',
    key: 'aksi',
    render: (record: KaryawanData) => {
      const idKaryawan = record.id;
      return (
        <ModalComponent
          title={'Detail Karyawan'}
          content={<ModalDetailKaryawan idKaryawan={idKaryawan} />}
          footer={(handleOk) => (
            <div>
              <Button type="primary" onClick={handleOk}>OK</Button>
            </div>
          )}
        >
          <Button style={{ backgroundColor: 'rgba(244, 247, 254, 1)', color: '#1890FF', border: 'none' }}>
            <EyeOutlined /> Detail
          </Button>
        </ModalComponent>
      );
    },
  },
];

const Page: React.FC = () => {
  const [pageTugas, setPageTugas] = useState(1);
  const [pageSizeTugas, setPageSizeTugas] = useState(10);
  const { data: apiResponse, error: updateError, isValidating: updateValidating } = karyawanRepository.hooks.useAllKaryawan(pageTugas, pageSizeTugas);
  
  const handlePageChangeTugas = (newPage: number, newPageSize: number) => {
    setPageTugas(newPage);
    setPageSizeTugas(newPageSize);
};
  useEffect(() => {
    console.log('apiResponse:', apiResponse);
    console.log('Error:', updateError);
  }, [apiResponse, updateError]);

  if (updateValidating) {
    return <Spin style={{ textAlign: 'center', padding: '20px' }} />;
  }

  if (updateError) {
    return <Alert message="Error fetching data" type="error" />;
  }

  return (
    <div
      style={{
        padding: 24,
        minHeight: '100vh',
        backgroundColor: '#fff',
        borderRadius: 15,
      }}
    >

        <h1 style={{ fontSize: '30px', paddingBottom: '20px', paddingTop: '20px' }}>
          Daftar Karyawan
        </h1>

        <Table
          columns={columnKaryawan}
          dataSource={apiResponse.data}
          pagination={{
            current: pageTugas,
            pageSize: pageSizeTugas,
            total: apiResponse.data.count,
            position: ['bottomCenter'],
            onChange: (pageTugas, pageSizeTugas) => {
                handlePageChangeTugas(pageTugas, pageSizeTugas)
            },
        }}
          className='custom-table'
          rowKey="id"
        />
    </div>
  );
};

export default Page;
