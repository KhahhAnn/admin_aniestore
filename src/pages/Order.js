import { Button, DatePicker, Form, Input, Modal, Popconfirm, Select, Skeleton, Table, message } from 'antd';
import axios from 'axios';
import ReactECharts from 'echarts-for-react';
import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import dayjs from 'dayjs';
import { select } from 'redux-saga/effects';

const { Option } = Select;

const Order = () => {
   const [orderList, setOrderList] = useState([]);
   const [loading, setLoading] = useState(false);
   const [isModalVisible, setIsModalVisible] = useState(false);
   const [editingOrder, setEditingOrder] = useState(null);
   const [form] = Form.useForm();
   const [orderStatusData, setOrderStatusData] = useState([]);
   const [totalOrders, setTotalOrders] = useState(0);
   const [selectedMonth, setSelectedMonth] = useState(dayjs());
   const [productSales, setProductSales] = useState([]);

   useEffect(() => {
      const fetchOrderData = async () => {
         try {
            setLoading(false);
            const token = localStorage.getItem("token");
            const response = await axios.get('http://localhost:8080/order', {
               headers: {
                  "Authorization": `Bearer ${token}`
               }
            });
            const orders = response.data._embedded.orders;
   
            // Lọc các đơn hàng theo tháng được chọn
            const filteredOrders = orders.filter(order => {
               const orderDate = dayjs(order.createdAt);
               const formattedDate = orderDate.format('YYYY-MM');
               const formattedSelectedMonth = selectedMonth.format('YYYY-MM');
               return formattedDate === formattedSelectedMonth; // Chỉ lấy đơn hàng trong tháng được chọn
            });
   
            // Khởi tạo lại mảng productSales mỗi khi tháng thay đổi
            const newSales = [];
   
            // Duyệt qua các đơn hàng đã lọc và lấy orderItems
            for (const order of filteredOrders) {
               const orderItemsUrl = order._links.orderItems.href;
   
               // Lấy thông tin các mặt hàng trong đơn hàng
               const orderItemsResponse = await axios.get(orderItemsUrl, {
                  headers: {
                     "Authorization": `Bearer ${token}`
                  }
               });
               const orderItems = orderItemsResponse.data._embedded.orderItems;
   
               // Duyệt qua các mặt hàng và lấy thông tin sản phẩm
               for (const item of orderItems) {
                  const productUrl = item._links.product.href;
   
                  // Lấy thông tin sản phẩm (title)
                  const productResponse = await axios.get(productUrl, {
                     headers: {
                        "Authorization": `Bearer ${token}`
                     }
                  });
                  const product = productResponse.data;
                  const productTitle = product.title; // Lấy title sản phẩm
   
                  // Cộng dồn số lượng bán cho sản phẩm
                  const productIndex = newSales.findIndex(sale => sale.title === productTitle);
                  if (productIndex !== -1) {
                     // Nếu sản phẩm đã tồn tại trong mảng, cộng dồn quantity
                     newSales[productIndex].quantity += item.quantity;
                  } else {
                     // Nếu chưa có, thêm mới vào mảng
                     newSales.push({ title: productTitle, quantity: item.quantity });
                  }
               }
            }
   
            // Cập nhật lại mảng productSales với dữ liệu mới
            setProductSales(newSales);
            setLoading(true);
   
         } catch (error) {
            console.error('Error fetching data:', error);
            setLoading(true);
         }
      };
   
      // Gọi hàm fetchOrderData mỗi khi selectedMonth thay đổi
      fetchOrderData();
   }, [selectedMonth]);




   const columns = [
      {
         title: 'STT',
         dataIndex: 'stt',
         key: 'stt',
      },
      {
         title: 'Id đơn hàng',
         dataIndex: 'orderId',
         key: 'orderId',
      },
      {
         title: 'Ngày bán',
         key: 'orderDate',
         dataIndex: 'orderDate',
      },
      {
         title: 'Phương thức thanh toán',
         key: 'isPayment',
         dataIndex: 'isPayment',
      },
      {
         title: 'Trạng thái đơn hàng',
         key: 'orderStatus',
         dataIndex: 'orderStatus',
      },
      {
         title: 'Tổng tiền hóa đơn',
         dataIndex: 'totalDiscountedPrice',
         key: 'totalDiscountedPrice',
         render: (totalDiscountedPrice) => (
            <span style={{ color: 'red' }}>
               {formatCurrency(totalDiscountedPrice)}
            </span>
         ),
      },
      {
         title: 'Action',
         dataIndex: 'id',
         key: 'id',
         render: (id) => (
            <div>
               <Popconfirm
                  title="Xóa đơn hàng"
                  description="Bạn có chắc chắn muốn xóa đơn hàng này?"
                  okText="Yes"
                  cancelText="No"
                  onConfirm={() => confirm(id)}
               >
                  <Button danger className="button-delete">Xóa</Button>
               </Popconfirm>
               <Button type="primary" className="button-edit" onClick={() => showEditModal(id)}>Chỉnh sửa</Button>
            </div>
         ),
      },
   ];

   const confirm = (orderId) => {
      handleDelete(orderId);
   };

   const handleDelete = async (orderId) => {
      try {
         setLoading(false);
         const token = localStorage.getItem("token");
         await axios.delete(`http://localhost:8080/api/admin/orders/${orderId}/delete`, {
            headers: {
               Authorization: `Bearer ${token}`,
            },
         });
         fetchData();
         message.success("Xóa thành công");
      } catch (error) {
         message.error("Xóa thất bại");
         setLoading(true);
      }
   };

   const fetchData = async () => {
      try {
         setLoading(false);
         const token = localStorage.getItem("token");
         const response = await axios.get('http://localhost:8080/order', {
            headers: {
               Authorization: `Bearer ${token}`,
            },
         });
         const orders = response.data._embedded.orders;
         const orderWithStt = orders.reverse().map((order, index) => ({
            ...order,
            stt: index + 1,
         }));
         setOrderList(orderWithStt);
         const statusCounts = orders.reduce((acc, order) => {
            acc[order.orderStatus] = (acc[order.orderStatus] || 0) + 1;
            return acc;
         }, {});

         const data = Object.keys(statusCounts).map((status) => ({
            value: statusCounts[status],
            name: status,
         }));

         setOrderStatusData(data);
         setTotalOrders(orders.length);
         setLoading(true);
      } catch (error) {
         console.error('Error fetching orders:', error);
         setLoading(true);
      }
   };

   useEffect(() => {
      fetchData();
   }, []);

   const showEditModal = (orderId) => {
      const order = orderList.find((order) => order.id === orderId);
      if (order) {
         setEditingOrder(order);
         form.setFieldsValue(order);
         setIsModalVisible(true);
      } else {
         message.error("Không tìm thấy đơn hàng");
      }
   };

   const handleCancel = () => {
      setIsModalVisible(false);
   };

   const handleOk = async () => {
      try {
         const updatedOrder = form.getFieldsValue();
         const token = localStorage.getItem("token");
         await axios.put('http://localhost:8080/api/admin/orders', updatedOrder, {
            headers: {
               Authorization: `Bearer ${token}`,
            },
         });
         fetchData();
         setIsModalVisible(false);
         message.success("Cập nhật thành công");
      } catch (error) {
         message.error("Cập nhật thất bại");
      }
   };

   const option = {
      title: {
         text: 'Biểu đồ trạng thái đơn hàng',
         subtext: 'Tổng số đơn hàng: ' + totalOrders,
         left: 'center',
      },
      tooltip: {
         trigger: 'item',
         formatter: '{a} <br/>{b}: {c} ({d}%)',
      },
      legend: {
         orient: 'vertical',
         left: 'left',
      },
      series: [
         {
            name: 'Trạng thái đơn hàng',
            type: 'pie',
            radius: '50%',
            data: orderStatusData,
            emphasis: {
               itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)',
               },
            },
         },
      ],
   };

   const formatCurrency = (value) => {
      return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
   };
   const getRandomColor = () => {
      const letters = '0123456789ABCDEF';
      let color = '#';
      for (let i = 0; i < 6; i++) {
         color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
   };

   const exportToExcel = () => {
      const ws = XLSX.utils.json_to_sheet(orderList);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Orders");
      XLSX.writeFile(wb, "orders.xlsx");
   };


   const productChartOptions = {
      title: {
         text: `Số lượng sản phẩm bán được trong tháng ${selectedMonth.format('YYYY-MM')}`,
         left: 'center'
      },
      tooltip: {
         trigger: 'axis',
         formatter: '{b}: {c} sản phẩm'
      },
      xAxis: {
         type: 'category',
         data: productSales.map(item => item.title),
      },
      yAxis: {
         type: 'value',
         name: 'Số lượng'
      },
      series: [
         {
            data: productSales.map(item => item.quantity),
            type: 'bar',
            itemStyle: {
               color: (params) => getRandomColor(),
            }
         }
      ]
   };

   const handleMonthChange = (date) => {
      setSelectedMonth(date);
      // fetchOrderData();
   };

   return (
      <div>
         {
            loading ? (
               <div>
                  <ReactECharts option={option} style={{ height: '300px' }} />
                  <DatePicker
                     picker="month"
                     format="YYYY-MM"
                     value={selectedMonth}
                     onChange={handleMonthChange}
                     style={{ marginBottom: "20px" }}
                     allowClear={false}
                  />
                  <ReactECharts option={productChartOptions} style={{ height: '300px', marginBottom: '20px' }} />
                  <Button onClick={exportToExcel} type="primary" style={{ marginBottom: '20px' }}>
                     Xuất excel
                  </Button>
                  <Table columns={columns} dataSource={orderList} />
                  <Modal
                     title="Chỉnh sửa đơn hàng"
                     open={isModalVisible}
                     onOk={handleOk}
                     onCancel={handleCancel}
                  >
                     <Form form={form} layout="vertical">
                        <Form.Item name="id" label="Id">
                           <Input disabled />
                        </Form.Item>
                        <Form.Item name="orderId" label="Id đơn hàng">
                           <Input disabled />
                        </Form.Item>
                        <Form.Item name="orderDate" label="Ngày bán">
                           <Input disabled />
                        </Form.Item>
                        <Form.Item name="isPayment" label="Phương thức thanh toán">
                           <Select>
                              <Option value="Đã thanh toán">Đã thanh toán</Option>
                              <Option value="Chưa thanh toán">Chưa thanh toán</Option>
                           </Select>
                        </Form.Item>
                        <Form.Item name="orderStatus" label="Trạng thái đơn hàng">
                           <Select>
                              <Option value="Chưa xác nhận đơn">Chưa xác nhận đơn</Option>
                              <Option value="Đã xác nhận đơn">Đã xác nhận đơn</Option>
                              <Option value="Đơn hàng đang vận chuyển">Đơn hàng đang vận chuyển</Option>
                              <Option value="Đã giao">Đã giao</Option>
                              <Option value="Nhận hàng thành công">Nhận hàng thành công</Option>
                           </Select>
                        </Form.Item>
                        <Form.Item name="totalDiscountedPrice" label="Tổng tiền hóa đơn">
                           <Input disabled />
                        </Form.Item>
                     </Form>
                  </Modal>
               </div>
            ) : (
               <Skeleton active />
            )
         }
      </div>
   );
};

export default Order;
