import React, { useEffect, useState } from "react";
import { Row, Table } from "antd";
import { title } from "process";
import { render } from "react-dom";

const TableTeam: React.FC<{
    data: any,
    idProject: string,
    nama_team: string,
    // mutate: any,
    // refreshTable: () => void
}> = ({data, idProject, nama_team}) => {
    const [taskCountAll, setTaskCountAll] = useState <{[key: string]: number | null}> ({});
    const [taskCountSelesai, setTaskCountSelesai] = useState <{[key: string]: number | null}> ({});
    // const [newNamaTeam, setNewNamaTeam] = useState(nama_team)
    useEffect(() => {
        const fetchTugas = async () => {
            try {
                if (data) {
                    const counts = await Promise.all(data.data.map(async (record: any) => {
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

    const columnTeam = [
        {
            title: 'Nama Karyawan',
            key: 'karyawan.nama',
            render: (record: any) => record.karyawan ? record.karyawan.user.nama: 'N/A',
        },
        {
            title: 'NIK',
            key: 'nik',
            render: (record: any) => record.karyawan ? record.karyawan.nik: 'N/A',
        },
        {
            title: 'Job',
            key: 'job',
            render: (record: any) => record.karyawan ? record.karyawan.job.nama_job: 'N/A',
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

            <Table
                dataSource={data?.data}
                columns={columnTeam}
                pagination={{ position: ['bottomCenter'], pageSize: 5 }}
            />
        </>
    );
};

export default TableTeam;