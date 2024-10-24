'use client'
import React, { useState } from "react";
import { Button, Card, Col, Form, Input, Row, message } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { authRepository } from "#/repository/auth";
import { useRouter } from "next/navigation";

const Login = () => {
    const router = useRouter()
    const [loading, setLoading] = useState(false);

    const loginHandle = async (values: any) => {
        setLoading(true);
        const response = await authRepository.api.login({
            username: values.username,
            password: values.password
        });

        if (response.error) {
            message.error(response.error);
        } else if (response.status === 200) {
            const token = response.data.access_token;
            const username = response.data.payload.username;
            const role = response.data.payload.role;
            const id = response.data.payload.sub;

            localStorage.setItem('user', username);
            localStorage.setItem('token', token);
            localStorage.setItem('role', role);
            localStorage.setItem('id', id);

            if (role === 'Super admin') {
                router.push(`/super-admin/${id}/dashboard`);
            } else if (role === 'Team Lead') {
                router.push(`/team-lead/${id}/dashboard`);
            } else if (role === 'Karyawan') {
                router.push(`/karyawan/${id}/dashboard`);
            }
        } else {
            message.error('Login gagal, silakan cek username dan password Anda.');
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
                                    rules={[{ required: true, message: 'Please input your Username!' }]}
                                    style={{ marginBottom: '40px' }}
                                >
                                    <Input
                                        size="large"
                                        prefix={<UserOutlined className="site-form-item-icon" />}
                                        placeholder="Username" />
                                </Form.Item>

                                <Form.Item
                                    name="password"
                                    rules={[{ required: true, message: 'Please input your Password!' }]}
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
