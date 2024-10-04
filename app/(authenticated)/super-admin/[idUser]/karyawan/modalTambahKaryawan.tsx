import React, { useState } from "react";
import { Input } from "antd";

interface ModalTambahKaryawanProps {
  createkaryawan: (karyawanData: { nik: string; user: string, gender: string, email: string, username: string, job: string }) => void;
}

const ModalTambahKaryawan: React.FC<ModalTambahKaryawanProps> = ({ createkaryawan }) => {
  const [nik, setNik] = useState<string>(""); // State untuk Nik
  const [user, setNama] = useState<string>(""); // State untuk Nama
  const [gender, setGender] = useState<string>("")// State untuk Gender
  const [email, setEmail] = useState<string>("")// State untuk Email
  const [username, setUsername] = useState<string>("")// State untuk Username
  const [job, setJob] = useState<string>("")// State untuk Job

  // Fungsi untuk mengirim data job ke parent component saat ada perubahan
  const handleKaryawanDataChange = () => {
    createkaryawan({ nik, user, gender, email, username, job });
  };

  return (
    <div>
      {/* Input untuk Nik */}
      <label htmlFor="Nik">Masukkan Nik</label>
      <Input
        id="Nik"
        value={nik}
        onChange={(e) => {
          setNik(e.target.value);
          handleKaryawanDataChange();
        }}
        placeholder="Masukkan Nik"
        style={{ marginBottom: 10 }}
      />

      {/* Input untuk Nama */}
      <label htmlFor="nama">Masukkan Nama</label>
      <Input
        id="nama"
        value={user}
        onChange={(e) => {
          setNama(e.target.value);
          handleKaryawanDataChange();
        }}
        placeholder="Masukkan Nama"
        style={{ marginBottom: 10 }}
      />

       {/* Input untuk gender */}
       <label htmlFor="gender">Masukkan Gender</label>
      <Input
        id="gender"
        value={gender}
        onChange={(e) => {
          setGender(e.target.value);
          handleKaryawanDataChange();
        }}
        placeholder="Masukkan Gender"
        style={{ marginBottom: 10 }}
      />

      {/* Input untuk email */}
      <label htmlFor="email">Masukkan Email</label>
      <Input
        id="email"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          handleKaryawanDataChange();
        }}
        placeholder="Masukkan Email"
        style={{ marginBottom: 10 }}
      />

      {/* Input untuk username */}
      <label htmlFor="username">Masukkan Username</label>
      <Input
        id="username"
        value={username}
        onChange={(e) => {
          setUsername(e.target.value);
          handleKaryawanDataChange();
        }}
        placeholder="Masukkan Username"
        style={{ marginBottom: 10 }}
      />

        {/* Input untuk job */}
       <label htmlFor="job">Masukkan Job</label>
      <Input
        id="job"
        value={job}
        onChange={(e) => {
          setJob(e.target.value);
          handleKaryawanDataChange();
        }}
        placeholder="Masukkan Jobs"
        style={{ marginBottom: 10 }}
      />
    </div>
  );
};

export default ModalTambahKaryawan;
