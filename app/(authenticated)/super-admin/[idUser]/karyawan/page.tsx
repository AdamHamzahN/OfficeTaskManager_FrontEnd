"use client";
import React, { useEffect, useState } from 'react';
import { Space, Table, Alert, Spin, Button, Switch, Modal, Tag, Input } from 'antd';
import { karyawanRepository } from '#/repository/karyawan'; // Ganti dengan jalur yang sesuai jika berbeda
import { EditOutlined, EyeOutlined } from "@ant-design/icons";
import { PlusOutlined } from "@ant-design/icons";
import ModalComponent from '#/component/ModalComponent';
import ModalDetailKaryawan from './modalDetailKaryawan';
import ModalTambahKaryawan from './modalTambahKaryawan';
import { render } from 'react-dom';

interface KaryawanData {
  id: string;
  user: { nama: string,id:string };
  nik: string;
  job: { nama_job: string };
  status_project: string;
}

const Page: React.FC = () => {
  const [newKaryawan, setNewKaryawan] = useState<{ nik: string, nama: string, gender: string, email: string, username: string, job: string }>({
    nik: '',
    nama: '',
    gender: '',
    email: '',
    username: '',
    job: '',
  });

  const [newPassword, setNewPassword] = useState<{ password: string }>({
    password: ''
  });
  
  const [selectedIdKaryawan, setSelectedIdKaryawan] = useState<string | null>(null);

  // state alert warning
  const [showAlert, setShowAlert] = useState(false);

  // handle edit password
  const editPassword = async () => {
    if (!newPassword.password) {
      setShowAlert(true);
      return;
    }
    // const password = newPassword.password
    try {
      console.log('tes', selectedIdKaryawan);
      await karyawanRepository.api.editPassword(selectedIdKaryawan || '', {newPassword});
      Modal.success({
        title: 'Password berhasil diubah',
        content: 'Password karyawan berhasil diubah...',
        okText: 'OK',
      });
      mutate()
      // setIsModalOpen(false); // Close the modal on success
    } catch (error) {
      console.error('Gagal edit password:', error);
    }
  };  

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
    dataIndex: 'status',
    render: (active: boolean) => (
      // <Switch defaultChecked onChange={onChange} />
      <Switch checked={active} onChange={(checked) => 
          console.log(`Status keaktifan diubah menjadi ${checked}`)} />
    ),
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
      return (
        <>
        <ModalComponent
          title={'Detail Tugas'}
          content={<ModalDetailKaryawan idKaryawan={idKaryawan} />}
          footer={(handleCancel, handleOk) => (
            <div>
              <Button onClick={handleCancel}>Cancel</Button>
              <Button type="primary" onClick={handleOk}>OK</Button>
            </div>
          )}
        >
          <Button style={{ backgroundColor: 'rgba(244, 247, 254, 1)', color: '#1890FF', border: 'none' }}>
            <EyeOutlined /> Detail
          </Button>
        </ModalComponent>

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
           setSelectedIdKaryawan(record.user.id)
           console.log('tes', record.id)
           // showModal();
           // onClick={() => setIsModalOpen(true)} // sama aja 
         }}
       >
         <EditOutlined /> Edit Password
       </Tag>
     </ModalComponent>
     </>
      );
    },
  }
];

  const { data: apiResponse, error: updateError, isValidating: updateValidating, mutate } = karyawanRepository.hooks.useAllKaryawan();

  const tambahKaryawan = async () => {
    console.log('p',newKaryawan)
    // if (!newKaryawan.nik || !newKaryawan.nama || !newKaryawan.gender || !newKaryawan.email || !newKaryawan.username || !newKaryawan.job) {
    //   alert('Lengkapi data Karyawan Terlebih Dahulu');
    //   return;
    // }
    try {
      await karyawanRepository.api.tambahKaryawan({ newKaryawan });
      Modal.success({
        title: 'Karyawan Ditambahkan',
        content: 'Berhasil menambahkan Karyawan baru!',
      });
    } catch (error) {
      console.error('Gagal menambahkan Karyawan:', error);
    }
  };

  useEffect(() => {
    console.log('apiResponse:', apiResponse);
    console.log('Error:', updateError);
  }, [apiResponse, updateError]);

  if (updateValidating) {
    return <Spin style={{ textAlign: 'center', padding: '20px' }} />;
  }

  if (updateError) {
    return <Alert message="Error fetching data" type="error" />;
  }

  return (
    <div
      style={{
        padding: 24,
        minHeight: '100vh',
        backgroundColor: '#fff',
        borderRadius: 15,
      }}
    >
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

      <Space style={{ marginLeft: '20px', marginBottom: '10px' }}>
        <h1 style={{ fontSize: '36px', fontFamily: 'Roboto, sans-serif', marginBottom: '0', marginTop: '30px' }}>
          Daftar Karyawan
        </h1>
        <ModalComponent
          title={'Tambah Karyawan Baru'}
          content={<ModalTambahKaryawan createkaryawan={setNewKaryawan} />}
          footer={(handleCancel) => (
            <div>
              <Button onClick={handleCancel}>Cancel</Button>
              <Button type="primary" onClick={tambahKaryawan}>Tambah</Button>
            </div>
          )}
        >
          <Button type="primary" icon={<PlusOutlined />} style={{ float: 'right' }}>
            Tambah Karyawan
          </Button>
        </ModalComponent>
      </Space>

      {apiResponse?.data?.result?.length > 0 ? (
        <Table
          columns={columnKaryawan}
          dataSource={apiResponse.data.result}
          pagination={{ position: ['bottomCenter'] }}
          style={{ marginLeft: '20px' }}
          className='custom-table'
          rowKey="id"
        />
      ) : (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <p>No data available</p>
        </div>
      )}
    </div>
  );
};

export default Page;
