import React from "react";
import {Form, Button,Icon,Input} from "antd";
import {Link} from 'react-router-dom'

const Bancos = () => {
  return (
  	<div style={{padding: '30px' }}>
      <h3>Nuevos usuarios</h3>	  
		<Link to='/usuarios'>Regresar <Icon type="undo" /></Link>			
		<Form layout='vertical' >
			<Form.Item label="Nombre de usuario">
				<Input />
			</Form.Item>
			<Form.Item label="Numero de identidad">
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
				<Button type="primary" htmlType="submit">Registrar nuevo usuario</Button>
			</Form.Item>																   
		</Form>
    </div>
  );
};

export default Bancos;
