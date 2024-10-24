"use client";
import React, { useEffect, useState } from 'react';
import { Table, Space, Collapse } from 'antd';
import { historyRepository } from '#/repository/history'; // Import historyRepository

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
  const [dataSource, setDataSource] = useState<any[]>([]); // State untuk menyimpan data yang di-fetch
  const [loading, setLoading] = useState(true); // State untuk mengelola status loading

  

  useEffect(() => {
    const getHistoryData = async () => {
      try {
        const result = await historyRepository.getHistoryById(); // Ambil data dari repository
        setDataSource(result.data); // Sesuaikan dengan struktur respons yang diharapkan
      } catch (error) {
        console.error('Error fetching history data:', error);
      } finally {
        setLoading(false); // Set loading menjadi false setelah data di-fetch
      }
    };

    getHistoryData(); // Panggil fungsi untuk mengambil data
  }, []);

  if (loading) return <p>Loading...</p>; // Status loading saat data sedang diambil

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      {/* Heading "History" */}
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
