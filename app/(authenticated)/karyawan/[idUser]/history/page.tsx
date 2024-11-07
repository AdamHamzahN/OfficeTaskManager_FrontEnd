"use client";
import React, { useEffect } from 'react';
import { Table, Space, Collapse, Spin, Alert } from 'antd';
import { historyRepository } from '#/repository/history'; // Import historyRepository
import { useParams } from 'next/navigation';

const { Panel } = Collapse;

interface HistoryData {
  nama_tugas: string;
  status: string;
  updated_at: string;
}

const columns = [
  {
    title: 'Nama Tugas',
    dataIndex: 'nama_tugas',
    key: 'nama_tugas',
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
  },
  {
    title: 'Update at',
    dataIndex: 'updated_at',
    key: 'updated_at',
  }
];

const Page: React.FC = () => {
  const params = useParams();
  const id_user = params?.idUser as string;
  // Ambil data menggunakan id_user sebagai parameter
  const { data: historyResponse, error: updateError, isValidating: updateValidating } = historyRepository.hooks.useGetHistoryById(id_user);

  // Cek hasil dari historyResponse
  useEffect(() => {
    console.log("History response:", historyResponse); // Log hasil respons dari API
    console.log("Error:", updateError); // Log error jika ada
  }, [historyResponse, updateError]);

  // Definisikan dataSource dari hasil historyResponse
  const dataSource = historyResponse
    ? historyResponse.data.map((item: HistoryData, index: number) => ({
        ...item,
        key: index, // Tambahkan key untuk setiap item
      }))
    : [];

  // Loading state ketika data sedang diambil
  if (updateValidating) {
    return <Spin style={{ textAlign: 'center', padding: '20px' }} />;
  }

  // Tampilkan error jika ada
  if (updateError) {
    return <Alert message="Error fetching data" type="error" />;
  }

  // Tampilkan data dalam bentuk tabel dan panel
  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <h1 style={{ fontSize: '36px', fontFamily: 'Roboto, sans-serif', marginBottom: '20px' }}>
        History
      </h1>
      
      <Collapse accordion>
        <Panel header="Tugas Project 3" key="1">
          <Table dataSource={dataSource} columns={columns} pagination={false} />
        </Panel>
        <Panel header="Project Aplikasi Perpustakaan" key="2">
          <Table dataSource={dataSource} columns={columns} pagination={false} />
        </Panel>
        <Panel header="Tugas Project 3" key="3">
          <Table dataSource={dataSource} columns={columns} pagination={false} />
        </Panel>
      </Collapse>
    </Space>
  );
};

export default Page;
