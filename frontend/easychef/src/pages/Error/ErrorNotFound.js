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
        404 - Error: Page Not Found
      </h1>
    </div>
   );
}
 
export default NotAuthorized;