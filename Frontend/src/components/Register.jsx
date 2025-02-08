import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, Space, message } from 'antd';
import axios from 'axios';
import Swal from 'sweetalert2';
import Cookies from 'js-cookie';
import Loader from './Loader';
import Navbar from './Navbar';
import { baseUrl } from '../baseurl';

const { Title, Text } = Typography;

const Register = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const handleResultClick = async (phnumber) => {
        try {
            const response = await axios.post(`${baseUrl}/api/def-token-register`, { phnumber });
            if (response.status === 201) {
                Swal.fire({ icon: 'warning', title: 'Already Exists!', text: response.data.message });
            } else {
                Swal.fire({ icon: 'success', title: 'Success!', text: `Search for ${response.data.name}` });
            }
        } catch (error) {
            if (error.response?.status === 500) {
                showPasswordPrompt(phnumber);
            } else {
                console.error('Error logging in:', error);
                message.error('An error occurred while processing your request.');
            }
        }
    };

    const showPasswordPrompt = (phnumber) => {
        Swal.fire({
            title: 'Enter KMIT Netra Password',
            input: 'password',
            inputAttributes: { autocapitalize: 'off' },
            showCancelButton: true,
            confirmButtonText: 'Submit',
            showLoaderOnConfirm: true,
            preConfirm: async (password) => {
                try {
                    const response = await axios.post(`${baseUrl}/api/get-token-register`, { phnumber, password });
                    return response.data;
                } catch (error) {
                    Swal.showValidationMessage('Login failed, please try again.');
                }
            },
            allowOutsideClick: () => !Swal.isLoading()
        }).then((result) => {
            if (result.isConfirmed && result.value?.name) {
                Swal.fire({ icon: 'success', title: 'Success!', text: `Search for ${result.value.name}` });
            } else {
                Swal.fire({ icon: 'error', title: 'Invalid Token', text: 'Failed to retrieve valid token.' });
            }
        });
    };

    const onFinish = async (values) => {
        setLoading(true);
        try {
            await handleResultClick(values.phnumber);
            form.resetFields();
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Navbar />
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Card bordered={false} style={{ maxWidth: 400, width: '100%', textAlign: 'center' }}>
                    <Space direction="vertical" size="large" style={{ width: '100%' }}>
                        <Title level={3} style={{ marginBottom: 0 }}>Spectra Registration</Title>
                        <Text type="secondary">Enter your phone number to check and register.</Text>
                        {loading ? (
                            <Loader />
                        ) : (
                            <Form form={form} layout="vertical" onFinish={onFinish}>
                                <Form.Item
                                    label="Student Phone Number (Netra)"
                                    name="phnumber"
                                    rules={[{ required: true, message: 'Please enter your Phone Number!' }]}
                                >
                                    <Input placeholder="Enter your Number" />
                                </Form.Item>
                                <Form.Item>
                                    <Button type="primary" htmlType="submit" block>Check and Register</Button>
                                </Form.Item>
                            </Form>
                        )}
                    </Space>
                </Card>
            </div>
        </>
    );
};

export default Register;
