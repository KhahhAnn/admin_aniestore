import { Button, Skeleton, Table, Modal, Form, Input } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react';

const Customers = () => {
   const [userList, setUserList] = useState([]);
   const [loading, setLoading] = useState(false);
   const [isModalVisible, setIsModalVisible] = useState(false);
   const [editingUser, setEditingUser] = useState(null);
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
         title: 'Họ tên đệm',
         dataIndex: 'firstName',
         key: 'firstName',
      },
      {
         title: 'Tên',
         dataIndex: 'lastName',
         key: 'lastName',
      },
      {
         title: 'Số điện thoại',
         dataIndex: 'mobile',
         key: 'mobile',
      },
      {
         title: 'Email',
         dataIndex: 'email',
         key: 'email',
      },
      {
         title: 'Kích hoạt',
         dataIndex: 'active',
         key: 'active',
         render: (active) => (active ? 'Đã kích hoạt' : 'Chưa kích hoạt'),
      },
      {
         title: 'Ảnh',
         dataIndex: 'imageSrc',
         key: 'imageSrc',
         render: (imageSrc) => <img src={imageSrc} alt="User" style={{ width: '50px', height: '50px' }} />,
      },
      {
         title: 'Action',
         dataIndex: 'id',
         key: 'x',
         render: (id) =>
            <div>
               <Button type="primary" className='button-edit' onClick={() => showEditModal(id)}>Edit</Button>
            </div>,
      },
   ];

   const fetchData = async () => {
      try {
         const token = localStorage.getItem("token");
         const response = await axios.get('http://localhost:8080/user', {
            headers: {
               "Authorization": `Bearer ${token}`
            }
         });
         const usersWithStt = response.data._embedded.userses.reverse().map((user, index) => ({
            ...user,
            stt: index + 1,
         }));
         setUserList(usersWithStt);
         console.log(usersWithStt);
         setLoading(true);
      } catch (error) {
         console.error('Error fetching users:', error);
      }
   };

   useEffect(() => {
      fetchData();
   }, []);

   const showEditModal = (id) => {
      const user = userList.find(user => user.id === id);
      setEditingUser(user);
      form.setFieldsValue(user);
      setIsModalVisible(true);
   };

   const handleCancel = () => {
      setIsModalVisible(false);
   };

   const handleOk = async () => {
      try {
         const updatedUser = form.getFieldsValue();
         const token = localStorage.getItem("token");
         await axios.put(`http://localhost:8080/user/${editingUser.id}`, updatedUser, {
            headers: {
               "Authorization": `Bearer ${token}`
            }
         });
         setUserList(prevList => prevList.map(user => user.id === editingUser.id ? { ...user, ...updatedUser } : user));
         setIsModalVisible(false);
      } catch (error) {
         console.error('Error updating user:', error);
      }
   };

   return (
      <>
         {
            loading ? (
               <div>
                  <Button type="button" className="btn btn-success mb-3">Add Customer</Button>
                  <Table
                     columns={columns}
                     expandable={{
                        expandedRowRender: (record) => (
                           <p style={{ margin: 0 }}>
                              {"Họ và tên: " + record.firstName + " " + record.lastName + " - Số điện thoại: " + record.mobile}
                           </p>
                        ),
                        rowExpandable: (record) => record.name !== 'Not Expandable',
                     }}
                     dataSource={userList}
                  />
                  <Modal
                     title="Edit Customer"
                     visible={isModalVisible}
                     onOk={handleOk}
                     onCancel={handleCancel}
                  >
                     <Form form={form} layout="vertical">
                        <Form.Item name="firstName" label="Họ tên đệm">
                           <Input />
                        </Form.Item>
                        <Form.Item name="lastName" label="Tên">
                           <Input />
                        </Form.Item>
                        <Form.Item name="mobile" label="Số điện thoại">
                           <Input />
                        </Form.Item>
                        <Form.Item name="email" label="Email">
                           <Input />
                        </Form.Item>
                        <Form.Item name="imageSrc" label="Ảnh">
                           <input type="file" onChange={handleChange} />
                           <img src={file == null ? form.getFieldValue('imageSrc') : file} alt='' style={{width: "100px", height: "100px", marginTop: "10px", objectFit: 'cover'}} />
                        </Form.Item>
                        <Form.Item name="active" label="Kích hoạt">
                           <Input type="checkbox" checked={form.getFieldValue('active')} />
                        </Form.Item>
                     </Form>
                  </Modal>
               </div>
            ) : (<Skeleton active />)
         }
      </>
   );
};

export default Customers;
