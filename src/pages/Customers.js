import { Button, Skeleton, Table } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react';


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
         title: 'Action',
         dataIndex: 'id',
         key: 'x',
         render: (id) =>
            <div>
               <Button type="primary" className='button-edit'>Edit</Button>
            </div>
         ,
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
               <div>
                  <button type="button" class="btn btn-success mb-3">Add Customers</button>
                  <Table
                     columns={columns}
                     expandable={{
                        expandedRowRender: (record) => (
                           <p
                              style={{
                                 margin: 0,
                              }}
                           >
                              {"Họ và tên: " + record.firstName + " " + record.lastName +  " - Số điện thoại: " + record.mobile}
                           </p>
                        ),
                        rowExpandable: (record) => record.name !== 'Not Expandable',
                     }}
                     dataSource={userList}
                  />
               </div>
            ) : (<Skeleton active />)
         }
      </>
   );
};


export default Customers;