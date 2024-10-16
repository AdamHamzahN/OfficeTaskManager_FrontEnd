'use client';
import { useRef, useState } from "react";
import { Button, Input, Select } from "antd";
import { UploadOutlined } from "@ant-design/icons";

const ModalEditTugas: React.FC<{
    idTugas: string,
    nama_tugas: string,
    status_tugas: string,
    update_tugas: (tugasData: { status: string; file_bukti: File | null }) => void,
}> = ({ idTugas, nama_tugas, status_tugas, update_tugas }) => {
    const [status, setStatus] = useState<string>(status_tugas);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [fileBukti, setFileBukti] = useState<File | null>(null);
    const [fileName, setFileName] = useState<string | null>(null);

    const handleButtonClick = (event: React.MouseEvent<HTMLElement>) => {
        event.preventDefault();
        if (fileInputRef.current) {
            fileInputRef.current.click(); // Memicu input file
        }
    };

    const handleSelectChange = (value: string) => {
        setStatus(value);
        update_tugas({ status: value, file_bukti: fileBukti });
    };

    const handleFileUploadChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] || null;
        setFileBukti(file);
        setFileName(file ? file.name : null); // Simpan nama file jika ada
        console.log('Selected file:', file);  // Debugging: memeriksa apakah file dipilih
        update_tugas({ status, file_bukti: file });
    };

    return (
        <div>
            <label htmlFor="nama_tugas" style={{ marginBottom: '8px', display: 'block' }}>Nama Tugas</label>
            <Input value={nama_tugas} readOnly style={{ marginBottom: '16px' }} />

            <label htmlFor="status" style={{ marginBottom: '8px', display: 'block' }}>Status Tugas</label>
            <Select
                id="status"
                placeholder="Select Status"
                style={{ width: '100%', marginBottom: '16px' }}
                value={status}
                onChange={handleSelectChange}
            >
                <Select.Option value="pending">Pending</Select.Option>
                <Select.Option value="on progress">On Progress</Select.Option>
                <Select.Option value="done">Done</Select.Option>
            </Select>

            {status === 'done' && (
                <>
                    <label htmlFor="hasil_project" style={{ marginBottom: '8px', display: 'block' }}>Hasil Project</label>
                    <input
                        type="file"
                        accept="application/pdf"
                        style={{ display: 'none' }}
                        ref={fileInputRef}
                        onChange={handleFileUploadChange}
                    />

                    <Button
                        htmlType='button'
                        block
                        onClick={handleButtonClick}
                        style={{ marginTop: '8px', width: '100%' }}
                    >
                        <UploadOutlined /> Pilih Hasil Project
                    </Button>

                    {fileName && (
                        <p style={{ marginTop: '8px' }}>File: {fileName}</p>
                    )}
                </>
            )}
        </div>

    );
};

export default ModalEditTugas;
