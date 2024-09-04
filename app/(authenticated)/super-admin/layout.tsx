// "use client";

// import React from 'react';
// import {HomeFilled, InfoCircleFilled, LaptopOutlined, NotificationOutlined, UserOutlined} from '@ant-design/icons';
// import type {MenuProps} from 'antd';
// import {Breadcrumb, Layout, Menu, theme} from 'antd';
// import {useRouter} from "next/navigation";

// const {Header, Content, Sider} = Layout;

// const items1: MenuProps['items'] = ['1', '2', '3'].map((key) => ({
//   key,
//   label: `nav ${key}`,
// }));

// const items2: MenuProps['items'] = [UserOutlined, LaptopOutlined, NotificationOutlined].map(
//   (icon, index) => {
//     const key = String(index + 1);

//     return {
//       key: `sub${key}`,
//       icon: React.createElement(icon),
//       label: `subnav ${key}`,

//       children: new Array(4).fill(null).map((_, j) => {
//         const subKey = index * 4 + j + 1;
//         return {
//           key: subKey,
//           label: `option${subKey}`,
//         };
//       }),
//     };
//   },
// );

// interface AuthenticatedLayoutProps {
//   children: React.ReactNode
// }

// const AuthenticatedLayout: React.FC<AuthenticatedLayoutProps> = ({children}) => {
//   const router = useRouter();

//   const {
//     token: {colorBgContainer},
//   } = theme.useToken();

//   const menu: MenuProps['items'] = [
//     {
//       key: `/home`,
//       icon: <HomeFilled/>,
//       label: `Home`,
//     },
//     {
//       key: `/about`,
//       icon: <InfoCircleFilled/>,
//       label: `About`,
//     }
//   ]

//   return (
//     <Layout>
//       <Header className="header flex">
//         <div className={"text-white"}>y</div>
//         <Menu theme="dark" mode="horizontal" defaultSelectedKeys={[]} items={items1} className={"flex-1"}/>
//       </Header>
//       <Layout>
//         <Sider width={200} style={{background: colorBgContainer}}>
//           <Menu
//             mode="inline"
//             defaultSelectedKeys={['1']}
//             defaultOpenKeys={['sub1']}
//             style={{height: '100%', borderRight: 0}}
//             items={menu.concat(items2)}
//             onClick={({key}) => {
//               router.push(key);
//               // console.log(`key ${key} route not found`);
//             }}
//           />
//         </Sider>
//         <Layout style={{padding: '0 24px 24px', height: 'calc(100vh - 64px)'}}>
//           <Content
//             style={{
//               padding: 24,
//               margin: '16px 0 0 0',
//               minHeight: 280,
//               background: colorBgContainer,
//             }}
//           >
//             {children}
//           </Content>
//         </Layout>
//       </Layout>
//     </Layout>
//   );
// };

// export default AuthenticatedLayout;

"use client";

import React from 'react';
import { DashboardOutlined, UserOutlined, TeamOutlined, IdcardOutlined, ProjectOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Layout, Menu, theme } from 'antd';
import { useRouter } from 'next/navigation';

const { Header, Content, Footer, Sider } = Layout;

// const items = [DashboardOutlined, UserOutlined, TeamOutlined, IdcardOutlined, ProjectOutlined].map(
//   (icon, index) => ({
//     key: String(index + 1),
//     icon: React.createElement(icon),
//     label: `nav ${index + 1}`,
//   }),
// );

// const App: React.FC = () => {
//   const {
//     token: { colorBgContainer, borderRadiusLG },
//   } = theme.useToken();

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
    key: '/super-admin/dashboard',
    icon: <DashboardOutlined style={{fontSize: 25}}/>,
    label: 'Dashboard',
  },
  {
    key: '/super-admin/team-lead',
    icon: <UserOutlined style={{fontSize: 25}}/>,
    label: 'Team Lead',
  },
  {
    key: '/super-admin/karyawan',
    icon: <TeamOutlined style={{fontSize: 25}}/>,
    label: 'Karyawan',
  },
  {
    key: '/super-admin/jobs',
    icon: <IdcardOutlined style={{fontSize: 25}}/>,
    label: 'Jobs',
  },
  {
    key: '/super-admin/project',
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
        <div className="rectangel"
          style={{
            margin: 10,
            width: 180,
            height: 90,
            backgroundColor: '#FFFFFF33', /* Warna putih dengan 20% transparansi */
            borderRadius: 5,
          }}
        ></div>
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
          <div style={{marginLeft: 970, fontSize: 20}}>
          Super Admin
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

// export default App;

export default AuthenticatedLayout;
