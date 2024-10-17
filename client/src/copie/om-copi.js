import React, { useState, useEffect } from 'react';
import axios from 'axios';

const apiUrl = "http://localhost:4000";

const OrdersManagement = () => {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState('');
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [editDetails, setEditDetails] = useState({
        name:'',
        email: '',
        phone: '',
        address: '', // إضافة الحقل الخاص بالعناوين
        totalOrderPrice: ''
    });
    const [orderDetails, setOrderDetails] = useState([]);


    useEffect(() => {
        // جلب جميع المستخدمين عند تحميل الصفحة
        axios.get(`${apiUrl}/admin/dashboard`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
            .then(res => {
                setUsers(res.data.users);
            })
            .catch(err => console.error(err));
    }, []);

    const fetchOrdersForUser = (username) => {
        axios.get(`${apiUrl}/admin/orders/${username}`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
            .then(res => {
                setOrders(res.data);
                setSelectedOrder(null); // إعادة تعيين الطلب المختار
            })
            .catch(err => console.error(err));
    };

    const handleDeleteOrder = (orderId) => {
        axios.delete(`${apiUrl}/admin/orders/${orderId}`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
            .then(() => {
                // حذف الطلبية من الحالة (state)
                const updatedOrders = orders.filter(order => order._id !== orderId);
                setOrders(updatedOrders);
                setSelectedOrder(null);
    
                // تحديث localStorage بحيث يتم إزالة الطلب المحذوف فقط
                const currentOrderDetails = JSON.parse(localStorage.getItem('orderDetails')) || [];
                const updatedOrderDetails = currentOrderDetails.filter(order => order._id !== orderId);
                
                localStorage.setItem('orderDetails', JSON.stringify(updatedOrderDetails));
            })
            .catch(err => console.error(err));
    };
    
    
    const handleEditOrder = (orderId) => {
        axios.put(`${apiUrl}/admin/orders/${orderId}`, editDetails, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
            .then(res => {
                const updatedOrder = res.data.order;
    
                // تحديث الطلبات في الحالة (state)
                const updatedOrders = orders.map(order => order._id === orderId ? updatedOrder : order);
                setOrders(updatedOrders);
                setSelectedOrder(null);
    
                // تحديث الطلب المعدل فقط في localStorage بدلاً من استبدال جميع الطلبات
                const currentOrderDetails = JSON.parse(localStorage.getItem('orderDetails')) || [];
                const updatedOrderDetails = currentOrderDetails.map(order => order._id === orderId ? updatedOrder : order);
                
                localStorage.setItem('orderDetails', JSON.stringify(updatedOrderDetails));
            })
            .catch(err => console.error(err));
    };
    

    const handleInputChange = (e) => {
        setEditDetails({
            ...editDetails,
            [e.target.name]: e.target.value
        });
        console.log('Updated Edit Details:', editDetails); // عرض القيم المحدثة في الحقول
    };
    

    const handleSelectOrder = (order) => {
        setSelectedOrder(order);
        setEditDetails({
            name: order.name,
            email: order.email,
            phone: order.phone,
            address: order.address, // إضافة العنوان
            totalOrderPrice: order.totalOrderPrice
        });
    };
    

    return (
        <div id='orders-management'>
            <h2>Orders Management</h2>
            <label htmlFor="userSelect">Select User:</label>
            <select id="userSelect" onChange={(e) => fetchOrdersForUser(e.target.value)}>
                <option value="">-- Select User --</option>
                {users.map(user => (
                    <option key={user._id} value={user.username}>{user.username}</option>
                ))}
            </select>

            {orders.length > 0 && (
                <div>
                    <h3>User Orders</h3>
                    <ul>
                        {orders.map(order => (
                            <li key={order._id} id='order-li' onClick={() => handleSelectOrder(order)}>
                                Order ID: {order._id}, Total Price: {order.totalOrderPrice}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {selectedOrder && (
                <div>
                    <h3>Order Details</h3>
                    <p>Name: {selectedOrder.name}</p>
                    <p>Email: {selectedOrder.email}</p>
                    <p>Phone: {selectedOrder.phone}</p>
                    
                    <p>Total Price: {selectedOrder.totalOrderPrice}</p>
                    <button onClick={() => handleDeleteOrder(selectedOrder._id)}>Delete Order</button>

                    {/* نموذج تعديل بيانات الطلب */}
                    <div>
                        <h4>Edit Order Details</h4>
                        <label>Name:</label>
                        <input
                         type="text"
                         name="name"
                        value={editDetails.name}
                        onChange={handleInputChange}
                        />
                        <br />

                        <label>Email:</label>
                        <input
                         type="text"
                         name="email"
                        value={editDetails.email}
                        onChange={handleInputChange}
                        />
                        <br />
                        <label>Address:</label>
                        <input
                         type="text"
                         name="address"
                        value={editDetails.address}
                        onChange={handleInputChange}
                        />
                        <br />

                        <label>Phone:</label>
                        <input
                            type="text"
                            name="phone"
                            value={editDetails.phone}
                            onChange={handleInputChange}
                        />
                        <br />
                        <label>Total Price:</label>
                        <input
                            type="number"
                            name="totalOrderPrice"
                            value={editDetails.totalOrderPrice}
                            onChange={handleInputChange}
                        />
                        <br />
                        <button onClick={() => handleEditOrder(selectedOrder._id)}>Save Changes</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrdersManagement;






