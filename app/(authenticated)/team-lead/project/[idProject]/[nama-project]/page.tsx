'use client'
import React, { useEffect, useState } from "react";
import { Button, Modal, Row, Table, Tabs, TabsProps, Tag, message } from "antd";
import { useParams } from "next/navigation";
import { ArrowLeftOutlined, EditOutlined, SearchOutlined, PlusOutlined, EyeOutlined } from "@ant-design/icons";
import { projectRepository } from "#/repository/project";
import { tugasRepository } from "#/repository/tugas";
import ModalComponent from "#/component/ModalComponent";
import ModalDetailProject from "./modal/modalDetailProject";
import Link from "next/link";
import { formatTimeStr } from "#/utils/formatTime";
import ModalUbahStatusProject from "./modal/modalUbahStatusProject";
import Container from "#/component/ContainerComponent";
import { JwtToken } from "#/utils/jwtToken";
import ModalUbahNamaTeam from "./modal/modalUbahNamaTeam";
import ModalTambahAnggota from "./modal/modalTambahAnggota";
import TableComponent from "#/component/TableComponent";
import ModalDetailTugas from "./modal/modalDetailTugas";
import ModalTambahTugas from "./modal/modalTambahTugas";
import ModalCekTugas from "./modal/modalCekTugas";
import TextArea from "antd/es/input/TextArea";

