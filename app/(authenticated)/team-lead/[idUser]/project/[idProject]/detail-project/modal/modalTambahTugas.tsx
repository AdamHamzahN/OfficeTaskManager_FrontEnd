import { Button, Input, Form, Select, DatePicker, message } from "antd";
import { useRef, useState } from "react";
import { UploadOutlined } from '@ant-design/icons';
import TextArea from "antd/es/input/TextArea";
import dayjs from 'dayjs';

interface ModalTambahTugasProps {
    create_tugas: (tugasData: {
        nama_tugas: string;
        deskripsi_tugas: string;
        deadline: string;
        id_karyawan: string;
        id_project: string;
        file_tugas: File | null;
    }) => void,
    karyawan: any;
    idProject: string;
}

const ModalTambahTugas: React.FC<ModalTambahTugasProps> = ({ create_tugas, karyawan, idProject }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [formData, setFormData] = useState<{
        nama_tugas: string;
        deskripsi_tugas: string;
        deadline: string;
        id_karyawan: string;
        file_tugas: File | null;
    }>({
        nama_tugas: '',
        deskripsi_tugas: '',
        deadline: '',
        id_karyawan: '',
        file_tugas: null,
    });
    const [fileName, setFileName] = useState<string | null>(null);

    const handleButtonClick = (event: React.MouseEvent<HTMLElement>) => {
        event.preventDefault();
        fileInputRef.current?.click();
    };

    const handleFileUploadChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] || null;
        setFileName(file ? file.name : null);
        handleChange('file_tugas', file);
    };

    const handleChange = (key: keyof typeof formData, value: any) => {
        const updatedFormData = {
            ...formData,
            [key]: value,
        };
        setFormData(updatedFormData);
        create_tugas({ ...updatedFormData, id_project: idProject }); // Ensure id_project is included
    };

    const handleSelectChange = (value: string) => {
        console.log("Selected Karyawan ID:", value);
        handleChange('id_karyawan', value);
    };

    const options = karyawan.map((karyawan: any) => ({
        value: karyawan.karyawan.id,
        label: `${karyawan.karyawan.user.nama} | ${karyawan.karyawan.job.nama_job}`,
    }));

    return (
        <div>
            <label htmlFor="nama_tugas" style={{ marginBottom: '8px', display: 'block' }}>Nama Tugas</label>
            <Input
                value={formData.nama_tugas}
                onChange={(e) => handleChange('nama_tugas', e.target.value)}
                placeholder="Masukkan nama tugas"
            />

            <label htmlFor="karyawan" style={{ marginBottom: '8px', display: 'block' }}>Karyawan</label>
            <Select
                id="karyawan"
                placeholder="Pilih Karyawan"
                style={{ width: '100%' }}
                onChange={handleSelectChange}
                options={options}
                value={formData.id_karyawan || undefined}
            />

            <label htmlFor="deskripsi" style={{ marginBottom: '8px', display: 'block' }}>Deskripsi Tugas</label>
            <TextArea
                autoSize={{ minRows: 3, maxRows: 9 }}
                style={{
                    height: 120,
                    resize: 'none',
                    marginBottom: '16px',
                    minWidth: 'auto'
                }}
                value={formData.deskripsi_tugas}
                onChange={(e) => handleChange('deskripsi_tugas', e.target.value)}
                placeholder="Masukkan deskripsi tugas"
            />

            <label htmlFor="deadline" style={{ marginBottom: '8px', display: 'block' }}>Deadline</label>
            <DatePicker
                style={{ width: '100%' }}
                onChange={(date, dateString) => handleChange('deadline', dateString)}
                value={formData.deadline ? dayjs(formData.deadline) : null}
                format="YYYY-MM-DD"
                placeholder="Pilih deadline"
            />

            <label htmlFor="detail_tugas" style={{ marginBottom: '8px', display: 'block' }}>File Detail Tugas</label>
            <input
                type="file"
                style={{ display: 'none' }}
                ref={fileInputRef}
                onChange={handleFileUploadChange}
                accept="application/pdf"
            />
            <Button
                htmlType="button"
                block
                onClick={handleButtonClick}
                style={{ marginTop: '8px', width: '100%' }}
                icon={<UploadOutlined />}
            >
                Masukkan File
            </Button>
            {fileName && (
                <p style={{ marginTop: '8px' }}>File: {fileName}</p>
            )}
        </div>
    );
};

export default ModalTambahTugas;
