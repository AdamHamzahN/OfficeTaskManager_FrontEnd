"use client";
import React, { useState } from 'react';
import { Space, Table, Tag, Alert, Spin, Button, Modal } from 'antd';
import { jobsRepository } from '#/repository/jobs'; // Ganti dengan jalur yang sesuai jika berbeda
import { EyeOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import ModalComponent from '#/component/ModalComponent';
import ModalDetailJobs from './modalDetailJobs';
import ModalEditJobs from './modalEditJobs';
import ModalTambahJobs from './modalTambahJobs';

const formatTimeStr = (dateStr: string) => {
  const date = new Date(dateStr);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  
  return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
};

// Definisikan tipe untuk objek job yang diterima dari API
interface JobData {
  job_id: string;
  job_nama_job: string;
  jumlah_karyawan: string;
  job_created_at: string;
  job_updated_at: string;
  job_deleted_at: string | null;
  aksi: string[];
}

// Perbarui DataType untuk mencocokkan data yang diterima
interface DataType {
  key: string;
  job_nama_job: string;
  jumlah_karyawan: string;
  job_created_at: string;
  aksi: string[];
}

const Page: React.FC = () => {
  const [newJob, setNewJob] = useState<{ nama_job: string; deskripsi_job: string }>({
    nama_job: '',
    deskripsi_job: '',
  });

  const [editJob, setEditJob] = useState<{ nama_job: string; deskripsi_job: string }>({
    nama_job: '',
    deskripsi_job: '',
  });

  // Tambahkan state untuk menyimpan idJob
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);

  const columnJobs = [
    {
      title: 'Nama Jobs',
      dataIndex: 'job_nama_job',
      key: 'job_nama_job',
    },
    {
      title: 'Jumlah Karyawan',
      dataIndex: 'jumlah_karyawan',
      key: 'jumlah_karyawan',
    },
    {
      title: 'Tanggal Di Tambahkan',
      dataIndex: 'job_created_at',
      key: 'job_created_at',
      render: (text: string) => formatTimeStr(text),
    },
    {
      title: 'Aksi',
      key: 'aksi',
      render: (record: any) => {
        const idJob = record.job_id;
        return (
          <div>
            <ModalComponent 
              title={'Detail Jobs'} 
              content={<ModalDetailJobs idJobs={idJob} />}
              footer={(handleCancel, handleOk) => (
                <div>
                  <Button onClick={handleCancel}>Cancel</Button>
                  <Button type="primary" onClick={handleOk}>Ok</Button>
                </div>
              )}
              onOk={() => console.log('Ok clicked')}
              onCancel={() => console.log('Cancel clicked')}
            >
              <Button
                style={{ backgroundColor: 'rgba(244, 247, 254, 1)', color: '#1890FF', border: 'none' }}
                onClick={() => setSelectedJobId(idJob)} // Set idJob saat klik
              >
                <EyeOutlined /> Detail
              </Button>
            </ModalComponent>
  
            <ModalComponent 
              title={'Edit Jobs'} 
              content={<ModalEditJobs editjob={idJob} />}
              footer={(handleCancel, editJobs) => (
                <div>
                  <Button onClick={handleCancel}>Cancel</Button>
                  <Button type="primary" onClick={editJobs}>Ok</Button>
                </div>
              )}
              onOk={() => console.log('Ok clicked')}
              onCancel={() => console.log('Cancel clicked')}
            >
              <Button
                style={{ backgroundColor: 'rgba(254, 243, 232, 1)', color: '#EA7D2A', border: 'none' }}
                onClick={() => setSelectedJobId(idJob)} // Set idJob saat klik
              >
                <EditOutlined /> Edit
              </Button>
            </ModalComponent>
          </div>
        );
      },
    },
  ];

  const { data: apiResponse, error: updateError, isValidating: updateValidating } = jobsRepository.hooks.useAllJobs();

  const tambahJob = async () => {
    if (!newJob) {
      alert('Pilih Karyawan Terlebih Dahulu');
      return;
    }
    try {
      await jobsRepository.api.tambahJobs({ newJob });
      Modal.success({
        title: 'Anggota Ditambahkan',
        content: 'Berhasil menambahkan anggota ke dalam tim!',
        okText: 'OK',
        cancelText: 'Tutup',
        onOk() {
          console.log('OK clicked');
        },
        onCancel() {
          console.log('Cancel clicked');
        },
      });
    } catch (error) {
      console.error('Gagal menambahkan anggota:', error);
    }
  };

  if (updateValidating) {
    return <Spin style={{ textAlign: 'center', padding: '20px' }} />;
  }

  if (updateError) {
    return <Alert message="Error fetching data" type="error" />;
  }
  const editJobs = async () => {
    if (!newJob) {
      alert('Pilih Karyawan Terlebih Dahulu');
      return;
    }
    try {
      //await jobsRepository.api.editJobById({ newJob });
      Modal.success({
        title: 'Anggota Ditambahkan',
        content: 'Berhasil menambahkan anggota ke dalam tim!',
        okText: 'OK',
        cancelText: 'Tutup',
        onOk() {
          console.log('OK clicked');
        },
        onCancel() {
          console.log('Cancel clicked');
        },
      });
    } catch (error) {
      console.error('Gagal menambahkan anggota:', error);
    }
  };

  if (updateValidating) {
    return <Spin style={{ textAlign: 'center', padding: '20px' }} />;
  }

  if (updateError) {
    return <Alert message="Error fetching data" type="error" />;
  }
  

  return (
    <div style={{ padding: 24, minHeight: '100vh', backgroundColor: '#fff', borderRadius: 15 }}>
      <Space style={{ width: '100%', justifyContent: 'space-between', marginBottom: '10px' }}>
        <h1 style={{ fontSize: '36px', fontFamily: 'Roboto, sans-serif', marginTop: '30px', marginBottom: '0' }}>
          Daftar Job
        </h1>
        
        {/* Button "Tambah Job" */}
        <ModalComponent
          title={'Tambah Job Baru'}
          content={<ModalTambahJobs createjob={setNewJob} />}
          footer={(handleCancel, editJobs) => (
            <div>
              <Button onClick={handleCancel}>Cancel</Button>
              <Button type="primary" onClick={tambahJob}>Tambah</Button>
            </div>
          )}
        >
          <Button type="primary" icon={<PlusOutlined />} style={{ float: 'right' }}>
            Tambah Job
          </Button>
        </ModalComponent>
      </Space>

      {/* Tabel data */}
      {apiResponse?.data?.length > 0 ? (
        <Table
          columns={columnJobs}
          dataSource={apiResponse.data}
          pagination={{ position: ['bottomCenter'] }}
          style={{ marginLeft: '20px' }}
          className="custom-table"
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
