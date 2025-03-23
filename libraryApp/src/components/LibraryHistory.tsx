//file most likely redundant and should be deleted at end of dev phase

import { Sidebar, Menu, MenuItem } from 'react-pro-sidebar';
import { Link, Outlet } from 'react-router-dom';


export default function LibraryHistory() {
    return (
      <div>
      
      <Sidebar>
  <Menu
    menuItemStyles={{
      button: {
        // the active class will be added automatically by react router
        // so we can use it to style the active menu item
        "&.active": {
          backgroundColor: '#13395e',
          color: '#b6c8d9',
        },
      },
    }}
  >
    <MenuItem component={<Link to="CheckoutHistory" />}> CheckoutHistory</MenuItem>
    <MenuItem component={<Link to="DonationHistory" />}> DonationHistory</MenuItem>
    <MenuItem component={<Link to="EventHistory" />}> EventHistory</MenuItem>
    <MenuItem component={<Link to="FineHistory" />}> FineHistory</MenuItem>
    <MenuItem component={<Link to="WaitlistHistory" />}> WaitlistHistory</MenuItem>
  </Menu>
</Sidebar>
<div style={{ flexGrow: 1, padding: "20px" }}>

        <Outlet /> {/* This will render the active route */}
        
      </div>
</div>

    );
  }
  