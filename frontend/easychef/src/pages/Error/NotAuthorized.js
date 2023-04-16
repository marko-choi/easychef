const NotAuthorized = () => {
  return ( 
    <div className="not-authorized"
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '90vh',
      }}>
      <h1>
        401 - Not Authorized
      </h1>
    </div>
   );
}
 
export default NotAuthorized;