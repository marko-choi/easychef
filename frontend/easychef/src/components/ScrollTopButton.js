import React, { useState, useEffect } from 'react';
import { Tooltip, IconButton } from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

const ScrollTopButton = () => {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.pageYOffset > 500) {
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleBackToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <>
      { showButton && (
        <Tooltip
          title="Back to top"
          aria-label="back to top"
          placement="left"  
          style={{
            fontFamily: 'Oxygen',
            fontSize: '1.2rem',
          }}
        >
          <IconButton
            variant="contained"
            color="primary"
            style={{
              position: 'fixed',
              zIndex: 100,
              bottom: 20,
              right: 20,
              color: 'white',
              background: '#F1D18D',
            }}
            onClick={handleBackToTop}
          >
            <KeyboardArrowUpIcon />
          </IconButton>
        </Tooltip>
      )}
    </>
  );
};

export default ScrollTopButton;
