import { Skeleton, Table } from 'antd';
import axios from 'axios';
import ReactECharts from 'echarts-for-react';
import React, { useEffect, useState } from 'react';
import { FaArrowTrendDown, FaArrowTrendUp } from "react-icons/fa6";

const Dashboard = () => {
   const [orderList, setOrderList] = useState([]);
   const [loading, setLoading] = useState(false);
   const [chartData, setChartData] = useState([]);

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
               {formatCurrency(totalDiscountedPrice)}
            </span>
         )
      },
   ];

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
         setLoading(true);
         formatChartData(orderWithStt);
      } catch (error) {
         setLoading(true);
         console.error('Error fetching orders:', error);
      }
   };

   const formatChartData = (orders) => {
      const aggregatedData = orders.reduce((acc, order) => {
         const date = order.orderDate;
         if (!acc[date]) {
            acc[date] = 0;
         }
         acc[date] += order.totalDiscountedPrice;
         return acc;
      }, {});

      const sortedChartData = Object.keys(aggregatedData)
         .sort((a, b) => new Date(a) - new Date(b))
         .map(date => ({
            date,
            value: aggregatedData[date]
         }));

      setChartData(sortedChartData);
   };

   useEffect(() => {
      fetchData();
   }, []);


   const option = {
      xAxis: {
         type: 'category',
         data: chartData.map(data => data.date),
      },
      yAxis: {
         type: 'value',
      },
      title: {
         show: true,
         text: "Biểu đồ doanh thu tháng 5/2024",
         textStyle: {
            fontFamily: "monospace",
         }
      }, 
      tooltip: {
         show: true,
         trigger: 'axis',
         formatter: (params) => {
            const [{ value, name }] = params;
            return `${name}: ${formatCurrency(value)}`;
         },
      },
      series: [
         {
            data: chartData.map(data => data.value),
            type: 'line',
         },
      ],
   };

   const formatCurrency = (value) => {
      return new Intl.NumberFormat('vi-VN', {
         style: 'currency',
         currency: 'VND',
      }).format(value);
   };
   

   return (
      <div>
         <h3 className='mb-4'>Dashboard</h3>
         <div className='d-flex justify-content-between align-items-center gap-3'>
            <div className='d-flex justify-content-between align-items-end flex-grow-1 bg-white p-3 rounded-3'>
               <div>
                  <p>Total</p> <h4 className='mb-0'>$1100</h4>
               </div>
               <div className='d-flex flex-column align-items-end'>
                  <h6> <FaArrowTrendUp />32%</h6>
                  <p className='mb-0'>Compare To 2023</p>
               </div>
            </div>
            <div className='d-flex justify-content-between align-items-end flex-grow-1 bg-white p-3 rounded-3'>
               <div>
                  <p>Total</p> <h4 className='mb-0'>$1100</h4>
               </div>
               <div className='d-flex flex-column align-items-end'>
                  <h6 className='red'> <FaArrowTrendDown />32%</h6>
                  <p className='mb-0'>Compare To 2023</p>
               </div>
            </div>
            <div className='d-flex justify-content-between align-items-end flex-grow-1 bg-white p-3 rounded-3'>
               <div>
                  <p>Total</p> <h4 className='mb-0'>$1100</h4>
               </div>
               <div className='d-flex flex-column align-items-end'>
                  <h6 className='green'> <FaArrowTrendUp />32%</h6>
                  <p className='mb-0'>Compare To 2022</p>
               </div>
            </div>
         </div>
         <ReactECharts option={option} style={{ height: '300px', marginTop: "100px" }} />
         <div className='mt-4'>
            <h3 className='mb-4'>Danh sách order</h3>
            <div>
               {
                  loading ? (<Table columns={columns} dataSource={orderList} />) : (<Skeleton active />)
               }
            </div>
         </div>
      </div>
   );
};

export default Dashboard;
