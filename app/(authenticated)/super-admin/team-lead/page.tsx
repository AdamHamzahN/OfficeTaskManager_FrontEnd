"use client";

import React from 'react';
import { Divider, Table, Button, Switch, Tag } from 'antd';
import type { TableColumnsType } from 'antd';
import { PlusOutlined, EditOutlined } from '@ant-design/icons';
import { teamleadRepository } from '#/repository/teamlead';

interface DataType {
  key: React.Key;
  name: string;
  age: number;
  address: string;
}
// keaktifanUser = 
const columns: TableColumnsType<DataType> = [
  {
    title: 'Nama Team Lead',
    dataIndex: 'name',
  },
  {
    title: 'Status Keaktifan',
    dataIndex: 'status',
    render: (active: boolean) => (
    // <Switch defaultChecked onChange={onChange} />
    <Switch checked={active} onChange={(checked) => 
        console.log(`Status keaktifan diubah menjadi ${checked}`)} />
    ),
  },
  {
    title: 'Aksi',
    dataIndex: 'address',
    render: () => (
        <Tag bordered={false} color="orange">
        <EditOutlined /> Edit Password
        </Tag>
    )
  },
];

const data: DataType[] = [
  {
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
  },
  {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
  },
  {
    key: '3',
    name: 'Joe Black',
    age: 32,
    address: 'Sydney No. 1 Lake Park',
  },
];


const Page: React.FC = () => {
    
    // const { data: statusKeaktifan } = teamleadRepository.hooks.useStatusKeaktifan();

//   <>
//   <div>
//         <h1>wee</h1>
//   </div>
//     {/* <Divider>Middle size table</Divider> */}
//     <Table columns={columns} dataSource={data} size="middle" />
    
//   </>

    return (
        <div>
            <h1 style={{ fontSize: 30, paddingTop: 20, paddingBottom: 20}}>Daftar Team Lead
                <Button type="primary" style={{ marginLeft: 720}}>
                <PlusOutlined />Tambah
                </Button>
            </h1>
            
            <Table 
                columns={columns} 
                dataSource={data} 
                size="middle"  
                />
        </div>
        
    )
};

export default Page;