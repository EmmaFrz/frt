import React, {Component} from "react";
import {connect} from "react-redux";
import {Menu, Icon} from "antd";
import {Link} from "react-router-dom";

import CustomScrollbars from "util/CustomScrollbars";
import SidebarLogo from "./SidebarLogo";

import Auxiliary from "util/Auxiliary";
import UserProfile from "./UserProfile";
import AppsNavigation from "./AppsNavigation";
import {
  NAV_STYLE_NO_HEADER_EXPANDED_SIDEBAR,
  NAV_STYLE_NO_HEADER_MINI_SIDEBAR,
  THEME_TYPE_LITE
} from "../../constants/ThemeSetting";
const { SubMenu } = Menu;

class SidebarContent extends Component {

  getNoHeaderClass = (navStyle) => {
    if (navStyle === NAV_STYLE_NO_HEADER_MINI_SIDEBAR || navStyle === NAV_STYLE_NO_HEADER_EXPANDED_SIDEBAR) {
      return "gx-no-header-notifications";
    }
    return "";
  };
  getNavStyleSubMenuClass = (navStyle) => {
    if (navStyle === NAV_STYLE_NO_HEADER_MINI_SIDEBAR) {
      return "gx-no-header-submenu-popup";
    }
    return "";
  };

  render() {
    const {themeType, navStyle, pathname} = this.props;
    const selectedKeys = pathname.substr(1);
    const defaultOpenKeys = selectedKeys.split('/')[1];
    return (<Auxiliary>

        <SidebarLogo/>
        <div className="gx-sidebar-content">
          <div className={`gx-sidebar-notifications ${this.getNoHeaderClass(navStyle)}`}>
            <UserProfile/>
            <AppsNavigation/>
          </div>
          <CustomScrollbars className="gx-layout-sider-scrollbar">
            <Menu
              defaultOpenKeys={[defaultOpenKeys]}
              selectedKeys={[selectedKeys]}
              theme={themeType === THEME_TYPE_LITE ? 'lite' : 'dark'}
              mode="inline">

              <Menu.Item key="home" >
                <Link to="/home"><Icon type="home"/>Inicio</Link>
              </Menu.Item>
              <Menu.Item key="transacciones" >
                <Link to="/transacciones"><Icon type="transaction" />Transacciones</Link>
              </Menu.Item>
            <SubMenu
              key="sub1"
              title={
                <div>
                  <Icon type="setting" />
                     Configuraciones
                </div>
              }
            >
              <Menu.Item key="divisas" >
                <Link to="/divisas"><Icon type="pound" />Divisas</Link>
              </Menu.Item>              
              <Menu.Item key="bancos" >
                <Link to="/bancos"><Icon type="bank" />Bancos</Link>
              </Menu.Item>
              <Menu.Item key="sucursales" >
                <Link to="/sucursales"><Icon type="apartment" />Sucursales</Link>
              </Menu.Item> 
              <Menu.Item key="paises" >
                <Link to="/paises"><Icon type="global" />Paises</Link>
              </Menu.Item> 
              <Menu.Item key="cambios" >
                <Link to="/cambios"><Icon type="account-book" />Tasas</Link>
              </Menu.Item>                             
              <Menu.Item key="reportes" > 
                <Link to="/reportes"><Icon type="form" />Reportes</Link>
              </Menu.Item>
              <Menu.Item key="usuarios" >
                <Link to="/usuarios"><Icon type="usergroup-add" />Usuarios</Link>
              </Menu.Item>
            </SubMenu>                                                                                
            </Menu>
          </CustomScrollbars>
        </div>
      </Auxiliary>
    );
  }
}

SidebarContent.propTypes = {};
const mapStateToProps = ({settings}) => {
  const {navStyle, themeType, locale, pathname} = settings;
  return {navStyle, themeType, locale, pathname}
};
export default connect(mapStateToProps)(SidebarContent);

