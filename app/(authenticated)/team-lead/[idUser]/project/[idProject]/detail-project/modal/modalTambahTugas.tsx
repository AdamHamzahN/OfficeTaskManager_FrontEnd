import { Button, Input, Form } from "antd";
import { useRef, useState } from "react";
import { UploadOutlined } from '@ant-design/icons';
import TextArea from "antd/es/input/TextArea";

const ModalTambahTugas: React.FC<{}> = () => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [fileInfo, setFileInfo] = useState<{ name: string; size: number; type: string } | null>(null);

    const handleButtonClick = (event: React.MouseEvent<HTMLElement>) => {
        event.preventDefault(); // Mencegah refresh halaman
        fileInputRef.current?.click(); 
        alert('p')
    };

    const handleFileUploadChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] || null;

        if (file) {
            setFileInfo({
                name: file.name,
                size: file.size, // Ukuran dalam byte
                type: file.type, // Tipe file
            });

            console.log(file);
        } else {
            setFileInfo(null); // Reset fileInfo jika tidak ada file
        }
    };

    return (
        <div>
            <Form onFinish={() => { /* Handle submit here if needed */ }}>
                <label htmlFor="nama_tugas" style={{ marginBottom: '8px', display: 'block' }}>Nama Tugas</label>
                <Input style={{ marginBottom: '16px' }} />

                <label htmlFor="nama_karyawan" style={{ marginBottom: '8px', display: 'block' }}>Nama Karyawan</label>
                <Input readOnly style={{ marginBottom: '16px' }} />

                <label htmlFor="deskripsi_tugas" style={{ marginBottom: '8px', display: 'block' }}>Deskripsi Tugas</label>
                <TextArea
                    autoSize={{ minRows: 3, maxRows: 9 }}
                    style={{
                        height: 120, resize: 'none',
                        marginBottom: '16px',
                        minWidth: 'auto'
                    }}
                />
                <label htmlFor="detail_tugas" style={{ marginBottom: '8px', display: 'block' }}>Detail Tugas</label>
                <input
                    type="file"
                    style={{ display: 'none' }}
                    ref={fileInputRef}
                    onChange={handleFileUploadChange} // Event handler
                    accept="application/pdf" // Filter tipe file yang diterima
                />
                <Button
                    htmlType="button" // Ganti dari reset ke button
                    block
                    onClick={handleButtonClick}
                    style={{ marginTop: '8px', width: '100%' }}
                >
                    <UploadOutlined /> Masukkan File
                </Button>

                {fileInfo && (
                    <div style={{ marginTop: '16px' }}>
                        <h4>File Info:</h4>
                        <p><strong>Nama:</strong> {fileInfo.name}</p>
                        <p><strong>Ukuran:</strong> {fileInfo.size} bytes</p>
                        <p><strong>Tipe:</strong> {fileInfo.type}</p>
                    </div>
                )}
            </Form>
        </div>
    );
};

export default ModalTambahTugas;
