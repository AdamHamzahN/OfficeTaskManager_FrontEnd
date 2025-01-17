'use client';
import React, { useState } from 'react';
import { Table, Button, Switch, Tag, Modal, Input, Form, Spin, Alert, message } from 'antd';
import { PlusOutlined, EditOutlined } from '@ant-design/icons';
import { teamleadRepository } from '#/repository/teamlead';
import ModalComponent from '#/component/ModalComponent';
import Container from '#/component/ContainerComponent';
import TableComponent from '#/component/TableComponent';

const Page: React.FC = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [modalTambahTeamLead, SetModalTambahTeamLead] = useState(false);

  const [newPassword, setNewPassword] = useState<{ password: string }>({
    password: ''
  });

  const [newTeamLead, setNewTeamLead] = useState<{ nama: string; username: string; email: string }>({
    nama: '',
    username: '',
    email: '',
  });

  const [selectedIdTeamLead, setSelectedIdTeamLead] = useState<string | null>(null);

  const { data: teamLead, isValidating: loading, mutate } = teamleadRepository.hooks.useNamaTeamLead(page, pageSize);

  const handlePageChange = (newPage: number, newPageSize: number) => {
    setPage(newPage);
    setPageSize(newPageSize);
  };

  // Function to handle status change
  const handleStatusChange = async (id: string, status: boolean) => {
    const newStatus = status ? 'inactive' : 'active';
    try {
      await teamleadRepository.api.editStatusKeaktifan(id, { status: newStatus });
      message.success(`Status keaktifan berhasil diubah menjadi ${newStatus}.`);
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
        SetModalTambahTeamLead(false);
        setNewTeamLead({ nama: '', username: '', email: '' });
      }else if(response.tambahTeamLeadResponse.statusCode !== 201) {
        return message.error(response.tambahTeamLeadResponse.message);
      }
    } catch (error: any) {
      message.warning(error.message);
    }
  };

  // handle edit password
  const editPassword = async () => {
    if (!newPassword.password) {
      message.warning("Field password tidak boleh kosong.");
      return;
    }
    if (newPassword.password.length < 6) {
      message.warning("Password harus terdiri dari 6 karakter");
      return;
    }
    try {
      await teamleadRepository.api.editPassword(selectedIdTeamLead || '', { newPassword });
      Modal.success({
        title: 'Password berhasil diubah',
        content: 'Password team lead berhasil diubah...',
        okText: 'OK',
      });
      setNewPassword({ password: '' });
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

  return (
    <Container>
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
          visible={modalTambahTeamLead}
          onCancel={()=>SetModalTambahTeamLead(false)}
          content={(
            <>
              <Form.Item
                label="Nama"
                name="name"
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
                name="username"
              >
                <Input
                  placeholder='Masukkan username'
                  value={newTeamLead.username}
                  onChange={(e) => setNewTeamLead({ ...newTeamLead, username: e.target.value })}
                />
              </Form.Item>

              <Form.Item
                label="Email"
                name="email"
              >
                <Input
                  placeholder='Masukkan email'
                  value={newTeamLead.email}
                  onChange={(e) => setNewTeamLead({ ...newTeamLead, email: e.target.value })}
                  style={{ marginLeft: 28, width: 357 }}
                />
              </Form.Item>
            </>
          )}
        >
          <Button type="primary" onClick={()=>SetModalTambahTeamLead(true)}>
            <PlusOutlined />Tambah
          </Button>
        </ModalComponent>
      </div>
      {/* Perbaikan Table */}
      <TableComponent
        data={teamLead?.data}
        columns={columns}
        loading={loading}
        page={page}
        pageSize={pageSize}
        total={teamLead?.count}
        pagination={true}
        className="w-full custom-table"
        onPageChange={handlePageChange}
      />
    </Container>
  );
};

export default Page;