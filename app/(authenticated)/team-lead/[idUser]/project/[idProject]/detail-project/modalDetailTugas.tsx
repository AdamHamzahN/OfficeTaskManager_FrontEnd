'use client';
import { Button, Input } from "antd";
import TextArea from "antd/es/input/TextArea";
import { SearchOutlined } from "@ant-design/icons";
import { projectRepository } from "#/repository/project";

const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    console.log('Change:', e.target.value);
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

    // console.log('Data:', detailTugas.data.nama_tugas);
    console.log('data:', detailTugas.data.status)
    return (
        <div style={{ borderTop: '2px ' }}>
            <label htmlFor="nama_tugas" style={{ marginBottom: '8px', display: 'block' }}>Nama Tugas</label>
            <Input value={detailTugas.data.nama_tugas} readOnly style={{ marginBottom: '16px' }} />

            <label htmlFor="nama_karyawan" style={{ marginBottom: '8px', display: 'block' }}>Nama Karyawan</label>
            <Input value={detailTugas.data.karyawan.user.nama} readOnly style={{ marginBottom: '16px' }} />

            <label htmlFor="deskripsi_tugas" style={{ marginBottom: '8px', display: 'block' }}>Deskripsi Tugas</label>
            <TextArea
                onChange={onChange}
                autoSize={{ minRows: 3, maxRows: 9 }}
                style={{
                    height: 120, resize: 'none',
                    marginBottom: '16px',
                    minWidth: 'auto'
                }}
                value={detailTugas.data.deskripsi_tugas}
                readOnly
            />
            {detailTugas.data.status === 'approved' && (
                <>
                    <label htmlFor="waktu_selesai" style={{ marginBottom: '8px', display: 'block' }}>Waktu Selesai</label>
                    <Input id="waktu_selesai" value={detailTugas.data.waktuSelesai || '2024-02-02'} style={{ marginBottom: '16px' }} />

                    <label htmlFor="bukti_pengerjaan" style={{ marginBottom: '8px', display: 'block' }}>Bukti Hasil Pengerjaan</label>
                    <Button block style={{ textAlign: 'left', marginBottom: '16px' }}>
                        <SearchOutlined /> Default
                    </Button>
                </>
            )}
            <label htmlFor="waktu_selesai" style={{ marginBottom: '8px', display: 'block' }}>Waktu Selesai</label>
            <Input value="2024-02-02" style={{ marginBottom: '16px' }} />

            <label htmlFor="bukti_pengerjaan" style={{ marginBottom: '8px', display: 'block' }}>Bukti Hasil Pengerjaan</label>
            <Button block style={{ textAlign: 'left', marginBottom: '16px' }}>
                <SearchOutlined /> Default
            </Button>
        </div>
    );
};

export default ModalDetailTugas;
