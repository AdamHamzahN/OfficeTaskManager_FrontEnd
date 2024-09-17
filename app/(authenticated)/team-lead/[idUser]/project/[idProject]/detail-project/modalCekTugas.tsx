import { Button, Input } from "antd";
import TextArea from "antd/es/input/TextArea";
import { SearchOutlined } from "@ant-design/icons";

const ModalCekTugas = () => {
    return (
        <div>
            <label htmlFor="nama_tugas" style={{ marginBottom: '8px', display: 'block' }}>Nama Tugas</label>
            <Input value="Tampilan Untuk Dashboard" readOnly style={{ marginBottom: '16px' }} />

            <label htmlFor="nama_karyawan" style={{ marginBottom: '8px', display: 'block' }}>Nama Karyawan</label>
            <Input value="Adi Sucipto" readOnly style={{ marginBottom: '16px' }} />

            <label htmlFor="deskripsi_tugas" style={{ marginBottom: '8px', display: 'block' }}>Deskripsi Tugas</label>
            <TextArea
                showCount   
                style={{ height: 120, resize: 'none', marginBottom: '16px' }}
                value="fadjfajhdfhhfahfdhashfs adhjkhfkjhdshfkahf hadhfkjha hadjfha ahdjkhfjk hadkfh kkkkkkkkkkkk kkkkkkkkkkkkkkkkkkkkkkk kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk kkkkkkkkkkkkkkkkkkkkkk"
                readOnly
            />

            <label htmlFor="waktu_selesai" style={{ marginBottom: '8px', display: 'block' }}>Waktu Selesai</label>
            <Input value="2024-02-02" style={{ marginBottom: '16px' }} />

            <label htmlFor="bukti_pengerjaan" style={{ marginBottom: '8px', display: 'block' }}>Bukti Hasil Pengerjaan</label>
            <Button block style={{ textAlign: 'left', marginBottom: '16px' }}>
                <SearchOutlined /> Default
            </Button>
        </div>
    );
};

export default ModalCekTugas;
