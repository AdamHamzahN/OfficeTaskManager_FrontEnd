'use client';

import React, { useState } from 'react';
import { Divider, Radio, Table, Button, Tabs, TabsProps } from 'antd';
import type { TableColumnsType, TableProps } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useParams } from 'next/navigation';


const Page: React.FC = () => {

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
        <div>
            <h1 style={{ fontSize: 30, padding: 20}} >Project
                <Button type='primary' style={{ marginLeft: 880 }}>
                    <PlusOutlined />Tambah
                </Button>
            </h1>
            <div style={{ 
                    paddingLeft: 24, 
                    paddingRight: 24, 
                    paddingBottom: 24, 
                    minHeight: '100vh', 
                    backgroundColor: '#FFFFFF', 
                    borderRadius: 15 
                    }}>
                <div>
                    <Tabs defaultActiveKey='pending' items={items} onChange={onChange}/>
                </div>
            </div>
        
        </div>
    );
};

export default Page;