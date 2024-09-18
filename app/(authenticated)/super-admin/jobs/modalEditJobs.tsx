"use client";
import { Button, Input } from "antd";
import TextArea from "antd/es/input/TextArea";
import { jobsRepository } from "#/repository/jobs";

const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    console.log('Change:', e.target.value);
};

const ModalEditJobs: React.FC<{idJobs: string}> = ({idJobs}) => {

    const { data: detailJob, error, isValidating: loading } = jobsRepository.hooks.useEditJobById(idJobs);

    if (loading) {
        console.log('Loading data...');
        return <div>Loading...</div>; // Tampilkan loader atau message jika data sedang dimuat
    }

    if (error) {
        console.error('Error fetching data:', error);
        return <div>Error loading data</div>; // Tangani error jika ada
    }

    //
    console.log('data:', detailJob.data.status)
    return (
        <div style={{ borderTop: '2px ' }}>
            <label htmlFor="nama_job" style={{ marginBottom: '8px', display: 'block' }}>Nama Job</label>
            <Input value={detailJob.data.nama_job} readOnly style={{ marginBottom: '16px' }} />

            <label htmlFor="deskripsi_job" style={{ marginBottom: '8px', display: 'block' }}>Deskripsi Job</label>
            <TextArea
                onChange={onChange}
                autoSize={{ minRows: 3, maxRows: 9 }}
                style={{
                    height: 120, resize: 'none',
                    marginBottom: '16px',
                    minWidth: 'auto'
                }}
                value={detailJob.data.deskripsi_job}
                readOnly
            />
            <label htmlFor="jumlah_karyawan" style={{ marginBottom: '8px', display: 'block' }}>Jumlah Karyawan</label>
            <Input value={detailJob.jumlah_karyawan} readOnly style={{ marginBottom: '16px' }} />

`            <label htmlFor="created_at" style={{ marginBottom: '8px', display: 'block' }}>Di Tambahkan Pada</label>
            <Input value={detailJob.data.created_at} readOnly style={{ marginBottom: '16px' }}  />
            
            <label htmlFor="updated_at" style={{ marginBottom: '8px', display: 'block' }}>Terakhir Di Update</label>
            <Input value={detailJob.data.updated_at} readOnly style={{ marginBottom: '16px' }}  />
        </div>
    );
};

export default ModalEditJobs;
