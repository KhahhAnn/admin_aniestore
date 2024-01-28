import React, { useEffect, useState } from 'react';
import { Skeleton, Table } from 'antd';
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
         render: (image) => <img className='table-img' src={image} alt='Ảnh sự kiện'/>,
      },
      {
         title: 'Link sự kiện',
         dataIndex: 'link',
         key: 'link',
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