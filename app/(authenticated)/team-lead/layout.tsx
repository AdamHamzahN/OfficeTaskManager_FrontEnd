"use client";

import React from 'react';
import { DashboardOutlined, TeamOutlined, IdcardOutlined, ProjectOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Layout, Menu, theme } from 'antd';
import { usePathname, useRouter } from 'next/navigation';

const { Header, Content, Footer, Sider } = Layout;

interface AuthenticatedLayoutProps {
  children: React.ReactNode
}

const AuthenticatedLayout: React.FC<AuthenticatedLayoutProps> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname() || '';  // Berikan string kosong sebagai nilai default jika `pathname` adalah `null`



  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const items: MenuProps['items'] = [
    {
      key: '/team-lead/dashboard',
      icon: <DashboardOutlined style={{ fontSize: 23 }} />,
      label: 'Dashboard',
    },
    {
      key: '/team-lead/karyawan',
      icon: <TeamOutlined style={{ fontSize: 23 }} />,
      label: 'Karyawan',
    },
    {
      key: '/team-lead/jobs',
      icon: <IdcardOutlined style={{ fontSize: 23 }} />,
      label: 'Jobs',
    },
    {
      key: '/team-lead/project',
      icon: <ProjectOutlined style={{ fontSize: 23 }} />,
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
        style={{
          position: 'fixed',
          height: '100vh',
          left: 0,
          top: 0,
          zIndex: 1000,
        }}
      ><div className="rectangel"
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
          onClick={({ key }) => {
            router.push(key);
            // console.log(`key ${key} route not found`);
          }}
        />
      </Sider>

      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer, position: 'sticky', top: 0, zIndex: 999 }} />
        <Content style={{ margin: '24px 16px 0', marginLeft: 220, marginTop: 20, fontFamily: 'Roboto' }}>
          {children}
        </Content>
        <Footer style={{ textAlign: 'center' }}>
        </Footer>
      </Layout>
    </Layout>
  );
};

// export default App;

export default AuthenticatedLayout;