import { Button, Form, Input, Switch, message } from 'antd';
import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';



const formItemLayout = {
   labelCol: {
      xs: {
         span: 24,
      },
      sm: {
         span: 6,
      },
   },
   wrapperCol: {
      xs: {
         span: 24,
      },
      sm: {
         span: 14,
      },
   },
};
const AddCustomer = () => {
   const [file, setFile] = useState();
   const [form] = Form.useForm();
   const navigate = useNavigate();

   function handleChange(e) {
      const imageFile = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
         const imageUrl = reader.result;
         setFile(imageUrl);
         form.setFieldsValue({ imageSrc: imageUrl });
      };
      reader.readAsDataURL(imageFile);
   }

   const handleAddCustomer = async (values) => {
      try {
         const response = await axios.post('http://localhost:8080/api/admin/customer', values);
         console.log(response.data);
         if (response.data.status) {
            message.success('Thêm khách hàng thành công');
            form.resetFields();
            setFile(null);
            navigate("../customers")
         } else {
            message.error('Thêm khách hàng thất bại');
         }
      } catch (error) {
         console.error('Error adding customer:', error);
         message.error('Có lỗi xảy ra khi thêm khách hàng');
      }
   };

   return (
      <div>
         <Link to="../customers"><button type="button" class="btn btn-success mb-3">Tài khoản</button></Link>
         <Form
            {...formItemLayout}
            form={form}
            onFinish={handleAddCustomer}
            style={{
               maxWidth: 600,
            }}
         >
            <Form.Item
               label="Họ đệm"
               name="firstName"
               rules={[
                  {
                     required: true,
                     message: 'Please input!',
                  },
               ]}
            >
               <Input />
            </Form.Item>
            <Form.Item
               label="Tên"
               name="lastName"
               rules={[
                  {
                     required: true,
                     message: 'Please input!',
                  },
               ]}
            >
               <Input />
            </Form.Item>
            <Form.Item
               label="Email"
               name="email"
               rules={[
                  {
                     required: true,
                     message: 'Please input!',
                  },
               ]}
            >
               <Input />
            </Form.Item>
            <Form.Item
               label="Password"
               name="password"
               rules={[
                  {
                     required: true,
                     message: 'Please input!',
                  },
               ]}
            >
               <Input.Password />
            </Form.Item>
            <Form.Item
               label="Phone number"
               name="mobile"
               rules={[
                  {
                     required: true,
                     message: 'Please input!',
                  },
               ]}
            >
               <Input />
            </Form.Item>
            <Form.Item
               label="Active"
               name="active"
               valuePropName="checked"
               rules={[
                  {
                     required: true,
                     message: 'Please input!',
                  },
               ]}
            >
               <Switch />
            </Form.Item>
            <Form.Item name="imageSrc" label="Ảnh">
               <input type="file" onChange={handleChange} />
               <img src={file == null ? form.getFieldValue('imageSrc') : file} alt='' style={{ width: "100px", height: "100px", marginTop: "10px", objectFit: 'cover' }} />
            </Form.Item>
            <Form.Item
               wrapperCol={{
                  offset: 6,
                  span: 16,
               }}
            >
               <Button type="primary" htmlType="submit">
                  Submit
               </Button>
            </Form.Item>
         </Form>
      </div>
   );
};

export default AddCustomer;
