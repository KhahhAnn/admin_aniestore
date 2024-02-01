import React, { useEffect, useState } from 'react';
import { Button, Table } from 'antd';
import axios from 'axios';
import { Skeleton } from 'antd';

const Customers = () => {
   const [userList, setUserList] = useState([]);
   const [loading, setLoading] = useState(false);
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
         title: 'Địa chỉ',
         dataIndex: 'address',
         key: 'address',
      },
      {
         title: 'Ngày sinh',
         dataIndex: 'birthday',
         key: 'birthday',
      },
      {
         title: 'Số điện thoại',
         dataIndex: 'phoneNum',
         key: 'phoneNum',
      },
      {
         title: 'Giới tính',
         dataIndex: 'gender',
         key: 'gender',
      },
      {
         title: 'Tên hiển thị',
         dataIndex: 'userName',
         key: 'userName',
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
         title: 'Action',
         dataIndex: 'id',
         key: 'x',
         render: (id) =>
            <div>
               <Button danger className='button-delete' onClick={() => handleDelete(id)}>Delete</Button>
               <Button type="primary" className='button-edit'>Edit</Button>
            </div>
         ,
      },
   ];
   const handleDelete = async (id) => {
      try {
         setLoading(false);
         const token = localStorage.getItem("token");
         const response = await axios.delete(`http://localhost:8080/api/user/${id}`, {
            headers: {
               "Authorization": `Bearer ${token}`
            }
         });
         console.log(response);
         setLoading(true)
         fetchData();
      } catch (error) {
         console.log(error);
      }
   }
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
         setLoading(true)
      } catch (error) {
         console.error('Error fetching reviews:', error);
      }
   };
   useEffect(() => {
      fetchData();
   }, []);
   return (
      <>
         {
            loading ? (
               <Table
                  columns={columns}
                  expandable={{
                     expandedRowRender: (record) => (
                        <p
                           style={{
                              margin: 0,
                           }}
                        >
                           {"Họ và tên: " + record.firstName + " " + record.lastName + " - Địa chỉ: " + record.address + " - Số điện thoại: " + record.phoneNum}
                        </p>
                     ),
                     rowExpandable: (record) => record.name !== 'Not Expandable',
                  }}
                  dataSource={userList}
               />
            ) : (<Skeleton active />)
         }
      </>
   );
};


export default Customers;