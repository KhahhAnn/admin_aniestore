import React, { useEffect, useState } from 'react';
import { Skeleton, Table } from 'antd';
import axios from 'axios';
const Products = () => {
   
   const [productList, setProductList] = useState([]);
   const [loading, setLoading] = useState(false);
   const columns = [
      {
         title: 'STT',
         dataIndex: 'stt',
         key: 'stt',
      },
      {
         title: 'Tên sản phẩm',
         dataIndex: 'productName',
         key: 'productName',
      },
      {
         title: 'Loại sản phẩm',
         dataIndex: 'typeProduct',
         key: 'typeProduct',
      },
      {
         title: 'Màu sắc',
         dataIndex: 'color',
         key: 'color',
      },
      {
         title: 'Size',
         dataIndex: 'size',
         key: 'size',
      },
      {
         title: 'Giá nhập',
         dataIndex: 'purchasePrice',
         key: 'purchasePrice',
         render: (text, record) => formatCurrency(record.purchasePrice),
      },
      {
         title: 'Giá gốc ',
         dataIndex: 'originPrices',
         key: 'originPrices',
         render: (text, record) => formatCurrency(record.originPrices),
      },
      {
         title: 'Giá bán',
         dataIndex: 'salePrices',
         key: 'salePrices',
         render: (text, record) => formatCurrency(record.salePrices),
      },
      {
         title: 'Số lượng còn',
         dataIndex: 'quantity',
         key: 'quantity',
      },
      {
         title: 'Action',
         dataIndex: '',
         key: 'x',
         render: () => <a>Delete</a>,
      },
   ];

   const formatCurrency = (value) => {
      const formattedValue = new Intl.NumberFormat('vi-VN', {
         style: 'currency',
         currency: 'VND',
      }).format(value);

      return formattedValue;
   };
   useEffect(() => {
      const fetchData = async () => {
         try {
            const token = localStorage.getItem("token");
            const response = await axios.get('http://localhost:8080/product', {
               headers: {
                  "Authorization": `Bearer ${token}`
               }
            });
            const productWithStt = response.data._embedded.productses.reverse().map((product, index) => ({
               ...product,
               stt: index + 1,
            }));
            setProductList(productWithStt);
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
            loading ? (<Table columns={columns} dataSource={productList} />) : (<Skeleton active />)
         }
      </div>
   );
};
export default Products;