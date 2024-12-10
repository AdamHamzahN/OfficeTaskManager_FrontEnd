
import React, { useRef, useState, useEffect } from "react";
import { Input, Form, DatePicker, Select, Button, message } from "antd";
import { UploadOutlined } from '@ant-design/icons';
import dayjs from "dayjs";
import { teamleadRepository } from '#/repository/teamlead';

interface ModalTambahProject {
    createproject: (projectData: {
        nama_project: string,
        id_team_lead: string,
        nama_team: string,
        start_date: string,
        end_date: string,
        file_project: File | null
    }) => void;
}

const TambahProject: React.FC<ModalTambahProject> = ({ createproject }) => {
    const [formData, setFormData] = useState<{
        nama_project: string,
        id_team_lead: string,
        nama_team: string,
        start_date: string,
        end_date: string,
        file_project: File | null
    }>({
        nama_project: '',
        id_team_lead: '',
        nama_team: '',
        start_date: '',
        end_date: '',
        file_project: null
    });

    // const [nama_project, setNamaProject] = useState<string>('');
    // const [id_team_lead, setTeamLead] = useState<string>('');
    // const [nama_team, setNamaTeam] = useState<string>('');
    // const [start_date, setStartDate] = useState<string>('');
    // const [end_date, setEndDate] = useState<string>('');
    // const [file_project, setFileProject] = useState<File | null>(null);

    // const  handleProject = () => {
    //     createproject({nama_project, id_team_lead, nama_team, start_date, end_date,file_project});

    // console.log('namaproject', nama_project);
    // console.log('id', id_team_lead);
    // console.log('namateam', nama_team);
    // console.log('start', start_date);
    // console.log('end', end_date);
    // console.log('fileww', file_project);

    // };

    useEffect(() => {
        createproject(formData);
    });

    const { data: teamLeadData } = teamleadRepository.hooks.useNamaTeamLeadActive();
    const options = teamLeadData?.map((teamLead: any) => ({
        value: teamLead.id,
        label: `${teamLead.nama}`
    })) || []

    const handleChange = (key: keyof typeof formData, value: any) => {
        // const updatedFormData = {
        //     ...formData,
        //     [key]: value,
        // };
        // setFormData(updatedFormData);
        // createproject({ ...updatedFormData});
        setFormData(prev => ({
            ...prev,
            [key]: value,
        }));
        console.log(key, value);
    };

    const handleSelectChange = (value: string) => {
        console.log('selected id team lead:', value);
        handleChange('id_team_lead', value)
    };

    // handle TANGGAL 
    const { RangePicker } = DatePicker;
    const handleDateChange = (dates: any, dateStrings: [string, string]) => {
        handleChange('start_date', dateStrings[0]);
        handleChange('end_date', dateStrings[1]);
    };

    // handle buttom uploud file
    const fileInputRef = useRef<HTMLInputElement>(null);
    const handleButtonClick = (event: React.MouseEvent<HTMLElement>) => {
        event.preventDefault();
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        // setFileProject(file || null);
        console.log(file)
        handleChange('file_project', file);
        // if (file) {
        //     message.success(`file ${file.name} bisa der`)
        // }
    };

    return (
        <>
            <Form.Item label='Nama Project:'>
                <Input
                    placeholder="Nama project"
                    value={formData.nama_project}
                    onChange={(e) => handleChange('nama_project', e.target.value)}
                />
            </Form.Item>

            <Form.Item label='Team Lead:'>
                <Select
                    placeholder="Team lead"
                    style={{ marginLeft: 18, width: 335 }}
                    onChange={handleSelectChange}
                    options={options}
                    value={formData.id_team_lead || undefined}
                />
            </Form.Item>

            <Form.Item label='Nama Team:'>
                <Input
                    placeholder="Nama team"
                    value={formData.nama_team}
                    style={{ marginLeft: 11, width: 334.5 }}
                    onChange={(e) => handleChange('nama_team', e.target.value)}
                />
            </Form.Item>

            <Form.Item label='Tanggal:'>
                <RangePicker
                    style={{ marginLeft: 36, width: 335 }}
                    value={formData.start_date && formData.end_date ? [dayjs(formData.start_date), dayjs(formData.end_date)] : null}
                    onChange={handleDateChange}
                />
            </Form.Item>

            <Form.Item label='Upload File:'>
                <input
                    type="file"
                    accept="application/pdf"
                    style={{ display: 'none' }}
                    ref={fileInputRef}
                    onChange={handleFileChange}
                />

                <Button
                    htmlType="button"
                    block
                    onClick={handleButtonClick}
                    style={{ marginLeft: 14, width: 334 }}
                >
                    <UploadOutlined />Upload file project
                </Button>
                {formData.file_project && <p style={{ marginLeft: 14, marginTop: '8px' }}>{formData.file_project.name}</p>}
            </Form.Item>

        </>
    );
};

export default TambahProject;