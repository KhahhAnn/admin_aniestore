import React, { useEffect, useState } from 'react';
import { Skeleton, Table } from 'antd';
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
         dataIndex: '',
         key: 'x',
         render: () => <a>Delete</a>,
      },
   ];
   useEffect(() => {
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