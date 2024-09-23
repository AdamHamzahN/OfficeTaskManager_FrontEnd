import React, { useEffect, useRef, useState } from 'react';
import { Input, Select, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const { Option } = Select;

const MyComponent: React.FC<{
    idProject: string,
    status_project: string,
    nama_project: string,
    nama_team: string,
    update_status_project: (status: string, file_bukti: File | null) => void,
}> = ({ idProject, status_project, nama_project, nama_team, update_status_project }) => {
    const [status, setStatus] = useState<string>(status_project);
    const [fileBukti, setFileBukti] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleButtonClick = (event: React.MouseEvent<HTMLElement>) => {
        event.preventDefault();
        fileInputRef.current?.click(); 
    };
    const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
    };
    
    const handleSelectChange = (value: string) => {
        setStatus(value);
        update_status_project(value, fileBukti);
    };
    const handleFileUploadChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        const file = event.target.files?.[0] || null;
        setFileBukti(file);
        update_status_project(status, file);
    };
    

    return (
        <form  onSubmit={handleFormSubmit}>
            <label htmlFor="nama_project" style={{ marginBottom: '8px', display: 'block' }}>
                Nama Project
            </label>
            <Input value={nama_project} id='nama_project' readOnly style={{ marginBottom: '16px' }} required />

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
                        onChange={handleFileUploadChange}
                        accept="application/pdf"
                        style={{ display:'none' }}
                        ref={fileInputRef}
                    />
                    <Button htmlType='button' block onClick={handleButtonClick} style={{ marginTop: '8px',width:'100%' }}>
                        <UploadOutlined /> Pilih Hasil Project
                    </Button>
                </>
            )}
        </form>
    );
};

export default MyComponent;
