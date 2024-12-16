import React, { useState } from "react";
import { Button, Tag, Row, Table } from "antd";
import ModalComponent from "#/component/ModalComponent";
import { EyeOutlined } from "@ant-design/icons";
import { tugasRepository } from "#/repository/tugas";
import ModalDetailTask from "./modalDetailTask";
import { formatTimeStr } from "#/utils/formatTime";
import TableComponent from "#/component/TableComponent";

const TableTask: React.FC<{
    idProject: string,
}> = ({idProject}) => {
    const [pageTask, setPageTask] = useState(1);
    const [pageSizeTask, setPageSizeTask] = useState(5);
    const {data: taskProject, error: errorTask, isValidating: validateTask} 
        = tugasRepository.hooks.useGetTugasByProject(idProject, pageTask, pageSizeTask);

    const handlePageChangeTask = (newPage: number, newPageSize: number) => {
        setPageTask(newPage);
        setPageSizeTask(newPageSize);
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
            <Row className="mb-4 mt-5">
                    <h1 className="text-xl flex items-center">
                        <span className="text-2xl">Task Project</span>
                    </h1>
            </Row>

            {/* <Table
                dataSource={taskProject?.data}
                columns={columns}
                loading={validateTask}
                pagination={{
                    current: pageTask,
                    pageSize: pageSizeTask,
                    total: taskProject?.count,
                    position: ['bottomCenter'],
                    onChange: (pageTask, pageSizeTask) => {
                        handlePageChangeTask(pageTask, pageSizeTask)
                    },
                }}
            /> */}
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
        </>
    )
}

export default TableTask;