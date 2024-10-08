import ModalComponent from "#/component/ModalComponent";
import { Button, Modal, Row, Table, Tag } from "antd";
import { EditOutlined, EyeOutlined } from "@ant-design/icons";
import ModalDetailTugas from "../modal/modalDetailTugas";
import ModalEditTugas from "../modal/modalEditTugas";
import { useState } from "react";
import { tugasRepository } from "#/repository/tugas";


const TugasBelumDiselesaikan: React.FC<{
    data: any,
    formatTimeStr: (text: string) => string,
    refreshTable: () => void,
}> = ({ data, formatTimeStr,refreshTable }) => {
    const [idTugas,setIdTugas] = useState<string | null>(null)
    const [formData, setFormData] = useState<{ status: string; file_bukti?: File | null }>({
        status: data.status,
        file_bukti: null,
        // fileName: '' 
    });

    const handleUpdateTugas = (tugasData: { status: string; file_bukti: File | null }) => {
        setFormData(tugasData);
    };
    
    const updateStatus = async () => {
        const { status, file_bukti } = formData;
        console.log(idTugas)
        if (status === 'done' && file_bukti === null || file_bukti === undefined) {
            alert('Masukkan file terlebih dahulu!');
            return;
        }

        try {
            await tugasRepository.api.updateStatusTugas(idTugas || '', {
                status: status,
                file_bukti: file_bukti
            });

            Modal.success({
                title: 'Berhasil',
                content: 'Berhasil mengubah status tugas',
                onOk() {
                    refreshTable();
                }
            });
        } catch (error) {
            console.error('Gagal mengubah status project:', error);
        }
    };



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
                        case 'on progress': return '#00BCD4';
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
                const nama_tugas = record.nama_tugas;
                const status_tugas = record.status;
                return (
                    <div style={{ display: 'flex', gap: '10px' }}>
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
                                onClick={() => setIdTugas(idTugas)}
                            >
                                <EyeOutlined /> Detail
                            </Button>
                        </ModalComponent>
                        <ModalComponent
                            title={'Edit Status'}
                            content={<ModalEditTugas 
                                idTugas={idTugas} 
                                nama_tugas={nama_tugas} 
                                status_tugas={status_tugas} 
                                update_tugas={handleUpdateTugas} />}
                            footer={(handleCancel, handleOk) => (
                                <div>
                                    <Button onClick={handleCancel}>Cancel</Button>
                                    <Button type="primary" onClick={updateStatus}>Ubah</Button>
                                </div>
                            )}
                        >
                            <Button
                                style={{
                                    backgroundColor: 'rgba(254, 243, 232, 1)',
                                    color: 'rgba(234, 125, 42, 1)',
                                    border: 'none',
                                }}
                                onClick={() => {
                                    setIdTugas(idTugas)
                                    setFormData({status:status_tugas,file_bukti:null})
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

    return (
        <div>
            <Row className="content-center w-full mb-4 justify-between">
                <div>
                    <h1 className="text-xl flex items-center">
                        <span className="text-2xl">Tugas Belum Diselesaikan</span>
                    </h1>
                </div>
            </Row>
            <Row className="w-full">
                <Table
                    dataSource={data}
                    columns={columns}
                    className="w-full custom-table"
                    pagination={{ position: ['bottomCenter'], pageSize: 5 }}
                />
            </Row>
        </div>
    )
}

export default TugasBelumDiselesaikan;