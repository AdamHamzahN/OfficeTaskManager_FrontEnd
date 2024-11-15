"use client";
import { Button, Input } from "antd";
import TextArea from "antd/es/input/TextArea";
import { karyawanRepository } from "#/repository/karyawan";
import { useEffect } from "react";

const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    console.log('Change:', e.target.value);
};

const ModalDetailKaryawan: React.FC<{ idKaryawan: string }> = ({ idKaryawan }) => {

    // Hook untuk mengambil data karyawan berdasarkan ID
    const { data: detailKaryawan, error, isValidating: loading } = karyawanRepository.hooks.useGetKaryawanById(idKaryawan);

    // Logging the ID and response data for debugging
    useEffect(() => {
        console.log('Fetching data for ID:', idKaryawan);
        console.log('Karyawan Data Full Response:', detailKaryawan);
        if (error) {
            console.error('Error fetching data:', error);
        }
    }, [idKaryawan, detailKaryawan, error]);

    // Cek apakah ID Karyawan valid
    if (!idKaryawan) {
        return <div>ID Karyawan tidak tersedia</div>; // Jika ID tidak ada
    }

    // Jika data masih dimuat
    if (loading) {
        console.log('Loading data...');
        return <div>Loading...</div>; // Loader saat data sedang dimuat
    }

    // Jika terjadi error saat mengambil data
    if (error) {
        console.error('Error fetching data:', error);
        return <div>Error loading data: {error.message}</div>; // Tampilkan error yang lebih rinci
    }

    // Pastikan data ada dan memiliki struktur yang benar sebelum diakses
    if (!detailKaryawan || !detailKaryawan.data) {
        return <div>No data available</div>;
    }

    // Ambil data karyawan dari response
    const karyawanData = detailKaryawan.data;

    console.log('p',karyawanData)
    return (
        <div>
            {/* NIK */}
            <label htmlFor="nik" style={{ marginBottom: '8px', display: 'block' }}>NIK</label>
            <Input value={karyawanData?.nik} readOnly style={{ marginBottom: '16px' }} />

            {/* Nama Karyawan */}
            <label htmlFor="nama_karyawan" style={{ marginBottom: '8px', display: 'block' }}>Nama Karyawan</label>
            <Input value={karyawanData?.user.nama} readOnly style={{ marginBottom: '16px' }} />

            {/* Alamat */}
            <label htmlFor="alamat" style={{ marginBottom: '8px', display: 'block' }}>Alamat</label>
            <TextArea
                value={karyawanData?.alamat || 'kosong'}
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
            <Input value={karyawanData?.gender} readOnly style={{ marginBottom: '16px' }} />

            {/* Status */}
            <label htmlFor="status" style={{ marginBottom: '8px', display: 'block' }}>Status</label>
            <Input value={karyawanData?.status_project} readOnly style={{ marginBottom: '16px' }} />

            {/* Email */}
            <label htmlFor="email" style={{ marginBottom: '8px', display: 'block' }}>Email</label>
            <Input value={karyawanData?.user.email} readOnly style={{ marginBottom: '16px' }} />

            {/* Job */}
            <label htmlFor="job" style={{ marginBottom: '8px', display: 'block' }}>Job</label>
            <Input value={karyawanData?.job.nama_job} readOnly style={{ marginBottom: '16px' }} />
        </div>
    );
};

export default ModalDetailKaryawan;
