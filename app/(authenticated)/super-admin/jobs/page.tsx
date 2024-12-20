"use client";
import React, { useEffect, useState } from 'react';
import { Space, Table, Alert, Spin, Button, Modal, message } from 'antd';
import { jobsRepository } from '#/repository/jobs';
import { EyeOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import ModalComponent from '#/component/ModalComponent';
import ModalDetailJobs from './modalDetailJobs';
import ModalEditJobs from './modalEditJobs';
import ModalTambahJobs from './modalTambahJobs';
import TableComponent from '#/component/TableComponent';
import { formatTimeStr } from '#/utils/formatTime';
import Container from '#/component/ContainerComponent';

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
      render: (record:any) => {
        const idJob = record.id;
        const nama_job = record.nama_job;
        const deskripsi_job = record.deskripsi_job;
        return (
          <div style={{ display: 'flex', gap: '2px' }}>
            <ModalComponent
              title={'Detail Job'}
              content={<ModalDetailJobs idJobs={idJob} />}
              footer={(handleCancel) => (
                <div>
                  <Button type="primary" onClick={handleCancel}>OK</Button>
                </div>
              )}
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
              footer={() => (
                <div>
                  <Button onClick={()=>setModalEditOpen(false)}>Cancel</Button>
                  <Button type="primary" onClick={handleEditJobs}>OK</Button>
                </div>
              )}
              visible={modalEditOpen && selectedJobId === idJob} 
              onCancel={()=>setModalEditOpen(false)}
            >
              <Button
                style={{ backgroundColor: 'rgba(254, 243, 232, 1)', color: '#EA7D2A', border: 'none' }}
                onClick={() => {
                  setSelectedJobId(idJob);
                  setEditsJob({ nama_job: nama_job, deskripsi_job: deskripsi_job });
                  setModalEditOpen(true);
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

  const [modalTambahOpen,setModalTambahOpen]= useState(false);
  const [modalEditOpen,setModalEditOpen]= useState(false);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(4);

  const { data ,isValidating:loading, mutate} = jobsRepository.hooks.useAllJobs(page, pageSize);

  const handlePageChange = (newPage: number, newPageSize: number) => {
    setPage(newPage);
    setPageSize(newPageSize);
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
      setNewJob({nama_job:'',deskripsi_job:''})
      setModalTambahOpen(false)
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
      setModalEditOpen(false);
    } catch (error) {
      console.error('Gagal mengedit Job:', error);
    }
  };

  return (
    <Container>
      <Space style={{ width: '100%', justifyContent: 'space-between' }}>
        <h1 style={{ fontSize: 30, paddingTop: 20, paddingBottom: 20 }}>
          Daftar Job
        </h1>

        <ModalComponent
          title={'Tambah Job Baru'}
          content={<ModalTambahJobs createjob={setNewJob} />}
          footer={(handleCancel) => (
            <div>
              <Button onClick={()=>setModalTambahOpen(false)}>Cancel</Button>
              <Button type="primary" onClick={tambahJob}>Tambah</Button>
            </div>
          )}
          visible={modalTambahOpen}
          onCancel={()=>setModalTambahOpen(false)}
        >
          <Button type="primary" onClick={()=>setModalTambahOpen(true)}>
            <PlusOutlined/>Tambah
          </Button>
        </ModalComponent>
      </Space>
      <TableComponent
        data={data?.data}
        columns={columnJobs}
        loading={loading}
        page={page}
        pageSize={pageSize}
        total={data?.count}
        pagination={true}
        className="w-full custom-table"
        onPageChange={handlePageChange}
      />
    </Container>
  );
};

export default Page;
