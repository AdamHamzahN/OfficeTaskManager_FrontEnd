import React, { useEffect, useRef, useState } from 'react';
import { Input, Select, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const { Option } = Select;

const ModalUbahStatusProject: React.FC<{
    idProject: string,
    status_project: string,
    nama_project: string,
    nama_team: string,
    update_status_project: (status: string, file_bukti: File | null) => void,
}> = ({ idProject, status_project, nama_project, nama_team, update_status_project }) => {
    const [status, setStatus] = useState<string>(status_project);
    const [fileBukti, setFileBukti] = useState<File | null>(null);
    const [fileName, setFileName] = useState<string | null>(null); // Tambahkan state untuk menyimpan nama file
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Fungsi untuk memicu file input ketika tombol diklik
    const handleButtonClick = (event: React.MouseEvent<HTMLElement>) => {
        event.preventDefault();
        if (fileInputRef.current) {
            fileInputRef.current.click(); // Memicu input file
        }
    };

    // Fungsi untuk menangani perubahan pada file input
    const handleFileUploadChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] || null;
        setFileBukti(file);
        setFileName(file ? file.name : null); // Simpan nama file jika ada
        console.log('Selected file:', file);  // Debugging: memeriksa apakah file dipilih
        update_status_project(status, file);
    };

    // Fungsi untuk menangani perubahan status di select
    const handleSelectChange = (value: string) => {
        setStatus(value);
        update_status_project(value, fileBukti);
    };

    // Fungsi untuk menangani submit form
    const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log('Submitting fileBukti:', fileBukti); // Debugging: memeriksa apakah file ter-set dengan benar
        update_status_project(status, fileBukti); // Mengirim status dan file bukti
    };

    return (
        <form onSubmit={handleFormSubmit}>
            <label htmlFor="nama_project" style={{ marginBottom: '8px', display: 'block' }}>
                Nama Project
            </label>
            <Input  id='nama_project' readOnly style={{ marginBottom: '16px' }} required />

            <label htmlFor="nama_team" style={{ marginBottom: '8px', display: 'block' }}>
                Nama Team
            </label>
            <Input value={nama_team} id='nama_team' readOnly style={{ marginBottom: '16px' }} required />

            <label htmlFor="status" style={{ marginBottom: '8px', display: 'block' }}>
                Status
            </label>
            <Select
                id="status"
                placeholder="Select Status"
                style={{ width: '100%', marginBottom: '16px' }}
                value={status}
                onChange={handleSelectChange}
            >
                <Option value="pending">Pending</Option>
                <Option value="on-progress">On Progress</Option>
                <Option value="done">Done</Option>
            </Select>

            {status === 'done' && (
                <>
                    <label htmlFor="hasil_project" style={{ marginBottom: '8px', display: 'block' }}>
                        Hasil Project
                    </label>
                    <input
                        type="file"
                        key={fileName || ''} // Menambahkan key untuk mereset input ketika file dipilih
                        onChange={handleFileUploadChange}
                        accept="application/pdf"
                        style={{ display: 'none' }}
                        ref={fileInputRef}
                    />

                    <Button htmlType='button' block onClick={handleButtonClick} style={{ marginTop: '8px', width: '100%' }}>
                        <UploadOutlined /> Pilih Hasil Project
                    </Button>
                    {/* Tampilkan nama file yang dipilih di bawah tombol */}
                    {fileName && (
                        <p style={{ marginTop: '8px' }}>File: {fileName}</p>
                    )}
                </>
            )}
        </form>
    );
};

export default ModalUbahStatusProject;
