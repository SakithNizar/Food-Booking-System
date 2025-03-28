import React from 'react';
import '../../styles/customer/SearchBar.css';

const SearchBar = ({ keyword, onChange }) => {
  return (
    <div className="search-container">
      <input
        className="search-input"
        type="text"
        placeholder="Search transportation options..."
        value={keyword}
        onChange={(e) => onChange(e.target.value)}
      />
      <span className="search-icon">🔍</span>
    </div>
  );
};

export default SearchBar;
