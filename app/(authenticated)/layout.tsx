"use client";

import React, { useState } from 'react';
import { DashboardOutlined, TeamOutlined, IdcardOutlined, ProjectOutlined, UserOutlined, HistoryOutlined, LogoutOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Button, Layout, Menu, Spin, theme, Modal, Input, Alert } from 'antd';
import { useRouter, useParams, usePathname } from 'next/navigation';
import { userRepository } from '#/repository/user';
import ProfileComponent from '#/component/ProfileComponent';

const { Header, Content, Footer, Sider } = Layout;

interface AuthenticatedLayoutProps {
  children: React.ReactNode
}

const AuthenticatedLayout: React.FC<AuthenticatedLayoutProps> = ({ children }) => {
  const router = useRouter();
  const params = useParams();
  const idUser = params?.idUser as string | undefined;
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const [newPassword, setNewPassword] = useState<{ current_password: string; new_password: string; confirm_new_password: string }>({
    current_password: '',
    new_password: '',
    confirm_new_password: ''
  });

  // const [selectedIdUser, setSelectedIdUser] = useState<string | null>(null);

  // state modal edit password
  const [isModalOpen, setIsModalOpen] = useState(false);

  // state alert warning 1
  const [showAlert, setShowAlert] = useState(false);

  // state alert warning 2, konfirm password
  const [showAlert2, setShowAlert2] = useState(false);

  // state alert error password
  const [showAlertError, setShowAlertError] = useState(false)

  // modal edit pw
  const showModal = () => {
    // setSelectedIdUser(newPassword.current_password); // Simpan password saat ini ke state
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  // close modal
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const { data: userData, isLoading, error } = userRepository.hooks.useGetUser(idUser);
  console.log(userData);
  if (isLoading) {
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

  // handle edit password
  const editPassword = async () => {
    if (!newPassword.current_password || !newPassword.new_password || !newPassword.confirm_new_password) {
      // alert('Semua field harus diisi');
      setShowAlert(true);
      return;
    }
    if (error) {
      return <div>Error</div>;
    }
    // const password = newPassword.password

    // Cek apakah current_password sesuai dengan password user saat ini
    // if (newPassword.current_password !== userData?.data?.current_password) {
    //   alert('Password saat ini salah');
    //   return;
    // }

    // cek apakah konfirmasi password sesuai dg pass baru
    if (newPassword.new_password !== newPassword.confirm_new_password) {
      setShowAlert2(true);
      // alert('Konfirmasi password tidak cocok')
      return;
    }

    try {
      console.log('tes', idUser);
      await userRepository.api.editPassword(idUser || '', { newPassword });

      // Kirimkan permintaan edit password ke server (gpt)
      // await userRepository.api.editPassword(idUser || '', { current_password: newPassword.current_password, new_password: newPassword.new_password });

      Modal.success({
        title: 'Berhasil Diubah',
        content: 'Password berhasil diubah...',
        okText: 'OK',
      });
      setIsModalOpen(false); // Close the modal on success
    } catch (error) {
      console.error('Gagal edit password:', error);
      setShowAlertError(true);
      // alert('Gagal mengubah password, periksa password saat ini atau koneksi Anda.');
    }
  };





  console.log(userData);
  const pathname = usePathname() || '';

  const isSuperAdmin = pathname.includes('/super-admin')
  const isTeamLead = pathname.includes('/team-lead')
  const isKaryawan = pathname.includes('/karyawan')
  const isProjectActive = pathname.includes('/project');

  const key = () => {
    if (isProjectActive && isSuperAdmin) {
      return `/super-admin/${idUser}/project`
    }else if(isProjectActive && isTeamLead){
      return `/team-lead/${idUser}/project`
    }else if (isProjectActive && isKaryawan){
      return `/karyawan/${idUser}/project`
    }else{
      return pathname;
    }
  }
  const selectedKey = key();

  const superAdminItems: MenuProps['items'] = [
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
      key: `/super-admin/${idUser}project`,
      icon: <ProjectOutlined style={{ fontSize: 25 }} />,
      label: 'Project',
    }
  ];

  const teamLeadItems: MenuProps['items'] = [
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
    }
  ];

  const karyawanItems: MenuProps['items'] = [
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
    }
  ];

  let items: MenuProps['items'] = [];
  if (pathname.includes(`/super-admin/${idUser}`)) {
    items = superAdminItems;
  } else if (pathname.includes(`/team-lead/${idUser}`)) {
    items = teamLeadItems;
  } else if (pathname.includes(`/karyawan/${idUser}`)) {
    items = karyawanItems;
  }

  const profileContent = () => {
    if (pathname.includes(`/super-admin`) || pathname.includes(`/team-lead/${idUser}`)) {
      return (
        <>
          <p style={{ margin: 0 }}>Nama :</p>
          <p>{userData?.data?.nama}</p>

          <p style={{ margin: 0 }}>Username :</p>
          <p>{userData?.data?.username}</p>

          <p style={{ margin: 0 }}>email :</p>
          <p>{userData?.data?.email}</p>

          <Button block type='primary' onClick={showModal}>
            Ubah Password
          </Button>

          <Modal title="Ubah Password" open={isModalOpen} onOk={editPassword} onCancel={handleCancel}>
            <p>Masukkan Password Saat Ini</p>
            <Input.Password
              placeholder="Masukkan password"
              value={newPassword.current_password}
              onChange={(e) => setNewPassword({ ...newPassword, current_password: e.target.value })}
            />

            <p style={{ marginTop: 15 }}>Masukkan Password Baru</p>
            <Input.Password
              placeholder='Masukkan password baru'
              value={newPassword.new_password}
              onChange={(e) => setNewPassword({ ...newPassword, new_password: e.target.value })}
            />

            <p style={{ marginTop: 15 }}>Konfirmasi Password</p>
            <Input.Password
              placeholder='Konfirmasi password'
              value={newPassword.confirm_new_password}
              onChange={(e) => setNewPassword({ ...newPassword, confirm_new_password: e.target.value })}
            />
          </Modal>

        </>
      )
    } else {
      return (
        <>
          {/* belum selesai */}
          <p style={{ margin: 0 }}>Nik :</p>
          <p></p>

          <p style={{ margin: 0 }}>Nama :</p>
          <p>{userData?.data?.nama}</p>

          <p style={{ margin: 0 }}>Username :</p>
          <p>{userData?.data?.username}</p>

          <p style={{ margin: 0 }}>email :</p>
          <p>{userData?.data?.email}</p>

          <Button block type='primary'>
            Ubah Password
          </Button>
        </>
      )
    }
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
            selectedKeys={[selectedKey]}
            items={items}
            onClick={({ key }) => {
              router.push(key);
            }}
          />
        </div>
        <div
          className="absolute bottom-0 left-0 right-0  text-gray-400 text-center mb-6 transition-colors duration-300 hover:text-white"
        >
          <a style={{ textDecoration: 'none' }} className=' text-gray-400'>
            <h1 className="text-lg m-0">
              <LogoutOutlined /> logout
            </h1>
          </a>
        </div>
      </Sider>

      {/* ALERT WARNING 1 */}
      {showAlert && (
        <>
          {/* Full-screen overlay to block interaction */}
          <div className='alert-overlay' />

          {/* Alert container */}
          <div className="alert-container">
            <Alert
              message="Warning"
              description="Semua field harus diisi."
              type="warning"
              showIcon
              closable
              onClose={() => setShowAlert(false)}
            />
          </div>
        </>
      )}

      {/* ALERT KONFIRMASI PASSWORD 2 */}
      {showAlert2 && (
        <>
          <div className='alert-overlay' />

          <div className='alert-container'>
            <Alert
              message='Warning'
              description="Konfirmasi password tidak cocok."
              type="warning"
              showIcon
              closable
              onClose={() => setShowAlert2(false)}
            />
          </div>
        </>
      )}

      {/* ALERT ERROR PASSWORD */}
      {showAlertError && (
        <>
          <div className='alert-overlay' />
          <div className='alert-container'>
            <Alert
              message='Error'
              description='Gagal mengubah password, periksa password saat ini atau koneksi Anda.'
              type='error'
              showIcon
              closable
              onClose={() => setShowAlertError(false)}
            />
          </div>
        </>
      )}

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
              content={profileContent}>
              <a style={{ textDecoration: 'none', color: 'black' }}>
                {userData?.data?.nama || 'Guest'}
                <UserOutlined style={{ fontSize: 30, marginLeft: 10 }} />
              </a>
            </ProfileComponent>
          </div>
        </Header>
        {/* , fontFamily: 'Roboto, sans-serif' */}
        <Content style={{ marginLeft: 220, marginTop: 20 }}>
          {children}
        </Content>
        <Footer style={{ textAlign: 'center' }}>
        </Footer>
      </Layout>
    </Layout>
  );
};

export default AuthenticatedLayout;