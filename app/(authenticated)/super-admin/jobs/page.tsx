"use client";
import React, { useState } from 'react';
import { Space, Table, Alert, Spin, Button, Modal, message } from 'antd';
import { jobsRepository } from '#/repository/jobs';
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

interface JobData {
  id: string;
  nama_job: string;
  jumlah_karyawan: string;
  deskripsi_job: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}


const Page: React.FC = () => {
  /**
   * struktur table job
   */
  const columnJobs = [
    {
      title: 'Nama Jobs',
      dataIndex: 'nama_job',
      key: 'nama_job',
    },
    {
      title: 'Jumlah Karyawan',
      dataIndex: 'jumlah_karyawan',
      key: 'jumlah_karyawan',
    },
    {
      title: 'Tanggal Di Tambahkan',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (text: string) => formatTimeStr(text),
    },
    {
      title: 'Aksi',
      key: 'aksi',
      render: (record: JobData) => {
        const idJob = record.id;
        const nama_job = record.nama_job;
        const deskripsi_job = record.deskripsi_job;
        return (
          <div style={{display:'flex',gap:'2px'}}>
            <ModalComponent
              title={'Detail Job'}
              content={<ModalDetailJobs idJobs={idJob} />}
              footer={(handleCancel) => (
                <div>
                  <Button type="primary" onClick={handleCancel}>OK</Button>
                </div>
              )}
              onCancel={() => console.log('Cancel clicked')}
            >
              <Button
                style={{ backgroundColor: 'rgba(244, 247, 254, 1)', color: '#1890FF', border: 'none' }}
                onClick={() => setSelectedJobId(idJob)}
              >
                <EyeOutlined /> Detail
              </Button>
            </ModalComponent>

            <ModalComponent
              title={'Edit Jobs'}
              content={<ModalEditJobs editjob={setEditsJob} job={editsJob} />}
              footer={(handleCancel) => (
                <div>
                  <Button onClick={handleCancel}>Cancel</Button>
                  <Button type="primary" onClick={handleEditJobs}>OK</Button>
                </div>
              )}
              onCancel={() => console.log('Cancel clicked')}
            >
              <Button
                style={{ backgroundColor: 'rgba(254, 243, 232, 1)', color: '#EA7D2A', border: 'none' }}
                onClick={() => {
                  setSelectedJobId(idJob);
                  setEditsJob({ nama_job: nama_job, deskripsi_job: deskripsi_job }); // Mengisi data edit
                }}
              >
                <EditOutlined /> Edit
              </Button>
            </ModalComponent>
          </div>
        );
      },
    },
  ];

  const [newJob, setNewJob] = useState<{ nama_job: string; deskripsi_job: string }>({
    nama_job: '',
    deskripsi_job: '',
  });

  const [editsJob, setEditsJob] = useState<{ nama_job: string; deskripsi_job: string }>({
    nama_job: '',
    deskripsi_job: '',
  });

  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);

  const [pageTugas, setPageTugas] = useState(1);
  const [pageSizeTugas, setPageSizeTugas] = useState(10);
  const { data: apiResponse, error: updateError, isValidating: updateValidating, mutate } = jobsRepository.hooks.useAllJobs(pageTugas, pageSizeTugas);

  const handlePageChangeTugas = (newPage: number, newPageSize: number) => {
    setPageTugas(newPage);
    setPageSizeTugas(newPageSize);
  };

  const tambahJob = async () => {
    if (!newJob.nama_job || !newJob.deskripsi_job) {
      message.warning('Lengkapi data Job Terlebih Dahulu');
      return;
    }
    try {
      await jobsRepository.api.tambahJobs({ newJob });
      Modal.success({
        title: 'Job Ditambahkan',
        content: 'Berhasil menambahkan Job baru!',
      });
      mutate()
      // setIsModalOpen(false); // Close the modal on success
    } catch (error) {
      console.error('Gagal menambahkan Job:', error);
    }
  };

  const handleEditJobs = async () => {
    console.log("handleEditJobs called", { selectedJobId, editsJob });
    if (!selectedJobId || !editsJob.nama_job || !editsJob.deskripsi_job) {
      message.warning('Data tidak boleh kosong');
      return;
    }
    try {
      await jobsRepository.api.editJobById(selectedJobId || '', { editsJob });
      Modal.success({
        title: 'Job Diedit',
        content: 'Berhasil mengedit Job!',
      });
      mutate()
      // setIsModalOpen(false); // Close the modal on success
    } catch (error) {
      console.error('Gagal mengedit Job:', error);
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
      <Space style={{ width: '100%', justifyContent: 'space-between' }}>
        <h1 style={{ fontSize: 30, paddingTop: 20, paddingBottom: 20}}>
          Daftar Job
        </h1>

        <ModalComponent
          title={'Tambah Job Baru'}
          content={<ModalTambahJobs createjob={setNewJob} />}
          footer={(handleCancel) => (
            <div>
              <Button onClick={handleCancel}>Cancel</Button>
              <Button type="primary" onClick={tambahJob}>Tambah</Button>
            </div>
          )}
        >
          <Button type="primary">
            <PlusOutlined />Tambah
          </Button>
        </ModalComponent>
      </Space>
      <Table
        columns={columnJobs}
        dataSource={apiResponse.data}
        pagination={{
          current: pageTugas,
          pageSize: pageSizeTugas,
          total: apiResponse.count,
          position: ['bottomCenter'],
          onChange: (pageTugas, pageSizeTugas) => {
            handlePageChangeTugas(pageTugas, pageSizeTugas)
          },
        }}
        className="custom-table"
      />
    </div>
  );
};

export default Page;
