'use client';
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Alert, Spin, Button, Modal, Input, Row, Table } from "antd";
import { ArrowLeftOutlined, SearchOutlined } from "@ant-design/icons";
import { JwtToken } from "#/utils/jwtToken";
import { config } from "#/config/app";
import { projectRepository } from "#/repository/project";
import ModalDetailProject from "#/app/(authenticated)/team-lead/project/[idProject]/[nama-project]/modal/modalDetailProject";
import Link from "next/link";
import TextArea from "antd/es/input/TextArea";
import ModalComponent from "#/component/ModalComponent";
import TableTeam from "./tableTeam";
import TableTask from "./tableTask";

const DetailProject: React.FC<{
    nama_team: any,
    idProject: string,
    teamData: string,
    pageTeam: any,
    pageSizeTeam: any,
    handlePageChange: any,
    formatTimeStr: (text: string) => string
    // mutateTeam: any,
    // refreshTable: () => void
}> = ({ idProject, nama_team, teamData, pageTeam, pageSizeTeam, handlePageChange, formatTimeStr }) => {
    return (
        <>
            <TableTeam
                idProject={idProject}
                nama_team={nama_team}
                data={teamData}
                pageTeam={pageTeam}
                pageSizeTeam={pageSizeTeam}
                handlePageChange={handlePageChange}
            // mutate={mutateTeam}
            // refreshTable={refreshTable}
            />
            <TableTask idProject={idProject} formatTimeStr={formatTimeStr} />
        </>
    );
};

const Page = () => {
    const params = useParams();
    const idUser = params?.idUser as string;
    const idProject = params?.idProject as string;
    const [pageTeam, setPageTeam] = useState(1);
    const [pageSizeTeam, setPageSizeTeam] = useState(5);
    const handlePageChange = (newPage: number, newPageSize: number) => {
        setPageTeam(newPage);
        setPageSizeTeam(newPageSize);
    };

    const { data: detailProject, error: errorDetailProject, isValidating: validateDetailProject, mutate }
    = projectRepository.hooks.useDetailProject(idProject);
    
    const { data: teamProject, error: errorTeam, isValidating: validateTeam, mutate: mutateTeam }
    = projectRepository.hooks.useTeamByProject(idProject, pageTeam, pageSizeTeam);
    
    const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
    const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);
    const [noteProject, setNoteProject] = useState<string>('');
    
    console.log('ku1', detailProject?.data)
    // const {nama_project, user, nama_team, status, start_date, end_date, file_project, file_hasil_project, note, updated_at} = detailProject?.data;
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

    const fileBukti = `${config.baseUrl}/${detailProject?.data.file_hasil_project?.replace(/\\/g, '/')}`;

    const acceptProject = async (id_project: string) => {
        try {
            await projectRepository.api.updateStatusProject(id_project, {
                status_project: 'approved'
            });
            // await refreshTable();
            Modal.success({
                title: 'Project Diterima',
                content: 'Project telah diterima',
                okText: 'OK',
                onOk() {
                    console.log('OK clicked');
                },
            });
            mutate()
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
            // await refreshTable();
            Modal.success({
                title: 'Project Dikembalikan',
                content: 'Project telah dikembalikan ke team lead',
                okText: 'OK',
                onOk() {
                    console.log('OK clicked');
                },
            });
            mutate()
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


    const loading = validateDetailProject
    const error = errorDetailProject

    if (loading) {
        return <Spin style={{ textAlign: 'center', padding: 20 }} />
    }
    if (error) {
        return <Alert message="Error fetching data" type="error" />;
    }

    const formatTimeStr = (dateStr: string) => {
        const date = new Date(dateStr);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); //bulan mulai dari 0
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
    };

    // const refreshTable = async () => {
    //     await mutateDetailProject();
    // }

    return (
        <>
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
                <div style={{display: 'flex', alignItems: 'center'}}>
                    <Button className="bg-blue-500 hover:bg-blue-700 text-black font-bold py-1 px-2 rounded-full w-8 h-8 border-0 flex justify-center items-center ml-2">
                        <Link href={`/super-admin/project`} className="no-underline text-black">
                            <ArrowLeftOutlined />
                        </Link>
                    </Button>
                    <h1 style={{ marginLeft: '8px', marginTop: '10px', fontSize: '25px', fontWeight: 'bold', fontFamily: 'Roboto, sans-serif' }}>
                        {detailProject.data.nama_project}
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
                            nama_project={detailProject?.data.nama_project}
                            team_lead={detailProject?.data.user.nama}
                            nama_team={detailProject?.data.nama_team}
                            status={detailProject?.data.status}
                            start_date={detailProject?.data.start_date}
                            end_date={detailProject?.data.end_date}
                            note={detailProject?.data.note}
                            file_project={detailProject?.data.file_project}
                            file_hasil_project={detailProject?.data.file_hasil_project}
                        />}
                        footer={(handleOk) => (
                            <>
                                <Button type="primary" onClick={handleOk}>OK</Button>
                            </>
                        )}
                    >
                        <button type="button" className="bg-transparent hover:bg-blue-600 text-blue-700 hover:text-white py-3 px-6 border border-blue-600 hover:border-transparent rounded text-justify cursor-pointer">
                            <SearchOutlined style={{ fontSize: 15 }} /> Detail Project
                        </button>
                    </ModalComponent>

                    {detailProject.data.status === 'done' && (
                        <ModalComponent
                            title="Cek Hasil"
                            content={
                                <>
                                    <label style={{marginBottom: 8, display: 'block'}}> Nama Project </label>
                                    <Input value={detailProject?.data.nama_project} readOnly style={{marginBottom: 16}} />

                                    <label style={{marginBottom: 8, display: 'block'}}> Penanggung Jawab </label>
                                    <Input value={detailProject?.data.user.nama} readOnly style={{marginBottom: 16}} />

                                    <label style={{marginBottom: 8, display: 'block'}}> Waktu Selesai </label>
                                    <Input value={formatTimeStr(detailProject?.data.updated_at)} readOnly style={{marginBottom: 16}} />

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
                                        className="redo-button"
                                        onClick={() => openNote(idProject)}
                                    >
                                        Redo
                                    </Button>
                                    
                                    <Button 
                                        type='primary' 
                                        className="approve-button"
                                        onClick={() => acceptProject(idProject)}
                                    >
                                        Approve
                                    </Button>
                                </>
                            )}
                        >
                            <button type="button" className="bg-transparent hover:bg-blue-500 text-blue-700 hover:text-white py-3 px-6 border border-blue-500 hover:border-transparent rounded cursor-pointer">
                                <SearchOutlined /> Cek Hasil
                            </button>
                        </ModalComponent>
                    )}
                    
                    <button 
                        type="button"
                        className="border py-3 px-6 rounded"
                        style={buttonStatusStyle(detailProject.data.status)}
                    >
                        {detailProject.data.status}
                    </button>
                    
                </div>
            </div>
            
                <div style={{ padding: 24, minHeight: '100vh', backgroundColor: '#FFFFFF', borderRadius: 15, marginTop: 30 }}>
                    <DetailProject
                        pageTeam={pageTeam}
                        pageSizeTeam={pageSizeTeam}
                        handlePageChange={handlePageChange}
                        nama_team={detailProject?.data.nama_team}
                        idProject={idProject}
                        teamData={teamProject}
                        formatTimeStr={formatTimeStr}
                    />
                </div>
        </>
    );
};

export default Page;