import React, { useState } from 'react';
import { Button, Input, Modal, Popover, message } from 'antd';
import { userRepository } from '#/repository/user';
import { EditOutlined } from '@ant-design/icons';
import { karyawanRepository } from '#/repository/karyawan';

const ProfileComponent: React.FC<{
  children: React.ReactNode,
  userData: any,
  idUser: any,
  role:any,
}> = ({ children, userData, idUser, role }) => {
  const [open, setOpen] = useState(false);
  let [isModalOpen, setIsModalOpen] = useState(false); // state modal Password
  let [modalAlamat, setModalAlamat] = useState(false); // state modal Alamat
  //state form password
  const [newPassword, setNewPassword] = useState<{ current_password: string; new_password: string; confirm_new_password: string }>({
    current_password: '',
    new_password: '',
    confirm_new_password: ''
  });

  // Memanggil hook untuk detail karyawan bila role karyawan
  const { data: karyawanData, isLoading: karyawanLoading, mutate } = role == 'Karyawan' ?
        karyawanRepository.hooks.useGetKaryawanByIdUser(idUser!) : { data: null, isLoading: false };
  console.log('sad', karyawanData?.data?.alamat)

  //state form alamat
  const [newAlamat, setNewAlamat] = useState<{ alamat: string }>({
    alamat: karyawanData?.data?.alamat ? karyawanData?.data?.alamat : ''
  });

  

  // close modal
  const handleCancel = () => {
    if (isModalOpen == true) {
      setIsModalOpen(false);
    } else if (modalAlamat == true) {
      setModalAlamat(false);
    }
  };

  /**
   * Function handle edit password
   */
  const editPassword = async () => {
    if (!newPassword.current_password || !newPassword.new_password || !newPassword.confirm_new_password) {
      message.warning('Field password tidak boleh kosong.')
      return;
    }
    if (newPassword.new_password !== newPassword.confirm_new_password) {
      message.warning('Mohon konfirmasi password dengan benar')
      return;
    }
    try {
      const response = await userRepository.api.editPassword(idUser || '', { newPassword });
      if (response.userResponse.statusCode === 200) {
        Modal.success({
          title: 'Berhasil Diubah',
          content: 'Password berhasil diubah...',
          okText: 'OK',
        });
        setIsModalOpen(false);
      } else {
        console.log(response.userResponse.message)
        message.error(response.userResponse.message)
      }
    } catch (error: any) {
      message.error(error.message);
    }
  };

  /**
   * function hanlde edit alamat (Khusus karyawan)
   */
  const editAlamat = async () => {
    if (!newAlamat.alamat) {
      message.warning('Field alamat wajib diisi.')
    }
    else {
      try {
        const response = await karyawanRepository.api.editAlamat(karyawanData?.data?.id, { alamat: newAlamat.alamat });
        if (response.karyawanResponse.statusCode === 200) {
          Modal.success({
            title: 'Berhasil Diubah',
            content: 'Alamat Berhasil Diubah',
            okText: 'OK',
          });
          mutate?.();
          setModalAlamat(false);
        } else {
          message.error(response.karyawanResponse.message)
        }
        setIsModalOpen(false);
        } catch (error: any) {
          message.error(error.message);
          }
    }
  };

  //tutup pop over
  const hide = () => {
    setOpen(false);
  };

  //buka pop over
  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
  };

  //content Profile
  const profileContent = () => {
    const buttonPassword = () => {
      return (
        <Button block type='primary' onClick={() => {
          setIsModalOpen(true);
          hide()
          setNewPassword({
            current_password: '',
            new_password: '',
            confirm_new_password: ''
          })
        }}>
          Ubah Password
        </Button>
      )
    }
    if (role == 'Super Admin' || role == 'Team Lead') {
      return (
        <>
          <p style={{ margin: 0 }}>Nama :</p>
          <p>{userData?.data?.nama}</p>

          <p style={{ margin: 0 }}>Username :</p>
          <p>{userData?.data?.username}</p>

          <p style={{ margin: 0 }}>email :</p>
          <p>{userData?.data?.email}</p>
          {role == 'Team Lead' && (
            <>
              <p style={{ margin: 0 }}>status :</p>
              <p>{userData?.data?.status}</p>
            </>
          )}
          {buttonPassword()}
        </>
      )
    } else {
      return (
        <>
          <p style={{ margin: 0 }}>NIK :</p>
          <p>{karyawanData?.data?.nik}</p>

          <p style={{ margin: 0 }}>Nama :</p>
          <p>{userData?.data.nama}</p>

          <p style={{ margin: 0 }}>Alamat :</p>
          {
            karyawanData?.data?.alamat !== null ? (
              <p style={{wordWrap: "break-word", maxWidth: "280px"}}>{karyawanData?.data?.alamat}<a style={{ marginLeft: 5 }} onClick={() => { setModalAlamat(true); hide() }}><EditOutlined /></a></p>
            ) : (
              <p>kosong <a style={{ marginLeft: 5 }} onClick={() => { setModalAlamat(true); hide() }}> <EditOutlined /></a></p>
            )
          }

          <p style={{ margin: 0 }}>Gender :</p>
          <p>{karyawanData?.data?.gender}</p>

          <p style={{ margin: 0 }}>Username :</p>
          <p>{userData?.data.username}</p>

          <p style={{ margin: 0 }}>email :</p>
          <p>{userData?.data.email}</p>

          {buttonPassword()}
        </>
      )
    }
  }

  return (
    <>
      <Popover
        content={profileContent}
        title={
          <div style={{ borderBottom: '1px solid lightgray' }}>
            Profile
          </div>
        }
        trigger="click"
        open={open}
        onOpenChange={handleOpenChange}
      >
        {children}
      </Popover>

      {/* Modal Ubah Password */}
      <Modal title="Ubah Password" open={isModalOpen} onOk={editPassword} onCancel={handleCancel}>
        <div style={{ borderTop: '1px solid lightgray', padding: '20px', borderBottom: '1px solid lightgray' }}>
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
        </div>
      </Modal>

      {/* Modal Ubah Alamat */}
      <Modal title="Ubah Alamat" open={modalAlamat} onOk={editAlamat} onCancel={handleCancel}>
        <div style={{ borderTop: '1px solid lightgray', padding: '20px', borderBottom: '1px solid lightgray' }}>
          <p>Masukkan Alamat Tempat Tinggal</p>
          <Input
            placeholder="Masukkan alamat"
            value={newAlamat.alamat}
            onChange={(e) => setNewAlamat({ ...newAlamat, alamat: e.target.value })}
          />
        </div>
      </Modal>

    </>
  );
}

export default ProfileComponent;