import React, { useEffect, useState } from 'react';
import { Skeleton, Table } from 'antd';
import axios from 'axios';
const Category = () => {
   const [categoryList, setCategoryList] = useState([]);
   const [loading, setLoading] = useState(false);
   const columns = [
      {
         title: 'STT',
         dataIndex: 'stt',
         key: 'stt',
      },
      {
         title: 'Tên loại sản phẩm',
         dataIndex: 'categoryName',
         key: 'categoryName',
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
            const response = await axios.get('http://localhost:8080/category', {
               headers: {
                  "Authorization": `Bearer ${token}`
               }
            });
            const categoryWithStt = response.data._embedded.categories.reverse().map((category, index) => ({
               ...category,
               stt: index + 1,
            }));
            setCategoryList(categoryWithStt);
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
            loading ? (<Table columns={columns} dataSource={categoryList} />) : (<Skeleton active />)
         }
      </div>
   );
};
export default Category;