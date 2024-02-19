import React, { useEffect, useState } from 'react';
import { Button, Popconfirm, Skeleton, Table } from 'antd';
import axios from 'axios';
const Order = () => {
   const [orderList, setOrderList] = useState([]);
   const [loading, setLoading] = useState(false);
   const columns = [
      {
         title: 'STT',
         dataIndex: 'stt',
         key: 'stt',
      },
      {
         title: 'Tên hóa đơn bán',
         dataIndex: 'orderName',
         key: 'orderName',
      },
      {
         title: 'Ngày bán',
         key: "orderDate",
         dataIndex: 'orderDate',
      },
      {
         title: 'Trạng thái đơn hàng',
         key: "status",
         dataIndex: 'status',
         render: (status) => (status ? "Đã hoàn thành" : "Chưa hoàn thành")
      },
      {
         title: 'Tổng tiền hóa đơn',
         dataIndex: 'total',
         key: 'total',
      },
      {
         title: 'Action',
         dataIndex: 'id',
         key: 'x',
         render: (id) =>
            <div>
               <Popconfirm
                  title="Delete the task"
                  description="Are you sure to delete this task?"
                  okText="Yes"
                  cancelText="No"
                  onConfirm={() => confirm(id)}
               >
                  <Button danger className='button-delete'>Delete</Button>
               </Popconfirm>
               <Button type="primary" className='button-edit'>Edit</Button>
            </div>
      },
   ];
   const confirm = (id) => {
      handleDelete(id)
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
         setLoading(true)
         fetchData();
      } catch (error) {
         console.log(error);
      }
   }
   const fetchData = async () => {
      try {
         const token = localStorage.getItem("token");
         const response = await axios.get('http://localhost:8080/order', {
            headers: {
               "Authorization": `Bearer ${token}`
            }
         });
         const orderWithStt = response.data._embedded.orders.reverse().map((order, index) => ({
            ...order,
            stt: index + 1,
         }));
         setOrderList(orderWithStt);
         setLoading(true)
      } catch (error) {
         setLoading(true)
         console.error('Error fetching color:', error);
      }
   };
   useEffect(() => {
      fetchData();
   }, []);
   return (
      <div>
         {
            loading ? 
            (
               <div>
                  <button type="button" class="btn btn-success mb-3">Add Order</button>
                  <Table columns={columns} dataSource={orderList} />
               </div>
            ) : (<Skeleton active />)
         }
      </div>
   );
};
export default Order;