"use client";
import { Table, Space, Collapse, Spin, Alert, Tag, Input, Pagination } from 'antd';
import { historyRepository } from '#/repository/history'; // Import historyRepository
import { useEffect, useState } from 'react';
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

/**
 * Component untuk mengambil data history dan menampilkannya
 *  Note : Di pisah dari page agar ketika fetching ulang hanya collapse history saja yang render ulang
 */
const HistoryItem: React.FC<{ searchText: string }> = ({searchText}) => {
  //Ambil id user dari token di local storage
  const id_user = JwtToken.getPayload().sub;
  //State Untuk Page
  const [page, setPage] = useState(1);
  //State Untuk page
  const [pageSize, setPageSize] = useState(10);
  //Fungsi untuk mengatur pagination
  const handlePageChange = (newPage: number, newPageSize: number) => {
    setPage(newPage);
    setPageSize(newPageSize);
  };

  // Ambil data menggunakan id_user sebagai parameter
  const { data: historyResponse, error: updateError, isValidating: updateValidating} = historyRepository.hooks.useGetHistoryById(id_user, page, pageSize, searchText);

  // Loading state ketika data sedang diambil
  if (updateValidating) {
    return <Spin style={{ textAlign: 'center', padding: '20px' }} />;
  }

  // // Tampilkan error jika ada
  if (updateError) {
    return <Alert message="Error fetching data" type="error" />;
  }
  return (
    <div>
      {/* Mapping data dari hook untuk menampilkan data history */}
      {historyResponse.data.map((project: any, index: number) => (
        <Collapse accordion key={index}>
          <Panel header={project.project.nama_project} key={index}>
            <Table
              columns={columnHistory}
              dataSource={project.tugas}
            />
          </Panel>
        </Collapse>
      ))}
      {/* Bila data history lebih dari 10 maka tampilkan pagination , bila tidak tidak ditampilkan */}
      {historyResponse.count > 10 && (
        <Pagination
          current={page}
          pageSize={pageSize}
          total={historyResponse.count}
          onChange={handlePageChange}
        />
      )}
    </div>
  )
}
const Page: React.FC = () => {
  // State untuk menampung hasil search
  const [searchText, setSearchText] = useState('');

  // Filter tugas berdasarkan search text
  const onSearch = (search: any) => {
    //Set value searchText menjadi value yang diambil dari input search
    setSearchText(search);
  };

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
            style={{ width: '400px' }}
            onSearch={(value) => onSearch(value)}
          />
        </div>
        {/* Panggil History Item */}
        <HistoryItem searchText={searchText} />
      </Space>
    </div>
  );
};

export default Page;
