
import { useNavigate } from 'react-router-dom';


import BooksManagement from '../components/BooksManagement';
import UsersManagement from '../components/UsersManagement';
import OrdersManagement from '../components/OrdersManagement';




const AdminDashboard = () => {

  const navigate = useNavigate();
  const goBack = () => {
    navigate('/protected');
};
    

    return (
      <div id="admin">
        <div id="admin-head" >
        <h1 > ADMIN dashbord</h1>
        <button onClick={goBack}>go back</button>
        </div>
       
      <h2>Users management dashboard</h2>
      {/* عرض قسم إدارة المستخدمين */}
      <UsersManagement />

      <h2>Books management dashboard</h2>
      {/* عرض قسم إدارة الكتب */}
      <BooksManagement />
       {/* عرض قسم ادارة الطلبات */}
      <h2>Orders Management Dashboard</h2>
      <OrdersManagement />
    </div>
    );
};

export default AdminDashboard;



