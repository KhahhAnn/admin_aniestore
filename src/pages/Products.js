import React, { useEffect, useState } from 'react';
import { Button, Form, Input, InputNumber, Modal, Pagination, Popconfirm, Select, Skeleton, Table, message } from 'antd';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Products = () => {
   const [productList, setProductList] = useState([]);
   const [loading, setLoading] = useState(false);
   const [isModalVisible, setIsModalVisible] = useState(false);
   const [editingProduct, setEditingProduct] = useState(null);
   const [form] = Form.useForm();
   const [file, setFile] = useState(null);
   const [totalElement, setTotalElement] = useState(0);
   const [totalPage, setTotalPage] = useState(0);
   const [currentPage, setCurrentPage] = useState(1);
   const [categoryList, setCategoryList] = useState([]);

   const fetchData = async (page = 1) => {
      try {
         const token = localStorage.getItem("token");
         const response = await axios.get(`http://localhost:8080/product?page=${page}&size=10`, {
            headers: {
               "Authorization": `Bearer ${token}`
            }
         });
         const { page: pageInfo, _embedded: { products } } = response.data;
         setTotalElement(pageInfo.totalElements);
         setTotalPage(pageInfo.totalPages);
         setProductList(products.reverse().map((product, index) => ({
            ...product,
            stt: index + 1 + (page - 1) * 20, // tính stt của sản phẩm trên toàn bộ danh sách
         })));
         setLoading(true);
      } catch (error) {
         console.error('Error fetching products:', error);
      }
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

   useEffect(() => {
      fetchData();
      fetchCategory();
   }, []);

   const handlePageChange = async (page) => {
      try {
         setCurrentPage(page);
         setLoading(false);
         await fetchData(page);
      } catch (error) {
         console.error('Error fetching products:', error);
      }
   };

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

   const handleOk = async () => {
      try {
         const updatedProduct = form.getFieldsValue();
         const token = localStorage.getItem("token");
         await axios.put(`http://localhost:8080/api/admin/products/update`, updatedProduct, {
            headers: {
               "Authorization": `Bearer ${token}`,
               "Content-Type": "application/json"
            }
         });
         fetchData(currentPage);
         setIsModalVisible(false);
         setFile(null);
         message.success("Cập nhật thành công");
      } catch (error) {
         console.error('Error updating product:', error);
         message.error("Cập nhật thất bại");
      }
   };

   const columns = [
      { title: 'STT', dataIndex: 'stt', key: 'stt' },
      { title: 'Tên sản phẩm', dataIndex: 'title', key: 'title' },
      { title: 'Thương hiệu', dataIndex: 'brand', key: 'brand' },
      { title: 'Màu sắc', dataIndex: 'color', key: 'color' },
      { title: 'Số lượng còn', dataIndex: 'quantity', key: 'quantity' },
      { title: 'Giá gốc', dataIndex: 'price', key: 'price', render: (text, record) => formatCurrency(record.price) },
      { title: 'Giá bán', dataIndex: 'discountedPrice', key: 'discountedPrice', render: (text, record) => formatCurrency(record.discountedPrice) },
      { title: 'Ảnh', dataIndex: 'imageUrl', key: 'imageUrl', render: (imageUrl) => <img style={{ width: "50px", height: "50px", objectFit: "cover" }} src={imageUrl} alt='' /> },
      {
         title: 'Action', dataIndex: 'id', key: 'x', render: (id) => (
            <div style={{ display: "flex", flexDirection: "row" }}>
               <Popconfirm
                  title="Xóa sản phẩm"
                  description="Bạn có chắc chắn muốn xóa sản phẩm này?"
                  okText="Yes"
                  cancelText="No"
                  onConfirm={() => handleDelete(id)}
               >
                  <Button danger className='button-delete'>Xóa</Button>
               </Popconfirm>
               <Button type="primary" className='button-edit' onClick={() => showEditModal(id)}>Sửa</Button>
            </div>
         ),
      },
   ];

   const formatCurrency = (value) => {
      return new Intl.NumberFormat('vi-VN', {
         style: 'currency',
         currency: 'VND',
      }).format(value);
   };

   const handleDelete = async (id) => {
      try {
         setLoading(false);
         const token = localStorage.getItem("token");
         await axios.delete(`http://localhost:8080/api/admin/products/delete/${id}`, {
            headers: { "Authorization": `Bearer ${token}` }
         });
         setLoading(true);
         fetchData(currentPage);
         message.success("Xóa thành công");
      } catch (error) {
         console.error('Error deleting product:', error);
         setLoading(true);
         message.error("Xóa thất bại");
      }
   };

   const showEditModal = (id) => {
      const product = productList.find(product => product.id === id);
      setEditingProduct(product);
      form.setFieldsValue(product);
      setIsModalVisible(true);
   };

   const handleCancel = () => {
      setIsModalVisible(false);
   };

   return (
      <div>
         {
            loading ? (
               <div>
                  <Link to="../add-product"><Button type="button" className="btn btn-success mb-3">Thêm Sản Phẩm</Button></Link>
                  <Table columns={columns} dataSource={productList} pagination={false} />
                  <Pagination
                     style={{ marginTop: "30px", alignItems: "center", textAlign: "center" }}
                     total={totalElement - 1}
                     pageSize={10}
                     current={currentPage}
                     onChange={handlePageChange}
                  />
                  <Modal
                     title="Sửa Sản Phẩm"
                     visible={isModalVisible}
                     onOk={handleOk}
                     onCancel={handleCancel}
                  >
                     <Form form={form} layout="vertical">
                        <Form.Item name="id" label="ID">
                           <Input disabled />
                        </Form.Item>
                        <Form.Item name="title" label="Tên Sản Phẩm">
                           <Input />
                        </Form.Item>
                        <Form.Item name="brand" label="Thương Hiệu">
                           <Input />
                        </Form.Item>
                        <Form.Item name="color" label="Màu Sắc">
                           <Input />
                        </Form.Item>
                        <Form.Item name="price" label="Giá Gốc">
                           <InputNumber style={{ width: '100%' }} />
                        </Form.Item>
                        <Form.Item name="discountedPrice" label="Giá Bán">
                           <InputNumber style={{ width: '100%' }} />
                        </Form.Item>
                        <Form.Item name="quantity" label="Số Lượng">
                           <InputNumber style={{ width: '100%' }} />
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
      </div>
   );
};

export default Products;
