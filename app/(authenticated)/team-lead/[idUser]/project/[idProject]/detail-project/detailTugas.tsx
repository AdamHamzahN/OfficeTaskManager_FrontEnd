import { Button, Input } from "antd";
import TextArea from "antd/es/input/TextArea";
import { SearchOutlined } from "@ant-design/icons";



const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    console.log('Change:', e.target.value);
};

const DetailTugas = () => {
    return (
        <div style={{}}>
            <label htmlFor="nama_tugas">Nama Tugas</label>
            <Input value={'Tampilan Untuk Dashboard'} readOnly />
            <label htmlFor="nama_tugas">Nama Karyawan</label>
            <Input value={'Adi Sucipto'} readOnly />
            <label htmlFor="nama_tugas">Deskripsi Tugas</label>
            <TextArea showCount
                placeholder="disable resize"
                onChange={onChange}
                style={{ height: 120, resize: 'none' }}
                value={'fadjfajhdfhhfahfdhashfs adhjkhfkjhdshfkahf hadhfkjha hadjfha ahdjkhfjk hadkfh kkkkkkkkkkkk kkkkkkkkkkkkkkkkkkkkkkk kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk kkkkkkkkkkkkkkkkkkkkkk'}
                readOnly />
            <label htmlFor="nama_tugas">Waktu Selesai</label>
            <Input value={'2024-02-02'} />
            <label htmlFor="nama_tugas">Bukti Hasil Pengerjaan</label>
            <Button block style={{textAlign:'left'}}><SearchOutlined />Default</Button>
        </div>
    )
}

export default DetailTugas;