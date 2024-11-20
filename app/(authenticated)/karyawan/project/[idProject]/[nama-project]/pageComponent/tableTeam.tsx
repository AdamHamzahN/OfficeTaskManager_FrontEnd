import { JwtToken } from "#/utils/jwtToken";
import { Row, Table } from "antd";
import { useEffect, useState } from "react";

const TableTeam: React.FC<{
    data: any,
    nama_team: string,
    idProject: string,
}> = ({ data, nama_team, idProject }) => {
    const token = JwtToken.getAuthData().token || null;
    const [countAll, setTaskCountAll] = useState<{ [key: string]: number | null }>({});
    const [countSelesai, setTaskCountSelesai] = useState<{ [key: string]: number | null }>({});
    useEffect(() => {
        const fetchTugas = async () => {
            try {
                if (data.data) {
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

        if (data.data) {
            fetchTugas();
        }
    }, [data , idProject]);


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
                        <span className="text-2xl">{nama_team}</span>
                    </h1>
                </div>
            </Row>
            <Row className="w-full">
                <Table
                    dataSource={data.data}
                    columns={columnTeam}
                    className="w-full custom-table"
                    pagination={{ position: ['bottomCenter'], pageSize: 5 }}
                />
            </Row>
        </div>
    );
};

export default TableTeam;