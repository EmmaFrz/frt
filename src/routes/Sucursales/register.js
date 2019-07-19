import React from "react";
import {Form, Button,Icon,Input} from "antd";
import {Link} from 'react-router-dom'


const Bancos = () => {
  return (
  	<div style={{padding: '30px' }}>
      <h3>Tú Seccion de registro de sucursales asociados</h3>	  
		<Link to='/sucursales'>Regresar <Icon type="undo" /></Link>			
		<Form layout='vertical' >
			<Form.Item label="Nombre de la sucursal">
				<Input />
			</Form.Item>
			<Form.Item label="Direccion">
				<Input />
			</Form.Item>
			<Form.Item label="Email">
				<Input />
			</Form.Item>
			<Form.Item label="Telefono">
				<Input />
			</Form.Item>
			<Form.Item label="Codigo Postal">
				<Input />
			</Form.Item>
			<Form.Item label="Pais">
				<Input />
			</Form.Item>			
			<Form.Item>
				<Button type="primary" htmlType="submit">Registrar nueva sucursal</Button>
			</Form.Item>																   
		</Form>
    </div>
  );
};

export default Bancos;
