import { Button, Form, Input, Modal, Popconfirm, Select, Skeleton, Table, message } from 'antd';
import axios from 'axios';
import ReactECharts from 'echarts-for-react';
import React, { useEffect, useState } from 'react';

const { Option } = Select;

const Order = () => {
   const [orderList, setOrderList] = useState([]);
   const [loading, setLoading] = useState(false);
   const [isModalVisible, setIsModalVisible] = useState(false);
   const [editingOrder, setEditingOrder] = useState(null);
   const [form] = Form.useForm();
   const [orderStatusData, setOrderStatusData] = useState([]);
   const [totalOrders, setTotalOrders] = useState(0);

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
         key: "orderDate",
         dataIndex: 'orderDate',
      },
      {
         title: 'Trạng thái đơn hàng',
         key: "orderStatus",
         dataIndex: 'orderStatus',
      },
      {
         title: 'Tổng tiền hóa đơn',
         dataIndex: 'totalDiscountedPrice',
         key: 'totalDiscountedPrice',
         render: (totalDiscountedPrice) => (
            <span style={{ color: "red" }}>
               {formatCurrency(totalDiscountedPrice)}
            </span>
         )
      },
      {
         title: 'Action',
         dataIndex: 'id',
         key: 'id',
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
               <Button type="primary" className='button-edit' onClick={() => showEditModal(id)}>Edit</Button>
            </div>
         ),
      },
   ];

   const confirm = (orderId) => {
      handleDelete(orderId)
   };
   

   const handleDelete = async (orderId) => {
      try {
         console.log(orderId);
         setLoading(false);
         const token = localStorage.getItem("token");
         const response = await axios.delete(`http://localhost:8080/api/admin/orders/${orderId}/delete`, {
            headers: {
               "Authorization": `Bearer ${token}`
            }
         });
         console.log(response.data);
         setLoading(true);
         fetchData();
         message.success("Xóa thành công");
      } catch (error) {
         console.log(error);
         message.error("Xóa thất bại");
         setLoading(true);
      }
   }

   const fetchData = async () => {
      try {
         setLoading(false);
         const token = localStorage.getItem("token");
         const response = await axios.get('http://localhost:8080/order', {
            headers: {
               "Authorization": `Bearer ${token}`
            }
         });
         const orders = response.data._embedded.orders;
         const orderWithStt = orders.reverse().map((order, index) => ({
            ...order,
            stt: index + 1,
         }));
         setOrderList(orderWithStt);
         console.log(orderWithStt);
         setLoading(true);
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
      const order = orderList.find(order => order.id === orderId);
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
               "Authorization": `Bearer ${token}`
            }
         });
         fetchData();
         setIsModalVisible(false);
         message.success("Cập nhật thành công");
      } catch (error) {
         console.error('Error updating order:', error);
         message.error("Cập nhật thất bại");
      }
   };

   const option = {
      title: {
         text: 'Biểu đồ order',
         subtext: 'Tổng số Orders: ' + totalOrders,
         left: 'center'
      },
      tooltip: {
         trigger: 'item',
         formatter: '{a} <br/>{b}: {c} ({d}%)'
      },
      legend: {
         orient: 'vertical',
         left: 'left'
      },
      series: [
         {
            name: 'Order Status',
            type: 'pie',
            radius: '50%',
            data: orderStatusData,
            emphasis: {
               itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
               }
            }
         }
      ]
   };

   const formatCurrency = (value) => {
      return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
   };

   return (
      <div>
         {
            loading ?
               (
                  <div>
                     <ReactECharts option={option} style={{ height: '300px' }} />
                     <Table columns={columns} dataSource={orderList} />
                     <Modal
                        title="Edit Order"
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
               ) : (<Skeleton active />)
         }
      </div>
   );
};

export default Order;
