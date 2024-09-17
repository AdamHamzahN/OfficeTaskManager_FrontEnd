"use client";
import React from 'react';
import { Space, Table, Tag, Alert, Spin, Button } from 'antd';
import { jobsRepository } from '#/repository/jobs'; // Ganti dengan jalur yang sesuai jika berbeda
import ModalComponent from '#/component/modal';
import DetailTugas from '../project/[idProject]/detail-project/detailTugas';
import { EyeOutlined } from "@ant-design/icons";

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
    dataIndex: 'aksi',
    render:()=>{
          return (
            <div>
            <ModalComponent title={'Detail Tugas'} content={
                <DetailTugas/>
            }/>
            <Button style={{backgroundColor:'rgba(244, 247, 254, 1)',color:'#1890FF',border:'none'}}><EyeOutlined/>detail</Button>
        </div>
    );
        }
},
];
const Page: React.FC = () => {
  const { data: apiResponse, error: updateError, isValidating: updateValidating } = jobsRepository.hooks.useAllJobs();

  if (updateValidating) {
    return <Spin style={{ textAlign: 'center', padding: '20px' }} />;
  }

  if (updateError) {
    return <Alert message="Error fetching data" type="error" />;
  }

  // Pastikan apiResponse memiliki field 'data' dan data adalah array
  const data: DataType[] = apiResponse && apiResponse.data ? apiResponse.data.map((job: JobData) => ({
    key: job.job_id, // Gunakan job_id sebagai key
    job_nama_job: job.job_nama_job,
    jumlah_karyawan: job.jumlah_karyawan,
    job_created_at: job.job_created_at,
    aksi: ['edit', 'delete', 'view'], // Sesuaikan aksi yang ingin ditampilkan
  })) : [];

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
      {data.length > 0 ? (
        <Table
          columns={columnJobs}
          dataSource={data}
          pagination={{ position: ['bottomCenter'] }}
          style={{ marginLeft: '20px' }}
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