const DetailProject: React.FC<{
    nama_team: any,
    status_project: any,
    idProject: any,
    mutateProject: any,
}> = ({ nama_team, status_project, idProject, mutateProject }) => {
    const token = JwtToken.getAuthData().token || null;

    //========================== useState ============================
    /**
     * useState count tugas 
     */
    const [countAll, setTaskCountAll] = useState<{ [key: string]: number | null }>({});
    const [countSelesai, setTaskCountSelesai] = useState<{ [key: string]: number | null }>({});

    /**
     * Form Tambah team
     */
    const [selectedKaryawan, setSelectedKaryawan] = useState<string | undefined>(undefined);
    const [newNamaTeam, setNewNamaTeam] = useState(nama_team);

    /***
     * Ubah nama team
     */
    const [namaTeam, setNamaTeam] = useState('');

    /**
     * Form tambah tugas
     */
    const [formData, setFormData] = useState<{
        nama_tugas: string;
        deskripsi_tugas: string;
        deadline: string;
        id_project: string;
        id_karyawan: string;
        file_tugas: File | null;
    }>({
        nama_tugas: '',
        deskripsi_tugas: '',
        deadline: '',
        id_project: idProject,
        id_karyawan: '',
        file_tugas: null,
    });

    /**
     * Modal tambah tugas
     */
    const [modalTambahTugas, setModalTambahTugas] = useState(false);

    /**
     * Modal tambah anggota team
     */
    const [modalTambahAnggotaTeam, setModalTambahAnggotaTeam] = useState(false);

    /**
     * Modal ubah nama team
     */
    const [modalUbahNamaTeam, setModalUbahNamaTeam] = useState(false);

    //========================== pagination ============================
    /**
     * Pagination table team
     */
    const [pageTeam, setPageTeam] = useState(1);
    const [pageSizeTeam, setPageSizeTeam] = useState(5);
    const handlePageTeamChange = (newPage: number, newPageSize: number) => {
        setPageTeam(newPage);
        setPageSizeTeam(newPageSize);
    };

    /**
     * Pagination table tugas
     */
    const [pageTugas, setPageTugas] = useState(1);
    const [pageSizeTugas, setPageSizeTugas] = useState(5);
    const handlePageChangeTugas = (newPage: number, newPageSize: number) => {
        setPageTugas(newPage);
        setPageSizeTugas(newPageSize);
    };

    //========================== Hooks ============================
    /**
     * Hook team
     */
    const { data: teamProject, isValidating: validateTeam, mutate: mutateTeam } = projectRepository.hooks.useTeamByProject(idProject, pageTeam, pageSizeTeam);

    /**
     * Hook tugas
     */
    const { data: tugasProject, isValidating: validateTugas, mutate: mutateTugas } = tugasRepository.hooks.useGetTugasByProject(idProject, pageTugas, pageSizeTugas);

    //========================== function & handle ============================
    /**
     * Handle tambah tugas 
     */
    const handleCreateTugas = (tugasData: {
        nama_tugas: string;
        deskripsi_tugas: string;
        deadline: string;
        id_project: string;
        id_karyawan: string;
        file_tugas: File | null;
    }) => {
        setFormData(tugasData);
    }
    /**
    * FUnction tambah tugas 
    */
    const createTask = async () => {
        const { nama_tugas, deskripsi_tugas, deadline, id_project, id_karyawan, file_tugas } = formData;
        if (!nama_tugas || !deskripsi_tugas || !deadline || !id_project || !id_karyawan || !file_tugas) {
            message.warning("Harap isi semua field yang diperlukan.");
            return;
        } else if (file_tugas?.type !== 'application/pdf') {
            message.warning("File tugas harus berupa PDF.");
            return;
        } else if (file_tugas?.size > 2 * 1024 * 1024) { // Maksimal 2MB
            message.warning("Ukuran file tidak boleh lebih dari 2MB.");
            return;
        } else {
            try {
                await tugasRepository.api.createTugas({
                    nama_tugas: nama_tugas,
                    deskripsi_tugas: deskripsi_tugas,
                    deadline: deadline,
                    id_project: id_project,
                    id_karyawan: id_karyawan,
                    file_tugas: file_tugas,
                })
                mutateTugas();
                Modal.success({
                    title: 'Berhasil',
                    content: 'Berhasil menambah Tugas Baru',
                    onOk: () => {
                        setFormData({
                            nama_tugas: '',
                            deskripsi_tugas: '',
                            deadline: '',
                            id_project,
                            id_karyawan: '',
                            file_tugas: null,
                        });
                        setModalTambahTugas(false);
                    },
                });
            } catch (error) {
                console.error('Gagal menambah Tugas', error);
            }
        }
    }

    /**
     * Handle tambah anggota team
     */
    const tambahKaryawan = async () => {
        if (!selectedKaryawan) {
            message.warning('Pilih Karyawan Terlebih Dahulu');
            return;
        }
        try {
            await projectRepository.api.createAnggotaTeam({
                id_project: idProject,
                id_karyawan: selectedKaryawan
            });
            mutateTeam();
            Modal.success({
                title: 'Anggota Ditambahkan',
                content: 'Berhasil menambahkan anggota ke dalam tim!',
                okText: 'OK',
                cancelText: 'Tutup',
            });
            setModalTambahAnggotaTeam(false);
            setSelectedKaryawan(undefined);
        } catch (error) {
            console.log('Gagal menambahkan anggota:', error);
        }
    };

    /**
    * Handle ubah nama team
    */
    const ubahNamaTeam = async () => {
        if (newNamaTeam === undefined || newNamaTeam === null) {
            message.warning('Masukkan Nama Team terlebih dahulu!')
        } else {

            try {
                await projectRepository.api.updateNamaTeam(idProject, {
                    nama_team: newNamaTeam
                })
                mutateProject();
                setModalUbahNamaTeam(false);
                Modal.success({
                    title: 'Berhasil',
                    content: 'Berhasil mengubah nama team',
                    onOk() {
                        console.log('OK clicked');
                    },
                    onCancel() {
                        console.log('Cancel clicked');
                    }
                });

            } catch (error) {
                console.error('Gagal mengubah nama team:', error);
            }
        }
    }

    /**
     * useEffect nama team
     */
    useEffect(() => {
        setNamaTeam(nama_team);
    }, [nama_team]);

    /**
     * useEffect jumlah tugas
     */
    useEffect(() => {
        const fetchTugas = async () => {
            try {
                if (teamProject) {
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
    }, [teamProject, idProject, tugasProject]);

    //========================== Column Table ============================
    /**
     * Table team
     */
    const columnTeam = [
        {
            title: 'Nama Karyawan',
            key: 'karyawan.nama',
            render: (record: any) => record.karyawan ? record.karyawan.user.nama : 'N/A',
        },
        {
            title: 'NIK',
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
                const data = countAll[idKaryawan] !== undefined ? countAll[idKaryawan] : 'Loading...';
                return data;
            },
        },
        {
            title: 'Tugas Selesai',
            key: 'tugas_selesai',
            render: (record: any) => {
                const idKaryawan = record.karyawan.id;
                const data = countSelesai[idKaryawan] !== undefined ? countSelesai[idKaryawan] : 'Loading...';
                return data;
            },
        },
    ];

    /**
     * Table tugas
     */
    const columnTugas = [
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
                    switch (status) {
                        case 'pending': return '#FFC107';
                        case 'on-progress': return '#00BCD4';
                        case 'redo': return '#F44336';
                        case 'done': return '#2196F3';
                        default: return '#4CAF50';
                    }
                };

                return <Tag color={getColor()} style={{ fontSize: '12px' }}>{status}</Tag>;
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
                const idTugas = record.id;

                return (
                    <div>
                        <ModalComponent
                            title={'Detail Tugas'}
                            content={<ModalDetailTugas idTugas={idTugas} />}
                            footer={(handleCancel, handleOk) => (
                                <div>
                                    <Button type="primary" onClick={handleOk}>OK</Button>
                                </div>
                            )}
                        >
                            <Button
                                style={{
                                    backgroundColor: 'rgba(244, 247, 254, 1)',
                                    color: '#1890FF',
                                    border: 'none',
                                }}
                            >
                                <EyeOutlined /> Detail
                            </Button>
                        </ModalComponent>
                    </div>

                );
            }
        },
    ];

    return (
        <div>
            {/* Table Team */}
            <Row className="content-center w-full mb-4 justify-between">
                <div>
                    <h1 className="text-xl flex items-center">
                        <span className="text-2xl">{namaTeam}</span>
                        {(status_project !== 'done' && status_project !== 'approved') && (
                            <ModalComponent
                                title={'Ubah Nama Team'}
                                content={<ModalUbahNamaTeam nama_team={nama_team} onNamaTeamChange={setNewNamaTeam} />}
                                footer={() => (
                                    <div>
                                        <Button onClick={() => setModalUbahNamaTeam(true)}>Cancel</Button>
                                        <Button type="primary" onClick={ubahNamaTeam}>Ubah</Button>
                                    </div>
                                )}
                                onCancel={() => { setNewNamaTeam(nama_team); setModalUbahNamaTeam(false) }}
                                visible={modalUbahNamaTeam}
                            >
                                <a onClick={() => setModalUbahNamaTeam(true)}>
                                    <EditOutlined className="ml-2 text-xl" />
                                </a>
                            </ModalComponent>
                        )}
                    </h1>
                </div>
                <div>
                    {(status_project !== 'done' && status_project !== 'approved') && (
                        <ModalComponent
                            title={'Tambah Anggota Team'}
                            content={<ModalTambahAnggota onSelectKaryawan={setSelectedKaryawan} />}
                            visible={modalTambahAnggotaTeam}
                            footer={() => (
                                <div>
                                    <Button onClick={() => setModalTambahAnggotaTeam(false)}>Cancel</Button>
                                    <Button type="primary" onClick={tambahKaryawan}>Tambah</Button>
                                </div>
                            )}
                            onOk={tambahKaryawan}
                            onCancel={() => { setSelectedKaryawan(undefined); setModalTambahAnggotaTeam(false) }}
                        >
                            <button
                                className="bg-[#1890ff] hover:bg-blue-700 text-white py-2 px-2 border border-blue-700 rounded"
                                onClick={() => setModalTambahAnggotaTeam(true)}>
                                <PlusOutlined /> Tambah Anggota
                            </button>
                        </ModalComponent>
                    )}
                </div>
            </Row>
            <Row className="w-full">
                <TableComponent
                    data={teamProject?.data}
                    columns={columnTeam}
                    page={pageTeam}
                    pageSize={pageSizeTeam}
                    loading={validateTeam}
                    total={teamProject?.count}
                    pagination={true}
                    className="w-full custom-table"
                    onPageChange={handlePageTeamChange}
                />
            </Row>
            {/* Table Tugas  */}
            <Row className="content-center w-full mb-4 justify-between mt-5">
                <div>
                    <h1 className="text-xl flex items-center">
                        <span className="text-2xl">Task Project</span>
                    </h1>
                </div>
                <div>
                    {(status_project !== 'done' && status_project !== 'approved') && (
                        <ModalComponent
                            title={'Tambah Tugas Baru'}
                            content={<ModalTambahTugas create_tugas={handleCreateTugas} karyawan={teamProject?.data} idProject={idProject} />}
                            footer={(handleCancel) => (
                                <div>
                                    <Button onClick={handleCancel}>Cancel</Button>
                                    <Button type="primary" onClick={createTask} >Tambah</Button>
                                </div>
                            )}
                            visible={modalTambahTugas}
                            onCancel={() => setModalTambahTugas(false)}
                        >
                            <button className="bg-[#1890ff] hover:bg-blue-700 text-white py-2 px-2 border border-blue-700 rounded"
                                onClick={() => {
                                    setFormData({
                                        nama_tugas: '',
                                        deskripsi_tugas: '',
                                        deadline: '',
                                        id_project: idProject,
                                        id_karyawan: '',
                                        file_tugas: null
                                    });
                                    setModalTambahTugas(true);
                                }}>
                                <PlusOutlined /> Tambah Tugas
                            </button>
                        </ModalComponent>
                    )}
                </div>
            </Row>
            <Row className="w-full">
                <TableComponent
                    data={tugasProject?.data}
                    columns={columnTugas}
                    page={pageTugas}
                    pageSize={pageSizeTugas}
                    total={tugasProject?.count}
                    loading={validateTugas}
                    pagination={true}
                    className="w-full custom-table"
                    onPageChange={handlePageChangeTugas}
                />
            </Row>
        </div>
    );
};

