'use client';
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Alert, Spin, Button, Modal, Input, Row, Tag } from "antd";
import { ArrowLeftOutlined, SearchOutlined, EyeOutlined } from "@ant-design/icons";
import { JwtToken } from "#/utils/jwtToken";
import { config } from "#/config/app";
import { projectRepository } from "#/repository/project";
import { tugasRepository } from "#/repository/tugas";
import ModalDetailProject from "#/app/(authenticated)/team-lead/project/[idProject]/[nama-project]/modal/modalDetailProject";
import ModalDetailTask from "./modalDetailTask";
import Link from "next/link";
import TextArea from "antd/es/input/TextArea";
import ModalComponent from "#/component/ModalComponent";
import TableComponent from "#/component/TableComponent";

const Page = () => {
    const params = useParams();
    const idUser = params?.idUser as string;
    const idProject = params?.idProject as string;
    const [taskCountAll, setTaskCountAll] = useState<{ [key: string]: number | null }>({});
    const [pageTeam, setPageTeam] = useState(1);
    const [pageSizeTeam, setPageSizeTeam] = useState(5);
    const handlePageChangeTeam = (newPage: number, newPageSize: number) => {
        setPageTeam(newPage);
        setPageSizeTeam(newPageSize);
    };

    const [pageTask, setPageTask] = useState(1);
    const [pageSizeTask, setPageSizeTask] = useState(5);
    const handlePageChangeTask = (newPage: number, newPageSize: number) => {
        setPageTask(newPage);
        setPageSizeTask(newPageSize);
    };

    const [taskCountSelesai, setTaskCountSelesai] = useState<{ [key: string]: number | null }>({});
    
    const { data: detailProject, mutate }
    = projectRepository.hooks.useDetailProject(idProject);
    
    const { data: teamProject, isValidating: validateTeam}
    = projectRepository.hooks.useTeamByProject(idProject, pageTeam, pageSizeTeam);

    const {data: taskProject, isValidating: validateTask} 
    = tugasRepository.hooks.useGetTugasByProject(idProject, pageTask, pageSizeTask);
    
    const token = JwtToken.getAuthData().token || null;
    
    const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
    const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);
    const [noteProject, setNoteProject] = useState<string>('');

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

    // const loading = validateDetailProject
    // const error = errorDetailProject

    // if (loading) {
    //     return <Spin style={{ textAlign: 'center', padding: 20 }} />
    // }
    // if (error) {
    //     return <Alert message="Error fetching data" type="error" />;
    // }

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

    // Table Team
    useEffect(() => {
        const fetchTugas = async () => {
            try {
                if (teamProject && token) {
                    const counts = await Promise.all(teamProject.data.map(async (record: any) => {
                        const idKaryawan = record.karyawan.id;
                        const response = await fetch(`http://localhost:3222/tugas/${idKaryawan}/project/${idProject}/count-tugas`,
                            {
                                method: "GET",
                                headers: {
                                    "Content-Type": "application/json",
                                    "Authorization": `Bearer ${token}`,
                                },
                            }
                        );
                        const data = await response.json();
                        return { idKaryawan, countAll: data.countAll, countSelesai: data.countSelesai };
                    }));

                    const countAll = counts.reduce((acc: any, { idKaryawan, countAll }) => {
                        acc[idKaryawan] = countAll;
                        return acc;
                    }, {});

                    const countSelesai = counts.reduce((acc: any, { idKaryawan, countSelesai }) => {
                        acc[idKaryawan] = countSelesai;
                        return acc;
                    }, {});

                    setTaskCountAll(countAll);
                    setTaskCountSelesai(countSelesai);
                }
            } catch (error) {
                console.error('Error fetching task counts:', error);
            }
        };

        if (teamProject) {
            fetchTugas();
        }
    }, [teamProject, idProject]);

        const columnTeam = [
            {
                title: 'Nama Karyawan',
                key: 'karyawan.nama',
                render: (record: any) => record.karyawan ? record.karyawan.user.nama : 'N/A',
            },
            {
                title: 'NIP',
                key: 'nik',
                render: (record: any) => record.karyawan ? record.karyawan.nik : 'N/A',
            },
            {
                title: 'Job',
                key: 'job',
                render: (record: any) => record.karyawan ? record.karyawan.job.nama_job : 'N/A',
            },
            {
                title: 'Jumlah Tugas',
                key: 'jumlah_tugas',
                render: (record: any) => {
                    const idKaryawan = record.karyawan.id;
                    const data = taskCountAll[idKaryawan] !== undefined ? taskCountAll[idKaryawan] : 'Loading...';
                    return data;
                },
            },
            {
                title: 'Tugas Selesai',
                key: 'tugas_selesai',
                render: (record: any) => {
                    const idKaryawan = record.karyawan.id;
                    const data = taskCountSelesai[idKaryawan] !== undefined ? taskCountSelesai[idKaryawan] : 'Loading...';
                    return data;
                },
            },
        ];

    // Table Task 
    const columns = [
        {
            title: 'Tugas',
            dataIndex: 'nama_tugas',
            key: 'nama_tugas'
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => {
                const getColor = () => {
                    switch(status) {
                        case 'pending': return '#FFC107';
                        case 'on-progress': return '#00BCD4';
                        case 'redo': return '#F44336';
                        case 'done': return '#2196F3';
                        default: return '#4CAF50';
                    }
                };

                return <Tag color={getColor()} style={{fontSize: 12}}>{status}</Tag>;
            }
        },
        {
            title: 'Deadline',
            dataIndex: 'deadline',
            key: 'deadline'
        },
        {
            title: 'Waktu Update',
            dataIndex: 'updated_at',
            key: 'waktu update',
            render: (text: string) => formatTimeStr(text)
        },
        {
            title: 'Aksi',
            key: 'aksi',
            render: (record: any) => {
                const idTask = record.id;

                return (
                    <>
                        <ModalComponent
                            title="Detail Tugas"
                            content={<ModalDetailTask idTask={idTask} />}
                            footer={(handleOk) => (
                                <>
                                    <Button type="primary" onClick={handleOk}>OK</Button>
                                </>
                            )}
                        >
                            <Button
                                style={{
                                    backgroundColor: 'rgba(244, 247, 254, 1)',
                                    color: '#1890FF',
                                    border: 'none',
                                }}
                            >
                                <EyeOutlined/> Detail
                            </Button>
                        </ModalComponent>
                    </>
                );
            }
        }
    ];

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
                        {detailProject?.data.nama_project}
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

                    {detailProject?.data.status === 'done' && (
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
                        style={buttonStatusStyle(detailProject?.data.status)}
                    >
                        {detailProject?.data.status}
                    </button>
                    
                </div>
            </div>
            
            <div style={{ padding: 24, minHeight: '100vh', backgroundColor: '#FFFFFF', borderRadius: 15, marginTop: 30 }}>
                
                {/* Table Team */}
                <Row className="mb-4">
                    <h1 className="text-xl flex items-center">
                        <span className="text-2xl">{detailProject?.data.nama_team}</span>
                    </h1>
                </Row>
            
                {/* Perbaikan Table */}
                <TableComponent
                    data={teamProject?.data}
                    columns={columnTeam}
                    loading={validateTeam}
                    page={pageTeam}
                    pageSize={pageSizeTeam}
                    total={teamProject?.count}
                    pagination={true}
                    className="w-full custom-table"
                    onPageChange={handlePageChangeTeam}
                />

                {/* Table Task */}
                <Row className="mb-4 mt-5">
                        <h1 className="text-xl flex items-center">
                            <span className="text-2xl">Task Project</span>
                        </h1>
                </Row>

                <TableComponent
                data={taskProject?.data}
                columns={columns}
                loading={validateTask}
                page={pageTask}
                pageSize={pageSizeTask}
                total={taskProject?.count}
                pagination={true}
                className="w-full custom-table"
                onPageChange={handlePageChangeTask}
            />

            </div>
        </>
    );
};

export default Page;