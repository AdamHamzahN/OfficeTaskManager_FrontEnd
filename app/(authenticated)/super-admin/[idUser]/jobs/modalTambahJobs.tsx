import React, { useState } from "react";
import { Input } from "antd";

interface ModalTambahJobsProps {
  createjob: (jobData: { nama_job: string; deskripsi_job: string }) => void;
}

const ModalTambahJobs: React.FC<ModalTambahJobsProps> = ({ createjob }) => {
  const [nama_job, setJobName] = useState<string>(""); // State untuk nama job
  const [deskripsi_job, setJobDescription] = useState<string>(""); // State untuk deskripsi job

  // Fungsi untuk mengirim data job ke parent component saat ada perubahan
  const handleJobDataChange = () => {
    createjob({ nama_job, deskripsi_job });
  };

  return (
    <div>
      {/* Input untuk nama job */}
      <label htmlFor="jobName">Masukkan Nama Job Baru</label>
      <Input
        id="jobName"
        value={nama_job}
        onChange={(e) => {
          setJobName(e.target.value);
          handleJobDataChange();
        }}
        placeholder="Masukkan nama jobs baru"
        style={{ marginBottom: 10 }}
      />

      {/* Input untuk deskripsi job */}
      <label htmlFor="jobDescription">Masukkan Deskripsi Jobs</label>
      <Input
        id="jobDescription"
        value={deskripsi_job}
        onChange={(e) => {
          setJobDescription(e.target.value);
          handleJobDataChange();
        }}
        placeholder="Masukkan deskripsi jobs baru"
        style={{ marginBottom: 10 }}
      />
    </div>
  );
};

export default ModalTambahJobs;
