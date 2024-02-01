import { Button, Popconfirm, Table } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Skeleton } from 'antd';


const Review = () => {

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
   const [reviewList, setReviewList] = useState([]);
   const [loading, setLoading] = useState(false);

   const handleDelete = async (id) => {
      console.log(id);
      try {
         const token = localStorage.getItem("token");
         const response = await axios.delete(`http://localhost:8080/api/review/${id}`, {
            headers: {
               "Authorization": `Bearer ${token}`
            }
         });
         console.log(response);
         fetchData();
      } catch (error) {
         console.log(error);
      }
   }
   const confirm = (id) => {
      handleDelete(id)
   };
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
   useEffect(() => {
      fetchData();
   }, [])

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
