import { Button, Skeleton, Table } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
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
         dataIndex: 'id',
         key: 'x',
         render: (id) =>
            <div>
               <Button danger className='button-delete' onClick={() => handleDelete(id)}>Delete</Button>
               <Button type="primary" className='button-edit'>Edit</Button>
            </div>
         ,
      },
   ];
   const handleDelete = async (id) => {
      try {
         setLoading(false);
         const token = localStorage.getItem("token");
         const response = await axios.delete(`http://localhost:8080/api/category/${id}`, {
            headers: {
               "Authorization": `Bearer ${token}`
            }
         });
         console.log(response);
         setLoading(true)
         fetchData();
      } catch (error) {
         console.log(error);
      }
   }
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
   useEffect(() => {
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