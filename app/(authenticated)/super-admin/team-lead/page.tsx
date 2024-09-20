"use client";

// import React from 'react';
import React, { useState } from 'react';
import { Divider, Table, Button, Switch, Tag, Modal, Input, Form, Row, Col, Select  } from 'antd';
import type { TableColumnsType } from 'antd';
import { PlusOutlined, EditOutlined, EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { teamleadRepository } from '#/repository/teamlead';

interface DataType {
  key: React.Key;
  name: string;
  age: number;
  address: string;
}

const Page: React.FC = () => {

  // state modal edit password
  const [isModalOpen, setIsModalOpen] = useState(false);

  // state modal tambah team lead
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };
  
  const showAddModal = () => {
    setIsAddModalOpen (true);
  }

  // const handleOk = () => {
  //   setIsModalOpen(false);
  // };

  const handleSuccess = () => {
    setIsModalOpen(false);
    Modal.success({
      content: 'Password team lead berhasil diubah...',
    });
  };

  const handleAddSuccess = () => {
    setIsAddModalOpen(false);
    Modal.success({
      content: 'Team Lead baru berhasil ditambahkan...'
    });
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleAddCancel = () => {
    setIsAddModalOpen(false);
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
      <Tag
        bordered={false}
        color="orange"
        style={{ cursor: 'pointer' }}  
        onClick={showModal}
      >
        <EditOutlined /> Edit Password
      </Tag>
        // <Tag bordered={false} color="orange">
        // <EditOutlined /> Edit Passwor
        // </Tag>
    )
  },
];

// const handleEditPasswordClick = () => {
//   console.log('Edit Password clicked');
//   // Tambahkan logika lain di sini, seperti navigasi atau membuka modal
// };

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

// const handleEditPasswordClick = () => {
//   console.log('Edit Password clicked');
//   // Tambahkan logika lain di sini, seperti navigasi atau membuka modal
// };


  // const Page: React.FC = () => {
      
  //   const [isModalOpen, setIsModalOpen] = useState(false);

  //   const showModal = () => {
  //     setIsModalOpen(true);
  //   };

  //   const handleOk = () => {
  //     setIsModalOpen(false);
  //   };

  //   const handleCancel = () => {
  //     setIsModalOpen(false);
  //   };
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
                <Button type="primary" style={{ marginLeft: 720}} onClick={showAddModal}>
                <PlusOutlined />Tambah
                  
                </Button>
            </h1>
            
            <Table 
                columns={columns} 
                dataSource={data} 
                size="middle"
                pagination={{ position: ['bottomCenter'] }}
                />

            <Modal title="Ubah Password" open={isModalOpen} onOk={handleSuccess} onCancel={handleCancel}>
              <p>Masukkan Password Baru</p>
              {/* <Input placeholder="Masukkan Password" /> */}
              <Input.Password placeholder="Masukkan Password" />
            </Modal>

            <Modal title="Tambah Team Lead" open={isAddModalOpen} onOk={handleAddSuccess} onCancel={handleAddCancel}>
              <p>Tambah Team Lead</p>
              {/* <Input placeholder="Masukkan Password" /> */}
              {/* <Input.Password placeholder="Masukkan Password" /> */}
              <Form>
                
                    <Form.Item
                      label="Nama"
                      style={{ width: '100%' }}
                      // rules={[{ required: true, message: 'Please input your username!' }]}
                    >
                      <Input placeholder='Masukkan nama' style={{ marginLeft: 25, width: 397 }}/>
                    </Form.Item>
                  
                    <Form.Item
                      label="Username"
                      // rules={[{ required: true, message: 'Please input your username!' }]}
                    >
                      <Input placeholder='Masukkan username' />
                    </Form.Item>

                    <Form.Item
                      label="Email"
                      // rules={[{ required: true, message: 'Please input your username!' }]}
                    >
                      <Input placeholder='Masukkan email' style={{ marginLeft: 29, width: 398 }}/>
                    </Form.Item>

                
              </Form>
            </Modal>

        </div>
        
    );
};

export default Page;