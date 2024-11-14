'use client'
import React, { useState } from "react";
import { Button, Card, Col, Form, Input, Row, message } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { authRepository } from "#/repository/auth";
import { useRouter } from "next/navigation";
import { JwtToken } from "#/utils/jwtToken";

const Login = () => {
    const router = useRouter()
    const [loading, setLoading] = useState(false);

    const loginHandle = async (values: any) => {
        setLoading(true);
        // Kirim username dan password ke api 
        const response = await authRepository.api.login({
            username: values.username,
            password: values.password
        });

        //cek error
        if (response.error) {
            //bila error tampilkan error
            message.error(response.error);
        } else if (response.status === 200) {
            /**
             * Ambil data dari response dan masukkan ke variable
             */
            const token = response.data.access_token;
            const role = response.data.user.role;
            const id = response.data.user.sub;
            const expiryTime = response.data.expires_in;
            /**
             * Masukkan token dan expiryTime ke variable authData
             */
            const authData = { token , expiryTime };

            /**
             * simpan authData ke local storage
             */
            JwtToken.storeToken(authData);

            /**
             * Cek role dan redirect ke dashboard berdasarkan role user
             */
            if (role === 'Super admin') {
                router.push(`/super-admin/${id}/dashboard`);
            } else if (role === 'Team Lead') {
                router.push(`/team-lead/${id}/dashboard`);
            } else if (role === 'Karyawan') {
                router.push(`/karyawan/${id}/dashboard`);
            }
        } else {
            message.error('Login gagal, username atau password salah.');
        }
        setLoading(false);
    };

    return (
        <div style={{
            width: '100vw',
            height: '100vh',
            justifyContent: 'center',
            alignItems: 'center',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#FFFFFF',
            overflow: 'hidden',
        }}>
            <Row style={{ width: '100%', minHeight: '5vh', maxHeight: '10vh' }} gutter={16}>
                <img
                    src="/logo.svg"
                    alt="logo"
                    style={{ width: 150, height: 50, position: 'absolute', top: 20, left: 20 }}
                />
            </Row>
            <Row style={{ width: '100%', flex: '1 1 auto', display: 'flex', marginTop: '10px', }} gutter={16}>
                <Col xs={24} md={12} style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'column',
                }}>
                    <img
                        src="/image.png"
                        alt="background"
                        style={{ width: '100%', maxHeight: '100vh', objectFit: 'contain' }}
                    />
                </Col>

                <Col xs={24} md={12} style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'column',
                }}>
                    <Card
                        style={{ width: '500px', height: '500px', textAlign: 'center', boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)' }}
                        headStyle={{ fontSize: 30, fontWeight: 200 }}
                        bordered={true}
                        bodyStyle={{ height: '100%' }}
                    >
                        <div style={{ width: '100%', textAlign: 'center', fontFamily: 'Roboto,san-serif', fontSize: '75px', height: '25%' }}>
                            <p>LOGIN</p>
                        </div>
                        <div style={{ width: '100%', textAlign: 'center', height: '75%' }}>
                            <Form
                                layout={'vertical'}
                                initialValues={{ remember: true }}
                                name="normal_login"
                                className="login-form"
                                onFinish={loginHandle}
                            >
                                <Form.Item
                                    name="username"
                                    rules={[{ required: true, message: 'Username tidak boleh kosong!' }]}
                                    style={{ marginBottom: '40px' }}
                                >
                                    <Input
                                        size="large"
                                        prefix={<UserOutlined className="site-form-item-icon" />}
                                        placeholder="Username" />
                                </Form.Item>

                                <Form.Item
                                    name="password"
                                    rules={[{ required: true, message: 'Password tidak boleh kosong!' }]}
                                    style={{ marginBottom: '70px' }}
                                >
                                    <Input.Password
                                        size="large"
                                        prefix={<LockOutlined className="site-form-item-icon" />}
                                        placeholder="Password"
                                    />
                                </Form.Item>

                                <Form.Item>
                                    <Button
                                        type="primary"
                                        block
                                        loading={loading}
                                        htmlType="submit"
                                        size={'large'}
                                        className="login-form-button">
                                        Sign In
                                    </Button>
                                </Form.Item>
                            </Form>
                        </div>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default Login;
