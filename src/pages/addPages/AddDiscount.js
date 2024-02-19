import {
   Button,
   DatePicker,
   Form,
   Input,
   InputNumber
} from 'antd';
import React from 'react';
const { RangePicker } = DatePicker;
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
const AddDiscount = () => (
   <Form
      {...formItemLayout}
      variant="filled"
      style={{
         maxWidth: 600,
      }}
   >
      <Form.Item
         label="Discount name"
         name="Discount name"
         rules={[
            {
               required: true,
               message: 'Please input!',
            },
         ]}
      >
         <Input />
      </Form.Item>

      <Form.Item
         label="Percent discount"
         name="Percent discount"
         rules={[
            {
               required: true,
               message: 'Please input!',
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
         label="Range apply"
         name="Range apply"
         rules={[
            {
               required: true,
               message: 'Please input!',
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
            Submit
         </Button>
      </Form.Item>
   </Form>
);
export default AddDiscount;