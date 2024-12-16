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
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {/* Input untuk Nik */}
      <div style={{ display: "flex", alignItems: "center" }}>
        <label htmlFor="Nip" style={{ width: "120px" }}>NIP :</label>
        <Input
          id="Nip"
          value={nik}
          onChange={(e) => { setNik(e.target.value)}}
          placeholder="Masukkan NIP Karyawan"
          type="number"
          style={{ flex: 1 }}
        />
      </div>

      {/* Input untuk Nama */}
      <div style={{ display: "flex", alignItems: "center" }}>
        <label htmlFor="nama" style={{ width: "120px" }}>Nama:</label>
        <Input
          id="nama"
          value={nama}
          onChange={(e) => setNama(e.target.value)}
          placeholder="Masukkan Nama"
          style={{ flex: 1 }}
        />
      </div>

      {/* Dropdown untuk Gender */}
      <div style={{ display: "flex", alignItems: "center" }}>
        <label htmlFor="gender" style={{ width: "120px" }}>Gender:</label>
        <Select
          placeholder="Pilih Gender"
          style={{ flex: 1 }}
          onChange={(value) => setGender(value)}
        >
          <Select.Option value="laki-laki">Laki-Laki</Select.Option>
          <Select.Option value="perempuan">Perempuan</Select.Option>
        </Select>
      </div>

      {/* Input untuk Email */}
      <div style={{ display: "flex", alignItems: "center" }}>
        <label htmlFor="email" style={{ width: "120px" }}>Email:</label>
        <Input
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Masukkan Email"
          style={{ flex: 1 }}
        />
      </div>

      {/* Input untuk Username */}
      <div style={{ display: "flex", alignItems: "center" }}>
        <label htmlFor="username" style={{ width: "120px" }}>Username:</label>
        <Input
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Masukkan Username"
          style={{ flex: 1 }}
        />
      </div>

      {/* Dropdown untuk Job */}
      <div style={{ display: "flex", alignItems: "center" }}>
        <label htmlFor="job" style={{ width: "120px" }}>Job:</label>

        {/* Jika loading tampilkan spinner */}
        {loading && <p>Loading jobs...</p>}

        {/* Jika ada error tampilkan pesan error */}
        {error && <p>Error loading jobs: {error.message}</p>}

        {/* Jika tidak error atau loading, tampilkan dropdown */}
        {!loading && !error && (
          <Select
            placeholder="Pilih Pekerjaan"
            style={{ flex: 1 }}
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
    </div>
  );
};

export default ModalTambahKaryawan;
