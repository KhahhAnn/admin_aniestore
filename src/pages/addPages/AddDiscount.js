import {
   Button,
   DatePicker,
   Form,
   Input,
   InputNumber,
   message,
} from 'antd';
import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const { RangePicker } = DatePicker;

const AddDiscount = () => {
   const navigate = useNavigate();

   const formItemLayout = {
      labelCol: {
         xs: {
            span: 24,
         },
         sm: {
            span: 6,
         },
      },
      wrapperCol: {
         xs: {
            span: 24,
         },
         sm: {
            span: 14,
         },
      },
   };
   const onFinish = async (values) => {
      const { discountName, percentDiscount, rangeApply } = values;
      const data = {
         discountName,
         percentDiscount,
         applyDate: rangeApply[0].format('YYYY-MM-DD'),
         expiry: rangeApply[1].format('YYYY-MM-DD'),
      };
      try {
         const token = localStorage.getItem("token");
         const response = await axios.post('http://localhost:8080/api/discount', data, {
            headers: {
               "Authorization": `Bearer ${token}`,
               "Content-Type": "application/json"
            }
         });
         if (response.data.status) {
            message.success(response.data.message);
            navigate("../discount")
         } else {
            message.error(response.data.message);
         }
      } catch (error) {
         message.error('Đã xảy ra lỗi khi thêm mã giảm giá!');
      }
   };

   return (
      <Form
         {...formItemLayout}
         style={{
            maxWidth: 600,
         }}
         onFinish={onFinish}
      >
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

         <Form.Item
            wrapperCol={{
               offset: 6,
               span: 16,
            }}
         >
            <Button type="primary" htmlType="submit">
               Thêm
            </Button>
         </Form.Item>
      </Form>
   );
};

export default AddDiscount;
