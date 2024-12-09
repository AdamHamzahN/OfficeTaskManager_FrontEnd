'use client';
import React, { useState } from 'react';
import { Table, Button, Switch, Tag, Modal, Input, Form, Spin, Alert, message } from 'antd';
import { PlusOutlined, EditOutlined } from '@ant-design/icons';
import { teamleadRepository } from '#/repository/teamlead';
import ModalComponent from '#/component/ModalComponent';

const Page: React.FC = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [newPassword, setNewPassword] = useState<{ password: string }>({
    password: ''
  });

  const [newTeamLead, setNewTeamLead] = useState<{ nama: string; username: string; email: string }>({
    nama: '',
    username: '',
    email: '',
  });

  const [selectedIdTeamLead, setSelectedIdTeamLead] = useState<string | null>(null);

  const { data: namaTeamLead, error: errorNamaTeamLead, isValidating: validateNamaTeamLead, mutate } =
    teamleadRepository.hooks.useNamaTeamLead(page, pageSize);

  if (validateNamaTeamLead) {
    return <Spin style={{ textAlign: 'center', padding: '20px' }} />;
  }
  if (errorNamaTeamLead) {
    return <Alert message="Error fetching data" type="error" />;
  }

  const handlePageChange = (newPage: number, newPageSize: number) => {
    setPage(newPage);
    setPageSize(newPageSize);
  };

  // Function to handle status change
  const handleStatusChange = async (id: string, status: boolean) => {
    const newStatus = status ? 'inactive' : 'active';
    try {
      await teamleadRepository.api.editStatusKeaktifan(id, { status: newStatus });
      message.success('Status keaktifan berhasil diperbarui');
      mutate();
    } catch (error) {
      message.error('Gagal memperbarui status keaktifan');
    }
  };

  // Handle adding a new Team Lead
  const tambahTeamLead = async () => {
    if (!newTeamLead.nama || !newTeamLead.username || !newTeamLead.email) {
      // alert('Semua field harus diisi');
      message.warning("Harap isi semua field yang diperlukan.");
      return;
    }
    const nama = newTeamLead.nama;
    const username = newTeamLead.username;
    const email = newTeamLead.email
    try {
      const response = await teamleadRepository.api.tambahTeamLead({ nama, username, email });
      /**
       * Cek apakah berhasil?
       */
      console.log(response.tambahTeamLeadResponse)
       if(response.tambahTeamLeadResponse.statusCode === 201 ){
        //bila berhasil tampilkan success message
        Modal.success({
          title: 'Team Lead Ditambahkan',
          content: 'Berhasil menambahkan Team Lead baru!',
          okText: 'OK',
          onOk() {
            console.log('Team Lead berhasil ditambahkan');
          },
        });
        mutate();
        setNewTeamLead({nama: '', username: '', email: ''});
      }
    } catch (error:any) {
      message.warning(error.message);
    }
  };

  // handle edit password
  const editPassword = async () => {
    if (!newPassword.password) {
      message.warning("Harap isi semua field yang diperlukan.");
      return;
    }
    if(newPassword.password.length < 6){
      message.warning("Password minimal 6 karakter.");
      return;
    }
    try {
      await teamleadRepository.api.editPassword(selectedIdTeamLead || '', { newPassword });
      Modal.success({
        title: 'Password berhasil diubah',
        content: 'Password team lead berhasil diubah...',
        okText: 'OK',
      });
      setNewPassword({password:''});
      mutate()
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
      render: (status: any, record: any) => {
        const status_user = status == "active" ? true : false;
        const id_user = record.id;
        return (
          <Switch checked={status_user} onChange={() => handleStatusChange(id_user, status_user)} />
        )
      },
    },
    {
      title: 'Aksi',
      // dataIndex: 'address',
      key: 'aksi',
      render: (record: any) => (
        <ModalComponent
          title="Ubah Password"
          footer={(handleCancel) => (
            <>
              <Button onClick={handleCancel}>Cancel</Button>
              <Button type='primary' onClick={editPassword}>OK</Button>
            </>
          )}
          content={(
            <>
              <p>Masukkan Password Baru</p>
              <Input.Password
                placeholder="Masukkan password"
                value={newPassword.password}
                onChange={(e) => setNewPassword({ ...newPassword, password: e.target.value })}
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

  // const dataSource = Array.isArray(namaTeamLead) ? namaTeamLead : [];
  // console.log(dataSource)

  return (
    <div style={{ padding: 24, minHeight: '100vh', backgroundColor: '#FFFFFF', borderRadius: 15 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontSize: 30, paddingTop: 20, paddingBottom: 20 }}>
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
                  onChange={(e) => setNewTeamLead({ ...newTeamLead, nama: e.target.value })}
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
                  onChange={(e) => setNewTeamLead({ ...newTeamLead, username: e.target.value })}
                />
              </Form.Item>

              <Form.Item
                label="Email"
              // name="email"
              >
                <Input
                  placeholder='Masukkan email'
                  value={newTeamLead.email}
                  onChange={(e) => setNewTeamLead({ ...newTeamLead, email: e.target.value })}
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

      <Table
        columns={columns}
        dataSource={namaTeamLead.data} 
        size="middle"
        pagination={{
          current: page,
          pageSize: pageSize,
          total: namaTeamLead?.count,
          position: ['bottomCenter'],
          onChange: (page, pageSize) => {
              handlePageChange(page, pageSize)
          },
      }}
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