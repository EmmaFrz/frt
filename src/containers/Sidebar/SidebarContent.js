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
import IntlMessages from "../../util/IntlMessages";

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
                <Link to="/home"><Icon type="home" style={{color:'#d88f2f'}}/>
                  <IntlMessages id="Inicio"/></Link>
              </Menu.Item>
              <Menu.Item key="transacciones" >
                <Link to="/transacciones"><Icon type="transaction" style={{color:'#d88f2f'}} />
                  <IntlMessages id="Transacciones"/></Link>
              </Menu.Item>
              <Menu.Item key="divisas" >
                <Link to="/divisas"><Icon type="pound" style={{color:'#d88f2f'}} />
                  <IntlMessages id="Divisas"/></Link>
              </Menu.Item>              
              <Menu.Item key="bancos" >
                <Link to="/bancos"><Icon type="bank" style={{color:'#d88f2f'}} />
                  <IntlMessages id="Bancos"/></Link>
              </Menu.Item>
              <Menu.Item key="sucursales" >
                <Link to="/sucursales"><Icon type="apartment" style={{color:'#d88f2f'}} />
                  <IntlMessages id="Sucursales"/></Link>
              </Menu.Item> 
              <Menu.Item key="paises" >
                <Link to="/paises"><Icon type="global" style={{color:'#d88f2f'}} />
                  <IntlMessages id="Paises"/></Link>
              </Menu.Item> 
              <Menu.Item key="cambios" >
                <Link to="/cambios"><Icon type="account-book" style={{color:'#d88f2f'}} />
                  <IntlMessages id="Tasas"/></Link>
              </Menu.Item>                             
              <Menu.Item key="reportes" > 
                <Link to="/reportes"><Icon type="form" style={{color:'#d88f2f'}} />
                  <IntlMessages id="Reportes"/></Link>
              </Menu.Item>
              <Menu.Item key="usuarios" >
                <Link to="/usuarios"><Icon type="usergroup-add" style={{color:'#d88f2f'}} />
                  <IntlMessages id="Usuarios"/></Link>
              </Menu.Item>
              <Menu.Item key="configuraciones" >
                <Link to="/configuraciones"><Icon type="setting" style={{color:'#d88f2f'}} />
                  <IntlMessages id="Configuracion"/></Link>
              </Menu.Item>                                                                                   
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

