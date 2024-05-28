import { Button, Popconfirm, Table, Skeleton } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';

const Review = () => {
   const [reviewList, setReviewList] = useState([]);
   const [loading, setLoading] = useState(false);
   const [goodReviews, setGoodReviews] = useState(0);
   const [averageReviews, setAverageReviews] = useState(0);
   const [poorReviews, setPoorReviews] = useState(0);

   useEffect(() => {
      fetchData();
   }, []);

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
   
         const [userEmails, products] = await Promise.all([
            Promise.all(userEmailPromises),
            Promise.all(productPromises)
         ]);
   
         products.forEach((response, index) => {
            console.log('Product Response:', response.data);
         });
   
         const updatedReviews = reviewListWithStt.map((review, index) => ({
            ...review,
            userEmail: userEmails[index].data.email,
            productName: products[index].data.title,
         }));
   
         setReviewList(updatedReviews);
         setLoading(true);
   
         // Tính toán dữ liệu cho biểu đồ
         let goodCount = 0;
         let averageCount = 0;
         let poorCount = 0;
   
         updatedReviews.forEach(review => {
            const starsNumber = review.starsNumber;
            if (starsNumber >= 4 && starsNumber <= 5) {
               goodCount++;
            } else if (starsNumber >= 2 && starsNumber <= 3) {
               averageCount++;
            } else {
               poorCount++;
            }
         });
   
         setGoodReviews(goodCount);
         setAverageReviews(averageCount);
         setPoorReviews(poorCount);
   
      } catch (error) {
         setLoading(true);
         console.log('Error fetching reviews:', error);
      }
   };
   

   const option = {
      tooltip: {
         trigger: 'item'
      },
      legend: {
         top: '5%',
         left: 'center'
      },
      series: [
         {
            name: 'Review Rating',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            itemStyle: {
               borderRadius: 10,
               borderColor: '#fff',
               borderWidth: 2
            },
            label: {
               show: false, 
               position: 'inside',
               formatter: '{b}: {c} ({d}%)' 
            },
            emphasis: {
               label: {
                  show: true,
                  fontSize: 16,
                  fontWeight: 'bold'
               }
            },
            labelLine: {
               show: false
            },
            data: [
               { value: goodReviews, name: 'Good (4-5 stars)' },
               { value: averageReviews, name: 'Average (2-3 stars)' },
               { value: poorReviews, name: 'Poor (0-1 stars)' }
            ]
         }
      ]
   };

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
            </div>
         ),
      },
   ];

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

   return (
      <>
         {loading ? (
            <div>
               <ReactECharts option={option} />
               <Table columns={columns} dataSource={reviewList} />
            </div>
         ) : (
            <Skeleton active />
         )}
      </>
   );
}

export default Review;
