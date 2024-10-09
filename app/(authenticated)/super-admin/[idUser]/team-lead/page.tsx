'use client';

import React, { useState } from 'react';
import { Divider, Table, Button, Switch, Tag, Modal, Input, Form, Row, Col, Select, Spin, Alert  } from 'antd';
import type { TableColumnsType } from 'antd';
import { PlusOutlined, EditOutlined, EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { teamleadRepository } from '#/repository/teamlead';
import ModalComponent from '#/component/ModalComponent';


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

  // state alert warning
  const [showAlert, setShowAlert] = useState(false);
  
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
        mutate()
        // setIsAddModalOpen(false); // Close the modal on success
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
          mutate()
          // setIsModalOpen(false); // Close the modal on success
        } catch (error) {
          console.error('Gagal edit password:', error);
        }
      };

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
      <ModalComponent
          title="Ubah Password"
          footer={(handleCancel) => (
            <div>
              <Button onClick={handleCancel}>Cancel</Button>
              <Button type='primary' onClick={editPassword}>OK</Button>
            </div>
          )}
            content={(
              <>
                <p>Masukkan Password Baru</p>
                  <Input.Password 
                    placeholder="Masukkan password" 
                    value={newPassword.password}
                    onChange={(e) => setNewPassword({ ...newPassword, password: e.target.value})}
                  />
              </>
            )}
        >
          <Tag
            bordered={false}
            color="orange"
            style={{ cursor: 'pointer' }}  
            onClick={() => {
              setSelectedIdTeamLead(record.id)
              console.log('p', record.id)
              // showModal();
              // onClick={() => setIsModalOpen(true)} // sama aja 
            }}
          >
            <EditOutlined /> Edit Password
          </Tag>
        </ModalComponent>
      
    )
  },
];  

const { data: namaTeamLead, error: errorNamaTeamLead, isValidating: validateNamaTeamLead, mutate } = 
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

return (
    <div style={{ padding: 24, minHeight: '100vh', backgroundColor: '#FFFFFF', borderRadius: 15 }}>
      <div  style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <h1 style={{ fontSize: 30, paddingTop: 20, paddingBottom: 20}}>
          Daftar Team Lead
        </h1>

          <ModalComponent
            title="Tambah Team Lead"
            footer={(handleCancel) => (
              <>
                <Button onClick={handleCancel}>Cancel</Button>
                <Button type='primary' onClick={tambahTeamLead}>OK</Button>
              </>
            )}
            content={(
              <>
                {/* <p>Tambah Team Lead</p> */}
                {/* <Form> */}
                    <Form.Item
                      label="Nama"
                      // name="name"
                    >
                      <Input 
                        placeholder='Masukkan nama'  
                        value={newTeamLead.nama} 
                        onChange={(e) => setNewTeamLead({ ...newTeamLead, nama: e.target.value})}
                        style={{ marginLeft: 25, width: 357 }}
                      />
                    </Form.Item>
                  
                    <Form.Item
                      label="Username"
                      // name="username"
                    >
                      <Input 
                        placeholder='Masukkan username' 
                        value={newTeamLead.username}
                        onChange={(e) => setNewTeamLead({...newTeamLead, username: e.target.value})}
                      />
                    </Form.Item>

                    <Form.Item
                      label="Email"
                      // name="email"
                    >
                      <Input 
                        placeholder='Masukkan email' 
                        value={newTeamLead.email}
                        onChange={(e) => setNewTeamLead({...newTeamLead, email: e.target.value})}
                        style={{ marginLeft: 28, width: 357 }}
                      />
                    </Form.Item>
                {/* </Form> */}
              </>
            )}
            >
              <Button type="primary" >
                <PlusOutlined />Tambah
              </Button>
          </ModalComponent>
        
      </div>

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
        {/* <ModalComponent
         title="Ubah Password"
         footer={(handleCancel) => (
          <div>
            <Button onClick={editPassword}>Ok</Button>
            <Button onClick={handleCancel}>Cancel</Button>
          </div>
         )}
          content={(
            <>
              <p>Masukkan Password Baru</p>
                <Input.Password 
                  placeholder="Masukkan password" 
                  value={newPassword.password}
                  onChange={(e) => setNewPassword({ ...newPassword, password: e.target.value})}
                />
            </>
          
          )}
        >
        </ModalComponent> */}
        
        
    </div>
  );
};

export default Page;