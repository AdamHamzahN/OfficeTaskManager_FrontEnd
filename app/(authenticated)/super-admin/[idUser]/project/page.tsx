'use client';

import React, { useState } from 'react';
import { Divider, Radio, Table, Button, Tabs, TabsProps } from 'antd';
import type { TableColumnsType, TableProps } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useParams } from 'next/navigation';
import ModalComponent from '#/component/ModalComponent';
import TambahProject from './modalTambahProject';

const Page: React.FC = () => {
    const [newProject, setNewProject] = useState<{nama_project: string, id_team_lead: string, nama_team: string, start_date: string, end_date: string, file_project: string}>({
        nama_project: '',
        id_team_lead: '',
        nama_team: '',
        start_date: '',
        end_date: '',
        file_project: ''
    });

    const [activeKey, setActiveKey] = useState<string>('pending');
    const params = useParams();

    const onChange: TabsProps['onChange'] = (key) => {
        setActiveKey(key);
    };

    const items: TabsProps['items'] = [
        {
            key: 'pending',
            label: 'Pending',
        },
        {
            key: 'on-progres',
            label: 'On Progres',
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
                            {/* <Button type='primary' onClick={tambahProject}>OK</Button> */}
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
            </div>
        </>
    );
};

export default Page;