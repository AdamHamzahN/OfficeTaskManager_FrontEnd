import React, { useState } from 'react';
import { Select } from 'antd';
import { projectRepository } from '#/repository/project';

interface KaryawanOption {
    value: string;
    label: string;
}

interface ModalTambahAnggotaProps {
    onSelectKaryawan: (id: string) => void;
}

const ModalTambahAnggota: React.FC<ModalTambahAnggotaProps> = ({ onSelectKaryawan }) => {
    // state untuk menyimpan id karyawan 
    const [selectedKaryawan, setSelectedKaryawan] = useState<string | undefined>(undefined);

    // Hook untuk mendapatkan data karyawan yang belum ada di project
    const { data: karyawanData } = projectRepository.hooks.useGetKaryawanAvailable();
    const options: KaryawanOption[] = karyawanData?.map((karyawan: any) => ({
        value: karyawan.id,
        label: `${karyawan.user.nama} | ${karyawan.job.nama_job}`,
    })) || [];

    //handle ketika value select berubah
    const handleSelectChange = (value: string) => {
        setSelectedKaryawan(value);
        onSelectKaryawan(value);
    };

    return (
        <div>
            <label htmlFor="karyawan">Masukkan Anggota Baru</label>
            <Select
                showSearch
                id="karyawan"
                placeholder="Masukkan Karyawan"
                style={{ width: '100%' }}
                onChange={handleSelectChange}
                options={options}
                filterOption={(input, option) =>
                    typeof option?.label === 'string' && option.label.toLowerCase().includes(input.toLowerCase())
                }
            />
        </div>
    );
};

export default ModalTambahAnggota;
