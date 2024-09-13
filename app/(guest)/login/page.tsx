"use client";

import React, { useState } from "react";
// import {observer} from 'mobx-react-lite';
import { Button, Card, Col, Form, Input, Layout, Row, Typography } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
// import ParticlesLayout from "../components/Layout/ParticlesLayout";
// import { useHistory } from 'react-router-dom';
// import { useRouter } from 'next/router';
// import { useRouter } from "next/router";



const Login = () => {
    // const store = useStore();
    const [loading, setLoading] = useState(false);

    // let history = useHistory();

    const onFinish = (values: any) => {
        console.log('Received values of form: ', values);
        enterLoading(values).then(res => {
            console.log(res, "awasaa");
        }).catch((error) => {
            console.log({ error }, "awasaa error");
        });
    };

    const enterLoading = async (props: any) => {
        // store.setInitialToken("ayayay", "clap");
        // return history.push("/app/page_example_1");
    };

    return (
        
        <div style={{ width: '90vw', display: 'flex', justifyContent: 'center', padding: '85px' ,textAlign:'center' }}>
            {/* <header> */}
                <img src="/logo.svg" alt="" style={{ width: 200, height: 100, margin: 20, position: 'absolute', top: 0, left: 0}} />
            {/* </header> */}
            <img src="/background.svg" alt="background" />
            
            <Row justify={'center'}>
                <Col>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'flex-start',
                        marginTop: '5vh',
                        flexDirection: 'column',
                        alignItems: 'center',
                        }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>
                            <Typography.Paragraph
                                style={{
                                    margin: 0,
                                    padding: 0,
                                    fontSize: 20,
                                    marginLeft: 5,
                                    fontWeight: 600,
                                    color: "#413d3e",
                                }}
                            >
                                {/* Office Task Manager */}
                            </Typography.Paragraph>
                        </div>
                        <Card
                            style={{ width: 320, textAlign: 'center' }}
                            headStyle={{ fontSize: 30, fontWeight: 200 }}
                            className={"shadow"}
                            bordered={true}
                            title={'Login'}
                        >
                            <Form
                                layout={'vertical'}
                                name="normal_login"
                                className="login-form"
                                onFinish={onFinish}
                            >
                                <Form.Item
                                    label="Username"
                                    name="username"
                                    // size={'large'}
                                    rules={[{ required: false, message: 'Please input your Username!' }]}
                                >
                                    <Input
                                        prefix={<UserOutlined className="site-form-item-icon" />}
                                        type="text"
                                        placeholder="Username" />
                                </Form.Item>

                                <Form.Item
                                    style={{
                                        marginBottom: 0,
                                    }}
                                    label="Password"
                                    name="password"
                                    // size={'large'}
                                    rules={[{ required: false, message: 'Please input your Password!' }]}
                                >
                                    <Input.Password
                                        prefix={<LockOutlined className="site-form-item-icon" />}
                                        type="password"
                                        placeholder="Password"
                                    />
                                </Form.Item>

                                <Form.Item
                                    style={{
                                        marginTop: 0,
                                        marginBottom: 20,
                                        padding: 0
                                    }}
                                >
                                </Form.Item>

                                {/* <Form.Item
                                    style={{
                                        marginBottom: 5,
                                        textAlign: 'left'
                                    }}>
                                    <Form.Item name="remember" valuePropName="checked" noStyle>
                                        <Checkbox>Remember me</Checkbox>
                                    </Form.Item>
                                </Form.Item> */}

                                <Form.Item
                                    style={{
                                        marginBottom: 0,
                                    }}>
                                    <Button type="primary"
                                        block
                                        loading={loading}
                                        htmlType="submit"
                                        size={'large'}
                                        onSubmit={enterLoading}
                                        className="login-form-button">
                                        Sign In
                                    </Button>
                                </Form.Item>
                            </Form>
                        </Card>
                    </div>
                </Col>
            </Row>

        </div>
        )
};

export default Login;
