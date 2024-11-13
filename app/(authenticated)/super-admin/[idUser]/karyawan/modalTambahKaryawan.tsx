import React, { useState, useEffect } from "react";
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

  // Mengambil data dari API melalui hooks
  const { data: detailJob, error, isValidating: loading } = jobsRepository.hooks.useJobs();

  // useEffect untuk mengirim data karyawan ke parent component saat ada perubahan pada salah satu field
  useEffect(() => {
    createkaryawan({ nik, nama, gender, email, username, job });
  }, [nik, nama, gender, email, username, job]);

  return (
    <div>
      {/* Input untuk Nik */}
      <label htmlFor="Nik">Nik :</label>
      <Input
        id="Nik"
        value={nik}
        onChange={(e) => setNik(e.target.value)}
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
        onChange={(e) => setNama(e.target.value)}
        placeholder="Masukkan Nama"
        style={{ marginLeft: 46, width: 342 }}
      />

      <br />
      <br />

      {/* Dropdown untuk Gender */}
      <label htmlFor="gender">Gender :</label>
      <Select
        placeholder="Pilih Gender"
        style={{ width: 337, marginLeft: 42 }}
        onChange={(value) => setGender(value)}
      >
        <Select.Option value="laki-laki">Laki-Laki</Select.Option>
        <Select.Option value="perempuan">Perempuan</Select.Option>
      </Select>

      <br />
      <br />

      {/* Input untuk Email */}
      <label htmlFor="email">Email :</label>
      <Input
        id="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
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
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Masukkan Username"
        style={{ marginLeft: 22, width: 335 }}
      />

      <br />
      <br />

      {/* Dropdown untuk Job */}
      <label htmlFor="job">Jobs :</label>

      {/* Jika loading tampilkan spinner */}
      {loading && <p>Loading jobs...</p>}

      {/* Jika ada error tampilkan pesan error */}
      {error && <p>Error loading jobs: {error.message}</p>}

      {/* Jika tidak error atau loading, tampilkan dropdown */}
      {!loading && !error && (
        <Select
          placeholder="Pilih Pekerjaan"
          style={{ width: 330, marginBottom: '16px', marginLeft: 63 }}
          onChange={(value) => setJob(value)}
        >
          {detailJob?.data.map((jobItem: any) => (
            <Select.Option key={jobItem.id} value={jobItem.id}>
              {jobItem.nama_job}
            </Select.Option>
          ))}
        </Select>
      )}
    </div>
  );
};

export default ModalTambahKaryawan;
