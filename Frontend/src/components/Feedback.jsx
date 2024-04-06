import React, { useState } from 'react';
import { Form, Input, Button, Rate } from 'antd';
import axios from 'axios';

const FeedbackForm = ({netraID}) => {
  const [form] = Form.useForm();
  const [rating, setRating] = useState(0);

  const handleRatingChange = value => {
    setRating(value);
  };

  const onFinish = async values => {
    try {
      const response = await axios.post('http://localhost:5000/api/submit/feedback', {
        ...values,
        rating, // Include rating in the request body
        netraID
      });
      
      console.log('Feedback submitted successfully:', response.data);
      
      // Reset form fields
      form.resetFields();
      setRating(0);
    } catch (error) {
      console.error('Error submitting feedback:', error);
    }
  };

  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
  };

  return (
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
        <Rate value={rating} onChange={handleRatingChange} />
      </Form.Item>
      <Form.Item
        label="Name"
        name="name"
        rules={[{ required: true, message: 'Please enter your name!' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Comments"
        name="comments"
        rules={[{ required: true, message: 'Please enter your comments!' }]}
      >
        <Input.TextArea rows={4} />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Submit Feedback
        </Button>
      </Form.Item>
    </Form>
  );
};

export default FeedbackForm;
