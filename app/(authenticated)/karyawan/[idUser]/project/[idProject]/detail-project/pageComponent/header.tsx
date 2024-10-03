import { config } from "#/config/app";
import { projectRepository } from "#/repository/project";
import { Button, Input, Modal, Select } from "antd";
import { useRef, useState } from "react";
import { ArrowLeftOutlined, FileExcelOutlined, EditOutlined, EyeOutlined, SearchOutlined } from "@ant-design/icons";
import Link from "next/link";


const Header: React.FC<{
    status: string,
    file_project: string,
    idProject: string,
    nama_team: string,
    nama_project: string,
    idUser: string,
    refreshTable: () => void
}> = ({ status, file_project, idProject, nama_team, nama_project, idUser, refreshTable }) => {
    const { Option } = Select;

    const getButtonStyles = (status: string) => {
        switch (status) {
            case 'pending':
                return { backgroundColor: 'rgba(255, 193, 7, 0.1)', borderColor: '#FFC107', color: '#FFC107' };
            case 'on-progress':
                return { backgroundColor: 'rgba(0, 188, 212, 0.1)', borderColor: '#00BCD4', color: '#00BCD4' };
            case 'redo':
                return { backgroundColor: 'rgba(244, 67, 54, 0.1)', borderColor: '#F44336', color: '#F44336' };
            case 'done':
                return { backgroundColor: 'rgba(33, 150, 243, 0.1)', borderColor: '#2196F3', color: '#2196F3' };
            default:
                return { backgroundColor: 'rgba(76, 175, 80, 0.1)', borderColor: '#4CAF50', color: '#4CAF50' };
        }
    };

    const filePdfUrl = `${config.baseUrl}/${file_project?.replace(/\\/g, '/')}`;
    const [formData, setFormData] = useState<{ status: string; file_bukti: File | null }>({
        status: status,
        file_bukti: null,
    });

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileUploadChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files ? e.target.files[0] : null;
        setFormData(prevFormData => ({ ...prevFormData, file_bukti: file }));
    };

    const handleButtonClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const updateStatus = async () => {
        const { status, file_bukti } = formData;

        if (!status) {
            alert('Masukkan Status terlebih dahulu!');
            return;
        }

        try {
            await projectRepository.api.updateStatusProject(idProject, {
                status_project: status,
                file_bukti: file_bukti
            });

            Modal.success({
                title: 'Berhasil',
                content: 'Berhasil mengubah status project',
                onOk() {
                    refreshTable();
                }
            });
        } catch (error) {
            console.error('Gagal mengubah status project:', error);
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <button className="bg-blue-500 hover:bg-blue-700 text-black font-bold py-1 px-2 rounded-full w-8 h-8 border-0 flex justify-center items-center ml-2">
                    <Link href={`/team-lead/${idUser}/project`} className="no-underline text-black">
                        <ArrowLeftOutlined />
                    </Link>
                </button>
                <h3 style={{ marginLeft: '8px', marginTop: '10px', fontSize: '25px', fontWeight: 'bold', fontFamily: 'Roboto, sans-serif' }}>
                    {nama_project}
                </h3>
            </div>
            <div style={{ display: 'flex', gap: 20, fontFamily: 'Arial', marginTop: 5, marginBottom: 5 }}>
                <a href={filePdfUrl} target='_blank' rel="noopener noreferrer">
                    <button type="button" className="bg-transparent hover:bg-green-600 text-green-700 hover:text-white py-3 px-6 border border-green-600 hover:border-transparent rounded text-justify">
                        <FileExcelOutlined style={{ fontSize: 15 }} /> Export To Excel
                    </button>
                </a>
                <button
                    type="button"
                    className="border py-3 px-6 rounded"
                    style={getButtonStyles(status)}
                >
                    {status}
                </button>
            </div>
        </div>
    );
};
export default Header;
