import React, { useState } from 'react';
import { Select } from 'antd';
import { projectRepository } from '#/repository/project';

interface Karyawan {
    id: string;
    user: { nama: string };
    job: { nama_job: string };
}
    
interface ModalTambahAnggotaProps {
    onSelectKaryawan: (id: string) => void;
}

const ModalTambahAnggota: React.FC<ModalTambahAnggotaProps> = ({ onSelectKaryawan }) => {
    const [selectedKaryawan, setSelectedKaryawan] = useState<string | undefined>(undefined);

    const { data: karyawanData } = projectRepository.hooks.useGetKaryawanAvailable();
    const options = karyawanData?.map((karyawan: any) => ({
        value: karyawan.id,
        label: `${karyawan.user.nama} | ${karyawan.job.nama_job}`,
    })) || [];

    const handleSelectChange = (value: string) => {
        setSelectedKaryawan(value);
        onSelectKaryawan(value);
    };

    return (
        <div>
            <label htmlFor="karyawan">Masukkan Anggota Baru</label>
            <Select
                id="karyawan"
                placeholder="Masukkan Karyawan"
                style={{ width: '100%' }}
                onChange={handleSelectChange}
                options={options}
            />
        </div>
    );
};


export default ModalTambahAnggota;
