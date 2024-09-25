import ModalComponent from "#/component/ModalComponent";
import { Button, Row, Table, Tag } from "antd";
import ModalDetailTugas from "../modal/modalDetailTugas";
import { ArrowLeftOutlined, FileExcelOutlined, EditOutlined, EyeOutlined, SearchOutlined } from "@ant-design/icons";
import ModalTambahTugas from "../modal/modalTambahTugas";

const TableTask: React.FC<{
    data: any,
    refreshTable: () => void,
    formatTimeStr: (text: string) => string,
}> = ({ data, refreshTable, formatTimeStr }) => {
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
                    <ModalComponent
                        title={'Tambah Anggota Team'}
                        content={<ModalTambahTugas  />}
                        footer={(handleCancel) => (
                            <div>
                                <Button onClick={handleCancel}>Cancel</Button>
                                <Button type="primary" >Tambah</Button>
                            </div>
                        )}
                        // onOk={tambahKaryawan}
                        // onCancel={() => setSelectedKaryawan(undefined)}
                    >
                        <button className="bg-[#1890ff] hover:bg-blue-700 text-white py-2 px-2 border border-blue-700 rounded">
                            + Tambah Tugas
                        </button>
                    </ModalComponent>
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

export default TableTask;