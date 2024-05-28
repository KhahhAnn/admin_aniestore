import { Button, Layout, Menu, Skeleton, theme } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { AiOutlineDashboard, AiOutlinePicLeft, AiOutlinePicRight } from "react-icons/ai";
import { BiCategoryAlt, BiSolidDiscount } from "react-icons/bi";
import { CiUser } from "react-icons/ci";
import { FaClipboardList, FaFileInvoiceDollar } from "react-icons/fa";
import { FaStar } from "react-icons/fa6";
import { GrCatalogOption, GrUserAdmin } from "react-icons/gr";
import { IoNotifications } from "react-icons/io5";
import { MdEventNote, MdProductionQuantityLimits } from "react-icons/md";
import { Outlet, useNavigate } from 'react-router-dom';

const { Header, Sider, Content } = Layout;
const MainLayout = () => {
   const [loading, setLoading] = useState(true);
   const [user, setUser] = useState();
   const [userFetched, setUserFetched] = useState(false); 

   const getUser = async (jwt) => {
      try {
         const response = await axios.get('http://localhost:8080/api/users/profile', {
            headers: {
               "Authorization": `Bearer ${jwt}`
            }
         })
         setUser(response.data);
         setUserFetched(true); 
         setLoading(false);
      } catch (error) {
         setLoading(false);
      }
   }

   useEffect(() => {
      const jjwt_token = localStorage.getItem('token');
      if (jjwt_token && !userFetched) { 
         getUser(jjwt_token);
      }
   }, [userFetched]) 

   const [collapsed, setCollapsed] = useState(false);
   const {
      token: { colorBgContainer, borderRadiusLG },
   } = theme.useToken();
   const navigate = useNavigate();
   
   return (
      loading ? (<Skeleton active />) : (<Layout>
         <Sider trigger={null} collapsible collapsed={collapsed}>
            <div className="logo">
               <h2 className='text-white fs-5 text-center py-3 mb-0'>
                  <span className='sm-logo'>< GrUserAdmin /></span>
                  <span className='lg-logo'>ADMIN ANIESTORE</span>
               </h2>
            </div>
            <Menu
               theme="dark"
               mode="inline"
               defaultSelectedKeys={['']}
               onClick={({ key }) => {
                  if (key === "signout") {
                  } else {
                     navigate(key);
                  }
               }}
               items={[
                  {
                     key: '',
                     icon: <AiOutlineDashboard className='fs-4' />,
                     label: 'Dashboard',
                  },
                  {
                     key: 'customers',
                     icon: <CiUser className='fs-4' />,
                     label: 'Customers',
                  },
                  {
                     key: 'catalog',
                     icon: <GrCatalogOption className='fs-4' />,
                     label: 'Catalog',
                     children: [
                        {
                           key: 'event',
                           icon: <MdEventNote className='fs-4' />,
                           label: 'Event',
                        },
                        {
                           key: 'discount',
                           icon: <BiSolidDiscount className='fs-4' />,
                           label: 'Discount',
                        },
                        {
                           key: 'import-invoice',
                           icon: <FaFileInvoiceDollar className='fs-4' />,
                           label: 'Import Invoice',
                        },
                     ]
                  },
                  {
                     key: 'order',
                     icon: <FaClipboardList className='fs-4' />,
                     label: 'Order',
                  },
                  {
                     key: 'category',
                     icon: <BiCategoryAlt className='fs-4' />,
                     label: 'Category',
                  },
                  {
                     key: 'products',
                     icon: <MdProductionQuantityLimits className='fs-4' />,
                     label: 'Products',
                  },
                  {
                     key: 'review',
                     icon: <FaStar className='fs-4' />,
                     label: 'Review',
                  },
               ]}
            />
         </Sider>
         <Layout>
            <Header
               className='d-flex justify-content-between ps-2 pe-5'
               style={{
                  padding: 0,
                  background: colorBgContainer,
               }}
            >
               <Button
                  type="text"
                  icon={collapsed ? <AiOutlinePicRight /> : <AiOutlinePicLeft />}
                  onClick={() => setCollapsed(!collapsed)}
                  style={{
                     fontSize: '16px',
                     width: 64,
                     height: 64,
                  }}
               />
               <div className='d-flex gap-3 align-items-center'>
                  <div className='position-relative'>
                     <IoNotifications className='fs-4' />
                     <span className='badge bg-warning p-1 position-absolute'>3</span>
                  </div>
                  <div className='d-flex gap-3 align-items-center'>
                     <div>
                        <img className='avata' src={user?.imageSrc} alt='' />
                     </div>
                     <div>
                        <h5 className='mb-0'>{user?.firstName} {user?.lastName}</h5>
                        <p className='mb-0'>{user?.email}</p>
                     </div>
                  </div>
               </div>
            </Header>
            <Content
               style={{
                  margin: '24px 16px',
                  padding: 24,
                  minHeight: 280,
                  background: colorBgContainer,
                  borderRadius: borderRadiusLG,
               }}
            >
               <Outlet />
            </Content>
         </Layout>
      </Layout>)
   )
}
export default MainLayout;
