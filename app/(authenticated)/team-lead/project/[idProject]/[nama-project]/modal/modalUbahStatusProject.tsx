import { Button, Input, Select } from "antd";
import { Option } from "antd/es/mentions";
import { useRef, useState } from "react";

const ModalUbahStatusProject: React.FC<{
    detailProject: any
    setFormData: any
}> = ({ detailProject, setFormData }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [formData, setData] = useState<{ status: string; file_bukti: File | null, fileName: string }>({
        status: detailProject.data.status,
        file_bukti: null,
        fileName: '',
    })

    const handleFileUploadChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files ? e.target.files[0] : null;
        setFormData((prev: any)=>({
            ...prev,
            file_bukti: file,
            fileName: file ? file.name : ''
        }))
        setData((prev: any)=>({
            ...prev,
            file_bukti: file,
            fileName: file ? file.name : ''
        }))
    };

    const handleButtonClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    return (
        <>
            <label htmlFor="nama_project" style={{ marginBottom: '8px', display: 'block' }}>
                Nama Project
            </label>
            <Input value={detailProject?.data.nama_project} id='nama_project' readOnly style={{ marginBottom: '16px' }} required />

            <label htmlFor="nama_team" style={{ marginBottom: '8px', display: 'block' }}>
                Nama Team
            </label>
            <Input value={detailProject?.data.nama_team} id='nama_team' readOnly style={{ marginBottom: '16px' }} required />

            <label htmlFor="status" style={{ marginBottom: '8px', display: 'block' }}>
                Status
            </label>
            <Select
                id="status"
                placeholder="Select Status"
                style={{ width: '100%', marginBottom: '16px' }}
                value={formData.status}
                onChange={(value) => {
                    setFormData((prev:any) => ({ ...prev, status: value })); 
                    setData((prev:any) => ({ ...prev, status: value }))
                }}
            >
                <Option value="pending">Pending</Option>
                <Option value="on-progress">On Progress</Option>
                <Option value="done">Done</Option>
            </Select>

            {formData.status === 'done' && (
                <>
                    <label htmlFor="hasil_project" style={{ marginBottom: '8px', display: 'block' }}>
                        Hasil Project
                    </label>
                    <input
                        type="file"
                        onChange={handleFileUploadChange}
                        accept="application/pdf"
                        style={{ display: 'none' }}
                        ref={fileInputRef}
                        required
                    />
                    <Button htmlType='button' block onClick={handleButtonClick} style={{ marginTop: '8px', width: '100%' }}>
                        Pilih Hasil Project
                    </Button>
                    {formData.fileName && ( // Menampilkan nama file jika ada
                        <p style={{ marginTop: '8px', fontStyle: 'italic', color: '#555' }}>
                            {formData.fileName}
                        </p>
                    )}
                </>
            )}
        </>
    )
}
export default ModalUbahStatusProject;