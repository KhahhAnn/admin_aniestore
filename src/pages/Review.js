import { Table } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
const columns = [
   {
      title: 'Id',
      dataIndex: 'id',
   },
   {
      title: 'Content Rate',
      dataIndex: 'contentRated',
   },
   {
      title: 'Star',
      dataIndex: 'star',
   },
   {
      title: 'Product',
      dataIndex: 'product',
   },
   {
      title: 'User',
      dataIndex: 'user',
   },
];

const Review = () => {
   const [reviewList, setReviewList] = useState([]);

   useEffect(() => {
      const fetchData = async () => {
         try {
            const token = localStorage.getItem("token");
            const response = await axios.get('http://localhost:8080/review', {headers: {
               "Authorization" :  `Bearer ${token}`
            }});
            setReviewList(response.data._embedded.reviews);
         } catch (error) {
            console.error('Error fetching reviews:', error);
         }
      };
      fetchData();
   }, []);   
   return (
      <div>
         <div className='mt-4'>
            <h3 className='mb-4'>Danh sách review</h3>
            <div>
               <Table columns={columns} dataSource={reviewList} />
            </div>
         </div>
      </div>
   )
}

export default Review