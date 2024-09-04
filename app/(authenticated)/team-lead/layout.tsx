"use client";

import React from 'react';
import { DashboardOutlined, TeamOutlined, IdcardOutlined, ProjectOutlined } from '@ant-design/icons';
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
      key: '/team-lead/dashboard',
      icon: <DashboardOutlined/>,
      label: 'Dashboard',
    },
    {
      key: '/team-lead/karyawan',
      icon: <TeamOutlined/>,
      label: 'Karyawan',
    },
    {
      key: '/team-lead/jobs',
      icon: <IdcardOutlined/>,
      label: 'Jobs',
    },
    {
      key: '/team-lead/project',
      icon: <ProjectOutlined/>,
      label: 'Project',
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
          <Header style={{ padding: 0, background: colorBgContainer }} />
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
  
  // export default App;
  
  export default AuthenticatedLayout;