import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Card } from 'antd';
import axios from 'axios';
import Swal from 'sweetalert2'; 
import Cookies from 'js-cookie';  
import Loader from './Loader';
import Navbar from './Navbar';
import { baseUrl } from '../baseurl';

const Register = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
  }, []);

  const handleResultClick = async (result) => {
    try {
        const response = await axios.post(`${baseUrl}/api/def-token-register`, {
            phnumber: result
        });
        console.log(result);
        if(response.status==201){ 
            Swal.fire({
                icon: 'warning',
                title: 'Already exists!',
                text: `${response.data.message}`,
                confirmButtonText: 'OK'
            });
        }else{
            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: `Search for ${response.data.name}`,
                confirmButtonText: 'OK'
            });
        }
    } catch (error) {
        if (error.response?.status === 500) {
            showPasswordPrompt(result);
        } else {
            console.error('Error logging in:', error);
        }
    }
  };

  const showPasswordPrompt = (result) => {
    Swal.fire({
        title: 'Enter KMIT Netra Password',
        input: 'password',
        inputAttributes: { autocapitalize: 'off' },
        showCancelButton: true,
        confirmButtonText: 'Submit',
        showLoaderOnConfirm: true,
        preConfirm: async (password) => {
            try {
                const response = await axios.post(`${baseUrl}/api/get-token-register`, {
                    phnumber: result,
                    password: password
                });
                return response.data;
            } catch (error) {
                console.error('Error logging in:', error);
                Swal.showValidationMessage(`Login failed: ${error}`);
            }
        },
        allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
        if (result.isConfirmed && result.value?.name) {
            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: `Search for ${result.value.name}`,
                confirmButtonText: 'OK'
            });
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Invalid Token',
                text: 'Failed to retrieve valid token from Netra API.',
            });
        }
    });
  };

  const onFinish = async (values) => {
    setLoading(true);
    try {
        console.log(values.phnumber);
        await handleResultClick(values.phnumber);
        form.resetFields();
    } catch (error) {
        console.error('Error submitting feedback:', error);
    } finally {
        setLoading(false);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
    Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Please enter a valid phone number!',
    });
  };

  return (
    <>
      <Navbar />
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Card
          title="Spectra Registration "
          style={{ marginTop: '127px', width: '400px', textAlign: 'center', backgroundColor: '#f0f2f5' }}
          headStyle={{ backgroundColor: '#001529', color: 'white' }}
          bodyStyle={{ padding: '20px' }}
        >
          {loading ? (
            <Loader />
          ) : (
            <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
            >
              <Form.Item
                label="Student-PhoneNumber (Netra)"
                name="phnumber"
                rules={[{ required: true, message: 'Please enter your Phone Number!' }]}
              >
                <Input placeholder="Enter your Number" />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Check and Register
                </Button>
              </Form.Item>
            </Form>
          )}
        </Card>
      </div>
    </>
  );
};

export default Register;
