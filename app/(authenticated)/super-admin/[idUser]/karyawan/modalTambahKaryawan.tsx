import React, { useState } from "react";
import { Input, Select } from "antd";
import { jobsRepository } from "#/repository/jobs"; // Sesuaikan dengan path repository Anda

interface ModalTambahKaryawanProps {
  createkaryawan: (karyawanData: { nik: string; nama: string; gender: string; email: string; username: string; job: string }) => void;
}

const ModalTambahKaryawan: React.FC<ModalTambahKaryawanProps> = ({ createkaryawan }) => {
  const [nik, setNik] = useState<string>(""); // State untuk Nik
  const [nama, setNama] = useState<string>(""); // State untuk Nama
  const [gender, setGender] = useState<string>(""); // State untuk Gender
  const [email, setEmail] = useState<string>(""); // State untuk Email
  const [username, setUsername] = useState<string>(""); // State untuk Username
  const [job, setJob] = useState<string>(""); // State untuk Job

  const handleSelectChange = (value: string) => {
    setJob(value);
    handleKaryawanDataChange();
};

  // Mengambil data dari API melalui hooks
  const { data: detailJob, error, isValidating: loading } = jobsRepository.hooks.useAllJobs();
 

  // Fungsi untuk mengirim data karyawan ke parent component saat ada perubahan
  const handleKaryawanDataChange = () => {
    createkaryawan({ nik, nama, gender, email, username, job });
    console.log(createkaryawan)
  };

  return (
    <div>
      {/* Input untuk Nik */}
      <label htmlFor="Nik">Nik :</label>
      <Input
        id="Nik"
        value={nik}
        onChange={(e) => {
          setNik(e.target.value);
          handleKaryawanDataChange();
        }}
        placeholder="Masukkan Nik"
        style={{ marginLeft: 59, width: 342 }}
      />

      <br />
      <br />

      {/* Input untuk Nama */}
      <label htmlFor="nama">Nama :</label>
      <Input
        id="nama"
        value={nama}
        onChange={(e) => {
          setNama(e.target.value);
          handleKaryawanDataChange();
        }}
        placeholder="Masukkan Nama"
        style={{ marginLeft: 46, width: 342 }}
      />

      <br />
      <br />

      {/* Input untuk Gender */}
      <label htmlFor="gender">Gender :</label>
      <Input
        id="gender"
        value={gender}
        onChange={(e) => {
          setGender(e.target.value);
          handleKaryawanDataChange();
        }}
        placeholder="Masukkan Gender"
        style={{ marginLeft: 42, width: 337 }}
      />

      <br />
      <br />

      {/* Input untuk Email */}
      <label htmlFor="email">Email :</label>
      <Input
        id="email"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          handleKaryawanDataChange();
        }}
        placeholder="Masukkan Email"
        style={{ marginLeft: 50, width: 339 }}
      />

      <br />
      <br />

      {/* Input untuk Username */}
      <label htmlFor="username">Username :</label>
      <Input
        id="username"
        value={username}
        onChange={(e) => {
          setUsername(e.target.value);
          handleKaryawanDataChange();
        }}
        placeholder="Masukkan Username"
        style={{ marginLeft: 20, width: 340 }}
      />

      <br />
      <br />

      {/* Input untuk Job */}
      <label htmlFor="job">Job :</label>

      {/* Jika loading tampilkan spinner */}
      {loading && <p>Loading jobs...</p>}

      {/* Jika ada error tampilkan pesan error */}
      {error && <p>Error loading jobs: {error.message}</p>}

      {/* Jika tidak error atau loading, tampilkan dropdown */}
      {!loading && !error && (
        <Select
          placeholder="Pilih Pekerjaan"
          style={{ width: 340, marginBottom: '16px', marginLeft: 60 }}
          onChange={
            handleSelectChange
          }
        >
          {detailJob?.data.map((jobItem: any) => (
            <Select.Option key={jobItem.job_id} value={jobItem.job_id}>
              {jobItem.job_nama_job}
            </Select.Option>
          ))}
        </Select>
      )}
    </div>
  );
};

export default ModalTambahKaryawan;
