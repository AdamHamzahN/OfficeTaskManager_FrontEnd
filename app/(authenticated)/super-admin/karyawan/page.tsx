"use client";
import React, { useEffect, useState } from 'react';
import { Space, Table, Alert, Spin, Button, Switch, Modal, Tag, Input, message } from 'antd';
import { karyawanRepository } from '#/repository/karyawan'; // Ganti dengan jalur yang sesuai jika berbeda
import { EditOutlined, EyeOutlined } from "@ant-design/icons";
import { PlusOutlined } from "@ant-design/icons";
import ModalComponent from '#/component/ModalComponent';
import ModalDetailKaryawan from './modalDetailKaryawan';
import ModalTambahKaryawan from './modalTambahKaryawan';
import TableComponent from '#/component/TableComponent';
import Container from '#/component/ContainerComponent';

interface KaryawanData {
  id: string;
  user: { nama: string, id: string };
  nik: string;
  job: { nama_job: string, id: string };
  status_project: string;
}

const Page: React.FC = () => {
  /**
   * Struktur column table
   */
  const columnKaryawan = [
    {
      title: 'Nama Karyawan',
      key: 'user',
      render: (record: KaryawanData) => record.user ? record.user.nama : 'N/A'
    },
    {
      title: 'NIK',
      key: 'nik',
      dataIndex: 'nik'
    },
    {
      title: 'Job',
      key: 'nama_job',
      render: (record: KaryawanData) => record.job ? record.job.nama_job : 'N/A'
    },
    {
      title: 'Status Keaktifan',
      key: 'status',
      render: (record: any) => {

        const status_user = record.user.status == 'active' ? true : false;
        const id_karyawan = record.id;
        return (
          <Switch checked={status_user} onChange={() => handleStatusChange(id_karyawan, status_user)} />
        )
      }
    },
    {
      title: 'Status Project',
      key: 'status_project',
      dataIndex: 'status_project'
    },
    {
      title: 'Aksi',
      key: 'aksi',
      render: (record: KaryawanData) => {
        const idKaryawan = record.id;
        const currentJob = record.job.id;
        setJob(currentJob);
        return (
          <div style={{ display: 'flex', gap: '2px' }}>
            <ModalComponent
              title={'Detail Karyawan'}
              content={<ModalDetailKaryawan idKaryawan={idKaryawan} jobChange={setJob} />}
              visible={modalDetailKaryawan && selectedIdKaryawan === idKaryawan} 
              onCancel={() => setModalDetailKaryawan(false)}
              footer={(handleCancel) => (
                <div>
                  <Button type="primary"
                    onClick={() => {
                      handleJobUpdate(idKaryawan, job, currentJob, handleCancel)
                    }}>OK</Button>
                </div>
              )
              }
            >
              <Button style={{ backgroundColor: 'rgba(244, 247, 254, 1)', color: '#1890FF', border: 'none' }} onClick={() => {setModalDetailKaryawan(true);setSelectedIdKaryawan(idKaryawan);}}>
                <EyeOutlined /> Detail
              </Button>
            </ModalComponent >

            <ModalComponent
              title="Ubah Password"
              footer={(handleCancel) => (
                <div>
                  <Button onClick={() => {
                    handleCancel()
                    setNewPassword({ password: '' });
                  }}>Cancel</Button>
                  <Button type='primary' onClick={editPassword}>OK</Button>
                </div>
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
              <Button
                type="text"
                style={{ backgroundColor: 'rgba(254, 243, 232, 1)', color: '#EA7D2A', border: 'none' }}
                onClick={() => {
                  setSelectedIdKaryawan(record.user.id);
                }}
              >
                <EditOutlined /> Edit Password
              </Button>

            </ModalComponent>
          </div >
        );
      },
    }
  ];

  //state modal tambah
  const [modalTambahKaryawan, setModalTambahKaryawan] = useState(false);

  //state modal detail
  const [modalDetailKaryawan, setModalDetailKaryawan] = useState(false);

  // useState page
  const [page, setPage] = useState(1);

  // useState page size
  const [pageSize, setPageSize] = useState(5);

  //hook get all karyawan
  const { data: apiResponse, isValidating: loading, mutate } = karyawanRepository.hooks.useAllKaryawan(page, pageSize);

  // useState form create karyawan
  const [newKaryawan, setNewKaryawan] = useState<{ nik: string, nama: string, gender: string, email: string, username: string, job: string }>({
    nik: '',
    nama: '',
    gender: '',
    email: '',
    username: '',
    job: '',
  });


  //useState form update password
  const [newPassword, setNewPassword] = useState<{ password: string }>({
    password: ''
  });

  // state update job
  const [job, setJob] = useState<string>("");

  //set selected id karyawan
  const [selectedIdKaryawan, setSelectedIdKaryawan] = useState<string | null>(null);

  // handle edit password
  const editPassword = async () => {
    if (!newPassword.password) {
      message.warning('Field password tidak boleh kosong.')
      return;
    }
    if (newPassword.password.length < 6) {
      message.error('Password harus terdiri dari 6 karakter');
      return;
    }
    // const password = newPassword.password
    try {
      console.log('tes', selectedIdKaryawan);
      await karyawanRepository.api.editPassword(selectedIdKaryawan || '', { newPassword });
      Modal.success({
        title: 'Password berhasil diubah',
        content: 'Password karyawan berhasil diubah...',
        okText: 'OK',
      });
      setNewPassword({ password: '' });
      mutate();
      // setIsModalOpen(false); // Close the modal on success
    } catch (error) {
      console.error('Gagal edit password:', error);
    }
  };

  //handle update status keaktifan
  const handleStatusChange = async (id: string, status: boolean) => {
    const newStatus = status ? 'inactive' : 'active';
    try {
      await karyawanRepository.api.updateStatusKeaktifanKaryawan(id, { status: newStatus });
      message.success(`Status keaktifan berhasil diubah menjadi ${newStatus}.`);
      mutate();
    } catch (e) {
      return e;
    }
  }

  //handle pagination
  const handlePageChange = (newPage: number, newPageSize: number) => {
    setPage(newPage);
    setPageSize(newPageSize);
  };

  //handle tambah karyawan
  const tambahKaryawan = async () => {
    if (!newKaryawan.nik || !newKaryawan.nama || !newKaryawan.gender || !newKaryawan.email || !newKaryawan.username || !newKaryawan.job) {
      message.warning('Lengkapi data Karyawan Terlebih Dahulu');
      return;
    }
    try {
      const response = await karyawanRepository.api.tambahKaryawan({ newKaryawan });
      if (response.karyawanResponse?.statusCode == 201) {
        Modal.success({
          title: 'Karyawan Ditambahkan',
          content: 'Berhasil menambahkan Karyawan baru!',
        });
        mutate();
        setModalTambahKaryawan(false);
      } else {
        message.warning(response.karyawanResponse.message);
      }
    } catch (error: any) {
      message.warning(error.message);
    }
  };

  //handle update job
  const handleJobUpdate = async (id: string, job: any, currentJob: any, handleCancel: any) => {
    console.log(job, currentJob)
    if (job === currentJob) {
      handleCancel();
      setModalDetailKaryawan(false);
      return;
    } else {
      Modal.confirm({
        title: 'Ubah Job?',
        content: 'Apakah yakin ingin mengubah job karyawan ini?',
        async onOk() {
          try {
            await karyawanRepository.api.editJob(id, { job: job });
            Modal.success({
              title: 'Berhasil',
              content: 'Berhasil mengubah job karyawan',
              async onOk() {
                mutate();
                handleCancel();
              }
            })
            setModalDetailKaryawan(false);
          } catch (error) {
            message.error('gagal mengupdate job')
          }
        },
        onCancel() {
          console.log('Dialog dibatalkan');
        },
      });
    }
  }

  return (
    <Container>
      <Space style={{ width: '100%', justifyContent: 'space-between' }}>
        <h1 style={{ fontSize: 30, paddingTop: 20, paddingBottom: 20 }}>
          Daftar Karyawan
        </h1>
        <ModalComponent
          title={'Tambah Karyawan Baru'}
          content={<ModalTambahKaryawan createkaryawan={setNewKaryawan} />}
          visible={modalTambahKaryawan}
          onCancel={() => setModalTambahKaryawan(false)}
          footer={() => (
            <div>
              <Button onClick={()=>setModalTambahKaryawan(false)}>Cancel</Button>
              <Button type="primary" onClick={tambahKaryawan}>Tambah</Button>
            </div>
          )}
        >
          <Button type="primary" onClick={() => setModalTambahKaryawan(true)}>
            <PlusOutlined />Tambah
          </Button>
        </ModalComponent>
      </Space>
      <TableComponent
        data={apiResponse?.data}
        columns={columnKaryawan}
        loading={loading}
        page={page}
        pageSize={pageSize}
        total={apiResponse?.count}
        pagination={true}
        className="w-full custom-table"
        onPageChange={handlePageChange}
      />
    </Container>
  );
};

export default Page;
