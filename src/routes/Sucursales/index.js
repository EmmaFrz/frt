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
    title: 'Nombre de la sucursal',
    dataIndex: 'sucursal',
    key: 'sucursal',
  },
  {
    title: 'Direccion',
    dataIndex: 'direccion',
    key: 'direccion',
  },
  {
    title: 'Email',
    dataIndex: 'email',
    key: 'email',
  },
  {
    title: 'Telefono',
    dataIndex: 'telefono',
    key: 'telefono',
  },
  {
    title: 'Codigo Postal',
    dataIndex: 'zip',
    key: 'zip',
  },
  {
    title: 'Pais',
    dataIndex: 'pais_sucursal',
    key: 'pais_sucursal',
  }     
];
const dataSource = [
  {
    key: '1',
    id:1,
    sucursal: 'Sucursal Nueva fortuna',
    direccion: 'avenida ABC',
    email: 'sucursal@example.com',
    telefono:'+58123456789',
    zip:252525,
    pais_sucursal:'Venezuela'
  },
  {
    key: '2',
    id:2,
    sucursal: 'Sucursal Nueva fortuna 2',
    direccion: 'avenida ABC2',
    email: 'sucursal2@example.com',
    telefono:'+56123456789',
    zip:252525  ,
    pais_sucursal:'Chile'
  },
  {
    key: '3',
    id:3,
    sucursal: 'Sucursal Nueva fortuna 3',
    direccion: 'avenida ABC3',
    email: 'sucursa3l@example.com',
    telefono:'+52123456789',
    zip:353535,
    pais_sucursal:'Mexico'
  }, 

];
class Sucursales extends React.Component{
  state ={
    dataSource: dataSource
  }

  filterName = (zip,name,obj) => {
    let newMap = [];
    obj.map((data) => {
      if(data.sucursal === name){
        newMap.push(data) 
      }
      if (data.zip == zip) {
        newMap.push(data)
      }
    })

    return newMap
  }

  handleSubmit = (event) => {
    event.preventDefault();
    console.info(event.target.zip.value)
    let datos = this.filterName(event.target.zip.value,event.target.nombre.value,this.state.dataSource)
    this.setState({
      dataSource:datos
    })
    if (event.target.nombre.value === '' && event.target.zip.value === '') {
      this.setState({
        dataSource:dataSource
      })
    }  
  }

  render(){
  return (
    <div style={{padding: '30px' }}>
      <h3>Tú Seccion de Sucursales asociadas</h3>
      <Row gutter={16}>
        <Col span={8}>
          <Card title="Tasa de cambio" extra={<a href="#">Actualizar <Icon type="reload" /></a>} style={{ height:200, width: 300 }}>
            <h2><center>8.000 VEF</center></h2>
            <p>Datos pueden cambiar segun avance el dia</p>
          </Card> 
        </Col>
        <Col span={8}>        
        <Card  title="Busqueda Inteligente" extra={<Link to='/sucursales/registro'>Nueva Sucursal <Icon type="plus-circle" /></Link>} style={{ height:200, width: 650 }}>
          <Form layout='inline' onSubmit={this.handleSubmit}>
              <Form.Item label="Nombres">
                <Input name='nombre'/>
              </Form.Item>          
              <Form.Item label="Codigo postal">
                <Input name='zip'/> 
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
      <center><Table columns={columns} dataSource={this.state.dataSource}/></center>
      </Row>
    </div>
  );
};

}
export default Sucursales;
