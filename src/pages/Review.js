import { Button, Popconfirm, Table, Skeleton } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react';

const Review = () => {
   const columns = [
      {
         title: 'STT',
         dataIndex: 'stt',
      },
      {
         title: 'Nội dung',
         dataIndex: 'review',
      },
      {
         title: 'Số sao đánh giá',
         dataIndex: 'starsNumber',
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
         render: (id) => (
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
         ),
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
      handleDelete(id);
   };

   const fetchData = async () => {
      try {
         const token = localStorage.getItem("token");
         const response = await axios.get('http://localhost:8080/review', {
            headers: {
               "Authorization": `Bearer ${token}`
            }
         });
         console.log(response.data);
         
         const reviewListWithStt = response.data._embedded.reviews.reverse().map((review, index) => ({
            ...review,
            stt: index + 1,
            id: review._links.self.href.split('/').pop(),
         }));

         const userLinks = reviewListWithStt.map(review => review._links.user.href);
         const productLinks = reviewListWithStt.map(review => review._links.product.href);

         const userEmailPromises = userLinks.map(link => axios.get(link, {
            headers: {
               "Authorization": `Bearer ${token}`
            }
         }));
         
         const productPromises = productLinks.map(link => axios.get(link, {
            headers: {
               "Authorization": `Bearer ${token}`
            }
         }));

         console.log(productPromises);
         const [userEmails, products] = await Promise.all([
            Promise.all(userEmailPromises),
            Promise.all(productPromises)
         ]);

         products.forEach((response, index) => {
            console.log('Product Response:', response.data); // Log product response
         });

         const updatedReviews = reviewListWithStt.map((review, index) => ({
            ...review,
            userEmail: userEmails[index].data.email,
            productName: products[index].data.title,
         }));

         setReviewList(updatedReviews);
         setLoading(true);
      } catch (error) {
         setLoading(true);
         console.log('Error fetching reviews:', error);
      }
   };

   useEffect(() => {
      fetchData();
   }, []);

   return (
      <>
         {loading ? (
            <div>
               <Button type="button" className="btn btn-success mb-3">Add Review</Button>
               <Table columns={columns} dataSource={reviewList} />
            </div>
         ) : (
            <Skeleton active />
         )}
      </>
   );
}

export default Review;
