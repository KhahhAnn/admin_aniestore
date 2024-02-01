import React, { useEffect, useState } from 'react';
import { Button, Skeleton, Table, Popconfirm } from 'antd';
import axios from 'axios';
const ImportInvoice = () => {
   const [invoiceList, setInvoiceList] = useState([]);
   const [loading, setLoading] = useState(false);
   const columns = [
      {
         title: 'STT',
         dataIndex: 'stt',
         key: 'stt',
      },
      {
         title: 'Tên hóa đơn nhập',
         dataIndex: 'invoiceName',
         key: 'invoiceName',
      },
      {
         title: 'Ngày nhập',
         key: "importDate",
         dataIndex: 'importDate',
      },
      {
         title: 'Tổng tiền hóa đơn',
         dataIndex: 'total_price',
         key: 'total_price',
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
         const response = await axios.get('http://localhost:8080/import-invoice', {
            headers: {
               "Authorization": `Bearer ${token}`
            }
         });
         const invoiceWithStt = response.data._embedded.importInvoices.reverse().map((invoice, index) => ({
            ...invoice,
            stt: index + 1,
         }));
         setInvoiceList(invoiceWithStt);
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
            loading ? (<Table columns={columns} dataSource={invoiceList} />) : (<Skeleton active />)
         }
      </div>
   );
};
export default ImportInvoice;