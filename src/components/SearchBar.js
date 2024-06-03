// src/components/SearchBar.js
import React, { useState } from 'react';
import { Form, FormControl, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import '../App.css';

const SearchBar = ({ handleSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleChange = (event) => {
    setSearchTerm(event.target.value);
    handleSearch(event.target.value);  // Call handleSearch directly here on each change
  };

  return (
    <Form onSubmit={(event) => event.preventDefault()} className="d-flex">
      <FormControl
        type="text"
        placeholder="Search"
        value={searchTerm}
        onChange={handleChange}  // This now correctly handles the search on each keystroke
        className="mr-2"
      />
      <Button variant="outline-light" type="submit">
        <FontAwesomeIcon icon={faSearch} />
      </Button>
    </Form>
  );
};



export default SearchBar;
