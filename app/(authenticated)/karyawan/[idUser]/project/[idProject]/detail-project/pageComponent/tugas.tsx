import { useState } from "react";
import TugasBelumDiselesaikan from "./tugasBelumDiselesaikan";
import DaftarTugasSaya from "./daftarTugasSaya";
import { tugasRepository } from "#/repository/tugas";

const TugasComponent: React.FC<{
    idUser: string,
    status: any,
    id_project: string
    formatTimeStr: (text: string) => string
}> = ({ idUser, id_project,status,formatTimeStr }) => {
    const [pageTugas, setPageTugas] = useState(1);
    const [pageSizeTugas, setPageSizeTugas] = useState(5);
    const handlePageChangeTugas = (newPage: number, newPageSize: number) => {
        setPageTugas(newPage);
        setPageSizeTugas(newPageSize);
    };

    const [pageDaftarTugas, setPageDaftarTugas] = useState(1);
    const [pageSizeDaftarTugas, setPageSizeDaftarTugas] = useState(5);
    const handlePageChangeDaftarTugas = (newPage: number, newPageSize: number) => {
        setPageDaftarTugas(newPage);
        setPageSizeDaftarTugas(newPageSize);
    };

    const tugas = tugasRepository.hooks.useGetTugasKaryawanBelumSelesai(idUser,id_project, pageTugas, pageSizeTugas);
    const daftarTugas = tugasRepository.hooks.useGetTugasProjectKaryawanByIdUser(idUser,id_project, pageDaftarTugas, pageSizeDaftarTugas);

    const refreshTableTugas = async () => {
        tugas.mutate();
        daftarTugas.mutate();
    }
    return (
        <div>
            {status !== 'approved' && (
                <div
                    style={{
                        padding: 24,
                        backgroundColor: '#fff',
                        borderRadius: 15,
                        marginTop: 10,
                    }}
                >
                    <TugasBelumDiselesaikan
                        dataTugas={tugas}
                        page={pageTugas}
                        pageSize={pageSizeTugas}
                        handlePageChangeTugas={handlePageChangeTugas}
                        formatTimeStr={formatTimeStr}
                        refreshTable={refreshTableTugas}
                    />
                </div>
            )}
            <div
                style={{
                    padding: 24,
                    backgroundColor: '#fff',
                    borderRadius: 15,
                    marginTop: 10,
                }}
            >
                <DaftarTugasSaya
                    dataDaftarTugas={daftarTugas}
                    page={pageDaftarTugas}
                    pageSize={pageSizeDaftarTugas}
                    handlePageChangeTugas={handlePageChangeDaftarTugas}
                    formatTimeStr={formatTimeStr}
                    refreshTable={refreshTableTugas} 
                    />
            </div>
        </div>
    );
};

export default TugasComponent;
