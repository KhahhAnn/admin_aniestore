import React, { useEffect, useState } from 'react';
import { Skeleton, Table } from 'antd';
import axios from 'axios';

const Discount = () => {
   const [discountList, setDiscountList] = useState([]);
   const [loading, setLoading] = useState(false);
   const columns = [
      {
         title: 'STT',
         dataIndex: 'stt',
         key: 'stt',
      },
      {
         title: 'Mã giảm giá',
         dataIndex: 'discountName',
         key: 'discountName',
      },
      {
         title: 'Phần trăm giảm giá',
         key: "percentDiscount",
         dataIndex: 'percentDiscount',
         render: (percentDiscount) => <p>{percentDiscount}%</p>
      },
      {
         title: 'Ngày áp dụng',
         dataIndex: 'applyDate',
         key: 'applyDate',
      },
      {
         title: 'Ngày hết hạn',
         dataIndex: 'expiry',
         key: 'expiry',
      },
      {
         title: 'Action',
         dataIndex: '',
         key: 'x',
         render: () => <a>Delete</a>,
      },
   ];
   useEffect(() => {
      const fetchData = async () => {
         try {
            const token = localStorage.getItem("token");
            const response = await axios.get('http://localhost:8080/discount', {
               headers: {
                  "Authorization": `Bearer ${token}`
               }
            });
            const discountWithStt = response.data._embedded.discounts.reverse().map((discount, index) => ({
               ...discount,
               stt: index + 1,
            }));
            setDiscountList(discountWithStt);
            setLoading(true)
         } catch (error) {
            console.error('Error fetching color:', error);
         }
      };
      fetchData();
   }, []);
   return (
      <div>
         {
            loading ? <Table columns={columns} dataSource={discountList}/> : <Skeleton active />
         }
      </div>
   );

};
export default Discount;