const TugasDiselesaikan: React.FC<{
    id_project: string;
}> = ({ id_project }) => {
    const [isNoteModalVisible, setIsNoteModalVisible] = useState(false);
    const [currentTugasId, setCurrentTugasId] = useState<string | null>(null);
    const [note, setNote] = useState<string>('');
    const [pageTugasSelesai, setPageTugasSelesai] = useState(1);
    const [pageSizeTugasSelesai, setPageSizeTugasSelesai] = useState(5);
    const handlePageTugasSelesaiChange = (newPage: number, newPageSize: number) => {
        setPageTugasSelesai(newPage);
        setPageSizeTugasSelesai(newPageSize);
    };
    /**
     * Hooks tugas selesai
    */
    const { data: tugasSelesai, isValidating: validateTugasSelesai, mutate: mutateTugasSelesai } = tugasRepository.hooks.useTugasSelesai(id_project, pageTugasSelesai, pageSizeTugasSelesai);

    const acceptTugas = async (id_tugas: string) => {
        try {
            await tugasRepository.api.updateStatusTugas(id_tugas, {
                status: 'approved'
            });
            mutateTugasSelesai();
            Modal.success({
                title: 'Tugas Diterima',
                content: 'Tugas Telah Diterima',
                cancelText: 'Tutup',
            });
        } catch (error) {
            console.error('Gagal mengupdate Tugas', error);
        }
    };

    const redoTugas = async (id_tugas: string, note: any) => {
        try {
            await tugasRepository.api.updateStatusTugas(id_tugas, {
                status: 'redo',
                note: note
            });
            mutateTugasSelesai();
            Modal.success({
                title: 'Tugas Dikembalikan',
                content: 'Tugas telah dikembalikan ke karyawan',
                okText: 'Tutup',
            });
        } catch (error) {
            console.error('Gagal mengupdate Tugas', error);
        }
    };

    const openNote = (id_tugas: string) => {
        setCurrentTugasId(id_tugas);
        setIsNoteModalVisible(true);
    };

    const handleNoteSubmit = async () => {
        if (currentTugasId && note.trim()) {
            await redoTugas(currentTugasId, note);
            setIsNoteModalVisible(false);
            setNote('');
            setCurrentTugasId(null);
        } else {
            // Tampilkan peringatan jika catatan kosong
            Modal.warning({
                title: 'Catatan Diperlukan',
                content: 'Harap masukkan catatan sebelum menolak tugas.',
                okText: 'OK',
            });
        }
    };
    const handleNoteCancel = () => {
        setIsNoteModalVisible(false);
        setNote('');
        setCurrentTugasId(null);
    };


    const columnTugasDiselesaikan = [
        {
            title: 'Tugas',
            dataIndex: 'nama_tugas',
            key: 'nama_tugas'
        },
        {
            title: 'Nama Karyawan',
            key: 'karyawan.nama',
            render: (record: any) => record.karyawan ? record.karyawan.user.nama : 'N/A',
        },
        {
            title: 'Waktu Update',
            dataIndex: 'updated_at',
            key: 'updated_at',
            render: (text: string) => formatTimeStr(text)
        },
        {
            title: 'Aksi',
            key: 'aksi',
            render: (record: any) => {
                const idTugas = record?.id;
                console.log(idTugas)
                return (
                    <div>
                        <ModalComponent
                            title={'Detail Tugas'}
                            content={<ModalCekTugas idTugas={idTugas} />}
                            footer={() => (
                                <div>
                                    <Button
                                        type="primary"
                                        className="redo-button"
                                        onClick={() => openNote(idTugas)}
                                    >
                                        Redo
                                    </Button>

                                    <Button
                                        type="primary"
                                        className="approve-button"
                                        onClick={() => acceptTugas(idTugas)}
                                    >
                                        Approve
                                    </Button>
                                </div>
                            )}
                        >
                            <Button
                                style={{
                                    backgroundColor: 'rgba(244, 247, 254, 1)',
                                    color: '#1890FF',
                                    border: 'none',
                                }}
                            >
                                <SearchOutlined /> Cek Tugas
                            </Button>
                        </ModalComponent>

                    </div>

                );
            }
        }
    ];
    return (
        <div className="mt-5">
            <TableComponent
                data={tugasSelesai?.data}
                columns={columnTugasDiselesaikan}
                loading={validateTugasSelesai}
                page={pageTugasSelesai}
                pageSize={pageSizeTugasSelesai}
                total={tugasSelesai?.count}
                pagination={true}
                className="w-full custom-table"
                onPageChange={handlePageTugasSelesaiChange}
            />
            <ModalComponent
                title={'Note'}
                onCancel={handleNoteCancel}
                content={
                    <div>
                        <p>Masukkan Note :</p>
                        <TextArea
                            rows={4}
                            placeholder="Masukkan note..."
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            required
                        />
                    </div>
                }
                footer={() => (
                    <div>
                        <Button onClick={handleNoteCancel}>
                            Batal
                        </Button>
                        <Button type="primary" onClick={handleNoteSubmit}>
                            OK
                        </Button>
                    </div>
                )}
                visible={isNoteModalVisible}
            />
        </div>
    );
};

