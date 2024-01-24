import { Column } from '@ant-design/plots';
import { Table } from 'antd';
import React from 'react';
import { FaArrowTrendDown, FaArrowTrendUp } from "react-icons/fa6";
const columns = [
   {
      title: 'SNo',
      dataIndex: 'key',
   },
   {
      title: 'Name',
      dataIndex: 'name',
   },
   {
      title: 'Product',
      dataIndex: 'product',
   },
   {
      title: 'Status',
      dataIndex: 'status',
   },
];
const data1 = [];
for (let i = 0; i < 46; i++) {
   data1.push({
      key: i,
      name: `Edward King ${i}`,
      product: 32,
      status: `London, Park Lane no. ${i}`,
   });
}
const Dashboard = () => {
   const data = [
      {
         type: 'Tháng 1',
         sales: 38,
      },
      {
         type: 'Tháng 2',
         sales: 52,
      },
      {
         type: 'Tháng 3',
         sales: 61,
      },
      {
         type: 'Tháng 4',
         sales: 145,
      },
      {
         type: 'Tháng 5',
         sales: 48,
      },
      {
         type: 'Tháng 6',
         sales: 38,
      },
      {
         type: 'Tháng 7',
         sales: 38,
      },
      {
         type: 'Tháng 8',
         sales: 38,
      },
      {
         type: 'Tháng 9',
         sales: 40,
      },
      {
         type: 'Tháng 10',
         sales: 58,
      },
      {
         type: 'Tháng 11',
         sales: 18,
      },
      {
         type: 'Tháng 12',
         sales: 200,
      },
   ];
   const config = {
      data,
      xField: 'type',
      yField: 'sales',
      color: "#ffd333",
      label: {
         position: 'top',
         style: {
            fill: '#FFFFFF',
            opacity: 1,
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
            <h3 className='mb-4'>Tiền lãi 2023($)</h3>
            <div>
               <Column {...config} />
            </div>
         </div>
         <div className='mt-4'>
            <h3 className='mb-4'>Danh sách order</h3>
            <div>
               <Table columns={columns} dataSource={data1} />
            </div>
         </div>
      </div>
   )
}
export default Dashboard