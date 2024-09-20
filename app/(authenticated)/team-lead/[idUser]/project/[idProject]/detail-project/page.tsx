'use client'
import React, { useEffect, useState } from "react";
import { Alert, Button, Modal, Row, Spin, Table, Tabs, TabsProps, Tag } from "antd";
import { ArrowLeftOutlined, FileExcelOutlined, EditOutlined, EyeOutlined, SearchOutlined } from "@ant-design/icons";
import Link from "next/link";
import { useParams } from "next/navigation";
import { projectRepository } from "#/repository/project";
import ModalComponent from "#/component/ModalComponent";
import ModalDetailTugas from "./modalDetailTugas";
import ModalCekTugas from "./modalCekTugas";
import ModalTambahAnggota from "./modalTambahAnggota";
import { config } from "#/config/app";
import ModalUbahStatusProject from "./modalUbahStatusProject";
import TextArea from "antd/es/input/TextArea";
import ModalUbahNamaTeam from "./modalUbahNamaTeam";

const formatTimeStr = (dateStr: string) => {
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
};

const ButtonExportExcel: React.FC<{
    status: string,
    file_project: string,
    idProject: string,
    nama_team: string,
    nama_project: string
}> = ({ status, file_project, idProject, nama_team, nama_project }) => {
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


    return (
        <div style={{ display: 'flex', gap: 20, fontFamily: 'Arial', marginTop: 5, marginBottom: 5 }}>
            <a href={filePdfUrl} target='_blank' rel="noopener noreferrer">
                <button className="bg-transparent hover:bg-green-600 text-green-700 hover:text-white py-3 px-6 border border-green-600 hover:border-transparent rounded text-justify">
                    <FileExcelOutlined style={{ fontSize: 15 }} /> Export To Excel
                </button>
            </a>

            {/* Tombol Ubah Status hanya muncul jika status bukan "approved" */}
            {status !== 'approved' && (
                <>
                    <ModalComponent
                        title={'Ubah Status Project'}
                        content={<ModalUbahStatusProject idProject={idProject} status_project={status} nama_team={nama_team} nama_project={nama_project} />}
                        footer={(handleCancel, handleOk) => (
                            <div>
                                <Button onClick={handleCancel}>Cancel</Button>
                                <Button type="primary" onClick={handleOk}>Ok</Button>
                            </div>
                        )}
                    >
                        <button className="bg-transparent hover:bg-blue-500 text-blue-700 hover:text-white py-3 px-6 border border-blue-500 hover:border-transparent rounded">
                            <EditOutlined /> Ubah Status
                        </button>
                    </ModalComponent>
                </>
            )}
            <button
                className="border py-3 px-6 rounded"
                style={getButtonStyles(status)}
            >
                {status}
            </button>
        </div>
    );
};


