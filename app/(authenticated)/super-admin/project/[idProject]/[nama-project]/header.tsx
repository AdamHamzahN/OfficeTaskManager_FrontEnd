import { Button, Modal, Input } from "antd";
import ModalComponent from "#/component/ModalComponent";
import {ArrowLeftOutlined, SearchOutlined} from "@ant-design/icons";
import ModalDetailProject from "#/app/(authenticated)/team-lead/project/[idProject]/[nama-project]/modal/modalDetailProject";
import Link from "next/link";
import { config } from "#/config/app";
import { projectRepository } from "#/repository/project";
import { useParams } from "next/navigation";
import { useState } from "react";
import TextArea from "antd/es/input/TextArea";
import { formatTimeStr } from "#/utils/formatTime";

const Header: React.FC <{
    data: any
    idUser: string
    refreshTable: () => void
}> = ({data, idUser ,refreshTable}) => {

    const params = useParams();
    const idProject = params?.idProject as string;

    const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
    const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);
    const [noteProject, setNoteProject] = useState<string>('');

    const {nama_project, user, nama_team, status, start_date, end_date, file_project, file_hasil_project, note, updated_at} = data;
    const buttonStatusStyle = (status: string) => {
        switch (status) {
            case 'pending':
                return {backgroundColor: 'rgba(255, 193, 7, 0.1)', borderColor: '#FFC107', color: '#FFC107'};
            case 'on-progress':
                return {backgroundColor: 'rgba(0, 188, 212, 0.1)', borderColor: '#00BCD4', color: '#00BCD4'};
            case 'redo':
                return { backgroundColor: 'rgba(244, 67, 54, 0.1)', borderColor: '#F44336', color: '#F44336' };
            case 'done':
                return {backgroundColor: 'rgba(33, 150, 243, 0.1)', borderColor: '#2196F3', color: '#2196F3'};
            default:
                return {backgroundColor: 'rgba(76, 175, 80, 0.1)', borderColor: '#4CAF50', color: '#4CAF50'};
        }
    };

    const fileBukti = `${config.baseUrl}/${file_hasil_project?.replace(/\\/g, '/')}`;

    const acceptProject = async (id_project: string) => {
        try {
            await projectRepository.api.updateStatusProject(id_project, {
                status_project: 'approved'
            });
            await refreshTable();
            Modal.success({
                title: 'Project Diterima',
                content: 'Project telah diterima',
                okText: 'OK',
                onOk() {
                    console.log('OK clicked');
                },
            });
        } catch (error) {
            console.error('Gagal mengupdate Project', error);
        }
    };

    const redoProject = async (id_project: string, note: any) => {
        try {
            await projectRepository.api.updateStatusProject(id_project, {
                status_project: 'redo',
                note: note
            });
            await refreshTable();
            Modal.success({
                title: 'Project Dikembalikan',
                content: 'Project telah dikembalikan ke team lead',
                okText: 'OK',
                onOk() {
                    console.log('OK clicked');
                },
            });
        } catch (error) {
            console.error('Gagal mengupdate Project', error);
        }
    };

    const openNote = (id_project: string) => {
        setCurrentProjectId(id_project)
        setIsNoteModalOpen(true)
    };
    
    const handleNoteSubmit = async () => {
        if (currentProjectId && noteProject.trim()) {
            await redoProject(currentProjectId, noteProject);
            setIsNoteModalOpen(false);
            setNoteProject('');
            setCurrentProjectId(null);
        } else {
            // Tampilkan peringatan jika catatan kosong
            Modal.warning({
                title: 'Catatan Diperlukan',
                content: 'Harap masukkan catatan sebelum menolak tugas.',
                okText: 'OK',
            });
        }
    };

    const handleNoteCancel = async () => {
        setIsNoteModalOpen(false);
        setNoteProject('');
        setCurrentProjectId(null)
    };

    return (
        <div style={{display: 'flex', justifyContent: 'space-between'}}>
            <div style={{display: 'flex', alignItems: 'center'}}>
                <Button className="bg-blue-500 hover:bg-blue-700 text-black font-bold py-1 px-2 rounded-full w-8 h-8 border-0 flex justify-center items-center ml-2">
                    <Link href={`/super-admin/project`} className="no-underline text-black">
                        <ArrowLeftOutlined />
                    </Link>
                </Button>
                <h1 style={{ marginLeft: '8px', marginTop: '10px', fontSize: '25px', fontWeight: 'bold', fontFamily: 'Roboto, sans-serif' }}>
                    {nama_project}
                </h1>
            </div>
            <div style={{display: 'flex', gap: 20, fontFamily: 'Arial', marginTop: 5, marginBottom: 5}}>
                
            <ModalComponent
                title='Note'
                content={
                    <>
                        <p>Masukkan Note:</p>
                        <TextArea
                            rows={4}
                            placeholder="Masukkan note..."
                            value={noteProject}
                            onChange={(e) => setNoteProject(e.target.value)}
                            required
                        />
                    </>
                }
                footer={() => (
                    <>
                        <Button onClick={handleNoteCancel}>
                            Cancel
                        </Button>
                        <Button type="primary" onClick={handleNoteSubmit}>
                            Submit
                        </Button>
                    </>
                )}
                visible={isNoteModalOpen}
            />

                <ModalComponent
                    title="Detail Project"
                    content={<ModalDetailProject
                        nama_project={nama_project}
                        team_lead={user.nama}
                        nama_team={nama_team}
                        status={status}
                        start_date={start_date}
                        end_date={end_date}
                        note={note}
                        file_project={file_project}
                        file_hasil_project={file_hasil_project}
                    />}
                    footer={(handleOk) => (
                        <>
                            <Button type="primary" onClick={handleOk}>OK</Button>
                        </>
                    )}
                >
                    <button type="button" className="bg-transparent hover:bg-blue-600 text-blue-700 hover:text-white py-3 px-6 border border-blue-600 hover:border-transparent rounded text-justify">
                        <SearchOutlined style={{ fontSize: 15 }} /> Detail Project
                    </button>
                </ModalComponent>

                {status === 'done' && (
                    <ModalComponent
                        title="Cek Hasil"
                        content={
                            <>
                                <label style={{marginBottom: 8, display: 'block'}}> Nama Project </label>
                                <Input value={nama_project} readOnly style={{marginBottom: 16}} />

                                <label style={{marginBottom: 8, display: 'block'}}> Penanggung Jawab </label>
                                <Input value={user.nama} readOnly style={{marginBottom: 16}} />

                                <label style={{marginBottom: 8, display: 'block'}}> Waktu Selesai </label>
                                <Input value={formatTimeStr(updated_at)} readOnly style={{marginBottom: 16}} />

                                <label style={{marginBottom: 8, display: 'block'}}> Bukti Hasil Pengerjaan </label>
                                <a href={fileBukti} target="_blank" rel="noopener noreferrer">
                                    <Button block style={{textAlign: 'left', marginBottom: 16}}>
                                        <SearchOutlined /> Lihat Hasil
                                    </Button>
                                </a>
                            </>
                        }
                        footer={() => (
                            <>
                                <Button 
                                    type='primary' 
                                    style={{ backgroundColor: '#F44336', borderColor: '#F44336' }} 
                                    onClick={() => openNote(idProject)}
                                >
                                    Redo
                                </Button>
                                
                                <Button 
                                    type='primary' 
                                    style={{ backgroundColor: '#4CAF50', borderColor: '#4CAF50' }} 
                                    onClick={() => acceptProject(idProject)}
                                >
                                    Approve
                                </Button>
                            </>
                        )}
                    >
                        <button type="button" className="bg-transparent hover:bg-blue-500 text-blue-700 hover:text-white py-3 px-6 border border-blue-500 hover:border-transparent rounded">
                            <SearchOutlined /> Cek Hasil
                        </button>
                    </ModalComponent>
                )}
                
                <button 
                    type="button"
                    className="border py-3 px-6 rounded"
                    style={buttonStatusStyle(status)}
                >
                    {status}
                </button>
            </div>
        </div>
    )
};

export default Header;