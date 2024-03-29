const customToastStyle = {
    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif',
    width: '320px',
    padding: '12px',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'start',
    background: '#FCE8DB',
    borderRadius: '8px',
    boxShadow: '0px 0px 5px -3px #111',
  };
  
  const customErrorIconStyle = {
    width: '20px',
    height: '20px',
    transform: 'translateY(-2px)',
    marginRight: '8px',
  };
  
  const customErrorTitleStyle = {
    fontWeight: '500',
    fontSize: '14px',
    color: '#71192F',
  };
  
  const customErrorCloseStyle = {
    width: '20px',
    height: '20px',
    cursor: 'pointer',
    marginLeft: 'auto',
};
  
export { customErrorCloseStyle, customErrorTitleStyle, customToastStyle, customErrorIconStyle };