const TableTeam: React.FC<{ data: any, nama_team: string, idProject: string, refreshTable: () => void }> = ({ data, nama_team, idProject, refreshTable }) => {
    const [countAll, setTaskCountAll] = useState<{ [key: string]: number | null }>({});
    const [countSelesai, setTaskCountSelesai] = useState<{ [key: string]: number | null }>({});
    const [selectedKaryawan, setSelectedKaryawan] = useState<string | undefined>(undefined);
    const [old_nama_team, setNamaTeam] = useState('');
    const [newNamaTeam, setNewNamaTeam] = useState(nama_team);

    useEffect(() => {
        const fetchTugas = async () => {
            try {
                if (data) {
                    const counts = await Promise.all(data.map(async (record: any) => {
                        const idKaryawan = record.karyawan.id;
                        const response = await fetch(`http://localhost:3222/tugas/${idKaryawan}/project/${idProject}/count-tugas`);
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

        if (data) {
            fetchTugas();

        }
    }, [data, idProject]);

    const tambahKaryawan = async () => {
        if (!selectedKaryawan) {
            alert('Pilih Karyawan Terlebih Dahulu');
            return;
        }
        try {
            await projectRepository.api.createAnggotaTeam({
                id_project: idProject,
                id_karyawan: selectedKaryawan
            });
            setSelectedKaryawan(undefined);

            refreshTable()
            Modal.success({
                title: 'Anggota Ditambahkan',
                content: 'Berhasil menambahkan anggota ke dalam tim!',
                okText: 'OK',
                cancelText: 'Tutup',
                onOk() {
                    console.log('OK clicked');
                },
                onCancel() {
                    console.log('Cancel clicked');
                }
            });
        } catch (error) {
            console.error('Gagal menambahkan anggota:', error);
        }
    };

    const ubahNamaTeam = async () => {
        if (newNamaTeam === undefined || newNamaTeam === null) {
            alert('Masukkan Nama Team terlebih dahulu!')
        }
        try {
            await projectRepository.api.updateNamaTeam(idProject, {
                nama_team: newNamaTeam
            })
            refreshTable()
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

    return (
        <div>
            <Row className="content-center w-full mb-4 justify-between">
                <div>
                    <h1 className="text-xl flex items-center">
                        <span className="text-2xl">{nama_team}</span>
                        <ModalComponent
                            title={'Ubah Nama Team'}
                            content={<ModalUbahNamaTeam nama_team={nama_team} onNamaTeamChange={setNewNamaTeam} />}
                            footer={(handleCancel) => (
                                <div>
                                    <Button onClick={handleCancel}>Cancel</Button>
                                    <Button type="primary" onClick={ubahNamaTeam}>Ubah</Button>
                                </div>
                            )}
                            onOk={ubahNamaTeam}
                            onCancel={() => setNewNamaTeam(nama_team)}
                        >
                            <a>
                                <EditOutlined className="ml-2 text-xl" />
                            </a>
                        </ModalComponent>

                    </h1>
                </div>
                <div>
                    <ModalComponent
                        title={'Tambah Anggota Team'}
                        content={<ModalTambahAnggota onSelectKaryawan={setSelectedKaryawan} />}
                        footer={(handleCancel) => (
                            <div>
                                <Button onClick={handleCancel}>Cancel</Button>
                                <Button type="primary" onClick={tambahKaryawan}>Tambah</Button>
                            </div>
                        )}
                        onOk={tambahKaryawan}
                        onCancel={() => setSelectedKaryawan(undefined)}
                    >
                        <button className="bg-[#1890ff] hover:bg-blue-700 text-white py-2 px-2 border border-blue-700 rounded">
                            + Tambah Anggota
                        </button>
                    </ModalComponent>

                </div>
            </Row>
            <Row className="w-full">
                {data && data.length > 0 ? (
                    <Table
                        dataSource={data}
                        columns={columnTeam}
                        className="w-full custom-table"
                        pagination={{ position: ['bottomCenter'], pageSize: 5 }}
                    />
                ) : (
                    <div style={{ textAlign: 'center', padding: '20px' }}>
                        <p>No data available</p>
                    </div>
                )}
            </Row>
        </div>
    );
};

const TableTask: React.FC<{ data: any, refreshTable: () => void }> = ({ data, refreshTable }) => {
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
                                    <Button onClick={handleCancel}>Cancel</Button>
                                    <Button type="primary" onClick={handleOk}>Ok</Button>
                                </div>
                            )}
                            onOk={() => console.log('Ok clicked')}  // Tambahkan handler onOk
                            onCancel={() => console.log('Cancel clicked')}  // Tambahkan handler onCancel
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
            <Row className="content-center w-full mb-4 justify-between mt-5">
                <div>
                    <h1 className="text-xl flex items-center">
                        <span className="text-2xl">Task Project</span>
                    </h1>
                </div>
                <div>
                    <button className="bg-[#1890ff] hover:bg-blue-700 text-white py-2 px-2 border border-blue-700 rounded">
                        + Tambah Tugas
                    </button>
                </div>
            </Row>
            <Row className="w-full">
                {data && data.length > 0 ? (
                    <Table
                        dataSource={data}
                        columns={columns}
                        className="w-full custom-table"
                        pagination={{ position: ['bottomCenter'], pageSize: 5 }}
                    />
                ) : (
                    <div style={{ textAlign: 'center', padding: '20px' }}>
                        <p>No data available</p>
                    </div>
                )}

            </Row>
        </div>
    )
}

const DetailProject: React.FC<{
    nama_team: any,
    idProject: any,
    idUser: any,
    teamData: any,
    tugasData: any,
    refreshTable: () => void
}> = ({ nama_team, idProject, idUser, teamData, tugasData, refreshTable }) => {
    return (
        <div>
            <TableTeam idProject={idProject} nama_team={nama_team} data={teamData} refreshTable={refreshTable} />
            <TableTask data={tugasData} refreshTable={refreshTable} />
        </div>
    );
};

const TugasDiselesaikan: React.FC<{ data: any, refreshTable: () => void }> = ({ data, refreshTable }) => {
    const [isNoteModalVisible, setIsNoteModalVisible] = useState(false);
    const [currentTugasId, setCurrentTugasId] = useState<string | null>(null);
    const [note, setNote] = useState<string>('');

    const acceptTugas = async (id_tugas: string) => {
        try {
            await projectRepository.api.updateStatusTugas(id_tugas, {
                status: 'approved'
            });
            await refreshTable();
            Modal.success({
                title: 'Tugas Diterima',
                content: 'Tugas Telah Diterima',
                cancelText: 'Tutup',
                onOk() {
                    console.log('OK clicked');
                },
                onCancel() {
                    console.log('Cancel clicked');
                }
            });
        } catch (error) {
            console.error('Gagal mengupdate Tugas', error);
        }
    };

    const redoTugas = async (id_tugas: string, note: any) => {
        try {
            await projectRepository.api.updateStatusTugas(id_tugas, {
                status: 'redo',
                note: note
            });
            await refreshTable();
            Modal.error({
                title: 'Tugas Dikembalikan',
                content: 'Tugas telah dikembalikan ke karyawan',
                cancelText: 'Tutup',
                onOk() {
                    console.log('OK clicked');
                },
                onCancel() {
                    console.log('Cancel clicked');
                }
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
                                    <Button type="primary" danger onClick={() => openNote(idTugas)}>
                                        Redo
                                    </Button>
                                    <Button
                                        type="primary"
                                        style={{ backgroundColor: 'green', borderColor: 'green' }}
                                        onClick={() => acceptTugas(idTugas)}
                                    >
                                        Approved
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
            <Table
                dataSource={data}
                columns={columnTugasDiselesaikan}
                className="w-full custom-table"
                pagination={{ position: ['bottomCenter'], pageSize: 5 }}
            />
            <ModalComponent
                title={'Catatan Redo Tugas'}
                content={
                    <div>
                        <p>Masukkan Note :</p>
                        <TextArea
                            rows={4}
                            placeholder="Masukkan catatan..."
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                        />
                    </div>
                }
                footer={() => (
                    <div>
                        <Button onClick={handleNoteCancel}>
                            Batal
                        </Button>
                        <Button type="primary" onClick={handleNoteSubmit}>
                            Submit
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
    const idUser = params?.idUser as string;
    const idProject = params?.idProject as string;
    const [activeKey, setActiveKey] = useState<string>('DetailProject');

    const { data: detailProject, error: errorDetailProject, isValidating: validateDetailProject, mutate: mutateDetailProject } = projectRepository.hooks.useDetailProject(idProject);

    const { data: tugasSelesai, error: errorTugasSelesai, isValidating: validateTugasSelesai, mutate: mutateTugasSelesai } = projectRepository.hooks.useTugasSelesai(idProject);

    const { data: teamProject, error: errorTeam, isValidating: validateTeam, mutate: mutateTeam } = projectRepository.hooks.useTeamByProject(idProject);

    const { data: tugasProject, error: errorTugas, isValidating: validateTugas, mutate: mutateTugas } = projectRepository.hooks.useGetTugasByProject(idProject);

    const loading = validateDetailProject || validateTugasSelesai || validateTeam || validateTugas;
    const error = errorDetailProject || errorTugasSelesai || errorTeam || errorTugas;
    // const mutate = mutateDetailProject && mutateTugasSelesai;


    if (loading) {
        return <Spin style={{ textAlign: 'center', padding: '20px' }} />;
    }
    if (error) {
        return <Alert message="Error fetching data" type="error" />;
    }

    const refreshTable = async () => {
        await mutateDetailProject();
        await mutateTugasSelesai();
        await mutateTeam();
        await mutateTugas();
    };

    const onChange: TabsProps['onChange'] = (key) => {
        setActiveKey(key);
    };

    const items: TabsProps['items'] = [
        {
            key: 'DetailProject', label: 'Detail Project', children: <DetailProject
                nama_team={detailProject?.data.nama_team}
                idProject={idProject}
                idUser={idUser}
                teamData={teamProject}
                tugasData={tugasProject}
                refreshTable={refreshTable}
            />
        },
        { key: 'TugasDiselesaikan', label: 'Tugas Diselesaikan', children: <TugasDiselesaikan data={tugasSelesai} refreshTable={refreshTable} /> },
    ];

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <button className="bg-blue-500 hover:bg-blue-700 text-black font-bold py-1 px-2 rounded-full w-8 h-8 border-0 flex justify-center items-center ml-2">
                        <Link href={`/team-lead/${idUser}/project`} className="no-underline text-black">
                            <ArrowLeftOutlined />
                        </Link>
                    </button>
                    <h3 style={{ marginLeft: '8px', marginTop: '10px', fontSize: '25px', fontWeight: 'bold', fontFamily: 'Roboto, sans-serif' }}>
                        {detailProject?.data.nama_project}
                    </h3>
                </div>
                <ButtonExportExcel
                    status={detailProject?.data.status}
                    file_project={detailProject?.data.file_project}
                    idProject={detailProject?.data.id}
                    nama_project={detailProject?.data.nama_project}
                    nama_team={detailProject?.data.nama_team}

                />
            </div>
            <div
                style={{
                    paddingRight: 24,
                    paddingBottom: 24,
                    paddingLeft: 24,
                    minHeight: '100vh',
                    backgroundColor: '#fff',
                    borderRadius: 15,
                    marginTop: 10,
                }}
            >
                <Tabs activeKey={activeKey} items={items} onChange={onChange} />
            </div>
        </div>
    );
};

export default Page;
