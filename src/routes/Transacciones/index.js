import React from "react";
import {Form, Table, Button,Icon, DatePicker, Select, Input, Card, Col, Row } from "antd";
import {Link} from 'react-router-dom'
const { RangePicker } = DatePicker;
const { Option } = Select;
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
const dataSource = [
  {
    key: '1',
    id:1,
    cedula: 25443711,
    nombre: 'Emmanuel José',
    banco: 'BANESCO',
    cedula_receptor:23791618,
    nombre_receptor:'Yoselin Torres',
    banco_receptor:'BANESCO',
    monto_enviado:150000,
    status:'Aprobado'
  },
  {
    key: '2',
    id:2,
    cedula: 24956352,
    nombre: 'Jesús Medina',
    banco: 'VENEZUELA',
    cedula_receptor:23558642,
    nombre_receptor:'Cristian Gonzalez',
    banco_receptor:'BANESCO',
    monto_enviado:95000,
    status:'Procesando'
  },  
  {
    key: '3',
    id:3,
    cedula: 24996782,
    nombre: 'Moises Flores',
    banco: 'MICROFINANCIERO',
    cedula_receptor:21986320,
    nombre_receptor:'Felix Maita',
    banco_receptor:'BANFANB',
    monto_enviado:650000,
    status:'Rechazado'
  },  
  {
    key: '4',
    id:4,
    cedula: 24996782,
    nombre: 'Ibai Llanos',
    banco: 'BBVA',
    cedula_receptor:21986320,
    nombre_receptor:'Emmanuel José',
    banco_receptor:'BANESCO',
    monto_enviado:650000,
    status:'Procesando'
  },      

];
class Transacciones extends React.Component{

  state ={
    dataSource:dataSource
  }

  filterName = (bank,name) => {
    this.setState({dataSource:dataSource})
    let newMap = [];
    this.state.dataSource.map((data) => {
      if(data.nombre === name){
        newMap.push(data) 
      }
      if(data.banco === bank){
        newMap.push(data) 
      }     
      if(data.nombre_receptor === name){
        newMap.push(data) 
      }      
    })

    return newMap
  }

  handleSubmit = (event) => {
    event.preventDefault();
    let datos = this.filterName(event.target.banco.value,event.target.nombre.value)
    this.setState({
      dataSource:datos
    })
    if (event.target.nombre.value === '' && event.target.banco.value === '') {
      this.setState({
        dataSource:dataSource
      })
    }    
  }

  handleChange = (event) => {

  }

  render(){
    return (
      <div style={{padding: '30px' }}>
      <h3>Tú seccion de Transacciones</h3>
        <Row gutter={16}>
          <Col span={8}>
            <Card title="Tasa de cambio" extra={<a href="#">Actualizar <Icon type="reload" /></a>} style={{ height:200, width: 300 }}>
              <h2><center>8.000 VEF</center></h2>
              <p>Datos pueden cambiar segun avance el dia</p>
            </Card> 
          </Col>
          <Col span={8}>        
          <Card  title="Busqueda Inteligente" extra={<Link to='/transacciones/registro'>Nueva Transaccion <Icon type="plus-circle" /></Link>} style={{ height:200, width: 650 }}>
            <Form layout='inline' onSubmit={this.handleSubmit}>
                <Form.Item label="Nombres">
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
          </Card>
        </Col>                
        </Row>
        <Table columns={columns} dataSource={this.state.dataSource}/>
      </div>
    );
  };  
}
export default Transacciones;
