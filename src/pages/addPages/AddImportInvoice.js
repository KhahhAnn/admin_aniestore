import {
   Button,
   Form,
   Input
} from 'antd';
import React from 'react';

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
const AddImportInvoice = () => (
   <Form
      {...formItemLayout}
      variant="filled"
      style={{
         maxWidth: 600,
      }}
   >
      <Form.Item
         label="Invoice name"
         name="Invoice name"
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
         label="Invoice price"
         name="Invoice price"
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
export default AddImportInvoice;