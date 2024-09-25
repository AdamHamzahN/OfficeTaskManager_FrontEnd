import ModalComponent from "#/component/ModalComponent";
import { projectRepository } from "#/repository/project";
import { Button, Modal, Table } from "antd";
import { useState } from "react";
import ModalCekTugas from "../modal/modalCekTugas";
import { ArrowLeftOutlined, FileExcelOutlined, EditOutlined, EyeOutlined, SearchOutlined } from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";


const TugasDiselesaikan: React.FC<{
    data: any,
    refreshTable: () => void,
    formatTimeStr: (text: string) => string,
}> = ({ data, refreshTable,formatTimeStr }) => {
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
export default TugasDiselesaikan
