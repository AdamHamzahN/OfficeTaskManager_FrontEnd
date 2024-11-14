import ModalComponent from "#/component/ModalComponent";
import { Button, Modal, Row, Table, Tag, message } from "antd";
import ModalDetailTugas from "../modal/modalDetailTugas";
import { EyeOutlined } from "@ant-design/icons";
import ModalTambahTugas from "../modal/modalTambahTugas";
import { useState } from "react";
import { tugasRepository } from "#/repository/tugas";
import { projectRepository } from "#/repository/project";

const TableTask: React.FC<{
    dataTugas: any,
    status_project: any,
    idProject: string,
    pageTugas: any,
    pageSizeTugas: any,
    handlePageChangeTugas: any,
    refreshTable: () => void,
    formatTimeStr: (text: string) => string,
}> = ({ dataTugas, status_project, idProject, pageTugas, pageSizeTugas, handlePageChangeTugas, refreshTable, formatTimeStr }) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const { data: tugasProject, error: errorTugas, isValidating: validateTugas, mutate: mutateTugas } = dataTugas;
    const { data: teamProject, error: errorTeam, isValidating: validateTeam, mutate: mutateTeam } = projectRepository.hooks.useTeamByProject(idProject);
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

    const createTask = async () => {
        const { nama_tugas, deskripsi_tugas, deadline, id_project, id_karyawan, file_tugas } = formData;

        if (!nama_tugas || !deskripsi_tugas || !deadline || !id_project || !id_karyawan || !file_tugas) {
            message.warning("Harap isi semua field yang diperlukan.");
            return;
        }

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
                    setIsModalVisible(false);
                },
            });
        } catch (error) {
            console.error('Gagal menambah Tugas', error);
        }
    }

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
                                    <Button onClick={handleCancel}>Cancel</Button>
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
                            visible={isModalVisible}
                            onCancel={() => setIsModalVisible(false)}
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
                                    setIsModalVisible(true);
                                }}>
                                + Tambah Tugas
                            </button>
                        </ModalComponent>
                    )}
                </div>
            </Row>
            <Row className="w-full">
                <Table
                    dataSource={tugasProject?.data}
                    columns={columns}
                    className="w-full custom-table"
                    loading={validateTugas}
                    pagination={{
                        current: pageTugas,
                        pageSize: pageSizeTugas,
                        total: tugasProject?.count,
                        position: ['bottomCenter'],
                        onChange: (pageTugas, pageSizeTugas) => {
                            handlePageChangeTugas(pageTugas, pageSizeTugas)
                        },
                    }}
                />
            </Row>
        </div>
    )
}

export default TableTask;