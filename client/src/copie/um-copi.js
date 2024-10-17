import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const apiUrl = 'http://localhost:4000';

const UsersManagement = () => {
    const [users, setUsers] = useState([]);
    const [selectedUserToDelete, setSelectedUserToDelete] = useState('');
    const [selectedUserToChangePassword, setSelectedUserToChangePassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const navigate = useNavigate();
    const [message, setMessage] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/');
            return;
        }

        const user = jwtDecode(token);
        if (user.role !== 'admin') {
            alert('Access Denied');
            navigate('/');
        } else {
            // جلب قائمة المستخدمين
            const fetchUsers = async () => {
                try {
                    const response = await fetch(`${apiUrl}/admin/dashboard`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    const data = await response.json();
                    setUsers(data.users);
                } catch (error) {
                    console.error('Error fetching users:', error);
                }
            };
            fetchUsers();
        }
    }, [navigate]);

    const handleDeleteUser = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`${apiUrl}/admin/delete`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username: selectedUserToDelete }),
            });

            if (response.ok) {
                alert('User deleted successfully');
                setUsers(users.filter(user => user.username !== selectedUserToDelete));
                setSelectedUserToDelete('');
            } else {
                alert('Error deleting user');
            }
        } catch (error) {
            alert('Error deleting user');
        }
    };

    const handleChangePassword = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`${apiUrl}/admin/change-password`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: selectedUserToChangePassword,
                    newPassword,
                }),
            });

            if (response.ok) {
                alert('Password changed successfully');
                setSelectedUserToChangePassword('');
                setNewPassword('');
            } else {
                alert('Error changing password');
            }
        } catch (error) {
            alert('Error changing password');
        }
    };

    

    return (
        <div  id='users-management'>
           
            <h3>Users List</h3>
            <div style={{overflowY:"scroll"}}> 
            <ul>
                {users.map(user => (
                    <li key={user.username}>{user.username}</li>
                ))}
            </ul>
                
                 </div>
           

            <div>
                <h3>Delete User</h3>
                <select
                    value={selectedUserToDelete}
                    onChange={(e) => setSelectedUserToDelete(e.target.value)}
                >
                    <option value="">Select user to delete</option>
                    {users.map(user => (
                        <option key={user.username} value={user.username}>
                            {user.username}
                        </option>
                    ))}
                </select>
                <button onClick={handleDeleteUser}>Delete</button>
            </div>

            <div>
                <h3>Change User Password</h3>
                <select
                    value={selectedUserToChangePassword}
                    onChange={(e) => setSelectedUserToChangePassword(e.target.value)}
                >
                    <option value="">Select user to change password</option>
                    {users.map(user => (
                        <option key={user.username} value={user.username}>
                            {user.username}
                        </option>
                    ))}
                </select>
                <input
                    type="password"
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                />
                <button onClick={handleChangePassword}>Change Password</button>
            </div>
         
        </div>
    );
};

export default UsersManagement;
