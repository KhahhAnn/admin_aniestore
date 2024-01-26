import { Table } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Skeleton } from 'antd';

const columns = [
   {
      title: 'STT',
      dataIndex: 'stt',
   },
   {
      title: 'Nội dung',
      dataIndex: 'contentRated',
   },
   {
      title: 'Số sao đánh giá',
      dataIndex: 'star',
   },
   {
      title: 'Sản phẩm',
      dataIndex: 'productName',
   },
   {
      title: 'Người dùng',
      dataIndex: 'userEmail',
   },
];

const Review = () => {
   const [reviewList, setReviewList] = useState([]);
   const [loading, setLoading] = useState(false);

   useEffect(() => {
      const fetchData = async () => {
         try {
            const token = localStorage.getItem("token");
            const response = await axios.get('http://localhost:8080/review', {
               headers: {
                  "Authorization": `Bearer ${token}`
               }
            });
            const reviewListWithStt = response.data._embedded.reviews.reverse().map((review, index) => ({
               ...review,
               stt: index + 1,
               userEmail: review._links.user.href,
               productName: review._links.products.href
            }));
            setReviewList(reviewListWithStt);

            const userLinks = response.data._embedded.reviews.map(review => review._links.user.href);
            const productLinks = response.data._embedded.reviews.map(review => review._links.products.href);
            const userEmailPromises = userLinks.map(link => axios.get(link, {
               headers: {
                  "Authorization": `Bearer ${token}`
               }
            }));
            const userEmails = await Promise.all(userEmailPromises);
            userEmails.forEach((response, index) => {
               const userEmail = response.data.email;
               setReviewList(prevState => prevState.map((review, i) => (i === index ? { ...review, userEmail } : review)));
            });
            const productsPromises = productLinks.map(link =>
               axios.get(link, {
                  headers: {
                     "Authorization": `Bearer ${token}`
                  }
               }));
            const productsName = await Promise.all(productsPromises);
            productsName.forEach((response, index) => {
               const productName = response.data.productName;
               setReviewList(prevState => prevState.map((review, i) => (i === index ? { ...review, productName } : review)));
            });
            setLoading(true)
         } catch (error) {
            console.log('Error fetching reviews:', error);
         }
      };
      fetchData();
   }, []);

   return (
      <>
         {loading ? (
            <div>
               <div className='mt-4'>
                  <h3 className='mb-4'>Danh sách review</h3>
                  <div>
                     <Table columns={columns} dataSource={reviewList} />
                  </div>
               </div>
            </div>
         ) : (
            <Skeleton active />
         )}
      </>
   );

}

export default Review;
