import React, { useEffect, useState } from "react";
import { Row, Table } from "antd";
import { JwtToken } from "#/utils/jwtToken";
import TableComponent from "#/component/TableComponent";
import { projectRepository } from "#/repository/project";

const TableTeam: React.FC<{
    idProject: string,
    nama_team: string,
    // mutate: any,
    // refreshTable: () => void
}> = ({  idProject, nama_team }) => {
    const [taskCountAll, setTaskCountAll] = useState<{ [key: string]: number | null }>({});
    const [pageTeam, setPageTeam] = useState(1);
    const [pageSizeTeam, setPageSizeTeam] = useState(5);
    const handlePageChange = (newPage: number, newPageSize: number) => {
        setPageTeam(newPage);
        setPageSizeTeam(newPageSize);
    };
    const [taskCountSelesai, setTaskCountSelesai] = useState<{ [key: string]: number | null }>({});
    const { data, isValidating: loading} = projectRepository.hooks.useTeamByProject(idProject, pageTeam, pageSizeTeam);
    const token = JwtToken.getAuthData().token || null;
    useEffect(() => {
        const fetchTugas = async () => {
            try {
                if (data && token) {
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
                const data = taskCountAll[idKaryawan] !== undefined ? taskCountAll[idKaryawan] : 'Loading...';
                return data;
            },
        },
        {
            title: 'Tugas Selesai',
            key: 'tugas_selesai',
            render: (record: any) => {
                const idKaryawan = record.karyawan.id;
                const data = taskCountSelesai[idKaryawan] !== undefined ? taskCountSelesai[idKaryawan] : 'Loading...';
                return data;
            },
        },
    ];

    return (
        <>
            <Row className="mb-4">
                <h1 className="text-xl flex items-center">
                    <span className="text-2xl">{nama_team}</span>
                </h1>
            </Row>
            
            {/* Perbaikan Table */}
            <TableComponent
                data={data?.data}
                columns={columnTeam}
                loading={loading}
                page={pageTeam}
                pageSize={pageSizeTeam}
                total={data?.count}
                pagination={true}
                className="w-full custom-table"
                onPageChange={handlePageChange}
            />
        </>
    );
};

export default TableTeam;