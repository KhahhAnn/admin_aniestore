import { Button, Popconfirm, Table, Skeleton, message, Pagination } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import * as XLSX from 'xlsx';


const Review = () => {
   const [reviewList, setReviewList] = useState([]);
   const [loading, setLoading] = useState(false);
   const [goodReviews, setGoodReviews] = useState(0);
   const [averageReviews, setAverageReviews] = useState(0);
   const [poorReviews, setPoorReviews] = useState(0);
   const [totalElement, setTotalElement] = useState(0);
   const [currentPage, setCurrentPage] = useState(1);


   useEffect(() => {
      fetchData();
   }, []);

   const fetchData = async (page = 1) => {
      try {
         const token = localStorage.getItem("token");
         const response = await axios.get(`http://localhost:8080/review?page=${page - 1}&size=10`, {
            headers: {
               "Authorization": `Bearer ${token}`
            }
         });

         const { page: pageInfo} = response.data;
         setTotalElement(pageInfo.totalElements); 

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
               { value: goodReviews, name: 'Tốt (4-5 sao)' },
               { value: averageReviews, name: 'Trung bình (2-3 sao)' },
               { value: poorReviews, name: 'Kém (0-1 sao)' }
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
                  title="Xóa"
                  description="Bạn có chắc chắn muốn xóa?"
                  okText="Có"
                  cancelText="Quay lại"
                  onConfirm={() => confirm(id)}
               >
                  <Button danger className='button-delete'>Xóa</Button>
               </Popconfirm>
            </div>
         ),
      },
   ];
   const exportToExcel = () => {
      const ws = XLSX.utils.json_to_sheet(reviewList);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Categories");
      XLSX.writeFile(wb, "review.xlsx");
   };

   const handleDelete = async (id) => {
      console.log(id);
      try {
         const token = localStorage.getItem("token");
         const response = await axios.delete(`http://localhost:8080/api/admin/review/${id}`, {
            headers: {
               "Authorization": `Bearer ${token}`
            }
         });
         console.log(response);
         fetchData();
         message.success("Xóa loại sản phẩm thành công");
      } catch (error) {
         console.log(error);
         message.error("Xóa loại sản phẩm thành công");
      }
   }

   const confirm = (id) => {
      handleDelete(id);
   };

   const handlePageChange = async (page) => {
      try {
         setCurrentPage(page);
         setLoading(false);
         await fetchData(page);
      } catch (error) {
         console.error('Error fetching products:', error);
      }
   };

   return (
      <>
         {loading ? (
            <div>
               <ReactECharts option={option} />
               <Button onClick={exportToExcel} type="primary" style={{ marginBottom: '20px' }}>
                  Xuất excel
               </Button>
               <Table columns={columns} dataSource={reviewList} pagination={false} />
               <Pagination
                  style={{ marginTop: "30px", alignItems: "center", textAlign: "center" }}
                  total={totalElement - 1}
                  pageSize={10}
                  current={currentPage}
                  onChange={handlePageChange}
               />
            </div>
         ) : (
            <Skeleton active />
         )}
      </>
   );
}

export default Review;
