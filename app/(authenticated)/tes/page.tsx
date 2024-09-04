// "use client";

// import React, { Children } from 'react';
// import { DashboardOutlined, UploadOutlined, UserOutlined, VideoCameraOutlined } from '@ant-design/icons';
// import { MenuProps } from 'antd';
// import { Layout, Menu, theme } from 'antd';
// import { useRouter } from 'next/navigation';
// import AuthenticatedLayout from '../layout';

// const { Header, Content, Footer, Sider } = Layout;

// // const items = [DashboardOutlined, UserOutlined, VideoCameraOutlined, UploadOutlined, UserOutlined].map(
// // (icon, index) => ({
// //     key: String(index + 1),
// //     icon: React.createElement(icon),
// //     label: `nav ${index + 1}`,
// // }),
// // );

// const App: React.FC = () => {
// const {
//     token: { colorBgContainer, borderRadiusLG },
// } = theme.useToken();

// interface AuthenticatedLayoutProps {
//     children: React.ReactNode
// }

// const AuthenticatedLayout: React.FC<AuthenticatedLayoutProps> = ({children}) => {
//     const router = useRouter();
// }

// const menu: MenuProps['items'] = [
//     {
//         key: `/home`,
//         icon: <DashboardOutlined/>,
//         label: `Home`,
//     },
//     {
//         key: `/tes`,
//         icon: <UploadOutlined/>,
//         label: `About`,
//     }
// ]


// return (
//     <Layout>
//     <Sider
//         breakpoint="lg"
//         collapsedWidth="0"
//         onBreakpoint={(broken) => {
//         console.log(broken);
//         }}
//         onCollapse={(collapsed, type) => {
//         console.log(collapsed, type);
//         }}
//     >
//         <div className="demo-logo-vertical" />
//         <Menu theme="dark" mode="inline" defaultSelectedKeys={['4']} items={items} />
//     </Sider>
//     <Layout>
//         <Header style={{ padding: 0, background: colorBgContainer }} />
//         <Content style={{ margin: '24px 16px 0' }}>
//         <div
//             style={{
//             padding: 24,
//             minHeight: 300,
//             background: colorBgContainer,
//             borderRadius: borderRadiusLG,
//             }}
//         >
//             content
//         </div>
//         </Content>
//         <Footer style={{ textAlign: 'center' }}>
//         Ant Design ©{new Date().getFullYear()} Created by Ant UED
//         </Footer>
//     </Layout>
//     </Layout>
// );
// };

// export default AuthenticatedLayout;


'use client';

import React from 'react';
import { DashboardOutlined, UploadOutlined, UserOutlined, VideoCameraOutlined } from '@ant-design/icons';
import { Layout, Menu, theme } from 'antd';

const { Header, Content, Footer, Sider } = Layout;

const items = [DashboardOutlined, UserOutlined, VideoCameraOutlined, UploadOutlined, UserOutlined].map(
(icon, index) => ({
    key: String(index + 1),
    icon: React.createElement(icon),
    label: `nav ${index + 1}`,
}),
);

const App: React.FC = () => {
const {
    token: { colorBgContainer, borderRadiusLG },
} = theme.useToken();

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
        <Menu theme="dark" mode="inline" defaultSelectedKeys={['4']} items={items} />
    </Sider>
    <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }} />
        <Content style={{ margin: '24px 16px 0' }}>
        <div
            style={{
            padding: 24,
            minHeight: 300,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
            }}
        >
            content
        </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
        Ant Design ©{new Date().getFullYear()} Created by Ant UED
        </Footer>
    </Layout>
    </Layout>
);
};

export default App;