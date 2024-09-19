"use client";
import React from 'react';
import { Space, Table, Tag, Alert, Spin, Button } from 'antd';
import { jobsRepository } from '#/repository/jobs'; // Ganti dengan jalur yang sesuai jika berbeda
import { EyeOutlined } from "@ant-design/icons";
import ModalComponent from '#/component/ModalComponent';
import ModalDetailKaryawan from './modalDetailKaryawan';


// Definisikan tipe untuk objek job yang diterima dari API
interface KaryawanData {
    idKaryawan: any;

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
        title: 'Nama Karyawan',
        dataIndex: 'job_nama_job',
        key: 'job_nama_job',
      },
    {
    title: 'NIK',
    dataIndex: 'nik',
    key: 'nik',
  },
  {
    title: 'Tanggal Di Tambahkan',
    dataIndex: 'job_created_at',
    key: 'job_created_at',
  },
  {
    title: 'Aksi',
    key: 'aksi',
    render: (record: any) => {
      const idJob = record.job_id;

      return (
        <div>
          <ModalComponent 
          title={'Detail Tugas'} 
          content={<ModalDetailKaryawan idJobs={idJob} />}
            footer={(handleCancel, handleOk) => (
                                <div>
                                    <Button onClick={handleCancel}>Cancel</Button>
                                    <Button type="primary" onClick={handleOk}>Ok</Button>
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
