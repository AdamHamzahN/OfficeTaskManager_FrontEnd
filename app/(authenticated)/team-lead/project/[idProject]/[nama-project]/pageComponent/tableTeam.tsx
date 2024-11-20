import ModalComponent from "#/component/ModalComponent";
import { projectRepository } from "#/repository/project";
import { Button, Modal, Row, Table, message } from "antd";
import { useEffect, useState } from "react";
import ModalUbahNamaTeam from "../modal/modalUbahNamaTeam";
import { ArrowLeftOutlined, FileExcelOutlined, EditOutlined, EyeOutlined, SearchOutlined, PlusOutlined } from "@ant-design/icons";
import ModalTambahAnggota from "../modal/modalTambahAnggota";
import { tugasRepository } from "#/repository/tugas";
import { JwtToken } from "#/utils/jwtToken";

const TableTeam: React.FC<{
    data: any,
    status_project: any,
    dataTugas: any,
    page: any,
    pageSize: any,
    handlePageChange: any,
    nama_team: string,
    idProject: string,
    mutate: any
    refreshTable: () => void
}> = ({ data, status_project, dataTugas, page, pageSize, handlePageChange, nama_team, idProject, mutate, refreshTable }) => {
    const token = JwtToken.getAuthData().token || null;
    const [countAll, setTaskCountAll] = useState<{ [key: string]: number | null }>({});
    const [countSelesai, setTaskCountSelesai] = useState<{ [key: string]: number | null }>({});
    const [selectedKaryawan, setSelectedKaryawan] = useState<string | undefined>(undefined);
    const [newNamaTeam, setNewNamaTeam] = useState(nama_team);
    const [namaTeam, setNamaTeam] = useState('');

    /**
     * useEffect jumlah tugas
     */
    useEffect(() => {
        setNamaTeam(nama_team);
    }, [nama_team]);
    useEffect(() => {
        const fetchTugas = async () => {
            try {
                if (data) {
                    const counts = await Promise.all(data.data.map(async (record: any) => {
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
    }, [data, idProject, dataTugas]);

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
            setSelectedKaryawan(undefined);

            mutate();
            Modal.success({
                title: 'Anggota Ditambahkan',
                content: 'Berhasil menambahkan anggota ke dalam tim!',
                okText: 'OK',
                cancelText: 'Tutup',
                onOk() {
                    console.log('OK clicked');
                },
            });
        } catch (error) {
            console.error('Gagal menambahkan anggota:', error);
        }
    };

    /**
     * Handle ubah nama team
     */
    const ubahNamaTeam = async () => {
        if (newNamaTeam === undefined || newNamaTeam === null) {
            message.warning('Masukkan Nama Team terlebih dahulu!')
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
                        <span className="text-2xl">{namaTeam}</span>
                        {(status_project !== 'done' && status_project !== 'approved') && (
                            <ModalComponent
                                title={'Ubah Nama Team'}
                                content={<ModalUbahNamaTeam nama_team={nama_team} onNamaTeamChange={setNewNamaTeam} />}
                                footer={(handleCancel) => (
                                    <div>
                                        <Button onClick={handleCancel}>Cancel</Button>
                                        <Button type="primary" onClick={ubahNamaTeam}>Ubah</Button>
                                    </div>
                                )}
                                onCancel={() => setNewNamaTeam(nama_team)}
                            >
                                <a>
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
                            <PlusOutlined /> Tambah Anggota
                        </button>
                    </ModalComponent>
                )}
                </div>
            </Row>
            <Row className="w-full">
                <Table
                    dataSource={data?.data}
                    columns={columnTeam}
                    className="w-full custom-table"
                    pagination={{
                        current: page,
                        pageSize: pageSize,
                        total: data?.count,
                        position: ['bottomCenter'],
                        onChange: (pageTugas, pageSizeTugas) => {
                            handlePageChange(pageTugas, pageSizeTugas)
                        },
                    }}
                />
            </Row>
        </div>
    );
};

export default TableTeam;