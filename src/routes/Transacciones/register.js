import React from "react";
import {Form, Button,Icon,Input} from "antd";
import {Link} from 'react-router-dom'

const RegisterTransactions = () => {
  return (
  	<div style={{padding: '30px' }}>
      <h3>Nuevas transacciones</h3>	  
		<Link to='/transacciones'>Regresar <Icon type="undo" /></Link>
		<Form layout='vertical' >
			<Form.Item label="Cedula Emisor">
				<Input />
			</Form.Item>
			<Form.Item label="Nombre Emisor">
				<Input />
			</Form.Item>
			<Form.Item label="Banco Emisor">
				<Input />
			</Form.Item>
			<Form.Item label="Cedula Receptor">
				<Input />
			</Form.Item>
			<Form.Item label="Nombre Receptor">
				<Input />
			</Form.Item>
			<Form.Item label="Banco Receptor">
				<Input />
			</Form.Item>
			<Form.Item label="Monto a enviar">
				<Input />
			</Form.Item>						
			<Form.Item>
				<Button type="primary" htmlType="submit">Procesar Transacción</Button>
			</Form.Item>																   
		</Form>
    </div>
  );
};

export default RegisterTransactions;
