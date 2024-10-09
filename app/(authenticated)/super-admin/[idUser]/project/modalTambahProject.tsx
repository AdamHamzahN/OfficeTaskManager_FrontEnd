
import React, {useRef,useState} from "react";
import { Input, Form, DatePicker, Space, Button } from "antd";
import { UploadOutlined } from '@ant-design/icons';
import dayjs from "dayjs";

interface ModalTambahProject {
    createproject: (projectData: {
                                nama_project: string, 
                                id_team_lead: string, 
                                nama_team: string, 
                                start_date: string, 
                                end_date: string, 
                                file_project: string
                                }) => void;
}

const TambahProject: React.FC<ModalTambahProject> = ({createproject}) => {
    const [nama_project, setNamaProject] = useState<string>('');
    const [id_team_lead, setTeamLead] = useState<string>('');
    const [nama_team, setNamaTeam] = useState<string>('');
    const [start_date, setStartDate] = useState<string>('');
    const [end_date, setEndDate] = useState<string>('');
    const [file_project, setFileProject] = useState<string>('');

    const  handleProject = () => {
        createproject({nama_project, id_team_lead, nama_team, start_date, end_date,file_project});
    };
    // TANGGAL
    const {RangePicker} = DatePicker;

    const handleDataChange = (dates: any, dateStrings: [string, string]) => {
        setStartDate(dateStrings[0]);
        setEndDate(dateStrings[1]);
        handleProject();
    }

    // buttom uploud file
    const fileInputRef = useRef<HTMLInputElement>(null);
    const handleButtonClick = (event:React.MouseEvent<HTMLElement>) => {
        event.preventDefault();
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    return (
        <>
            <Form.Item label='Nama Project:'>
                <Input
                    placeholder="Nama project"
                    value={nama_project}
                    onChange={(e) => {
                        setNamaProject(e.target.value);
                        handleProject();
                    }}
                />
            </Form.Item>

            <Form.Item label='Team Lead:'>
                <Input
                    placeholder="Team lead"
                    value={id_team_lead}
                    style={{ marginLeft: 18, width: 335 }}
                    onChange={(e) => {
                        setTeamLead(e.target.value);
                        handleProject();
                    }}
                />
            </Form.Item>

            <Form.Item label='Nama Team:'>
                <Input
                    placeholder="Nama team"
                    value={nama_team}
                    style={{ marginLeft: 11, width: 334.5 }}
                    onChange={(e) => {
                        setNamaTeam(e.target.value);
                        handleProject();
                    }}
                />
            </Form.Item>

            <Form.Item label='Tanggal:'>
                <RangePicker
                    style={{ marginLeft: 36, width: 335 }}
                    value={start_date && end_date ? [dayjs(start_date), dayjs(end_date)] : null}
                    onChange={handleDataChange}
                />
            </Form.Item>

            <Form.Item label='Upload File:'>
                <input 
                    type="file"
                    accept="application/pdf"
                    style={{ display: 'none' }}
                    ref={fileInputRef}
                    placeholder="Upload file"
                    value={nama_team}
                    onChange={(e) => {
                        setFileProject(e.target.value);
                        handleProject();
                    }}
                />

                <Button 
                    htmlType="button" 
                    block 
                    onClick={handleButtonClick} 
                    style={{ marginLeft: 14, width: 334 }}>  
                    <UploadOutlined/>Upload file</Button>
            </Form.Item>
            
        </>
    );
};

export default TambahProject;