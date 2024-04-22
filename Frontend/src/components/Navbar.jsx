import React from 'react';
import { NavLink } from 'react-router-dom';
import { Layout, Menu } from 'antd';

const { Header } = Layout;

const Navbar = () => {
  return (
    <Header>
      <div className="logo" />
      <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']}>
        <Menu.Item key="1">
          <NavLink to="/user" activeClassName="active-link">Home</NavLink>
        </Menu.Item>
        <Menu.Item key="2">
          <NavLink to="/search" activeClassName="active-link">Search</NavLink>
        </Menu.Item>
        <Menu.Item key="3">
          <NavLink to="/aboutus" activeClassName="active-link">About Us</NavLink>
        </Menu.Item>
      </Menu>
    </Header>
  );
};

export default Navbar;
