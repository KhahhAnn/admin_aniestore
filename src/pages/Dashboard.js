import { Skeleton, Table, DatePicker, Pagination } from 'antd';
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
   const [totalElement, setTotalElement] = useState(0);
   const [currentPage, setCurrentPage] = useState(1);
   const [totalPage, setTotalPage] = useState(0);


   const handlePageChange = async (page) => {
      try {
         setCurrentPage(page);
         setLoading(false);
         await fetchData(page);
      } catch (error) {
         console.error('Error fetching products:', error);
      }
   };

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

   const fetchData = async (page = 1) => {
      try {
         setLoading(false);
         const token = localStorage.getItem("token");

         const response = await axios.get(`http://localhost:8080/order?page=${page - 1}&size=10`, {
            headers: {
               "Authorization": `Bearer ${token}`
            }
         });
         const { page: pageInfo, _embedded: { orders } } = response.data;
         setTotalElement(pageInfo.totalElements);
         setTotalPage(pageInfo.totalPages);
         setAllOrders(orders.reverse().map((order, index) => ({
            ...order,
            stt: index + 1 + (page - 1) * 10
         })));
         setLoading(true);
         setOrderList(orders.reverse().map((order, index) => ({
            ...order,
            stt: index + 1 + (page - 1) * 10
         })));

         filterOrders(dateRange, orders);
      } catch (error) {
         setLoading(true);
         console.error('Error fetching orders:', error);
      }
   };

   const filterOrders = (dates, orders = allOrders) => {
      let filteredOrders = [];

      if (dates && dates.length === 2) {
         const [start, end] = dates;
         filteredOrders = orders.filter(order => {
            const orderDate = dayjs(order.orderDate);
            return orderDate.isAfter(start, 'day') && orderDate.isBefore(end, 'day');
         });
      } else {
         filteredOrders = orders;
      }

      // Cập nhật lại STT
      const ordersWithSTT = filteredOrders.map((order, index) => ({
         ...order,
         stt: index + 1,
      }));

      setOrderList(ordersWithSTT);
      formatChartData(ordersWithSTT);
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
         text: Array.isArray(dateRange) && dateRange[0] && dateRange[1]
            ? `Biểu đồ doanh thu từ ${dateRange[0].format('MM/YYYY')} đến ${dateRange[1].format('MM/YYYY')}`
            : 'Biểu đồ doanh thu',

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
         <RangePicker style={{ marginTop: "50px" }} picker="month" onChange={handleDateChange} defaultValue={[dayjs(`${currentYear}-01-01`), dayjs()]} />
         <ReactECharts option={option} style={{ height: '300px', marginTop: "50px" }} />
         <div className='mt-4'>
            <h3 className='mb-4'>Danh sách order</h3>
            <div>
               {
                  loading ? (<Table columns={columns} dataSource={allOrders} pagination={false} />) : (<Skeleton active />)
               }
               <Pagination
                  style={{ marginTop: "30px", alignItems: "center", textAlign: "center" }}
                  total={totalElement}
                  pageSize={10}
                  current={currentPage}
                  onChange={handlePageChange}
               />
            </div>
         </div>
      </div>
   );
};

export default Dashboard;