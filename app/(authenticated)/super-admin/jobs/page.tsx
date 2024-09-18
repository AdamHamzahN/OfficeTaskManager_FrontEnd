"use client";
import React from 'react';
import { Space, Table, Tag, Alert, Spin, Button } from 'antd';
import { jobsRepository } from '#/repository/jobs'; // Ganti dengan jalur yang sesuai jika berbeda
import { EyeOutlined } from "@ant-design/icons";
import { EditOutlined } from "@ant-design/icons";
import ModalComponent from '#/component/ModalComponent';
import ModalDetailJobs from './modalDetailJobs';
import ModalEditJobs from './modalEditJobs';

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
  job_id: string;
  job_nama_job: string;
  jumlah_karyawan: string;
  job_created_at: string;
  job_updated_at: string;
  job_deleted_at: string | null;
  aksi: string[];
}

// Perbarui DataType untuk mencocokkan data yang diterima
interface DataType {
  key: string;
  job_nama_job: string;
  jumlah_karyawan: string;
  job_created_at: string;
  aksi: string[];
}

const columnJobs = [
  {
    title: 'Nama Jobs',
    dataIndex: 'job_nama_job',
    key: 'job_nama_job',
  },
  {
    title: 'Jumlah Karyawan',
    dataIndex: 'jumlah_karyawan',
    key: 'jumlah_karyawan',
  },
  {
    title: 'Tanggal Di Tambahkan',
    dataIndex: 'job_created_at',
    key: 'job_created_at',
    render: (text: string) => formatTimeStr(text),
  },
  {
    title: 'Aksi',
    key: 'aksi',
    render: (record: any) => {
      const idJob = record.job_id;
      return (
        <div>
          <ModalComponent title={'Detail Jobs'} content={<ModalDetailJobs idJobs={idJob} />}>
            <Button style={{ backgroundColor: 'rgba(244, 247, 254, 1)', color: '#1890FF', border: 'none' }}>
              <EyeOutlined /> detail
            </Button>
          </ModalComponent>
          <ModalComponent title={'Edit Jobs'} content={<ModalEditJobs idJobs={idJob} />}>
            <Button style={{ backgroundColor: '', color: '#EA7D2A', border: 'none' }}>
              <EditOutlined/> edit
            </Button>
          </ModalComponent>
        </div>
      );
    },
  },
];

const Page: React.FC = () => {
  const { data: apiResponse, error: updateError, isValidating: updateValidating } = jobsRepository.hooks.useAllJobs();
  console.log('api :', apiResponse);
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
      {apiResponse?.data?.length > 0 ? (
        <Table
          columns={columnJobs}
          dataSource={apiResponse.data}
          pagination={{ position: ['bottomCenter'] }}
          style={{ marginLeft: '20px' }}
          className='custom-table'
        />
      ) : (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <p>No data available</p>
        </div>
      )}
    </div>
  );
};

export default Page;
