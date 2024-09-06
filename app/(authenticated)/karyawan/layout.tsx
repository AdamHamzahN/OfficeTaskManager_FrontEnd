"use client";

import React from 'react';
import { DashboardOutlined, ProjectOutlined, HistoryOutlined, UserOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Layout, Menu, theme } from 'antd';
import { useRouter } from 'next/navigation';

const { Header, Content, Footer, Sider } = Layout;

interface AuthenticatedLayoutProps {
    children: React.ReactNode
}

const AuthenticatedLayout: React.FC<AuthenticatedLayoutProps> = ({children}) => {
    const router = useRouter();


const {
    token: {colorBgContainer, borderRadiusLG},
} = theme.useToken();

const items: MenuProps['items'] = [
    {
      key: '/karyawan/dashboard',
      icon: <DashboardOutlined/>,
      label: 'Dashboard',
    },
    {
      key: '/karyawan/project',
      icon: <ProjectOutlined/>,
      label: 'Project',
    },
    {
      key: '/karyawan/history',
      icon: <HistoryOutlined/>,
      label: 'History',
    }
  ]
  
    return (
      <Layout>
        <Sider
          breakpoint="lg"
          collapsedWidth="0"
          onBreakpoint={(broken) => {
            console.log(broken);
          }}
          onCollapse={(collapsed, type) => {
            console.log(collapsed, type);
          }}
        >
          <div className="demo-logo-vertical" />
          <Menu theme="dark" mode="inline" defaultSelectedKeys={[]} items={items} 
            onClick={({key}) => {
              router.push(key);
              // console.log(`key ${key} route not found`);
            }}
          />
        </Sider>
  
        <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }}>
          <div style={{marginLeft: 890, fontSize: 20}}>
          Karyawan
          <UserOutlined style={{fontSize: 30, marginLeft: 10}}/>
          </div>
          </Header>
        <Content style={{ margin: '24px 16px 0' }}>
            <div
              style={{
                padding: 24,
                minHeight: 485,
                background: colorBgContainer,
                borderRadius: borderRadiusLG,
              }}
            >
              {children}
            </div>
          </Content>
          <Footer style={{ textAlign: 'center' }}>
            Ant Design ©{new Date().getFullYear()} Created by Ant UED
          </Footer>
        </Layout>
      </Layout>
    );
  };

  export default AuthenticatedLayout;