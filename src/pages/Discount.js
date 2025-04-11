import React, { useEffect, useState } from 'react';
import { Button, DatePicker, Form, Input, InputNumber, message, Modal, Popconfirm, Skeleton, Table } from 'antd';
import axios from 'axios';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';

const Discount = () => {
   const [discountList, setDiscountList] = useState([]);
   const [loading, setLoading] = useState(false);
   const [isModalVisible, setIsModalVisible] = useState(false);
   const [form] = Form.useForm();
   const { RangePicker } = DatePicker;


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
                  <Button danger className='button-delete'>Xóa</Button>
               </Popconfirm>
               <Button type="primary" className='button-edit' onClick={() => showEditModal(id)}>Sửa</Button>
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

   const showEditModal = (id) => {
      const discount = discountList.find(discount => discount.id === id);
      if (discount) {
         form.setFieldsValue({
            id: discount.id,
            discountName: discount.discountName,
            percentDiscount: discount.percentDiscount,
            rangeApply: [
               dayjs(discount.applyDate),
               dayjs(discount.expiry)
            ]
         });
         setIsModalVisible(true);
      }
   };

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
   useEffect(() => {
      fetchData();
   }, []);

   const handleCancel = () => {
      setIsModalVisible(false);
   };

   const handleOk = async () => {
      try {
         const updatedDiscount = form.getFieldsValue();
         const data = {
            id: updatedDiscount.id,
            discountName: updatedDiscount.discountName,
            percentDiscount: updatedDiscount.percentDiscount,
            applyDate: updatedDiscount.rangeApply[0].format('YYYY-MM-DD'),
            expiry: updatedDiscount.rangeApply[1].format('YYYY-MM-DD'),
         };
         const token = localStorage.getItem("token");
         const response = await axios.put('http://localhost:8080/api/discount', data, {
            headers: {
               "Authorization": `Bearer ${token}`,
               "Content-Type": "application/json"
            }
         });
         if (response.data) {
            message.success("Cập nhật voucher thành công");
            fetchData();
            setIsModalVisible(false);
         } else {
            message.error("Cập nhật voucher thất bại");
         }
      } catch (error) {
         message.error("Cập nhật voucher thất bại");
      }
   };

   return (
      <div>
         {
            loading ?
               (
                  <div>
                     <Link to="../add-discount"><button type="button" class="btn btn-success mb-3">Thêm mới voucher</button></Link>
                     <Table columns={columns} dataSource={discountList} />
                     <Modal
                        title="Edit Category"
                        visible={isModalVisible}
                        onOk={handleOk}
                        onCancel={handleCancel}
                     >
                        <Form form={form} layout="vertical">
                           <Form.Item name="id" label="ID">
                              <Input disabled />
                           </Form.Item>
                           <Form.Item
                              name="discountName"
                              label="Mã giảm giá"
                              rules={[
                                 {
                                    required: true,
                                    message: 'Vui lòng nhập mã giảm giá!',
                                 },
                              ]}
                           >
                              <Input />
                           </Form.Item>

                           <Form.Item
                              name="percentDiscount"
                              label="Phần trăm giảm giá"
                              rules={[
                                 {
                                    required: true,
                                    message: 'Vui lòng nhập phần trăm giảm giá!',
                                 },
                                 {
                                    type: 'number',
                                    min: 1,
                                    message: 'Phần trăm giảm giá phải lớn hơn 0!',
                                 },
                              ]}
                           >
                              <InputNumber
                                 style={{
                                    width: '100%',
                                 }}
                              />
                           </Form.Item>

                           <Form.Item
                              name="rangeApply"
                              label="Ngày áp dụng"
                              rules={[
                                 {
                                    required: true,
                                    message: 'Vui lòng chọn khoảng thời gian áp dụng!',
                                 },
                              ]}
                           >
                              <RangePicker />
                           </Form.Item>

                        </Form>
                     </Modal>
                  </div>
               )
               : <Skeleton active />
         }
      </div>
   );

};
export default Discount;