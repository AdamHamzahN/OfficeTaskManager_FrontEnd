"use client";
import React, { useEffect } from 'react';
import { Space, Table, Alert, Spin, Button } from 'antd';
import { karyawanRepository } from '#/repository/karyawan'; // Ganti dengan jalur yang sesuai jika berbeda
import { EyeOutlined } from "@ant-design/icons";
import ModalComponent from '#/component/ModalComponent';
import ModalDetailKaryawan from './modalDetailKaryawan';

// Definisikan tipe untuk objek job yang diterima dari API
interface KaryawanData {
    id: string;
    user: { nama: string };
    nik: string;
    job: { nama_job: string };
    status_project: string;
    aksi: string;
}

// Perbarui DataType untuk mencocokkan data yang diterima
interface DataType {
  key: string;
  user: { nama: string };
  nik: string;
  job: { nama_job: string };
  status_project: string;
  aksi: string[];
}

const columnKaryawan = [
  {
    title: 'Nama Karyawan',
    dataIndex: 'user',
    key: 'user',
    render: (user: { nama: string }) => user.nama, // Akses nama dari objek user
  },
  {
    title: 'NIK',
    dataIndex: 'nik',
    key: 'nik',
  },
  {
    title: 'Job',
    dataIndex: ['job', 'nama_job'], // Akses nama_job dari objek job
    key: 'nama_job',
  },
  {
    title: 'Status Keaktifan',
    dataIndex: 'status_project',
    key: 'status_project',
  },
  {
    title: 'Aksi',
    key: 'aksi',
    render: (record: KaryawanData) => {
      const idKaryawan = record.id; // Akses id untuk digunakan di modal
      return (
        <div>
          <ModalComponent
            title={'Detail Tugas'}
            content={<ModalDetailKaryawan idKaryawan={idKaryawan} />}
            footer={(handleCancel, handleOk) => (
              <div>
                <Button onClick={handleCancel}>Cancel</Button>
                <Button type="primary" onClick={handleOk}>Ok</Button>
              </div>
            )}
            onOk={() => console.log('Ok clicked')} // Tambahkan handler onOk
            onCancel={() => console.log('Cancel clicked')} // Tambahkan handler onCancel
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
  const { data: apiResponse, error: updateError, isValidating: updateValidating } = karyawanRepository.hooks.useAllKaryawan();

  // Debugging: Log response dan error
  useEffect(() => {
    console.log('Fetching karyawan data...');
    console.log('apiResponse:', apiResponse);
    console.log('Error:', updateError);
  }, [apiResponse, updateError]);

  if (updateValidating) {
    return <Spin style={{ textAlign: 'center', padding: '20px' }} />; // Tampilkan Spin saat loading
  }

  if (updateError) {
    return <Alert message="Error fetching data" type="error" />; // Tampilkan error jika ada
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
          Daftar Karyawan
        </h1>
      </Space>
      {apiResponse?.data?.length > 0 ? (
        <Table
          columns={columnKaryawan}
          dataSource={apiResponse.data.map((item: KaryawanData) => ({ ...item, key: item.id }))}
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
