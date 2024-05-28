import React, { useEffect, useState } from 'react';
import { Button, Popconfirm, Skeleton, Table } from 'antd';
import axios from 'axios';
import { Link } from 'react-router-dom';
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
         dataIndex: 'title',
         key: 'title',
      },
      {
         title: 'Loại sản phẩm',
         dataIndex: 'brand',
         key: 'brand',
      },
      {
         title: 'Màu sắc',
         dataIndex: 'color',
         key: 'color',
      },
      {
         title: 'Số lượng còn',
         dataIndex: 'sizes',
         key: 'sizes',
         render: (sizes) => {
            if (Array.isArray(sizes)) {
               return (
                  <span>
                     {sizes.map((size) => (
                        <span key={size.name}> {size.quantity} </span>
                     ))}
                  </span>
               );
            } else {
               return null; 
            }
         },
      },
      {
         title: 'Giá gốc ',
         dataIndex: 'price',
         key: 'price',
         render: (text, record) => formatCurrency(record.price),
      },
      {
         title: 'Giá bán',
         dataIndex: 'discountedPrice',
         key: 'discountedPrice',
         render: (text, record) => formatCurrency(record.discountedPrice),
      },
      {
         title: 'Size',
         dataIndex: 'sizes',
         key: 'sizes',
         render: (sizes) => {
            if (Array.isArray(sizes)) {
               return (
                  <span>
                     {sizes.map((size) => (
                        <span key={size.name}> {size.name} </span>
                     ))}
                  </span>
               );
            } else {
               return null;
            }
         },
      },
      {
         title: 'Action',
         dataIndex: 'id',
         key: 'x',
         render: (id) => (
            <div style={{ display: "flex", flexDirection: "row" }}>
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

   const formatCurrency = (value) => {
      const formattedValue = new Intl.NumberFormat('vi-VN', {
         style: 'currency',
         currency: 'VND',
      }).format(value);

      return formattedValue;
   };
   const confirm = (id) => {
      handleDelete(id)
   };
   const handleDelete = async (id) => {
      try {
         setLoading(false);
         const token = localStorage.getItem("token");
         const response = await axios.delete(`http://localhost:8080/api/discount/${id}`, {
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
         const response = await axios.get('http://localhost:8080/product', {
            headers: {
               "Authorization": `Bearer ${token}`
            }
         });
         console.log(response.data);
         const productWithStt = response.data._embedded.products.reverse().map((product, index) => ({
            ...product,
            stt: index + 1,
            sizes: product.sizes.map(size => ({
               name: size.name,
               quantity: size.quantity
            }))
         }));
         setProductList(productWithStt);
         setLoading(true)
         console.log(productWithStt);
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
            loading ?
               (
                  <div>
                     <Link to="../add-product"><button type="button" class="btn btn-success mb-3">Add Product</button></Link>
                     <Table columns={columns} dataSource={productList} />
                  </div>
               ) : (<Skeleton active />)
         }
      </div>
   );
};
export default Products;