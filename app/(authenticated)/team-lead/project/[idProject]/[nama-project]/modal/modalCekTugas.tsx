import { Button, Input } from "antd";
import TextArea from "antd/es/input/TextArea";
import { SearchOutlined } from "@ant-design/icons";
import { projectRepository } from "#/repository/project";
import { config } from "#/config/app";
import { tugasRepository } from "#/repository/tugas";

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

const ModalCekTugas:React.FC<{
    idTugas:string
}> = ({idTugas}) => {
    /**
     * Hook detail tugas
     */
    const { data: detailTugas, error, isValidating: loading } = tugasRepository.hooks.useGetTugasById(idTugas);
    if (loading) {
        console.log('Loading data...');
        return <div>Loading...</div>; 
    }

    if (error) {
        console.error('Error fetching data:', error);
        return <div>Error loading data</div>; 
    }
    /**
     * alias untuk url file hasil tugas
     */
    const fileHasilTugas = `${config.baseUrl}/${detailTugas.data.file_bukti.replace(/\\/g, '/')}`;
    return (
        <div>
            <label htmlFor="nama_tugas" style={{ marginBottom: '8px', display: 'block' }}>Nama Tugas</label>
            <Input value={detailTugas.data.nama_tugas} readOnly style={{ marginBottom: '16px' }} />

            <label htmlFor="nama_karyawan" style={{ marginBottom: '8px', display: 'block' }}>Nama Karyawan</label>
            <Input value={detailTugas.data.nama_tugas} readOnly style={{ marginBottom: '16px' }} />

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

            <label htmlFor="waktu_selesai" style={{ marginBottom: '8px', display: 'block' }}>Waktu Selesai</label>
            <Input value={formatTimeStr(detailTugas.data.updated_at)} style={{ marginBottom: '16px' }} />

            <label htmlFor="bukti_pengerjaan" style={{ marginBottom: '8px', display: 'block' }}>Bukti Hasil Pengerjaan</label>
            <a href={fileHasilTugas} target="_blank" rel="noopener noreferrer">              
                <Button block style={{ textAlign: 'left', marginBottom: '16px' }}>
                    <SearchOutlined /> Lihat Hasil
                </Button>
            </a>      
        </div>
    );
};

export default ModalCekTugas;
