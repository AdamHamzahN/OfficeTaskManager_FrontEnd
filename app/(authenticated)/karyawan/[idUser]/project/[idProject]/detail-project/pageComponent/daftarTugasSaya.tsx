import ModalComponent from "#/component/ModalComponent";
import { Button, Row, Table, Tag } from "antd";
import { ArrowLeftOutlined, FileExcelOutlined, EditOutlined, EyeOutlined, SearchOutlined } from "@ant-design/icons";
import ModalDetailTugas from "../modal/modalDetailTugas";
import { tugasRepository } from "#/repository/tugas";
import { useState } from "react";


const DaftarTugasSaya: React.FC<{
    dataDaftarTugas:any,
    page:any,
    pageSize: any,
    handlePageChangeTugas: any,
    formatTimeStr: (text: string) => string,
    refreshTable: () => void,
}> = ({ dataDaftarTugas,page,pageSize,handlePageChangeTugas, formatTimeStr,refreshTable }) => {

    const { data: daftarTugas, error: errorDaftarTugas, isValidating: validateDaftarTugas } = dataDaftarTugas
    const { data, count } = daftarTugas || {data:[] , count:0};
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
            <Row className="content-center w-full mb-4 justify-between">
                <div>
                    <h1 className="text-xl flex items-center">
                        <span className="text-2xl">Daftar Tugas</span>
                    </h1>
                </div>
            </Row>
            <Row className="w-full">
                <Table
                    dataSource={data}
                    columns={columns}
                    className="w-full custom-table"  
                    loading={validateDaftarTugas}
                    pagination={{
                        current: page,
                        pageSize: pageSize,
                        total: count,
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

export default DaftarTugasSaya;