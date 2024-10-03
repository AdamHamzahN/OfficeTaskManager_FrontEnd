'use client';

import React, { useState } from 'react';
import { Divider, Table, Button, Switch, Tag, Modal, Input, Form, Row, Col, Select, Spin, Alert  } from 'antd';
import type { TableColumnsType } from 'antd';
import { PlusOutlined, EditOutlined, EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { teamleadRepository } from '#/repository/teamlead';


const Page: React.FC = () => {

  const [newTeamLead, setNewTeamLead] = useState<{ nama: string; username: string; email: string }>({
    nama: '',
    username: '',
    email: '',
  });

  const [newPassword, setNewPassword] = useState<{ password: string }>({
    password: ''
  });
  
  const [selectedIdTeamLead, setSelectedIdTeamLead] = useState<string | null>(null);
  
  // state modal edit password
  const [isModalOpen, setIsModalOpen] = useState(false);

  // state modal tambah team lead
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // state alert warning
  const [showAlert, setShowAlert] = useState(false);

   // Open modal for adding team lead, tambah team lead
  const showAddModal = () => {
    setIsAddModalOpen (true);
  }
  // modal edit pw
  const showModal = () => {
    setIsModalOpen(true);
  };

  // close modal
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  
  const handleAddCancel = () => {
    setIsAddModalOpen(false);
  };
  
     // Handle adding a new Team Lead
    const tambahTeamLead = async () => {
      if (!newTeamLead.nama || !newTeamLead.username || !newTeamLead.email) {
        // alert('Semua field harus diisi');
        setShowAlert(true);
        return;
      }
      const nama = newTeamLead.nama;
      const username = newTeamLead.username;
      const email = newTeamLead.email
      // console.log('nama', nama)
      try {
        await teamleadRepository.api.tambahTeamLead({ nama, username, email });
        Modal.success({
          title: 'Team Lead Ditambahkan',
          content: 'Berhasil menambahkan Team Lead baru!',
          okText: 'OK',
          onOk() {
            console.log('Team Lead berhasil ditambahkan');
          },
        });
        setIsAddModalOpen(false); // Close the modal on success
        } catch (error) {
          console.error('Gagal menambahkan Team Lead:', error);
        }
      };

      // handle edit password
      const editPassword = async () => {
        if (!newPassword.password) {
          setShowAlert(true);
          return;
        }
        // const password = newPassword.password
        try {
          console.log('tes', selectedIdTeamLead);
          await teamleadRepository.api.editPassword(selectedIdTeamLead || '', {newPassword});
          Modal.success({
            title: 'Password berhasil diubah',
            content: 'Password team lead berhasil diubah...',
            okText: 'OK',
          });
          setIsModalOpen(false); // Close the modal on success
        } catch (error) {
          console.error('Gagal edit password:', error);
        }
      };
      
  // const handleSuccess = () => {
  //   setIsModalOpen(false);
  //   Modal.success({
  //     content: 'Password team lead berhasil diubah...',
  //   });
  // };

  // const handleAddSuccess = () => {
  //   setIsAddModalOpen(false);
  //   Modal.success({
  //     content: 'Team Lead baru berhasil ditambahkan...'
  //   });
  // };

const columns = [
  {
    title: 'Nama Team Lead',
    dataIndex: 'nama',
    key: 'nama',
    // render: (record: any) => record.nama ? record.nama : 'N/A',
  },
  
  {
    title: 'Status Keaktifan',
    dataIndex: 'status',
    key: 'status',
    render: (active: boolean) => (
    // <Switch defaultChecked onChange={onChange} />
    <Switch checked={active} onChange={(checked) => 
        console.log(`Status keaktifan diubah menjadi ${checked}`)} />
    ),
  },
  {
    title: 'Aksi',
    // dataIndex: 'address',
    key: 'aksi',
    render: (record: any) => (
      <Tag
        bordered={false}
        color="orange"
        style={{ cursor: 'pointer' }}  
        onClick={() => {
          setSelectedIdTeamLead(record.id)
          console.log('p', record.id)
          showModal();
          // onClick={() => setIsModalOpen(true)} // sama aja 
        }}
      >
        <EditOutlined /> Edit Password
      </Tag>
    )
  },
];  

const { data: namaTeamLead, error: errorNamaTeamLead, isValidating: validateNamaTeamLead } = 
  teamleadRepository.hooks.useNamaTeamLead();
console.log(namaTeamLead)

// const dataSource = Array.isArray(namaTeamLead) ? namaTeamLead : [];
// console.log(dataSource)

if (validateNamaTeamLead) {
  return <Spin style={{ textAlign: 'center', padding: '20px' }} />;
}
if (errorNamaTeamLead) {
  return <Alert message="Error fetching data" type="error" />;
}

// const handleEditPasswordClick = () => {
//   console.log('Edit Password clicked');
//   // Tambahkan logika lain di sini, seperti navigasi atau membuka modal
// };

return (
    <div style={{ padding: 24, minHeight: '100vh', backgroundColor: '#FFFFFF', borderRadius: 15 }}>
      <h1 style={{ fontSize: 30, paddingTop: 20, paddingBottom: 20}}>Daftar Team Lead
          <Button type="primary" style={{ marginLeft: 723}} onClick={showAddModal}>
          {/* <Button type="primary" onClick={tambahTeamLead}>Ok</Button> */}
          <PlusOutlined />Tambah
          </Button>
      </h1>
          
      {/* ALERT WARNING */}
        {showAlert && (
          <>
          {/* Full-screen overlay to block interaction */}
            <div className='alert-overlay' />

             {/* Alert container */}
              <div className="alert-container">
              <Alert
                  message="Warning"
                  description="Semua field harus diisi."
                  type="warning"
                  showIcon
                  closable
                  onClose={() => setShowAlert(false)}
              />
            </div>
          </>
        )}
        
        <Table 
            columns={columns} 
            dataSource={namaTeamLead}
            // dataSource={dataSource.map((item, index) => ({ ...item, key: item.id || index }))} 
            size="middle"
            pagination={{ position: ['bottomCenter'] }}
        />

        <Modal title="Ubah Password" open={isModalOpen} onOk={editPassword} onCancel={handleCancel}>
          <p>Masukkan Password Baru</p>
          <Input.Password 
            placeholder="Masukkan password" 
            value={newPassword.password}
            onChange={(e) => setNewPassword({ ...newPassword, password: e.target.value})}
          />
        </Modal>

        <Modal title="Tambah Team Lead" open={isAddModalOpen} onOk={tambahTeamLead} onCancel={handleAddCancel}>
          {/* <p>Tambah Team Lead</p> */}
            <Form>
                <Form.Item
                  label="Nama"
                  style={{ width: '100%' }}
                >
                  <Input 
                    placeholder='Masukkan nama'  
                    value={newTeamLead.nama} 
                    onChange={(e) => setNewTeamLead({ ...newTeamLead, nama: e.target.value})}
                    style={{ marginLeft: 25, width: 397 }}
                  />
                </Form.Item>
              
                <Form.Item
                  label="Username"
                >
                  <Input 
                    placeholder='Masukkan username' 
                    value={newTeamLead.username}
                    onChange={(e) => setNewTeamLead({...newTeamLead, username: e.target.value})}
                  />
                </Form.Item>

                <Form.Item
                  label="Email"
                >
                  <Input 
                    placeholder='Masukkan email' 
                    value={newTeamLead.email}
                    onChange={(e) => setNewTeamLead({...newTeamLead, email: e.target.value})}
                    style={{ marginLeft: 29, width: 398 }}
                  />
                </Form.Item>
            </Form>
        </Modal>
    </div>
  );
};

export default Page;