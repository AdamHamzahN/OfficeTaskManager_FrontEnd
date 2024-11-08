'use client';

import React, { useState } from 'react';
import { Row, Button, Tabs, TabsProps, Modal, Spin, Alert, Col, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useParams } from 'next/navigation';
import ModalComponent from '#/component/ModalComponent';
import TambahProject from './modalTambahProject';
import { projectRepository } from '#/repository/project';
import ProjectList from '#/component/ProjectList';

const ProjectListComponent: React.FC<{ data: any, isValidating: any, error: any, idUser: string, status: string }> = ({ data, isValidating, error, idUser, status }) => {
    if (isValidating) 
        return (
            <Col span={24}>
                <div style={{ textAlign: 'center', padding: '20px' }}>
                    <Spin size="large" style={{ padding: '20px' }} />
                </div>
            </Col>
        );
    if (error) return <Alert message="Error fetching data" type="error" />;
    if (!data || data.length === 0) 
        return (
            <Col span={24}>
                <div style={{ textAlign: 'center', padding: '20px' }}>
                    <p style={{ margin: 0 }}>Tidak Ada Data</p>
                </div>
            </Col>
        );

    return (
        <>
            {data.map((project: any, index: number) => (
                <ProjectList
                    key={index}
                    title={project.nama_project}
                    link={`/super-admin/${idUser}/project/${project.id}/detail-project`}
                    teamLead={project.user?.username}
                    startDate={project.start_date}
                    endDate={project.end_date}
                />
            ))}
        </>
    );
};

const Page: React.FC = () => {
    const [newProject, setNewProject] = useState<{
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

    const tambahProject = async (handleCancel: () => void) => { 
        console.log('new project', newProject);
        if (!newProject.nama_project || !newProject.id_team_lead || !newProject.nama_team || !newProject.start_date || !newProject.end_date || !newProject.file_project) {
            // alert('semua-nya isi dulu');
            message.warning("Harap isi semua field yang diperlukan.");
            return;
        }
        const nama_project = newProject.nama_project;
        const id_team_lead = newProject.id_team_lead;
        const nama_team = newProject.nama_team;
        const start_date = newProject.start_date;
        const end_date = newProject.end_date;
        const file_project = newProject.file_project

        try {
            await projectRepository.api.tambahProject({ 
                nama_project, id_team_lead, nama_team, start_date, end_date, file_project
            });
            mutate()
            Modal.success({
                title: 'Project Ditambahkan',
                content: 'Berhasil menambahkan Project baru!',
                okText: 'OK',
                onOk() {
                    handleCancel();
                    console.log('Project berhasil ditambahkan');
                },
            });
            
        } catch (error) {
            console.error('gabisa blok', error)
        }
    };

    const [activeKey, setActiveKey] = useState<string>('pending');
    const params = useParams();
    const idUser = params?.idUser as string | undefined

    const { data: project, error: errorProject, isValidating: validateProject, mutate } = 
    projectRepository.hooks.useGetProjectByStatus(activeKey);
    // console.log(namaTeamLead)

    const onChange: TabsProps['onChange'] = (key) => {
        setActiveKey(key);
    };

    const items: TabsProps['items'] = [
        {
            key: 'pending',
            label: 'Pending',
        },
        {
            key: 'on-progress',
            label: 'On Progress',
        },
        {
            key: 'done',
            label: 'Done',
        },
        {
            key: 'approved',
            label: 'Approved'
        },
    ];

    if(!idUser) return <>Invalid user</>

    return (
        <>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <h1 style={{ fontSize: 30, padding: 20}}>Project</h1>

                <ModalComponent
                    title='Tambah Project'
                    content={<TambahProject createproject={setNewProject} /> }
                    footer={(handleCancel) =>(
                        <>
                            <Button onClick={handleCancel}>Cancel</Button>
                            <Button type='primary' onClick={() => tambahProject(handleCancel)}>OK</Button>
                        </>
                    )}
                >
                    <Button type='primary' style={{ marginRight: 30 }}>
                            <PlusOutlined />Tambah
                    </Button>
                </ModalComponent>
            </div>

            <div style={{ 
                    paddingLeft: 24, 
                    paddingRight: 24, 
                    paddingBottom: 24, 
                    minHeight: '100vh', 
                    backgroundColor: '#FFFFFF', 
                    borderRadius: 15 
                    }}>
                {/* <div> */}
                    <Tabs defaultActiveKey='pending' items={items} onChange={onChange}/>
                {/* </div> */}
                <Row style={{marginTop: 20}}>
                    <ProjectListComponent data={project} isValidating={validateProject} error={errorProject} idUser={idUser} status={activeKey}/>
                </Row>
            </div>
        </>
    );
};

export default Page;