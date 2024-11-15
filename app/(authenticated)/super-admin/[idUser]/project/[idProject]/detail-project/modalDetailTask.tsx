'use client'
import { Button, Input } from "antd";
import TextArea from "antd/es/input/TextArea";
import { SearchOutlined } from "@ant-design/icons";
import { config } from "#/config/app";
import { tugasRepository } from "#/repository/tugas";

const formatTimeStr = (dateStr: string) => {
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
};

const ModalDetailTask: React.FC<{idTask: string}> =({idTask}) => {
    const {data: detailTask, isValidating: loading, error} = tugasRepository.hooks.useGetTugasById(idTask)

    if(loading) {
        console.log('Loading...!');
        return <>Loading...</>
    }

    if(error) {
        console.log('Error fetching data:', error);
        return <>Error loading data</>
    }

    const fileDetailTask = `${config.baseUrl}/${detailTask.data.file_tugas.replace(/\\/g, '/')}`;
    const fileHasilTask = `${config.baseUrl}/${detailTask.data.file_bukti.replace(/\\/g, '/')}`;

    return (
        <div style={{borderTop: 2}}>
            <label htmlFor="nama_tugas" style={{marginBottom: 8, display: 'block'}}>Nama Tugas</label>
            <Input value={detailTask.data.nama_tugas} readOnly style={{marginBottom: 16}}/>

            <label htmlFor="nama_karyawan" style={{marginBottom: 8, display: 'block'}}>Nama Karyawan</label>
            <Input value={detailTask.data.karyawan.user.nama} readOnly style={{marginBottom: 16}}/>

            <label htmlFor="deskripsi_tugas" style={{marginBottom: 8, display: 'block'}}>Deskripsi Tugas</label>
            <TextArea
                autoSize={{minRows: 3, maxRows: 9}}
                style={{height: 120, resize: 'none', marginBottom: 16, minWidth: 'auto'}}
                value={detailTask.data.deskripsi_tugas}
                readOnly
            />

            <label htmlFor="bukti_pengerjaan" style={{marginBottom: 8, display: 'block'}}>File Derail Tugas</label>
            <a href={fileDetailTask} target="_blank" rel="noopener noreferrer">
                <Button block style={{textAlign: 'left', marginBottom: 16}}>
                    <SearchOutlined /> Lihat Detail
                </Button>
            </a>

            {detailTask.data.status === 'done' &&(
                <>
                    <label htmlFor="waktu_selesai_done" style={{marginBottom: 8, display: 'block'}}>Waktu Selesai</label>
                    <Input id="waktu_selesai_done" value={formatTimeStr(detailTask.data.updated_at)} style={{marginBottom: 16}}/>

                    <label htmlFor="bukti_pengerjaan_done" style={{marginBottom: 8, display: 'block'}}>Bukti Hasil Pengerjaan</label>
                    <a href={fileHasilTask} target="_blank" rel="noopener noreferrer">
                        <Button block style={{textAlign: 'left', marginBottom: 16}}>
                            <SearchOutlined /> Lihat Hasil
                        </Button>
                    </a>
                </>
            )}
        </div>
    )
};

export default ModalDetailTask;