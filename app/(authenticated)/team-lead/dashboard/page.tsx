"use client";
import React from "react";
import { Button, Card, Space, Table, theme } from "antd";
import { store } from "#/store";
import ComponentCard from "../component/card";
import CardDashboard from "../component/card";
import Link from "next/link";


// Destructure the properties
const dataSource = [
    {
        key: '1',
        name: '04-03-2024 14:55:98 ',
        age: 'Project Aplikasi Perpustakaan',
        address: '10 Downing Street',
    },
    {
        key: '2',
        name: '04-03-2024 14:55:98 ',
        age: 'Project Aplikasi Perpustakaan',
        address: '10 Downing Street',
    },
    {
        key: '2',
        name: '04-03-2024 14:55:98 ',
        age: 'Project Aplikasi Perpustakaan',
        address: '10 Downing Street',
    },
];

const dataSource2 = [
    {
        key: '1',
        name: '04-03-2024 14:55:98 ',
        age: 'Project Aplikasi Perpustakaan',
        address: '10 Downing Street',
        addres: '10 Downing Street',

    },
    {
        key: '2',
        name: '04-03-2024 14:55:98 ',
        age: 'Project Aplikasi Perpustakaan',
        address: '10 Downing Street',
        addres: '10 Downing Street',

    },
    {
        key: '2',
        name: '04-03-2024 14:55:98 ',
        age: 'Project Aplikasi Perpustakaan',
        address: '10 Downing Street',
        addres: '10 Downing Street',
    },

];


const columns = [
    {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: 'Age',
        dataIndex: 'age',
        key: 'age',
    },
    {
        title: 'Address',
        dataIndex: 'address',
        key: 'address',
    },
];

const columns2 = [
    {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: 'Age',
        dataIndex: 'age',
        key: 'age',
    },
    {
        title: 'Address',
        dataIndex: 'address',
        key: 'address',
    },
    {
        title: 'Address',
        dataIndex: 'address',
        key: 'address',
    },
];

const CardProject: React.FC<{
    title: React.ReactNode,
    link: string,
    teamLead: React.ReactNode,
    startDate: string,
    endDate: String
}> = ({ title, link, teamLead ,startDate,endDate}) => (
    <Card style={{ width: '420px', maxWidth: '420px' }}>
        <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontWeight: 'bold',
            fontSize: '20px',
            top: 100,
        }}>
            <div style={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                maxWidth: 'calc(100% - 50px)'
            }}>
                {title}
            </div>
            <span style={{ fontWeight: 'bold', marginLeft: '10px' }}>
                <Link href={link}> &gt; </Link>
            </span>
        </div>
        <div style={{ fontSize: 15, fontWeight: 'bold' }}>
            {teamLead}
        </div>
        <div style={{ backgroundColor: 'rgba(242, 246, 249, 1)', display: 'flex',borderRadius:8 }}>
            <div className="startDate" style={{ borderRight: '1px solid black',padding:10,marginRight:5 }}>
                <h4 style={{color:'rgba(109, 117, 128, 1)'}}>Start Date</h4>
                {startDate}
            </div>

            <div className="endDate" style={{padding:10}}>
                <h4 style={{color:'rgba(109, 117, 128, 1)'}}>End Date</h4>
                {endDate}
            </div>
        </div>
    </Card>
);




const Page: React.FC = () => {
    return (
        <div
            style={{
                padding: 24,
                minHeight: '100vh',
                backgroundColor: 'rgba(255, 255, 255)',
                borderRadius: 15,
            }}

        >
            <div className="card-project" style={{ display: 'flex', justifyContent: 'space-between', gap: '20px', marginBottom: 48 }} >
                <CardDashboard style={{ width: '37em', flex: 1 }}>
                    <Table dataSource={dataSource} columns={columns} pagination={false} style={{ fontSize: '14px', display: "flex" }} />
                </CardDashboard>

                <CardDashboard style={{ width: '50em', flex: 1 }}>
                    <Table dataSource={dataSource2} columns={columns2} pagination={false} style={{ fontSize: '14px' }} />
                </CardDashboard>
            </div>
            <hr style={{ height: '2px', backgroundColor: 'black', border: 'none' }} />
            <div className="project-sedang-dikerjakan">
                <div className="title" style={{ fontFamily: "revert", textAlign: "center", fontSize: 40 }}>
                    <h1>Sedang DiKerjakan</h1>
                </div>
                <div className="project">
                    <CardProject
                        title={<div>Project Dinas Keamanan dan Keselamatan</div>}
                        link={'/'}
                        teamLead={<div>Team Lead 1</div>}
                        startDate={'2024-09-09'}
                        endDate={'2024-09-09'}  
                    />
                </div>
            </div>

        </div>
    );
};

export default Page;

