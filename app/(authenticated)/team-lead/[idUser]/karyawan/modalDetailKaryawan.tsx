"use client";
import { Button, Input } from "antd";
import TextArea from "antd/es/input/TextArea";
import { karyawanRepository } from "#/repository/karyawan";
import { useEffect } from "react";

const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    console.log('Change:', e.target.value);
};

const ModalDetailJobs: React.FC<{ idKaryawan: string }> = ({ idKaryawan }) => {
    const { data: detailKaryawan, error, isValidating: loading, mutate } = karyawanRepository.hooks.useGetKaryawanById(idKaryawan);

    // Logging the ID and response data for debugging
    useEffect(() => {
        console.log('Fetching data for ID:', idKaryawan);
        console.log('Karyawan Data:', detailKaryawan);
        if (error) {
            console.error('Error fetching data:', error);
        }
    }, [idKaryawan, detailKaryawan, error]);

    if (!idKaryawan) {
        return <div>ID Karyawan tidak tersedia</div>; // Jika ID tidak ada
    }

    if (loading) {
        console.log('Loading data...');
        return <div>Loading...</div>; // Loader saat data sedang dimuat
    }

    if (error) {
        console.error('Error fetching data:', error);
        return <div>Error loading data: {error.message}</div>; // Tampilkan error yang lebih rinci
    }

    // Pastikan data ada dan memiliki struktur yang benar sebelum diakses
    if (!detailKaryawan || !detailKaryawan.data) {
        return <div>No data available</div>;
    }

    const karyawanData = detailKaryawan.data;

    return (
        <div style={{ borderTop: '2px solid #ddd', paddingTop: '16px' }}>
            {/* NIK */}
            <label htmlFor="nik" style={{ marginBottom: '8px', display: 'block' }}>NIK</label>
            <Input value={karyawanData.nik || 'N/A'} readOnly style={{ marginBottom: '16px' }} />

            {/* Nama Karyawan */}
            <label htmlFor="nama_karyawan" style={{ marginBottom: '8px', display: 'block' }}>Nama Karyawan</label>
            <Input value={karyawanData.results?.user?.nama || 'N/A'} readOnly style={{ marginBottom: '16px' }} />

            {/* Alamat */}
            <label htmlFor="alamat" style={{ marginBottom: '8px', display: 'block' }}>Alamat</label>
            <TextArea
                value={karyawanData.alamat || 'N/A'}
                readOnly
                autoSize={{ minRows: 3, maxRows: 9 }}
                style={{
                    height: 120, resize: 'none',
                    marginBottom: '16px',
                    minWidth: 'auto'
                }}
            />

            {/* Gender */}
            <label htmlFor="gender" style={{ marginBottom: '8px', display: 'block' }}>Gender</label>
            <Input value={karyawanData.gender || 'N/A'} readOnly style={{ marginBottom: '16px' }} />

            {/* Status */}
            <label htmlFor="status" style={{ marginBottom: '8px', display: 'block' }}>Status</label>
            <Input value={karyawanData.status_project || 'N/A'} readOnly style={{ marginBottom: '16px' }} />

            {/* Email */}
            <label htmlFor="email" style={{ marginBottom: '8px', display: 'block' }}>Email</label>
            <Input value={karyawanData.result?.user?.email || 'N/A'} readOnly style={{ marginBottom: '16px' }} />

            {/* Job */}
            <label htmlFor="job" style={{ marginBottom: '8px', display: 'block' }}>Job</label>
            <Input value={karyawanData.nama_job || 'N/A'} readOnly style={{ marginBottom: '16px' }} />
        </div>
    );
};

export default ModalDetailJobs;
