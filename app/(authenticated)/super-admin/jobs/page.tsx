"use client";
import React, { useState } from 'react';
import { Space, Table, Tag, Alert, Spin, Button, Modal, Form, Input } from 'antd';
import type { TableProps } from 'antd';
import { EyeOutlined } from "@ant-design/icons";
import { jobsRepository } from '#/repository/jobs'; // Ganti dengan jalur yang sesuai jika berbeda
import DetailTugas from '../../team-lead/[idUser]/project/[idProject]/detail-project/detailTugas';
import ModalComponent from '#/component/modal';

const formatTimeStr = (dateStr: string) => {
  const date = new Date(dateStr);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Bulan dimulai dari 0
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

const columnJobs: TableProps<DataType>['columns'] = [
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
    dataIndex: 'aksi',
    render:()=>{
            return (
              <div>
              <ModalComponent title={'Detail Tugas'} content={
                  <DetailTugas/>
              }/>
              <Button style={{backgroundColor:'rgba(244, 247, 254, 1)',color:'#1890FF',border:'none'}}><EyeOutlined/>detail</Button>
          </div>
          );
        }
  },
];

const Page: React.FC = () => {
  // State untuk modal
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const { data: apiResponse, error: updateError, isValidating: updateValidating } = jobsRepository.hooks.useAllJobs();

  if (updateValidating) {
    return <Spin style={{ textAlign: 'center', padding: '20px' }} />;
  }

  if (updateError) {
    return <Alert message="Error fetching data" type="error" />;
  }

  // Pastikan apiResponse memiliki field 'data' dan data adalah array
  const data: DataType[] = apiResponse && apiResponse.data ? apiResponse.data.map((job: JobData) => ({
    key: job.job_id, // Gunakan job_id sebagai key
    job_nama_job: job.job_nama_job,
    jumlah_karyawan: job.jumlah_karyawan,
    job_created_at: job.job_created_at,
    aksi: ['edit', 'delete', 'view'], // Atur aksi jika ada
  })) : [];

  // Fungsi untuk membuka modal
  const showModal = () => {
    setIsModalVisible(true);
  };

  // Fungsi untuk menutup modal
  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields(); // Reset form ketika modal ditutup
  };

  // Fungsi ketika form disubmit
  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        console.log('Form Values:', values);
        // Tambahkan logika untuk menyimpan data baru
        setIsModalVisible(false); // Tutup modal setelah submit
        form.resetFields(); // Reset form setelah submit
      })
      .catch((info) => {
        console.log('Validate Failed:', info);
      });
  };

  return (
    <div
      style={{
        padding: 24,
        minHeight: '100vh',
        backgroundColor: '#fff',
        borderRadius: 15,
      }}
    >
      <Space style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: '10px' }}>
        <h1 style={{ fontSize: '36px', fontFamily: 'Roboto, sans-serif', marginBottom: 0 }}>
          Daftar Job
        </h1>
        <Button type="primary" size="large" onClick={showModal}>
          + Tambah
        </Button>
      </Space>
      {data.length > 0 ? (
        <Table
          columns={columnJobs}
          dataSource={data}
          pagination={{ position: ['bottomCenter'] }}
          style={{ margin: 0, padding: 0 }}
        />
      ) : (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <p>No data available</p>
        </div>
      )}

      {/* Modal untuk menambah job */}
      <Modal
        title="Tambah Job Baru"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Simpan"
        cancelText="Batal"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="job_nama_job"
            label="Nama Job:"
            rules={[{ required: true, message: 'Nama job harus diisi' }]}
          >
            <Input placeholder="Masukkan nama job" />
          </Form.Item>
          <Form.Item
            name="job_deskripsi_job"
            label="Deskripsi Job:"
            rules={[{ required: true, message: 'Deskripsi job harus diisi' }]}
          >
            <Input placeholder="Masukkan deskripsi job" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Page;
