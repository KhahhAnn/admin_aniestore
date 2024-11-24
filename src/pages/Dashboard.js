import { Skeleton, Table, DatePicker } from 'antd';
import axios from 'axios';
import ReactECharts from 'echarts-for-react';
import React, { useEffect, useState } from 'react';
import { FaArrowTrendDown, FaArrowTrendUp } from "react-icons/fa6";
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

const Dashboard = () => {
   const currentYear = dayjs().year();
   const [orderList, setOrderList] = useState([]);
   const [loading, setLoading] = useState(false);
   const [chartData, setChartData] = useState([]);
   const [allOrders, setAllOrders] = useState([]);
   const [dateRange, setDateRange] = useState([
      dayjs(`${currentYear}-01-01`),
      dayjs()
   ]);
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
         title: 'Phương thức thanh toán',
         key: "isPayment",
         dataIndex: 'isPayment',
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

   const handleDateChange = (dates) => {
      setDateRange(dates);
      filterOrders(dates);
   };

   const fetchData = async () => {
      try {
         setLoading(false);
         const token = localStorage.getItem("token");

         const response = await axios.get('http://localhost:8080/order', {
            headers: {
               "Authorization": `Bearer ${token}`
            }
         });

         const orders = response.data._embedded.orders.reverse().map((order, index) => ({
            ...order,
            stt: index + 1,
         }));
         
         setAllOrders(orders);
         setLoading(true);
         filterOrders(dateRange, orders);
      } catch (error) {
         setLoading(true);
         console.error('Error fetching orders:', error);
      }
   };

   const filterOrders = (dates, orders = allOrders) => {
      if (dates && dates.length === 2) {
         const [start, end] = dates;
         const filteredOrders = orders.filter(order => {
            const orderDate = dayjs(order.orderDate);
            return orderDate.isAfter(start, 'day') && orderDate.isBefore(end, 'day');
         });
         setOrderList(filteredOrders);
         formatChartData(filteredOrders);
      } else {
         setOrderList(orders);
         formatChartData(orders);
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
         text: "Biểu đồ doanh thu 2024",
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
         {/* <div className='d-flex justify-content-between align-items-center gap-3 mt-3'>
            <div className='d-flex justify-content-between align-items-end flex-grow-1 bg-white p-3 rounded-3'>
               <div>
                  <p>Tổng</p> <h4 className='mb-0'>$1100</h4>
               </div>
               <div className='d-flex flex-column align-items-end'>
                  <h6> <FaArrowTrendUp />32%</h6>
                  <p className='mb-0'>So với 2023</p>
               </div>
            </div>
            <div className='d-flex justify-content-between align-items-end flex-grow-1 bg-white p-3 rounded-3'>
               <div>
                  <p>Tổng</p> <h4 className='mb-0'>$1100</h4>
               </div>
               <div className='d-flex flex-column align-items-end'>
                  <h6 className='red'> <FaArrowTrendDown />32%</h6>
                  <p className='mb-0'>So với 2022</p>
               </div>
            </div>
            <div className='d-flex justify-content-between align-items-end flex-grow-1 bg-white p-3 rounded-3'>
               <div>
                  <p>Tổng</p> <h4 className='mb-0'>$1100</h4>
               </div>
               <div className='d-flex flex-column align-items-end'>
                  <h6 className='green'> <FaArrowTrendUp />32%</h6>
                  <p className='mb-0'>So với 2021</p>
               </div>
            </div>
         </div> */}
         <RangePicker style={{marginTop: "50px"}} picker="month" onChange={handleDateChange}  defaultValue={[dayjs(`${currentYear}-01-01`), dayjs()]}/>
         <ReactECharts option={option} style={{ height: '300px', marginTop: "50px" }} />
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