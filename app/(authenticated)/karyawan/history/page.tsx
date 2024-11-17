"use client";
import { Table, Space, Collapse, Spin, Alert, Tag, Input } from 'antd';
import { historyRepository } from '#/repository/history'; // Import historyRepository
import { useState } from 'react';
import { JwtToken } from '#/utils/jwtToken';

const { Panel } = Collapse;
const { Search } = Input;

const columnHistory = [
  {
    title: 'Nama Tugas',
    dataIndex: 'nama_tugas',
    key: 'nama_tugas',
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    render: (status: string) => {
      const getColor = () => {
        switch (status) {
          case 'done': return '#2196F3';
          case 'redo': return '#F44336';
        }
      };

      return <Tag color={getColor()}>{status}</Tag>;
    }
  },
  {
    title: 'Update at',
    dataIndex: 'updated_at',
    key: 'updated_at',
  }
];

const Page: React.FC = () => {
  const id_user = JwtToken.getPayload().sub;;

  // State untuk menampung hasil search
  const [searchText, setSearchText] = useState('');

  // Ambil data menggunakan id_user sebagai parameter
  const { data: historyResponse, error: updateError, isValidating: updateValidating } = historyRepository.hooks.useGetHistoryById(id_user);

  // Loading state ketika data sedang diambil
  if (updateValidating) {
    return <Spin style={{ textAlign: 'center', padding: '20px' }} />;
  }

  // Tampilkan error jika ada
  if (updateError) {
    return <Alert message="Error fetching data" type="error" />;
  }

  // Filter tugas berdasarkan search text
  const filteredData = historyResponse.data
    .filter((project: any) =>
      project.project.nama_project.toLowerCase().includes(searchText.toLowerCase())
    );
  console.log(filteredData);

  // Tampilkan data dalam bentuk tabel dan panel
  return (
    <div
      style={{
        paddingRight: 24,
        paddingBottom: 24,
        paddingLeft: 24,
        minHeight: '100vh',
        backgroundColor: '#fff',
        borderRadius: 15,
        position: 'relative',
      }}
    >
      <Space direction="vertical" style={{ width: '100%', marginTop: '30px' }}>
        <h1 style={{ fontSize: '36px', fontFamily: 'Roboto, sans-serif', marginBottom: '20px' }}>
          History
        </h1>

        {/* Search input positioned at the top-right corner */}
        <div style={{ position: 'absolute', top: 30, right: 24 }}>
          <Search
            placeholder="Search Nama Tugas"
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: '300px' }}
          />
        </div>

        {filteredData.map((project: any, index: number) => (
          <Collapse accordion key={index}>
            <Panel header={project.project.nama_project} key={index}>
              <Table
                columns={columnHistory}
                dataSource={project.tugas}
              />
            </Panel>
          </Collapse>
        ))}
      </Space>
    </div>
  );
};

export default Page;
