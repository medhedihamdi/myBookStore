import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {jwtDecode}  from 'jwt-decode';

const apiUrl = 'http://localhost:4000';

const BooksManagement = () => {
    const navigate = useNavigate();
    const [books, setBooks] = useState([]);
    const [newBook, setNewBook] = useState({
        name: '',
        author: '',
        genre: '',
        price: '',
        pages: '',
        volumes: '',
        description: '',
        imageUrl: '', // إضافة حقل لرابط الصورة
    });
    const [message, setMessage] = useState('');
    const [selectedBook, setSelectedBook] = useState('');
    const [editingBook, setEditingBook] = useState(null);

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
            const fetchBooks = async () => {
                try {
                    const response = await fetch(`${apiUrl}/books`);
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    const data = await response.json();
                    setBooks(data);
                } catch (error) {
                    console.error('Error fetching books:', error);
                }
            };

            fetchBooks();
        }
    }, [navigate]);

    const handleAddBook = async () => {
        // تحقق من أن جميع الحقول غير فارغة
        const { name, author, genre, price, pages, volumes, description, imageUrl } = newBook;
        
        if (!name || !author || !genre || !price || !pages || !volumes || !description || !imageUrl) {
            setMessage('Please fill out all fields before adding a book.');
            return;
        }
    
        // تحقق من أن الكتاب غير مكرر
        const isDuplicate = books.some(book => 
            book.name === name &&
            book.author === author &&
            book.genre === genre &&
            book.price === price &&
            book.pages === pages &&
            book.volumes === volumes &&
            book.description === description &&
            book.imageUrl === imageUrl
        );
    
        if (isDuplicate) {
            setMessage('This book already exists.');
            return;
        }
    
        try {
            const response = await fetch(`${apiUrl}/admin/books`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify(newBook),
            });
    
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
    
            const data = await response.json();
            setMessage(data.message);
            setBooks([...books, data.book]);
            setNewBook({
                name: '',
                author: '',
                genre: '',
                price: '',
                pages: '',
                volumes: '',
                description: '',
                imageUrl: '', // إعادة تعيين حقل رابط الصورة
            });
        } catch (error) {
            console.error('Error adding book:', error);
            setMessage('Error adding book');
        }
    };

    const handleUpdateBook = async () => {
        if (!editingBook) {
            setMessage('No book selected for editing.');
            return;
        }

        try {
            const response = await fetch(`${apiUrl}/admin/books/${editingBook._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify(newBook),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            setMessage(data.message);
            setBooks(books.map((book) => (book._id === editingBook._id ? data.book : book)));
            setEditingBook(null);
            setNewBook({
                name: '',
                author: '',
                genre: '',
                price: '',
                pages: '',
                volumes: '',
                description: '',
                imageUrl: '', // إعادة تعيين حقل رابط الصورة
            });
        } catch (error) {
            console.error('Error updating book:', error);
            setMessage('Error updating book');
        }
    };

    const handleSelectBookForEdit = (bookId) => {
        const book = books.find((b) => b._id === bookId);
        if (book) {
            setEditingBook(book);
            setNewBook({
                name: book.name || '',
                author: book.author || '',
                genre: book.genre || '',
                price: book.price || '',
                pages: book.pages || '',
                volumes: book.volumes || '',
                description: book.description || '',
                imageUrl: book.imageUrl || '', // تعيين رابط الصورة
            });
            setSelectedBook(bookId);
        }
    };

    const handleDeleteBook = async (bookId) => {
        try {
            const response = await fetch(`${apiUrl}/admin/books/${bookId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            setMessage(data.message);
            setBooks(books.filter((book) => book._id !== bookId));
            setSelectedBook('');
        } catch (error) {
            console.error('Error deleting book:', error);
            setMessage('Error deleting book');
        }
    };

    return (
        <div id='books-management'>
            <h3>Manage Books</h3>

            {/* قسم إضافة أو تعديل الكتب */}
            <div>
                <label>Book Name:</label>
                <input
                    type="text"
                    value={newBook.name || ''}
                    onChange={(e) => setNewBook({ ...newBook, name: e.target.value })}
                />
            </div>
            <div>
                <label>Author Name:</label>
                <input
                    type="text"
                    value={newBook.author || ''}
                    onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
                />
            </div>
            <div>
                <label>Genre:</label>
                <input
                    type="text"
                    value={newBook.genre || ''}
                    onChange={(e) => setNewBook({ ...newBook, genre: e.target.value })}
                />
            </div>
            <div>
                <label>Price:</label>
                <input
                    type="number"
                    value={newBook.price || ''}
                    onChange={(e) => setNewBook({ ...newBook, price: e.target.value })}
                /> $
            </div>
            <div>
                <label>Pages:</label>
                <input
                    type="number"
                    value={newBook.pages || ''}
                    onChange={(e) => setNewBook({ ...newBook, pages: e.target.value })}
                /> 
            </div>
            <div>
                <label>Volumes:</label>
                <input
                    type="number"
                    value={newBook.volumes || ''}
                    onChange={(e) => setNewBook({ ...newBook, volumes: e.target.value })}
                />
            </div>
            <div>
                <label>Description:</label>
                <textarea
                    value={newBook.description || ''}
                    onChange={(e) => setNewBook({ ...newBook, description: e.target.value })}
                />
            </div>
            <div>
                <label>Image URL:</label>
                <input
                    type="text"
                    value={newBook.imageUrl || ''}
                    onChange={(e) => setNewBook({ ...newBook, imageUrl: e.target.value })} 
                />
            </div>

            <button onClick={ handleAddBook}>
               Add  book
            </button>

            {/* قسم إدارة الكتب */}
            <div>
                <h4>Books List</h4>
                <select value={selectedBook} onChange={(e) => handleSelectBookForEdit(e.target.value)}>
                    <option value="">--Select a book--</option>
                    {books.map((book) => (
                        <option key={book._id} value={book._id}>
                            {book.name}
                        </option>
                    ))}
                </select>

                {/* عرض أزرار التعديل والحذف عند اختيار كتاب معين */}
                {selectedBook && (
                    <>
                        <button onClick={handleUpdateBook}>Update</button>
                        <button onClick={() => handleDeleteBook(selectedBook)}>Delete</button>
                    </>
                )}
            </div>

            {message && <p>{message}</p>}
        </div>
    );
};

export default BooksManagement;
