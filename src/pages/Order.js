import React, { useEffect, useState } from 'react';
import { Skeleton, Table } from 'antd';
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
      },
      {
         title: 'Tổng tiền hóa đơn',
         dataIndex: 'total',
         key: 'total',
      },
      {
         title: 'Action',
         dataIndex: '',
         key: 'x',
         render: () => <a>Delete</a>,
      },
   ];
   useEffect(() => {
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
            console.error('Error fetching color:', error);
         }
      };
      fetchData();
   }, []);
   return (
      <div>
         {
            loading ? (<Table columns={columns} dataSource={orderList} />) : (<Skeleton active />)
         }
      </div>
   );
};
export default Order;