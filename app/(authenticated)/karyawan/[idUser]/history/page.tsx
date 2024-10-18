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
    status: 'Done',
    update: '04-03-2024 13.00.00',
  },
  {
    key: '2',
    title: 'Front End developer',
    status: 'Redo',
    update: '04-03-2024 15.00.00',
  },
  {
    key: '3',
    title: 'Back End Developer',
    status: 'Redo',
    update: '04-03-2024 15.30.00',
  },
];

const columns = [
  {
    title: 'Nama Tugas',
    dataIndex: 'title',
    key: 'title',
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
  },
  {
    title: 'Update at',
    dataIndex: 'update',
    key: 'update',
  }
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
