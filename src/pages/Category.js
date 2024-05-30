import React, { useEffect, useState } from 'react';
import { Button, Modal, Form, Input, Skeleton, Table, message } from 'antd';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Category = () => {
   const [categoryList, setCategoryList] = useState([]);
   const [loading, setLoading] = useState(false);
   const [isModalVisible, setIsModalVisible] = useState(false);
   const [editingCategory, setEditingCategory] = useState(null);
   const [form] = Form.useForm();

   const columns = [
      {
         title: 'STT',
         dataIndex: 'stt',
         key: 'stt',
      },
      {
         title: 'Tên loại sản phẩm',
         dataIndex: 'name',
         key: 'name',
      },
      {
         title: 'Action',
         dataIndex: 'id',
         key: 'x',
         render: (id) => (
            <div>
               <Button danger className='button-delete' onClick={() => handleDelete(id)}>Delete</Button>
               <Button type="primary" className='button-edit' onClick={() => showEditModal(id)}>Edit</Button>
            </div>
         ),
      },
   ];

   const handleDelete = async (id) => {
      try {
         setLoading(false);
         console.log(id);
         const token = localStorage.getItem("token");
         await axios.delete(`http://localhost:8080/api/admin/category/${id}`, {
            headers: {
               "Authorization": `Bearer ${token}`
            }
         });
         message.success("Xóa loại sản phẩm thành công");
         setLoading(true);
         fetchData();
      } catch (error) {
         console.log(error);
         message.error("Xóa loại sản phẩm thất bại");
         setLoading(true);
      }
   };

   const fetchData = async () => {
      try {
         const token = localStorage.getItem("token");
         const response = await axios.get('http://localhost:8080/category', {
            headers: {
               "Authorization": `Bearer ${token}`
            }
         });
         const categoryWithStt = response.data._embedded.categories.reverse().map((category, index) => ({
            ...category,
            stt: index + 1,
         }));
         console.log(categoryWithStt);
         setCategoryList(categoryWithStt);
         setLoading(true);
      } catch (error) {
         console.error('Error fetching color:', error);
      }
   };


   useEffect(() => {
      fetchData();
   }, []);

   const showEditModal = (id) => {
      const index = categoryList.findIndex(category => category.id === id);
      const category = categoryList[index];
      form.setFieldsValue({
         id: category.id,
         name: category.name
      });
      setEditingCategory(category);
      setIsModalVisible(true);
   };


   const handleCancel = () => {
      setIsModalVisible(false);
   };

   const handleOk = async () => {
      try {
         const updatedCategory = form.getFieldsValue();
         console.log(updatedCategory);
         const token = localStorage.getItem("token");
         await axios.put(`http://localhost:8080/api/admin/category`, updatedCategory, {
            headers: {
               "Authorization": `Bearer ${token}`,
               "Content-Type": "application/json"
            }
         });
         fetchData();
         setIsModalVisible(false);
         message.success("Cập nhật loại sản phẩm thành công");
      } catch (error) {
         console.error('Error updating category:', error);
         message.error("Cập nhật loại sản phẩm thất bại");
      }
   };

   return (
      <div>
         {
            loading ?
               (
                  <div>
                     <Link to="../add-category"><button type="button" className="btn btn-success mb-3">Add Category</button></Link>
                     <Table columns={columns} dataSource={categoryList} />
                     <Modal
                        title="Edit Category"
                        visible={isModalVisible}
                        onOk={handleOk}
                        onCancel={handleCancel}
                     >
                        <Form form={form} layout="vertical">
                           <Form.Item name="id" label="ID">
                              <Input disabled />
                           </Form.Item>
                           <Form.Item name="name" label="Tên loại sản phẩm">
                              <Input />
                           </Form.Item>
                        </Form>
                     </Modal>
                  </div>
               ) : (<Skeleton active />)
         }
      </div>
   );
};

export default Category;
