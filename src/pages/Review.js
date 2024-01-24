import { Table } from 'antd';
import React from 'react'
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
const data = [];
for (let i = 0; i < 46; i++) {
   data.push({
      key: i,
      name: `Edward King ${i}`,
      product: 32,
      status: `London, Park Lane no. ${i}`,
   });
}
const Review = () => {
   return (
      <div>
         <div className='mt-4'>
            <h3 className='mb-4'>Danh sách review</h3>
            <div>
               <Table columns={columns} dataSource={data} />
            </div>
         </div>
      </div>
   )
}

export default Review