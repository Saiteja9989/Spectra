import React, { useState } from 'react';
import { Form, Input, Button, Rate, Card } from 'antd';
import axios from 'axios';
import Swal from 'sweetalert2'; 
import Loader from './Loader';
import Navbar from './Navbar';
import { baseUrl } from '../baseurl';
const FeedbackForm = ({ token }) => {
  const [form] = Form.useForm();
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleRatingChange = value => {
    setRating(value);
  };

  const onFinish = async values => {
    setLoading(true);
    try {
      const response = await axios.post(`${baseUrl}/api/submit/feedback`, {
        ...values,
        rating,
        token
      });

      console.log('Feedback submitted successfully:', response.data);

      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Feedback submitted successfully',
        confirmButtonText: 'OK'
      });

      form.resetFields();
      setRating(0);
    } catch (error) {
      console.error('Error submitting feedback:', error);
    } finally {
      setLoading(false);
    }
  };

  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
  };

  return (
    <>
      <Navbar/>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Card
          title="Feedback Form"
          style={{ width: '400px', textAlign: 'center', backgroundColor: '#f0f2f5' }}
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
                label="Rating"
                name="rating"
                rules={[{ required: true, message: 'Please give a rating!' }]}
              >
                <Rate value={rating} onChange={handleRatingChange} style={{ color: '#FFD700' }} />
              </Form.Item>
              <Form.Item
                label="Name"
                name="name"
                rules={[{ required: true, message: 'Please enter your name!' }]}
              >
                <Input placeholder="Enter your name" />
              </Form.Item>
              <Form.Item
                label="Comments"
                name="comments"
                rules={[{ required: true, message: 'Please enter your comments!' }]}
              >
                <Input.TextArea placeholder="Enter your comments" rows={4} />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Submit Feedback
                </Button>
              </Form.Item>
            </Form>
          )}
        </Card>
      </div>
    </>
  );
};

export default FeedbackForm;
