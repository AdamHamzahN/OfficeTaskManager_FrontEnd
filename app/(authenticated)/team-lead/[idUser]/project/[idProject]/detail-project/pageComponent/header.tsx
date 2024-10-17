import { config } from "#/config/app";
import { projectRepository } from "#/repository/project";
import { Button, Input, Modal, Select } from "antd";
import { useRef, useState } from "react";
import { ArrowLeftOutlined, EditOutlined, SearchOutlined } from "@ant-design/icons";
import ModalComponent from "#/component/ModalComponent";
import Link from "next/link";
import ModalDetailProject from "../modal/modalDetailProject";
const { Option } = Select;

const Header: React.FC<{
    data:any
    idUser : string
    refreshTable: () => void
}> = ({ data,idUser, refreshTable }) => {
    const { id, nama_project, nama_team, file_project, start_date, end_date, note, status, user,file_hasil_project } = data;
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
    const [formData, setFormData] = useState<{ status: string; file_bukti: File | null, fileName: string }>({
        status: status,
        file_bukti: null,
        fileName: '' // State untuk menyimpan nama file
    });

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileUploadChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files ? e.target.files[0] : null;
        setFormData(prevFormData => ({
            ...prevFormData,
            file_bukti: file,
            fileName: file ? file.name : '' // Menyimpan nama file yang dipilih
        }));
    };

    const handleButtonClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const updateStatus = async () => {
        const { status, file_bukti } = formData;

        if (status === 'done' && file_bukti === null || file_bukti === undefined) {
            alert('Masukkan file terlebih dahulu!');
            return;
        }

        try {
            await projectRepository.api.updateStatusProject(id, {
                status_project: status,
                file_hasil_project: file_bukti
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
                <ModalComponent
                    title={'Detail Project'}
                    content={<ModalDetailProject
                        nama_project={nama_project}
                        team_lead={user.nama }
                        nama_team={nama_team }
                        status={status}
                        start_date={start_date}
                        end_date={end_date}
                        note={note}
                        file_project={file_project}
                        file_hasil_project={file_hasil_project}
                    />}
                    footer={(handleOk) => (
                        <div>
                            <Button type="primary" onClick={handleOk}>OK</Button>
                        </div>
                    )}
                >
                    <button type="button" className="bg-transparent hover:bg-blue-600 text-blue-700 hover:text-white py-3 px-6 border border-blue-600 hover:border-transparent rounded text-justify">
                        <SearchOutlined style={{ fontSize: 15 }} /> Detail Project
                    </button>
                </ModalComponent>
                {status !== 'approved' && (
                    <ModalComponent
                        title={'Ubah Status Project'}
                        content={
                            <>
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
                                    value={formData.status}
                                    onChange={(value) => setFormData(prev => ({ ...prev, status: value }))}

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
                        }
                        footer={(handleCancel) => (
                            <div>
                                <Button htmlType="button" onClick={handleCancel}>Cancel</Button>
                                <Button type="primary" onClick={updateStatus}>OK</Button>
                            </div>
                        )}
                    >
                        <button type="button" className="bg-transparent hover:bg-blue-500 text-blue-700 hover:text-white py-3 px-6 border border-blue-500 hover:border-transparent rounded">
                            <EditOutlined /> Ubah Status
                        </button>
                    </ModalComponent>
                )}

                <button
                    type="button"
                    className="border py-3 px-6 rounded"
                    style={getButtonStyles(status)}
                >
                    {status}
                </button>
            </div>
        </div >
    );
};

export default Header;
