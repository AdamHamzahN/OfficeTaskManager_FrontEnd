"use client";
import React, { useEffect, useState } from 'react';
import { Table, Alert, Spin, Button, Switch } from 'antd';
import { karyawanRepository } from '#/repository/karyawan'; // Ganti dengan jalur yang sesuai jika berbeda
import { EyeOutlined } from "@ant-design/icons";
import ModalComponent from '#/component/ModalComponent';
import ModalDetailKaryawan from './modalDetailKaryawan';
import Container from '#/component/ContainerComponent';
import TableComponent from '#/component/TableComponent';

interface KaryawanData {
  id: string;
  user: { nama: string, status: string };
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
    render: (record: KaryawanData) => record?.user ? record.user.status : 'N/A'
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
          footer={(handleCancel, handleOk) => (
            <div>
              <Button type="primary" onClick={handleOk}>OK</Button>
            </div>
          )}
        >
          <Button style={{ backgroundColor: 'rgba(244, 247, 254, 1)', color: '#1890FF', border: 'none' }}>
            <EyeOutlined /> detail
          </Button>
        </ModalComponent>
      );
    },
  },
];

const Page: React.FC = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const { data: apiResponse, isValidating: loading } = karyawanRepository.hooks.useAllKaryawan(page, pageSize);

  const handlePageChange = (newPage: number, newPageSize: number) => {
    setPage(newPage);
    setPageSize(newPageSize);
  };

  return (
    <Container>
      <h1 style={{ fontSize: '30px', paddingBottom: '20px', paddingTop: '20px' }}>
        Daftar Karyawan
      </h1>

      {/* <Table
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
      /> */}
      <TableComponent
        data={apiResponse?.data}
        columns={columnKaryawan}
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
