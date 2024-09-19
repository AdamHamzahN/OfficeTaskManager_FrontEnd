import React, { useRef, useState } from 'react';
import { Input, Select, Button, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const { Option } = Select;

const MyComponent: React.FC<{
    idProject: string,
    status_project: string,
    nama_project: string,
    nama_team: string
}> = ({idProject , status_project, nama_project, nama_team}) => {
    const [status, setStatus] = React.useState<string>('');
    const [error, setError] = React.useState<string>('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleButtonClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();  // Trigger file input click
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            console.log('Selected file:', file);
        }
    };

    const handleStatusChange = (value: string) => {
        setStatus(value);
    };
    const handleSubmit = () => {
        if (!status) {
            setError('Status is required');
            return;
        }
    }

    return (
        <div>
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
                defaultValue={status_project}
                onChange={(value) => {
                    setStatus(value);
                    if (error) {
                        setError('');  // Clear error if value is selected
                    }
                }}
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
                        ref={fileInputRef}
                        style={{ display: 'none' }} // Hide the default file input
                        onChange={handleFileChange}
                    />
                    <Button block onClick={handleButtonClick}>
                        <UploadOutlined /> Kirim Hasil Project
                    </Button>
                </>
            )
            }

        </div >
    );
};

export default MyComponent;
