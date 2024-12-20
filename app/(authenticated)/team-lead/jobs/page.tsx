"use client";
import React, { useState } from 'react';
import { Table, Tag, Alert, Spin, Button } from 'antd';
import { jobsRepository } from '#/repository/jobs'; // Ganti dengan jalur yang sesuai jika berbeda
import { EyeOutlined } from "@ant-design/icons";
import ModalComponent from '#/component/ModalComponent';
import ModalDetailJobs from './modalDetailJobs';
import TableComponent from '#/component/TableComponent';
import Container from '#/component/ContainerComponent';

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
            footer={(handleOk) => (
              <div>
                <Button type="primary" onClick={handleOk}>OK</Button>
              </div>
            )}
            onOk={() => console.log('Ok clicked')}  // Tambahkan handler onOk
          >
            <Button style={{ backgroundColor: 'rgba(244, 247, 254, 1)', color: '#1890FF', border: 'none' }}>
              <EyeOutlined /> Detail
            </Button>
          </ModalComponent>
        </div>
      );
    },
  },
];

const Page: React.FC = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const { data: apiResponse, isValidating: loading } = jobsRepository.hooks.useAllJobs(page, pageSize);

  const handlePageChange = (newPage: number, newPageSize: number) => {
    setPage(newPage);
    setPageSize(newPageSize);
  };

  return (
    <Container>
      <h1 style={{ fontSize: '30px', paddingBottom: '20px', paddingTop: '20px' }}>
        Daftar Job
      </h1>
      {/* Perbaikan Table */}
      <TableComponent
        data={apiResponse?.data}
        columns={columnJobs}
        loading={loading}
        page={page}
        pageSize={pageSize}
        total={apiResponse?.count}
        pagination={true}
        className="w-full custom-table"
        onPageChange={handlePageChange}
      />
    </Container>
  );
};

export default Page;
