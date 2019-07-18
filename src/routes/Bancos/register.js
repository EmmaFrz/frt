import React from "react";
import {Form, Button,Icon,Input} from "antd";
import {Link} from 'react-router-dom'


const Bancos = () => {
  return (
  	<div style={{padding: '30px' }}>
      <h3>Tú Seccion de registro de bancos asociados</h3>	  
		<Link to='/bancos'>Regresar <Icon type="undo" /></Link>			
		<Form layout='vertical' >
			<Form.Item label="Nombre del banco">
				<Input />
			</Form.Item>
			<Form.Item label="Numero de cuenta">
				<Input />
			</Form.Item>
			<Form.Item label="Nombre asociado">
				<Input />
			</Form.Item>
			<Form.Item label="Cedula del asociado">
				<Input />
			</Form.Item>
			<Form.Item label="Pais del banco">
				<Input />
			</Form.Item>
			<Form.Item>
				<Button type="primary" htmlType="submit">Registrar nuevo banco</Button>
			</Form.Item>																   
		</Form>
    </div>
  );
};

export default Bancos;
