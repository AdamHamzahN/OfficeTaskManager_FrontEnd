"use client";

import React from 'react';
import { DashboardOutlined, UserOutlined, TeamOutlined, IdcardOutlined, ProjectOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Layout, Menu, theme } from 'antd';
import { useRouter, usePathname } from 'next/navigation';

const { Header, Content, Footer, Sider } = Layout;

interface AuthenticatedLayoutProps {
  children: React.ReactNode
}

const AuthenticatedLayout: React.FC<AuthenticatedLayoutProps> = ({children}) => {
  const router = useRouter();
  const pathname = usePathname() || '';

const {
  token: {colorBgContainer, borderRadiusLG},
} = theme.useToken();

const items: MenuProps['items'] = [
  {
    key: '/super-admin/dashboard',
    icon: <DashboardOutlined style={{fontSize: 23}}/>,
    label: 'Dashboard',
  },
  {
    key: '/super-admin/team-lead',
    icon: <UserOutlined style={{fontSize: 23}}/>,
    label: 'Team Lead',
  },
  {
    key: '/super-admin/karyawan',
    icon: <TeamOutlined style={{fontSize: 23}}/>,
    label: 'Karyawan',
  },
  {
    key: '/super-admin/jobs',
    icon: <IdcardOutlined style={{fontSize: 23}}/>,
    label: 'Jobs',
  },
  {
    key: '/super-admin/project',
    icon: <ProjectOutlined style={{fontSize: 25}}/>,
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
        <div className="rectangel"
        style={{
          padding: 2,
          margin: 10,
          width: 180,
          height: 80,
          backgroundColor: '#FFFFFF33',
          borderRadius: 5,
          textAlign: 'center',
          zIndex: 1000,
        }}
      >
          <img src="/logo-otm.svg" alt="logo" style={{ width: '165px', height: '75.2px' }} />
        </div>
        <div className="demo-logo-vertical" />
        <Menu theme="dark" mode="inline" selectedKeys={[pathname]} items={items} 
          onClick={({key}) => {
            router.push(key);
            // console.log(`key ${key} route not found`);
          }}
        />
      </Sider>

      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }}>
          <div style={{marginLeft: 970, fontSize: 20}}>
          Super Admin
          <UserOutlined style={{fontSize: 30, marginLeft: 10}}/>
          </div>
        </Header>
        <Content style={{ margin: '24px 16px 0' }}>
          <div
            style={{
              padding: 24,
              minHeight: 560,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            {children}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AuthenticatedLayout;
