'use client';
import { Button, Input } from "antd";
import TextArea from "antd/es/input/TextArea";
import { SearchOutlined } from "@ant-design/icons";
import { projectRepository } from "#/repository/project";
import { config } from "#/config/app";

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

const ModalDetailTugas: React.FC<{ idTugas: string }> = ({ idTugas }) => {

    const { data: detailTugas, error, isValidating: loading } = projectRepository.hooks.useGetTugasById(idTugas);

    if (loading) {
        console.log('Loading data...');
        return <div>Loading...</div>; // Tampilkan loader atau message jika data sedang dimuat
    }

    if (error) {
        console.error('Error fetching data:', error);
        return <div>Error loading data</div>; // Tangani error jika ada
    }
    const fileDetailTugas = `${config.baseUrl}/${detailTugas.data.file_tugas.replace(/\\/g, '/')}`;
    return (
        <div style={{ borderTop: '2px ' }}>
            <label htmlFor="nama_tugas" style={{ marginBottom: '8px', display: 'block' }}>Nama Tugas</label>
            <Input value={detailTugas.data.nama_tugas} readOnly style={{ marginBottom: '16px' }} />

            <label htmlFor="nama_karyawan" style={{ marginBottom: '8px', display: 'block' }}>Nama Karyawan</label>
            <Input value={detailTugas.data.karyawan.user.nama} readOnly style={{ marginBottom: '16px' }} />

            <label htmlFor="deskripsi_tugas" style={{ marginBottom: '8px', display: 'block' }}>Deskripsi Tugas</label>
            <TextArea
                autoSize={{ minRows: 3, maxRows: 9 }}
                style={{
                    height: 120, resize: 'none',
                    marginBottom: '16px',
                    minWidth: 'auto'
                }}
                value={detailTugas.data.deskripsi_tugas}
                readOnly
            />

            <label htmlFor="bukti_pengerjaan" style={{ marginBottom: '8px', display: 'block' }}>Detail Tugas</label>
            <a href={fileDetailTugas} target="_blank" rel="noopener noreferrer">              
                <Button block style={{ textAlign: 'left', marginBottom: '16px' }}>
                    <SearchOutlined /> Lihat Detail
                </Button>
            </a>      
            {detailTugas.data.status === 'approved' && (
                <>
                    <label htmlFor="waktu_selesai_approved" style={{ marginBottom: '8px', display: 'block' }}>Waktu Selesai</label>
                    <Input id="waktu_selesai_approved" value={formatTimeStr(detailTugas.data.waktuSelesai)}  style={{ marginBottom: '16px' }} />

                    <label htmlFor="bukti_pengerjaan_approved" style={{ marginBottom: '8px', display: 'block' }}>Bukti Hasil Pengerjaan</label>
                    <Button block style={{ textAlign: 'left', marginBottom: '16px' }}>
                        <SearchOutlined /> Lihat Hasil
                    </Button>
                </>
            )}
        </div>
    );
};

export default ModalDetailTugas;
