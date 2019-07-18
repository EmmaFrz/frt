import React from "react";
import {Form, Table, Button,Icon, DatePicker, Select, Input, Card, Col, Row } from "antd";
import {Link} from 'react-router-dom';
const { RangePicker } = DatePicker;
const columns = [
  {
    title: 'Id',
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: 'Cedula Emisor',
    dataIndex: 'cedula',
    key: 'cedula',
  },
  {
    title: 'Nombre Emisor',
    dataIndex: 'nombre',
    key: 'Nombre',
  },
  {
    title: 'Banco Emisor',
    dataIndex: 'banco',
    key: 'banco',
  },
  {
    title: 'Cedula Receptor',
    dataIndex: 'cedula_receptor',
    key: 'cedula_receptor',
  },
  {
    title: 'Nombre Receptor',
    dataIndex: 'nombre_receptor',
    key: 'nombre_receptor',
  }, 
  {
    title: 'Banco Receptor',
    dataIndex: 'banco_receptor',
    key: 'banco_receptor',
  },
  {
    title: 'Monto Enviado',
    dataIndex: 'monto_enviado',
    key: 'monto_enviado',
  },
  {
    title: 'Estatus Transaccion',
    dataIndex: 'status',
    key: 'status',
  },    
];
const Dashboard = () => {
  return (
  	<React.Fragment>
  		<h2>Bienvenido al dashboard de la plataforma</h2>
	      <Row gutter={16}>
	        <Col span={8}>
	          <Card title="Tasa de cambio"  style={{ height:170, width: 300 }}>
	            <h2><center>8.000 VEF</center></h2>
	            <p>Datos pueden cambiar segun avance el dia</p>
	          </Card> 
	        </Col>
	        <Col span={8}>        
	        <Card  title="Busqueda por ciudades" style={{ height:300, width: 500 }}>
	        	<Form layout='inline'>
                <Form.Item label="Ciudad a buscar">
                  <Input name='nombre'/>
                </Form.Item>
                <Form.Item label="Fechas">
                  <RangePicker style={{ width: 240 }}  />
                </Form.Item>          
                <Form.Item label="Banco">
                   <Input name='banco'/>
                </Form.Item>
                <Form.Item
                  wrapperCol={{
                    xs: { span: 24, offset: 0 },
                    sm: { span: 16, offset: 8 },
                  }}
                >
                  <Button type="primary" htmlType="submit">
                    Buscar<Icon type="search" />
                  </Button>
                </Form.Item>
              </Form>
              <h3>Balance de depositos diarios: 3500</h3>
	          </Card>
	        </Col> 
	        <Col span={32}>        
	        <Card   style={{ height:400, width: 1024 }}>
	        	<h2>Reportes de transacciones pendietes</h2>
        		<Table columns={columns} />	          
	        </Card>
	        </Col> 	          
	      </Row>  		
  	</React.Fragment>
  );
};

export default Dashboard;
