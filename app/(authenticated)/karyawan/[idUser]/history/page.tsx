"use client";
import React from 'react';
import { Table, Space, Collapse } from 'antd';

const { Panel } = Collapse;

const text = 
  "A dog is a type of domesticated animal. Known for its loyalty and faithfulness, it can be found as a welcome guest in many households across the world.";

const dataSource = [
  {
    key: '1',
    title: 'UI / UX Perpustakaan',
    author: 'John Doe',
    genre: 'Pemrograman',
    available: 'Ya',
  },
  {
    key: '2',
    title: 'Front End developer',
    author: 'Jane Smith',
    genre: 'Pemrograman',
    available: 'Tidak',
  },
  {
    key: '3',
    title: 'Pengantar Machine Learning',
    author: 'Sam Wilson',
    genre: 'Teknologi',
    available: 'Ya',
  },
];

const columns = [
  {
    title: 'Nama Tugas',
    dataIndex: 'title',
    key: 'title',
  },
  {
    title: 'Penulis',
    dataIndex: 'author',
    key: 'author',
  },
  {
    title: 'Genre',
    dataIndex: 'genre',
    key: 'genre',
  },
  {
    title: 'Tersedia',
    dataIndex: 'available',
    key: 'available',
  },
];

const App: React.FC = () => (
  <Space direction="vertical" style={{ width: '100%' }}>
    <Collapse accordion>
      <Panel header="Tugas Project 3" key="1">
        <p>{text}</p>
      </Panel>
      <Panel header="Project Aplikasi Perpustakaan" key="2">
        <Table dataSource={dataSource} columns={columns} pagination={false} />
      </Panel>
      <Panel header="Tugas Project 3" key="3">
        <p>{text}</p>
      </Panel>
    </Collapse>
  </Space>
);

export default App;
