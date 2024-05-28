import React, { useEffect, useState } from 'react';
import { Button, Popconfirm, Skeleton, Table, Modal, Form, Input, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Products = () => {
   const [productList, setProductList] = useState([]);
   const [loading, setLoading] = useState(false);
   const [isModalVisible, setIsModalVisible] = useState(false);
   const [editingProduct, setEditingProduct] = useState(null);
   const [form] = Form.useForm();
   const [file, setFile] = useState();
   function handleChange(e) {
      console.log(e.target.files);
      setFile(URL.createObjectURL(e.target.files[0]));
   }

   const columns = [
      {
         title: 'STT',
         dataIndex: 'stt',
         key: 'stt',
      },
      {
         title: 'Tên sản phẩm',
         dataIndex: 'title',
         key: 'title',
      },
      {
         title: 'Loại sản phẩm',
         dataIndex: 'brand',
         key: 'brand',
      },
      {
         title: 'Màu sắc',
         dataIndex: 'color',
         key: 'color',
      },
      {
         title: 'Số lượng còn',
         dataIndex: 'quantity',
         key: 'quantity',
         render: (text, record) => (
            <span>
               {record.quantity}
            </span>
         ),
      },
      {
         title: 'Giá gốc ',
         dataIndex: 'price',
         key: 'price',
         render: (text, record) => formatCurrency(record.price),
      },
      {
         title: 'Giá bán',
         dataIndex: 'discountedPrice',
         key: 'discountedPrice',
         render: (text, record) => formatCurrency(record.discountedPrice),
      },
      {
         title: 'Ảnh',
         dataIndex: 'imageUrl',
         key: 'imageUrl',
         render: (imageUrl) => <img style={{ width: "50px", height: "50px", objectFit: "cover" }} src={imageUrl} alt='' />
      },
      {
         title: 'Action',
         dataIndex: 'id',
         key: 'x',
         render: (id) => (
            <div style={{ display: "flex", flexDirection: "row" }}>
               <Popconfirm
                  title="Delete the task"
                  description="Are you sure to delete this task?"
                  okText="Yes"
                  cancelText="No"
                  onConfirm={() => confirm(id)}
               >
                  <Button danger className='button-delete'>Delete</Button>
               </Popconfirm>
               <Button type="primary" className='button-edit' onClick={() => showEditModal(id)}>Edit</Button>
            </div>
         ),
      },
   ];

   const formatCurrency = (value) => {
      const formattedValue = new Intl.NumberFormat('vi-VN', {
         style: 'currency',
         currency: 'VND',
      }).format(value);

      return formattedValue;
   };

   const confirm = (id) => {
      handleDelete(id);
   };

   const handleDelete = async (id) => {
      try {
         setLoading(false);
         const token = localStorage.getItem("token");
         const response = await axios.delete(`http://localhost:8080/api/discount/${id}`, {
            headers: {
               "Authorization": `Bearer ${token}`
            }
         });
         console.log(response);
         setLoading(true);
         fetchData();
      } catch (error) {
         console.log(error);
      }
   };

   const fetchData = async () => {
      try {
         const token = localStorage.getItem("token");
         const response = await axios.get('http://localhost:8080/product', {
            headers: {
               "Authorization": `Bearer ${token}`
            }
         });
         console.log(response.data);
         const productWithStt = response.data._embedded.products.reverse().map((product, index) => ({
            ...product,
            stt: index + 1,
         }));
         setProductList(productWithStt);
         setLoading(true);
         console.log(productWithStt);
      } catch (error) {
         console.error('Error fetching color:', error);
      }
   };

   useEffect(() => {
      fetchData();
   }, []);

   const showEditModal = (id) => {
      const product = productList.find(product => product.id === id);
      setEditingProduct(product);
      form.setFieldsValue(product);
      setIsModalVisible(true);
   };

   const handleCancel = () => {
      setIsModalVisible(false);
   };

   const handleOk = async () => {
      try {
         const updatedProduct = form.getFieldsValue();
         const token = localStorage.getItem("token");
         await axios.put(`http://localhost:8080/product/${editingProduct.id}`, updatedProduct, {
            headers: {
               "Authorization": `Bearer ${token}`
            }
         });
         setProductList(prevList => prevList.map(product => product.id === editingProduct.id ? { ...product, ...updatedProduct } : product));
         setIsModalVisible(false);
      } catch (error) {
         console.error('Error updating product:', error);
      }
   };

   const handleImageUpload = (info) => {
      if (info.file.status === 'done') {
         message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === 'error') {
         message.error(`${info.file.name} file upload failed.`);
      }
   };

   return (
      <div>
         {
            loading ?
               (
                  <div>
                     <Link to="../add-product"><button type="button" className="btn btn-success mb-3">Add Product</button></Link>
                     <Table columns={columns} dataSource={productList} />
                     <Modal
                        title="Edit Product"
                        visible={isModalVisible}
                        onOk={handleOk}
                        onCancel={handleCancel}
                     >
                        <Form form={form} layout="vertical">
                           <Form.Item name="title" label="Tên sản phẩm">
                              <Input />
                           </Form.Item>
                           <Form.Item name="brand" label="Loại sản phẩm">
                              <Input />
                           </Form.Item>
                           <Form.Item name="color" label="Màu sắc">
                              <Input />
                           </Form.Item>
                           <Form.Item name="price" label="Giá gốc">
                              <Input />
                           </Form.Item>
                           <Form.Item name="discountedPrice" label="Giá bán">
                              <Input />
                           </Form.Item>
                           <Form.Item name="quantity" label="Số lượng còn">
                              <Input />
                           </Form.Item>
                           <Form.Item name="imageUrl" label="Ảnh">
                              <input type="file" onChange={handleChange} />
                              <img src={file == null ? form.getFieldValue('imageUrl') : file} alt='' style={{ width: "100px", height: "100px", marginTop: "10px", objectFit: 'cover' }} />
                        </Form.Item>
                     </Form>
                  </Modal>
                  </div>
   ) : (<Skeleton active />)
}
      </div >
   );
};

export default Products;
