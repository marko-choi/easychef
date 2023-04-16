import React from 'react';
import { Alert } from '@mui/material';

const SuccessAlert = ({message}) => {
  return ( 
    <Alert className='d-flex align-items-center' 
      style={{ position: 'absolute', top: '8%', left: '50%', transform: 'translateX(-50%)',
      border: '1px solid #9cb39c', zIndex: '9999' }}
      severity="success"> 
      {message}
    </Alert>
   );
}
 
export default SuccessAlert;