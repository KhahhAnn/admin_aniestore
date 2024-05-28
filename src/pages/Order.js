import React, { useEffect, useState } from 'react';
import { Button, Popconfirm, Skeleton, Table, Modal, Form, Input, Select } from 'antd';
import axios from 'axios';
import ReactECharts from 'echarts-for-react';

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
               {totalDiscountedPrice}.000 VNĐ
            </span>
         )
      },
      {
         title: 'Action',
         dataIndex: 'orderId',
         key: 'orderId',
         render: (orderId) => (
            <div>
               <Popconfirm
                  title="Delete the task"
                  description="Are you sure to delete this task?"
                  okText="Yes"
                  cancelText="No"
                  onConfirm={() => confirm(orderId)}
               >
                  <Button danger className='button-delete'>Delete</Button>
               </Popconfirm>
               <Button type="primary" className='button-edit' onClick={() => showEditModal(orderId)}>Edit</Button>
            </div>
         ),
      },
   ];

   const confirm = (orderId) => {
      handleDelete(orderId)
   };

   const handleDelete = async (orderId) => {
      try {
         setLoading(false);
         const token = localStorage.getItem("token");
         const response = await axios.delete(`http://localhost:8080/api/order/${orderId}`, {
            headers: {
               "Authorization": `Bearer ${token}`
            }
         });
         console.log(response.data);
         setLoading(true);
         fetchData();
      } catch (error) {
         console.log(error);
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
      const order = orderList.find(order => order.orderId === orderId);
      setEditingOrder(order);
      form.setFieldsValue(order);
      setIsModalVisible(true);
   };

   const handleCancel = () => {
      setIsModalVisible(false);
   };

   const handleOk = async () => {
      try {
         const updatedOrder = form.getFieldsValue();
         const token = localStorage.getItem("token");
         await axios.put(`http://localhost:8080/order/${editingOrder.orderId}`, updatedOrder, {
            headers: {
               "Authorization": `Bearer ${token}`
            }
         });
         setOrderList(prevList => prevList.map(order => order.orderId === editingOrder.orderId ? { ...order, ...updatedOrder } : order));
         setIsModalVisible(false);
      } catch (error) {
         console.error('Error updating order:', error);
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
                        visible={isModalVisible}
                        onOk={handleOk}
                        onCancel={handleCancel}
                     >
                        <Form form={form} layout="vertical">
                           <Form.Item name="orderId" label="Id đơn hàng">
                              <Input disabled />
                           </Form.Item>
                           <Form.Item name="orderDate" label="Ngày bán">
                              <Input />
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
                              <Input />
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
