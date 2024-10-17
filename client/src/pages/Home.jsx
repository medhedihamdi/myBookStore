import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import BookCard from '../components/BookCard';

const Home = ({ books }) => {
  return (
    <div className="home">
      <h1 className="text-center mb-5">Book Collection</h1>
      <div className="row">
        {books.map(book => (
          <BookCard key={book._id} book={book} showAddToCart={false} />
        ))}
      </div>
    </div>
  );
};

export default Home;
