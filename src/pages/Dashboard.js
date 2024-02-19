import { Column } from '@ant-design/plots';
import { Button, Popconfirm, Table, Skeleton } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FaArrowTrendDown, FaArrowTrendUp } from "react-icons/fa6";
const Dashboard = () => {
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
   console.log(Array.isArray(orderList));
   console.log(orderList);
   const groupOrdersByMonth = (orderList) => {
      const groupedOrders = {};
      orderList.forEach(order => {
         const orderDate = new Date(order.orderDate);
         const monthYear = orderDate.getMonth() + 1 + '/' + orderDate.getFullYear();
         if (!groupedOrders[monthYear]) {
            groupedOrders[monthYear] = {
               orderDate: monthYear,
               total: order.total
            };
         } else {
            groupedOrders[monthYear].total += order.total;
         }
      });

      return Object.values(groupedOrders);
   };

   const data = groupOrdersByMonth(orderList);

   const config = {
      data,
      xField: 'orderDate',
      yField: 'total',
      color: "#ffd333",
      label: {
         position: 'top',
         style: {
            fill: '#FFFFFF',
            opacity: 0.6,
         },
      },
      xAxis: {
         label: {
            autoHide: true,
            autoRotate: false,
         },
      },
      meta: {
         type: {
            alias: 'Month',
         },
         sales: {
            alias: 'Income',
         },
      },
   };
   return (
      <div>
         <h3 className='mb-4'>Dashboard</h3>
         <div className='d-flex justify-content-between align-items-center gap-3'>
            <div className='d-flex justify-content-between align-items-end flex-grow-1 bg-white p-3 roudned-3'>
               <div>
                  <p>Total</p> <h4 className='mb-0'>$1100</h4>
               </div>
               <div className='d-flex flex-column align-items-end'>
                  <h6> <FaArrowTrendUp />32%</h6>
                  <p className='mb-0'>Compare To 2023</p>
               </div>
            </div>
            <div className='d-flex justify-content-between align-items-end flex-grow-1 bg-white p-3 roudned-3'>
               <div>
                  <p>Total</p> <h4 className='mb-0'>$1100</h4>
               </div>
               <div className='d-flex flex-column align-items-end'>
                  <h6 className='red'> <FaArrowTrendDown />32%</h6>
                  <p className='mb-0'>Compare To 2023</p>
               </div>
            </div>
            <div className='d-flex justify-content-between align-items-end flex-grow-1 bg-white p-3 roudned-3'>
               <div>
                  <p>Total</p> <h4 className='mb-0'>$1100</h4>
               </div>
               <div className='d-flex flex-column align-items-end'>
                  <h6 className='green'> <FaArrowTrendUp />32%</h6>
                  <p className='mb-0'>Compare To 2022</p>
               </div>
            </div>
         </div>
         <div className='mt-4'>
            <h3 className='mb-4'>Tiền lãi 2024($)</h3>
            <div>
            {
                  loading ? (<Column {...config} />) : (<Skeleton active />)
               }
            </div>
         </div>
         <div className='mt-4'>
            <h3 className='mb-4'>Danh sách order</h3>
            <div>
               {
                  loading ? (<Table columns={columns} dataSource={orderList} />) : (<Skeleton active />)
               }
            </div>
         </div>
      </div>
   )
}
export default Dashboard