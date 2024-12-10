"use client";
import React, { useState } from 'react';
import { Space, Table, Tag, Alert, Spin, Button } from 'antd';
import { jobsRepository } from '#/repository/jobs'; // Ganti dengan jalur yang sesuai jika berbeda
import { EyeOutlined } from "@ant-design/icons";
import ModalComponent from '#/component/ModalComponent';
import ModalDetailJobs from './modalDetailJobs';

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

// Definisikan tipe untuk objek job yang diterima dari API
interface JobData {
  id: string;
  nama_job: string;
  jumlah_karyawan: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  aksi: string[];
}

// Perbarui DataType untuk mencocokkan data yang diterima
interface DataType {
  key: string;
  nama_job: string;
  jumlah_karyawan: string;
  created_at: string;
  aksi: string[];
}

const columnJobs = [
  {
    title: 'Nama Jobs',
    dataIndex: 'nama_job',
    key: 'nama_job',
  },
  {
    title: 'Jumlah Karyawan',
    dataIndex: 'jumlah_karyawan',
    key: 'jumlah_karyawan',
  },
  {
    title: 'Tanggal Di Tambahkan',
    dataIndex: 'created_at',
    key: 'created_at',
    render: (text: string) => formatTimeStr(text),
  },
  {
    title: 'Aksi',
    key: 'aksi',
    render: (record: any) => {
      const idJob = record.id;

      return (
        <div>
          <ModalComponent
            title={'Detail Job'}
            content={<ModalDetailJobs idJobs={idJob} />}
            footer={(handleCancel, handleOk) => (
              <div>
                <Button type="primary" onClick={handleOk}>OK</Button>
              </div>
            )}
            onOk={() => console.log('Ok clicked')}  // Tambahkan handler onOk
            onCancel={() => console.log('Cancel clicked')}  // Tambahkan handler onCancel
          >
            <Button style={{ backgroundColor: 'rgba(244, 247, 254, 1)', color: '#1890FF', border: 'none' }}>
              <EyeOutlined /> detail
            </Button>
          </ModalComponent>
        </div>
      );
    },
  },
];

const Page: React.FC = () => {
  const [pageTugas, setPageTugas] = useState(1);
  const [pageSizeTugas, setPageSizeTugas] = useState(10);
  const { data: apiResponse, error: updateError, isValidating: updateValidating } = jobsRepository.hooks.useAllJobs(pageTugas, pageSizeTugas);

  const handlePageChangeTugas = (newPage: number, newPageSize: number) => {
    setPageTugas(newPage);
    setPageSizeTugas(newPageSize);
  };

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
      <Space style={{ marginLeft: '20px', marginBottom: '10px' }}>
        <h1 style={{ fontSize: '36px', fontFamily: 'Roboto, sans-serif', marginBottom: '0', marginTop: '30px' }}>
          Daftar Job
        </h1>
      </Space>
      <Table
        columns={columnJobs}
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
        style={{ marginLeft: '20px' }}
        className='custom-table'
      />
    </div>
  );
};

export default Page;
