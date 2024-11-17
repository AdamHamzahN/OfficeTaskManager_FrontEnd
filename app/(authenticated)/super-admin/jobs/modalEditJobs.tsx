import React, { useState, useEffect } from "react";
import { Input } from "antd";

interface ModalEditJobsProps {
  editjob: (jobData: { nama_job: string; deskripsi_job: string }) => void;
  job:any
}

const ModalEditJobs: React.FC<ModalEditJobsProps> = ({ editjob ,job}) => {
  const [nama_job, setJobName] = useState<string>(job.nama_job); // State untuk nama job
  const [deskripsi_job, setJobDescription] = useState<string>(job.deskripsi_job); // State untuk deskripsi job

  // Mengirim data hanya saat ada perubahan pada state nama_job atau deskripsi_job
  useEffect(() => {
    editjob({ nama_job, deskripsi_job });
  }, [nama_job, deskripsi_job, editjob]);

  return (
    <div>
      {/* Input untuk nama jobs */}
      <label htmlFor="jobName">Masukkan Nama Jobs Baru</label>
      <Input
        id="jobName"
        value={nama_job}
        onChange={(e) => setJobName(e.target.value)}
        placeholder="Masukkan nama jobs baru"
        style={{ marginBottom: 10 }}
      />

      {/* Input untuk deskripsi job */}
      <label htmlFor="jobDescription">Masukkan Deskripsi Jobs</label>
      <Input.TextArea
        id="jobDescription"
        value={deskripsi_job}
        onChange={(e) => setJobDescription(e.target.value)}
        placeholder="Masukkan deskripsi jobs baru"
        style={{ marginBottom: 10 }}
      />
    </div>
  );
};

export default ModalEditJobs;
