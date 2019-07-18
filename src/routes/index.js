import React from "react";
import {Route, Switch} from "react-router-dom";

import asyncComponent from "util/asyncComponent";

const App = ({match}) => (
  <div className="gx-main-content-wrapper">
    <Switch>
		<Route exact path='/home' component={asyncComponent(() => import('./main/dashboard/index'))}/>    		
  	<Route exact path='/transacciones' component={asyncComponent(() => import('./Transacciones'))}/>
    <Route exact path='/transacciones/registro' component={asyncComponent(() => import('./Transacciones/register.js'))}/>    
    <Route exact path='/bancos' component={asyncComponent(() => import('./Bancos'))}/>    
		<Route exact path='/bancos/registro' component={asyncComponent(() => import('./Bancos/register.js'))}/>
		<Route exact path='/sucursales' component={asyncComponent(() => import('./Sucursales'))}/>
    <Route exact path='/sucursales/registro' component={asyncComponent(() => import('./Sucursales/register.js'))}/>
		<Route exact path='/reportes' component={asyncComponent(() => import('./Reportes'))}/>
		<Route exact path='/configuraciones' component={asyncComponent(() => import('./Configuraciones'))}/>
    <Route exact path='/usuarios' component={asyncComponent(() => import('./Usuarios'))}/>    
    <Route exact path='/usuarios/registro' component={asyncComponent(() => import('./Usuarios/register.js'))}/>    
    <Route exact path='/divisas' component={asyncComponent(() => import('./Divisas'))}/>    
    <Route exact path='/divisas/registro' component={asyncComponent(() => import('./Divisas/register.js'))}/>   
    <Route exact path='/paises' component={asyncComponent(() => import('./Paises'))}/>         
    <Route exact path='/paises/registro' component={asyncComponent(() => import('./Paises/register.js'))}/>         
    </Switch>
  </div>
);

export default App;
