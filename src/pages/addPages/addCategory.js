import { Button, Form, Input, message } from 'antd';
import axios from 'axios';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const AddCategoryForm = () => {
   const [form] = Form.useForm();
   const navigate = useNavigate();

   const onFinish = async (values) => {
      try {
         const response = await axios.post('http://localhost:8080/api/admin/category', values);
         console.log(response.data);
         if (response.data.status) {
            message.success('Thêm danh mục thành công');
            form.resetFields();
            navigate("../category")
         } else {
            message.error('Thêm danh mục thất bại');
         }
      } catch (error) {
         console.error('Error while adding category:', error);
         message.error('Có lỗi xảy ra khi thêm danh mục');
      }
   };

   return (
      <Form
         form={form}
         onFinish={onFinish}
         style={{
            maxWidth: 600,
         }}
      >
         <Form.Item
            label="Tên danh mục"
            name="name"
            rules={[{ required: true, message: 'Vui lòng nhập tên danh mục' }]}
         >
            <Input />
         </Form.Item>
         <Form.Item>
            <Button type="primary" htmlType="submit">
               Thêm danh mục
            </Button>
         </Form.Item>
      </Form>
   );
};

export default AddCategoryForm;
