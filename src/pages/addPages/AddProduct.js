import { PlusOutlined } from '@ant-design/icons';
import {
   Button,
   Form,
   Input,
   InputNumber,
   Upload,
   Select,
   message
} from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

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


const AddProduct = () => {
   const [loading, setLoading] = useState(false);
   const [categoryList, setCategoryList] = useState([]);
   const [form] = Form.useForm();
   const [file, setFile] = useState(null);

   const handleChange = (e) => {
      const imageFile = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
         const imageUrl = reader.result;
         setFile(imageUrl);
         form.setFieldsValue({ imageUrl: imageUrl });
      };
      reader.readAsDataURL(imageFile);
   };

   const fetchCategory = async () => {
      try {
         const token = localStorage.getItem("token");
         const response = await axios.get('http://localhost:8080/category', {
            headers: {
               "Authorization": `Bearer ${token}`
            }
         });
         setCategoryList(response.data._embedded.categories);
         setLoading(true);
      } catch (error) {
         console.error('Error fetching categories:', error);
      }
   }

   const handleSubmit = async (values) => {
      try {
         const token = localStorage.getItem("token");
         await axios.post('http://localhost:8080/api/admin/products/add', values, {
            headers: {
               "Authorization": `Bearer ${token}`,
               "Content-Type": "application/json"
            }
         });

         message.success("Product added successfully!");
         form.resetFields();
      } catch (error) {
         console.error('Error adding product:', error);
         message.error("Failed to add product.");
      }
   };

   useEffect(() => {
      fetchCategory();
   }, []);

   return (<div>
      <Link to="../products"><button type="button" class="btn btn-success mb-3">Sản phẩm</button></Link>
      <Form
         {...formItemLayout}
         form={form}
         variant="filled"
         onFinish={handleSubmit}
         style={{
            maxWidth: 600,
         }}
      >
         <Form.Item
            label="Tên sản phẩm"
            name="title"
            rules={[
               {
                  required: true,
                  message: 'Please input the product name!',
               },
            ]}
         >
            <Input />
         </Form.Item>

         <Form.Item
            label="Màu sắc"
            name="color"
            rules={[
               {
                  required: true,
                  message: 'Please input the product color!',
               },
            ]}
         >
            <Input />
         </Form.Item>

         <Form.Item
            label="Giá bán"
            name="discountedPrice"
            rules={[
               {
                  required: true,
                  message: 'Please input the discounted price!',
               },
            ]}>
            <InputNumber />
         </Form.Item>

         <Form.Item
            label="Giá gốc"
            name="price"
            rules={[
               {
                  required: true,
                  message: 'Please input the original price!',
               },
            ]}>
            <InputNumber />
         </Form.Item>

         <Form.Item
            label="Thương hiệu"
            name="brand"
            rules={[
               {
                  required: true,
                  message: 'Please input the brand!',
               },
            ]}>
            <Input />
         </Form.Item>

         <Form.Item
            label="Số lượng"
            name="quantity"
            rules={[
               {
                  required: true,
                  message: 'Please input the quantity!',
               },
            ]}>
            <InputNumber />
         </Form.Item>

         <Form.Item
            label="Loại sản phẩm"
            name="categoryId"
            rules={[
               {
                  required: true,
                  message: 'Please select a category!',
               },
            ]}
         >
            <Select
               placeholder="Select a category"
               loading={!loading}
            >
               {categoryList.map(category => (
                  <Select.Option key={category.id} value={category.id}>
                     {category.name}
                  </Select.Option>
               ))}
            </Select>
         </Form.Item>

         <Form.Item name="imageUrl" label="Ảnh">
            <input type="file" onChange={handleChange} />
            <img src={file == null ? form.getFieldValue('imageUrl') : file} alt='' style={{ width: "100px", height: "100px", marginTop: "10px", objectFit: 'cover' }} />
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
}

export default AddProduct;
