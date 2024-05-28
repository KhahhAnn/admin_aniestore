import React, { useEffect, useState } from 'react';
import { Button, Popconfirm, Skeleton, Table } from 'antd';
import axios from 'axios';
import ReactECharts from 'echarts-for-react';

const Order = () => {
   const [orderList, setOrderList] = useState([]);
   const [loading, setLoading] = useState(false);
   const [orderStatusData, setOrderStatusData] = useState([]);
   const [totalOrders, setTotalOrders] = useState(0);


   const columns = [
      {
         title: 'STT',
         dataIndex: 'stt',
         key: 'stt',
      },
      {
         title: 'Id đơn hàng',
         dataIndex: 'orderId',
         key: 'orderId',
      },
      {
         title: 'Ngày bán',
         key: "orderDate",
         dataIndex: 'orderDate',
      },
      {
         title: 'Trạng thái đơn hàng',
         key: "orderStatus",
         dataIndex: 'orderStatus',
      },
      {
         title: 'Tổng tiền hóa đơn',
         dataIndex: 'totalDiscountedPrice',
         key: 'totalDiscountedPrice',
         render: (totalDiscountedPrice) => (
            <span style={{ color: "red" }}>
               {totalDiscountedPrice}.000 VNĐ
            </span>
         )
      },
      {
         title: 'Action',
         dataIndex: 'orderId',
         key: 'orderId',
         render: (orderId) => (
            <div>
               <Popconfirm
                  title="Delete the task"
                  description="Are you sure to delete this task?"
                  okText="Yes"
                  cancelText="No"
                  onConfirm={() => confirm(orderId)}
               >
                  <Button danger className='button-delete'>Delete</Button>
               </Popconfirm>
               <Button type="primary" className='button-edit'>Edit</Button>
            </div>
         ),
      },
   ];

   const confirm = (orderId) => {
      handleDelete(orderId)
   };

   const handleDelete = async (orderId) => {
      try {
         setLoading(false);
         const token = localStorage.getItem("token");
         const response = await axios.delete(`http://localhost:8080/api/order/${orderId}`, {
            headers: {
               "Authorization": `Bearer ${token}`
            }
         });
         console.log(response.data);
         setLoading(true);
         fetchData();
      } catch (error) {
         console.log(error);
      }
   }
   const fetchData = async () => {
      try {
         setLoading(false);
         const token = localStorage.getItem("token");
         const response = await axios.get('http://localhost:8080/order', {
            headers: {
               "Authorization": `Bearer ${token}`
            }
         });
         const orders = response.data._embedded.orders;
         const orderWithStt = response.data._embedded.orders.reverse().map((order, index) => ({
            ...order,
            stt: index + 1,
         }));
         setOrderList(orderWithStt);
         setLoading(true);
         const statusCounts = orders.reduce((acc, order) => {
            acc[order.orderStatus] = (acc[order.orderStatus] || 0) + 1;
            return acc;
         }, {});

         // Tạo dữ liệu cho biểu đồ
         const data = Object.keys(statusCounts).map((status) => ({
            value: statusCounts[status],
            name: status,
         }));

         setOrderStatusData(data);
         setTotalOrders(orders.length);
         setLoading(true);
      } catch (error) {
         console.error('Error fetching orders:', error);
         setLoading(true);
      }
   };

   useEffect(() => {
      fetchData();
   }, []);

   const option = {
      title: {
         text: 'Biểu đồ order',
         subtext: 'Tổng số Orders: ' + totalOrders,
         left: 'center'
      },
      tooltip: {
         trigger: 'item',
         formatter: '{a} <br/>{b}: {c} ({d}%)'
      },
      legend: {
         orient: 'vertical',
         left: 'left'
      },
      series: [
         {
            name: 'Order Status',
            type: 'pie',
            radius: '50%',
            data: orderStatusData,
            emphasis: {
               itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
               }
            }
         }
      ]
   };

   return (
      <div>
         {
            loading ?
               (
                  <div>
                     <ReactECharts option={option} style={{ height: '300px' }} />
                     <Table columns={columns} dataSource={orderList} />
                  </div>
               ) : (<Skeleton active />)
         }
      </div>
   );
};

export default Order;
