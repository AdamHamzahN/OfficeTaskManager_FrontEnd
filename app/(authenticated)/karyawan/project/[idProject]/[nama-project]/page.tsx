'use client'
import React, { useEffect, useState } from "react";
import { ArrowLeftOutlined, SearchOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";
import { useParams } from "next/navigation";
import { projectRepository } from "#/repository/project";
import { JwtToken } from "#/utils/jwtToken";
import Link from "next/link";
import ModalComponent from "#/component/ModalComponent";
import ModalDetailProject from "#/app/(authenticated)/team-lead/project/[idProject]/[nama-project]/modal/modalDetailProject";
import { Button, Modal, Row, Tag, message } from "antd";
import TableComponent from "#/component/TableComponent";
import { tugasRepository } from "#/repository/tugas";
import ModalDetailTugas from "./modal/modalDetailTugas";
import ModalEditTugas from "./modal/modalEditTugas";
import Container from "#/component/ContainerComponent";
import { formatTimeStr } from "#/utils/formatTime";

const Page = () => {
    const params = useParams();
    const idUser = JwtToken.getPayload().sub;
    const idProject = params?.idProject as string;
    const token = JwtToken.getAuthData().token || null;

    //===================== Pagination ========================================================
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
    const [pageTugasBelumSelesai, setPageTugasBelumSelesai] = useState(1);
    const [pageSizeTugasBelumSelesai, setPageSizeTugasBelumSelesai] = useState(5);
    const handlePageChangeTugasBelumSelesai = (newPage: number, newPageSize: number) => {
        setPageTugasBelumSelesai(newPage);
        setPageSizeTugasBelumSelesai(newPageSize);
    };

    /**
     * Pagination table tugas
     */
    const [pageDaftarTugas, setPageDaftarTugas] = useState(1);
    const [pageSizeDaftarTugas, setPageSizeDaftarTugas] = useState(5);
    const handlePageChangeDaftarTugas = (newPage: number, newPageSize: number) => {
        setPageDaftarTugas(newPage);
        setPageSizeDaftarTugas(newPageSize);
    };

    //===================== Hooks ============================================================
    /**
     * hook detail project
     */
    const { data: detailProject, isValidating: validateDetailProject } = projectRepository.hooks.useDetailProject(idProject);

    /**
     * hook team
     */
    const { data: teamProject, isValidating: validateTeam, mutate: mutateTeam } = projectRepository.hooks.useTeamByProject(idProject, pageTeam, pageSizeTeam);

    /**
     * hook tugas belum selesai
     */
    const { data: tugasBelumSelesai, isValidating: validateTugasBelumSelesai, mutate: mutateTugasBelumSelesai } = tugasRepository.hooks.useGetTugasKaryawanBelumSelesai(idUser, idProject, pageTugasBelumSelesai, pageSizeTugasBelumSelesai);

    /**
     * hook daftar tugas
     */
    const { data: daftarTugas, isValidating: validateDaftarTugas, mutate: mutateDaftarTugas } = tugasRepository.hooks.useGetTugasProjectKaryawanByIdUser(idUser, idProject, pageDaftarTugas, pageSizeDaftarTugas);


    //===================== useState ==========================================================
    /**
     * useState count tugas
     */
    const [countAll, setTaskCountAll] = useState<{ [key: string]: number | null }>({});
    const [countSelesai, setTaskCountSelesai] = useState<{ [key: string]: number | null }>({});

    const [formData, setFormData] = useState<{ status: string; file_bukti?: File | null }>({
        status: tugasBelumSelesai?.data.status,
        file_bukti: null,
    });

    const [idTugas, setIdTugas] = useState<string | null>(null)


    //===================== Function & handle ============================================================
    /**
     * Function refresh table tugas belum selesai & daftar tugas
     */
    const refreshTableTugas = async () => {
        mutateDaftarTugas();
        mutateTugasBelumSelesai();
    }

    const handleUpdateTugas = (tugasData: { status: string; file_bukti: File | null }) => {
        setFormData(tugasData);
    };

    /**
     * Update status tugas yang belum selesai
     */
    const updateStatus = async (modalInstance: any) => {
        const { status, file_bukti } = formData;
        console.log(status, file_bukti);
        if (status === 'done' && file_bukti === null || file_bukti === undefined) {
            message.warning('Masukkan file terlebih dahulu!');
            return;
        }  
        if (status === 'done' && file_bukti === null || file_bukti === undefined) {
            message.warning('Masukkan file terlebih dahulu!')
            return;
        } else if (status === 'done' && file_bukti!.type !== 'application/pdf') {
            message.warning("File tugas harus berupa PDF.");
            return;
        } else if (status === 'done' && file_bukti!.size > 2 * 1024 * 1024) { // Maksimal 2MB
            message.warning("Ukuran file tidak boleh lebih dari 2MB.");
            return;
        } else {
            try {
                await tugasRepository.api.updateStatusTugas(idTugas || '', {
                    status: status,
                    file_bukti: file_bukti
                });
                refreshTableTugas()
                Modal.success({
                    title: 'Berhasil',
                    content: 'Berhasil mengubah status tugas',
                    onOk: () => {
                        modalInstance.destroy();
                        // setIsModalVisible(false);
                    }
                });
            } catch (error) {
                console.error('Gagal mengubah status project:', error);
            }
        }
    };
    useEffect(() => {
        const fetchTugas = async () => {
            try {
                if (teamProject?.data) {
                    const counts = await Promise.all(teamProject?.data.map(async (record: any) => {
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

        if (teamProject?.data) {
            fetchTugas();
        }
    }, [teamProject, idProject]);

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
    const getColor = (status_tugas: string) => {
        switch (status_tugas) {
            case 'pending': return '#FFC107';
            case 'on progress': return '#00BCD4';
            case 'redo': return '#F44336';
            case 'done': return '#2196F3';
            default: return '#4CAF50';
        }
    };

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

    const columnTugasBelumDiselesaikan = [
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
                return <Tag color={getColor(status)} style={{ fontSize: '12px' }}>{status}</Tag>;
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
                const nama_tugas = record.nama_tugas;
                const status_tugas = record.status;
                return (
                    <div style={{ display: 'flex', gap: '10px' }}>
                        {/* Modal Detail Tugas */}
                        <ModalComponent
                            title={'Detail Tugas'}
                            content={<ModalDetailTugas idTugas={idTugas} />}
                            footer={(handleCancel, handleOk) => (
                                <div>
                                    <Button onClick={handleCancel}>Cancel</Button>
                                    <Button type="primary" onClick={handleOk}>Ok</Button>
                                </div>
                            )}
                        >
                            <Button
                                style={{
                                    backgroundColor: 'rgba(244, 247, 254, 1)',
                                    color: '#1890FF',
                                    border: 'none',
                                }}
                                onClick={() => {
                                    setIdTugas(idTugas)
                                }}
                            >
                                <EyeOutlined /> Detail
                            </Button>
                        </ModalComponent>
                        {/* Modal Update Status */}
                        <ModalComponent
                            title={'Edit Status'}
                            content={<ModalEditTugas
                                idTugas={idTugas}
                                nama_tugas={nama_tugas}
                                status_tugas={status_tugas}
                                update_tugas={handleUpdateTugas} />}
                            footer={(handleCancel) => (
                                <div>
                                    <Button onClick={handleCancel}>Cancel</Button>
                                    <Button type="primary" onClick={() => updateStatus({ destroy: handleCancel })}>Ubah</Button>
                                </div>
                            )}
                        // visible={isModalVisible}
                        // onCancel={() => setIsModalVisible(false)}
                        // maskStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.15)' }}
                        >
                            <Button
                                style={{
                                    backgroundColor: 'rgba(254, 243, 232, 1)',
                                    color: 'rgba(234, 125, 42, 1)',
                                    border: 'none',
                                }}
                                onClick={() => {
                                    setIdTugas(idTugas)
                                    // setIsModalVisible(true)
                                    setFormData({ status: status_tugas, file_bukti: null })
                                }}
                            >
                                <EditOutlined /> Edit
                            </Button>
                        </ModalComponent>
                    </div>
                );
            }
        },
    ];

    const columnDaftarTugas = [
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
                return <Tag color={getColor(status)} style={{ fontSize: '12px' }}>{status}</Tag>;
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
                            footer={(handleOk) => (
                                <div>
                                    <Button type="primary" onClick={handleOk}>Ok</Button>
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
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <button className="bg-blue-500 hover:bg-blue-700 text-black font-bold py-1 px-2 rounded-full w-8 h-8 border-0 flex justify-center items-center ml-2">
                        <Link href={`/karyawan/project`} className="no-underline text-black">
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
                                <Button type="primary" onClick={handleOk}>Ok</Button>
                            </div>
                        )}
                        onOk={() => console.log('Ok clicked')}  // Tambahkan handler onOk
                        onCancel={() => console.log('Cancel clicked')}  // Tambahkan handler onCancel
                    >
                        <button type="button" className="bg-transparent hover:bg-blue-600 text-blue-700 hover:text-white py-3 px-6 border border-blue-600 hover:border-transparent rounded text-justify">
                            <SearchOutlined style={{ fontSize: 15 }} /> Detail Project
                        </button>
                    </ModalComponent>
                    <button
                        type="button"
                        className="border py-3 px-6 rounded"
                        style={getButtonStyles(detailProject?.data.status)}
                    >
                        {detailProject?.data.status}
                    </button>
                </div>
            </div>
            <div
                style={{
                    padding: 24,
                    backgroundColor: '#fff',
                    borderRadius: 15,
                    marginTop: 10,
                }}
            >
                <div>
                    <Row className="content-center w-full mb-4 justify-between">
                        <div>
                            <h1 className="text-xl flex items-center">
                                <span className="text-2xl">{detailProject?.data.nama_team}</span>
                            </h1>
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
                </div>
            </div>
            <div>
                {detailProject?.data.status !== 'approved' && (
                    <div
                        style={{
                            padding: 24,
                            backgroundColor: '#fff',
                            borderRadius: 15,
                            marginTop: 10,
                        }}
                    >
                        <div>
                            <Row className="content-center w-full mb-4 justify-between">
                                <div>
                                    <h1 className="text-xl flex items-center">
                                        <span className="text-2xl">Tugas Belum Diselesaikan</span>
                                    </h1>
                                </div>
                            </Row>
                            <Row className="w-full">
                                <TableComponent
                                    data={tugasBelumSelesai?.data}
                                    columns={columnTugasBelumDiselesaikan}
                                    page={pageTugasBelumSelesai}
                                    pageSize={pageSizeTugasBelumSelesai}
                                    loading={validateTugasBelumSelesai}
                                    total={tugasBelumSelesai?.count}
                                    pagination={true}
                                    className="w-full custom-table"
                                    onPageChange={handlePageChangeTugasBelumSelesai}
                                />
                            </Row>
                        </div>
                    </div>
                )}
                <div
                    style={{
                        padding: 24,
                        backgroundColor: '#fff',
                        borderRadius: 15,
                        marginTop: 10,
                    }}
                >

                    <div>
                        <Row className="content-center w-full mb-4 justify-between">
                            <div>
                                <h1 className="text-xl flex items-center">
                                    <span className="text-2xl">Daftar Tugas</span>
                                </h1>
                            </div>
                        </Row>
                        <Row className="w-full">
                            <TableComponent
                                data={daftarTugas?.data}
                                columns={columnDaftarTugas}
                                loading={validateDaftarTugas}
                                page={pageDaftarTugas}
                                pageSize={pageSizeDaftarTugas}
                                total={daftarTugas?.count}
                                pagination={true}
                                className="w-full custom-table"
                                onPageChange={handlePageChangeDaftarTugas}
                            />
                        </Row>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Page;
