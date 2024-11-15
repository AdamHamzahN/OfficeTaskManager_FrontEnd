"use client";
import React from 'react';
import { DashboardOutlined, TeamOutlined, IdcardOutlined, ProjectOutlined, UserOutlined, HistoryOutlined, LogoutOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Layout, Menu, Spin, theme, Modal } from 'antd';
import { useRouter, useParams, usePathname } from 'next/navigation';
import { userRepository } from '#/repository/user';
import ProfileComponent from '#/component/ProfileComponent';
import { karyawanRepository } from '#/repository/karyawan';
import { JwtToken } from '#/utils/jwtToken';

const { Header, Content, Footer, Sider } = Layout;

interface AuthenticatedLayoutProps {
  children: React.ReactNode
}

const AuthenticatedLayout: React.FC<AuthenticatedLayoutProps> = ({ children }) => {
  const router = useRouter();
  const params = useParams();
  const pathname = usePathname() || '';
  // Mengambil data auth ( token dan expiryTime ) dari local storage
  let authData = JwtToken.getAuthData() || {};

  //mengambil token dan expiryTime dari authData
  const token = authData?.token || null;
  const expiryTime = authData?.expiryTime || null;

  //Mengambil payload yang ada di token
  let payload = JwtToken.getPayload(token); 

  //mengambil id/sub dari payload
  const id = payload?.sub;
  const role = payload?.role;

  //mengambil idUser dari params
  const idUser = params?.idUser as string | undefined;

  //cek apakah user berada di path / url tertentu
  const isSuperAdmin = pathname.includes(`/super-admin/${idUser}`);
  const isTeamLead = pathname.includes(`/team-lead/${idUser}`);
  const isKaryawan = pathname.includes(`/karyawan/${idUser}`);
  const isProjectActive = pathname.includes('/project');
  
  //variable cek user
  let checkUser = false;

  /**
   * Mengecek apakah token sudah expired atau belum
   */
  if (expiryTime && token) {
    const currentTime = new Date().getTime();
    if (currentTime >= expiryTime) {
      //bila waktu sekarang melebihi waktu expired dari token maka 
      //Menghapus semua data dari local storage
      localStorage.clear();
      Modal.warning({
        title: 'Sesi Kadaluarsa',
        content: 'Sesi Anda telah kadaluarsa , mohon untuk melakukan login ulang.',
        onOk() {
          //kembali ke halaman login
          router.push('/login');
        }
      });
    }
  }

  /**
   * Mengecek apakah token ada 
   */
  if (!token) {
    //Kembalikan ke /login bila token tidak ada
    router.push('/login');
  } else {
    //cek Role bila token ada
    if (isSuperAdmin && role !== 'Super admin') {
      router.push('/login');
    } else if (isTeamLead && role !== 'Team Lead') {
      router.push('/login');
    } else if (isKaryawan && role !== 'Karyawan') {
      router.push('/login');
    } else if (idUser !== id) {
      /**
       * mengecek apakah id user pada local storage sama dengan yang di url 
       * Bila tidak cocok maka kembalikan ke halaman login
       */
      router.push('/login');
    } else {
      checkUser = true;
    }
    if (checkUser) {
      const { token: { colorBgContainer } } = theme.useToken();
      /**
       * Memanggil hook untuk detail user
       */
      const { data: userData, isLoading:userLoading } = userRepository.hooks.useGetUser(idUser);

      /**
       * Memanggil hook untuk detail karyawan bila role user adalah karyawan
       */
      const { data: karyawanData, isLoading: karyawanLoading } = role == 'Karyawan' ? 
        karyawanRepository.hooks.useGetKaryawanByIdUser(idUser!) : { data: null, isLoading: false };

      let loading = userLoading || karyawanLoading;
      if (loading) {
        return <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh'
        }}>
          <Spin size="large" style={{ padding: '20px' }} />
          Mohon Tunggu ....
        </div>;
      }

      // handle untuk logout
      const handleLogout = () => {
        localStorage.clear();
        router.push('/login');
      }

      const selectedKey = () => {
        if (isProjectActive && isSuperAdmin) {
          return `/super-admin/${idUser}/project`
        } else if (isProjectActive && isTeamLead) {
          return `/team-lead/${idUser}/project`
        } else if (isProjectActive && isKaryawan) {
          return `/karyawan/${idUser}/project`
        } else {
          return pathname;
        }
      }

      /**
       * Item yang ditampilkan di menu / side bar
       */
      const menuItemsByRole = {
        superAdmin: [
          {
            key: `/super-admin/${idUser}/dashboard`,
            icon: <DashboardOutlined style={{ fontSize: 23 }} />,
            label: 'Dashboard',
          },
          {
            key: `/super-admin/${idUser}/team-lead`,
            icon: <UserOutlined style={{ fontSize: 23 }} />,
            label: 'Team Lead',
          },
          {
            key: `/super-admin/${idUser}/karyawan`,
            icon: <TeamOutlined style={{ fontSize: 23 }} />,
            label: 'Karyawan',
          },
          {
            key: `/super-admin/${idUser}/jobs`,
            icon: <IdcardOutlined style={{ fontSize: 23 }} />,
            label: 'Jobs',
          },
          {
            key: `/super-admin/${idUser}/project`,
            icon: <ProjectOutlined style={{ fontSize: 25 }} />,
            label: 'Project',
          },
        ],
        teamLead: [
          {
            key: `/team-lead/${idUser}/dashboard`,
            icon: <DashboardOutlined style={{ fontSize: 23 }} />,
            label: 'Dashboard',
          },
          {
            key: `/team-lead/${idUser}/karyawan`,
            icon: <TeamOutlined style={{ fontSize: 23 }} />,
            label: 'Karyawan',
          },
          {
            key: `/team-lead/${idUser}/jobs`,
            icon: <IdcardOutlined style={{ fontSize: 23 }} />,
            label: 'Jobs',
          },
          {
            key: `/team-lead/${idUser}/project`,
            icon: <ProjectOutlined style={{ fontSize: 23 }} />,
            label: 'Project',
          },
        ],
        karyawan: [
          {
            key: `/karyawan/${idUser}/dashboard`,
            icon: <DashboardOutlined style={{ fontSize: 23 }} />,
            label: 'Dashboard',
          },
          {
            key: `/karyawan/${idUser}/project`,
            icon: <ProjectOutlined style={{ fontSize: 23 }} />,
            label: 'Project',
          },
          {
            key: `/karyawan/${idUser}/history`,
            icon: <HistoryOutlined style={{ fontSize: 23 }} />,
            label: 'History',
          },
        ],
      };
      
      /**
       * Menampilkan menu item berdasarkan role
       */
      let items: MenuProps['items'] = [];
      if (isSuperAdmin) {
        items = menuItemsByRole.superAdmin;
      } else if (isTeamLead) {
        items = menuItemsByRole.teamLead;
      } else if (isKaryawan) {
        items = menuItemsByRole.karyawan;
      }
      
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
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div style={{ flex: 1 }}>
              <div
                className="rectangel"
                style={{
                  padding: 2,
                  margin: 10,
                  width: 180,
                  height: 80,
                  backgroundColor: '#FFFFFF33',
                  borderRadius: 5,
                  textAlign: 'center',
                }}
              >
                <img src="/logo-otm.svg" alt="logo" style={{ width: '165px', height: '75.2px' }} />
              </div>
              <div className="demo-logo-vertical" />
              <Menu
                theme="dark"
                mode="inline"
                selectedKeys={[selectedKey()]}
                items={items}
                onClick={({ key }) => {
                  router.push(key);
                }}
              />
            </div>
            <div
              className="absolute bottom-0 left-0 right-0  text-gray-400 text-center mb-6 transition-colors duration-300 hover:text-white"
            >

              <a style={{ textDecoration: 'none' }} className=' text-gray-400' onClick={handleLogout} >
                <h1 className="text-lg m-0" >
                  <LogoutOutlined /> logout
                </h1>
              </a>
            </div>
          </Sider>
          <Layout>
            <Header
              style={{
                padding: 0,
                background: colorBgContainer,
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center',
                position: 'sticky',
                top: 0,
                zIndex: 998,
              }}
            >
              <div style={{ marginRight: 27, fontSize: 20, color: 'white' }}>
                <ProfileComponent
                  userData={userData} karyawanData={karyawanData?.data} pathname={pathname} idUser={id} mutate={karyawanData?.mutate}
                >
                  <a style={{ textDecoration: 'none', color: 'black' }}>
                    {userData?.data?.nama!}
                    <UserOutlined style={{ fontSize: 30, marginLeft: 10 }} />
                  </a>
                </ProfileComponent>
              </div>
            </Header>
            <Content style={{ marginLeft: 220, marginTop: 20, padding: 10 }}>
              {children}
            </Content>
            <Footer style={{ textAlign: 'center' }}>
            </Footer>
          </Layout>
        </Layout>
      );
    };
  };
};

export default AuthenticatedLayout;