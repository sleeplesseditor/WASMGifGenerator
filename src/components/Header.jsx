import React from 'react';
import './Header.scss';

const Header = ({ title }) => {
    return (
      <nav className="navbar">
        <h3 className='navbar-heading' data-testid='navbar-main'>
            {title}
        </h3>
      </nav>
    );
}

export default Header;