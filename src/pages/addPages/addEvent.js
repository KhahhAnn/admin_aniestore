import { PlusOutlined } from '@ant-design/icons';
import {
   Button,
   Form,
   Input,
   Upload
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
const normFile = (e) => {
   if (Array.isArray(e)) {
      return e;
   }
   return e?.fileList;
};
const AddEvent = () => (
   <Form
      {...formItemLayout}
      variant="filled"
      style={{
         maxWidth: 600,
      }}
   >
      <Form.Item
         label="Event name"
         name="Event name"
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
         label="Link "
         name="Link"
         rules={[
            {
               required: true,
               message: 'Please input!',
            },
         ]}
      >
         <Input />
      </Form.Item>

      <Form.Item label="Upload" valuePropName="fileList" getValueFromEvent={normFile}>
         <Upload action="/upload.do" listType="picture-card">
            <button
               style={{
                  border: 0,
                  background: 'none',
               }}
               type="button"
            >
               <PlusOutlined />
               <div
                  style={{
                     marginTop: 8,
                  }}
               >
                  Upload
               </div>
            </button>
         </Upload>
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
export default AddEvent;