// Page Component
const Page = () => {
    const params = useParams();
    const idProject = params?.idProject as string;

    //============= useState Modal =====================================
    /**
     * Modal ubah status project
     */
    const [modalUbahStatusProject, setModalUbahStatusProject] = useState(false);

    //============= Hooks =====================================
    /**
     * Hooks detail Project
     */
    const { data: detailProject, mutate: mutateDetailProject } = projectRepository.hooks.useDetailProject(idProject);

    //============= useState =====================================
    /**
     * Ubah status project
     */
    const [formData, setFormData] = useState<{ status: string; file_bukti: File | null, fileName: string }>({
        status: detailProject?.data.status ? detailProject.data.status : null,
        file_bukti: null,
        fileName: ''
    });
    useEffect(() => {
        if (detailProject?.data.status) {
            setFormData((prev) => ({
                ...prev,
                status: detailProject.data.status
            }));
        }
    }, [detailProject]);

    //============= Function & Handle =====================================
    /**
     * Mengecek dan menentukan warna tombol status
     */
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

    /**
     * Handle update status project
     */
    const updateStatus = async () => {
        const { status, file_bukti } = formData;
        if (status === detailProject?.data.status) {
            setModalUbahStatusProject(false);
            return;
        }
        if (status === 'done' && file_bukti === null || file_bukti === undefined) {
            message.warning('Masukkan file terlebih dahulu!')
            return;
        } else if (status === 'done' && file_bukti!.type !== 'application/pdf') {
            message.warning("File harus berupa PDF.");
            return;
        } else if (status === 'done' && file_bukti!.size > 2 * 1024 * 1024) { // Maksimal 2MB
            message.warning("Ukuran file tidak boleh lebih dari 2MB.");
            return;
        } else {
            try {
                await projectRepository.api.updateStatusProject(detailProject.data.id, {
                    status_project: status,
                    file_hasil_project: file_bukti
                });
                mutateDetailProject();
                setModalUbahStatusProject(false);
                setFormData({
                    status: detailProject?.data.status ? detailProject.data.status : null,
                    file_bukti: null,
                    fileName: ''
                })
                Modal.success({
                    title: 'Berhasil',
                    content: 'Berhasil mengubah status project',
                });
            } catch (error) {
                setFormData({
                    status: detailProject?.data.status ? detailProject.data.status : null,
                    file_bukti: null,
                    fileName: ''
                })
                console.error('Gagal mengubah status project:', error);
            }
        }
    };

    //============= Tab Handle =====================================
    const [activeKey, setActiveKey] = useState<string>('DetailProject');
    const onChange: TabsProps['onChange'] = (key) => {
        setActiveKey(key);
    };
    const items: TabsProps['items'] = [
        {
            key: 'DetailProject', label: 'Detail Project', children: <DetailProject
                nama_team={detailProject?.data.nama_team}
                idProject={idProject}
                status_project={detailProject?.data.status}
                mutateProject={mutateDetailProject}
            />
        },
        { key: 'TugasDiselesaikan', label: 'Tugas Diselesaikan', children: <TugasDiselesaikan id_project={idProject} /> },
    ];

    return (
        <div>
            {/* Header Detail Project */}
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <button className="bg-blue-500 hover:bg-blue-700 text-black font-bold py-1 px-2 rounded-full w-8 h-8 border-0 flex justify-center items-center ml-2">
                        <Link href={`/team-lead/project`} className="no-underline text-black">
                            <ArrowLeftOutlined />
                        </Link>
                    </button>
                    <h3 style={{ marginLeft: '8px', marginTop: '10px', fontSize: '25px', fontWeight: 'bold', fontFamily: 'Roboto, sans-serif' }}>
                        {detailProject?.data.nama_project}
                    </h3>
                </div>
                <div style={{ display: 'flex', gap: 20, fontFamily: 'Arial', marginTop: 5, marginBottom: 5 }}>
                    <ModalComponent
                        title={'Detail Project'}
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
                            <div>
                                <Button type="primary" onClick={handleOk}>OK</Button>
                            </div>
                        )}
                    >
                        <button type="button" className="bg-transparent hover:bg-blue-600 text-blue-700 hover:text-white py-3 px-6 border border-blue-600 hover:border-transparent rounded text-justify">
                            <SearchOutlined style={{ fontSize: 15 }} /> Detail Project
                        </button>
                    </ModalComponent>
                    {detailProject?.data.status !== 'approved' && (
                        <ModalComponent
                            title={'Ubah Status Project'}
                            visible={modalUbahStatusProject}
                            content={
                                <ModalUbahStatusProject
                                    detailProject={detailProject}
                                    setFormData={setFormData}
                                />
                            }
                            onCancel={() => setModalUbahStatusProject(false)}
                            footer={(handleCancel) => (
                                <div>
                                    <Button htmlType="button" onClick={handleCancel}>Cancel</Button>
                                    <Button type="primary" onClick={updateStatus}>OK</Button>
                                </div>
                            )}
                        >
                            <button type="button"
                                className="bg-transparent hover:bg-blue-500 text-blue-700 hover:text-white py-3 px-6 border border-blue-500 hover:border-transparent rounded"
                                onClick={() => setModalUbahStatusProject(true)}
                            >
                                <EditOutlined /> Ubah Status
                            </button>
                        </ModalComponent>
                    )}

                    <button
                        type="button"
                        className="border py-3 px-6 rounded"
                        style={getButtonStyles(detailProject?.data.status)}
                    >
                        {detailProject?.data.status}
                    </button>
                </div>
            </div>

            {/* Content */}
            <Container
                style={{
                    paddingTop: 0,
                    marginTop: 30
                }}
            >
                <Tabs activeKey={activeKey} items={items} onChange={onChange} />
            </Container>
        </div>
    );
};

export default Page;
