'use client';
import { Button, Input, DatePicker } from "antd";
import TextArea from "antd/es/input/TextArea";
import { SearchOutlined } from "@ant-design/icons";
import dayjs from 'dayjs';
import { config } from "#/config/app";
const { RangePicker } = DatePicker;

const ModalDetailProject: React.FC<{
    nama_project: string,
    team_lead: string,
    nama_team: string,
    status: string,
    start_date: string,
    end_date: string,
    note: string,
    file_project: string,
    file_hasil_project: string,
}> = ({ nama_project, nama_team, file_project, start_date, end_date, note, status, team_lead, file_hasil_project }) => {

    // alias untuk url file project
    const fileDetailProject = `${config.baseUrl}/${file_project?.replace(/\\/g, '/')}`;

    // alias untuk url file hasil project
    const fileHasilProject = `${config.baseUrl}/${file_hasil_project?.replace(/\\/g, '/')}`;

    return (
        <div style={{ borderTop: '2px ' }}>
            <style>
                {`
                    .custom-range-picker.ant-picker-disabled {
                    background-color: white !important; 
                    color: rgba(0, 0, 0, 0.85) !important; 
                    cursor: allowed;
                    }

                    .custom-range-picker.ant-picker-disabled .ant-picker-input > input {
                    color: rgba(0, 0, 0, 0.85) !important;
                    cursor: allowed;
                    }
                `}
            </style>

            <label htmlFor="nama_tugas" style={{ marginBottom: '8px', display: 'block' }}>Nama Project</label>
            <Input value={nama_project} readOnly style={{ marginBottom: '16px' }} />

            <label htmlFor="nama_karyawan" style={{ marginBottom: '8px', display: 'block' }}>Penanggung Jawab</label>
            <Input value={team_lead} readOnly style={{ marginBottom: '16px' }} />

            <label htmlFor="nama_karyawan" style={{ marginBottom: '8px', display: 'block' }}>Nama Team</label>
            <Input value={nama_team} readOnly style={{ marginBottom: '16px' }} />

            <label htmlFor="nama_karyawan" style={{ marginBottom: '8px', display: 'block' }}>Status Project</label>
            <Input value={status} readOnly style={{ marginBottom: '16px' }} />

            <label htmlFor="nama_karyawan" style={{ marginBottom: '8px', display: 'block' }}>Waktu Pengerjaan</label>
            <RangePicker
                value={[dayjs(start_date), dayjs(end_date)]}
                disabled
                className="custom-range-picker"
                style={{ width: '100%' }}
            />

            {note && (
                <>
                    <label htmlFor="deskripsi_tugas" style={{ marginBottom: '8px', display: 'block', marginTop: '8px' }}>Note</label>
                    <TextArea
                        autoSize={{ minRows: 3, maxRows: 9 }}
                        style={{
                            height: 120, resize: 'none',
                            marginBottom: '16px',
                            minWidth: 'auto'
                        }}

                        value={note}
                        readOnly
                    />
                </>
            )}


            <label htmlFor="bukti_pengerjaan" style={{ marginTop: '15px' ,marginBottom: '8px', display: 'block' }}>Detail Project</label>
            <a href={fileDetailProject} target="_blank" rel="noopener noreferrer">
                <Button block style={{ textAlign: 'left', marginBottom: '16px' }}>
                    <SearchOutlined /> Lihat File Detail
                </Button>
            </a>
            {status === 'done' && (
                <>

                    <label htmlFor="bukti_pengerjaan" style={{ marginBottom: '8px', display: 'block' }}>Hasil Project</label>
                    <a href={fileHasilProject} target="_blank" rel="noopener noreferrer">
                        <Button block style={{ textAlign: 'left', marginBottom: '16px' }}>
                            <SearchOutlined /> Lihat Hasil Project
                        </Button>
                    </a>
                </>
            )}
        </div>
    );
};

export default ModalDetailProject;
