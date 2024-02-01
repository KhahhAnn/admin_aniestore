import React, { useEffect, useState } from 'react';
import { Button, Skeleton, Table, Popconfirm, message } from 'antd';
import axios from 'axios';
const Event = () => {
   const [eventList, setEventList] = useState([]);
   const [loading, setLoading] = useState(false);
   const columns = [
      {
         title: 'STT',
         dataIndex: 'stt',
         key: 'stt',
      },
      {
         title: 'Tên sự kiện',
         dataIndex: 'eventName',
         key: 'eventName',
      },
      {
         title: 'Ảnh sự kiện',
         key: "image",
         dataIndex: 'image',
         render: (image) => <img className='table-img' src={image} alt='Ảnh sự kiện' />,
      },
      {
         title: 'Link sự kiện',
         dataIndex: 'link',
         key: 'link',
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
                  onConfirm={()=>confirm(id)}
               >
                  <Button danger className='button-delete'>Delete</Button>
               </Popconfirm>
               <Button type="primary" className='button-edit'>Edit</Button>
            </div>
         ,
      },
   ];
   const confirm = (id) => {
      handleDelete(id)
   };
   const handleDelete = async (id) => {
      try {
         setLoading(false);
         const token = localStorage.getItem("token");
         const response = await axios.delete(`http://localhost:8080/api/event/${id}`, {
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
         const response = await axios.get('http://localhost:8080/event', {
            headers: {
               "Authorization": `Bearer ${token}`
            }
         });
         const eventsWithStt = response.data._embedded.events.reverse().map((event, index) => ({
            ...event,
            stt: index + 1,
         }));
         setEventList(eventsWithStt);
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
            loading ? (<Table columns={columns} dataSource={eventList} />) : (<Skeleton active />)
         }
      </div>
   );
}
export default Event;