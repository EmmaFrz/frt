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
    title: 'Nombre de usuario',
    dataIndex: 'sucursal',
    key: 'sucursal',
  },
  {
    title: 'Numero de identidad',
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
    title: 'Pais',
    dataIndex: 'zip',
    key: 'zip',
  },  
];
const dataSource = [
  {
    key: '1',
    id:1,
    sucursal: 'Juan Nieve',
    direccion: '12345678',
    email: 'kingofw@example.com',
    telefono:'+58123456789',
    zip:252525,
    pais_sucursal:'Venezuela'
  },
  {
    key: '2',
    id:2,
    sucursal: 'Juan Pascal',
    direccion: '123456782',
    email: 'kingofw@example.com',
    telefono:'+56123456789',
    zip:747474,
    pais_sucursal:'Chile'
  },
  {
    key: '3',
    id:3,
    sucursal: 'Juan Miguel',
    direccion: '123456783',
    email: 'kingofw@example.com',
    telefono:'+52123456789',
    zip:353535,
    pais_sucursal:'Mexico'
  }, 

];
class Usuarios extends React.Component{
  state ={
    dataSource:dataSource
  }

  handleChange = (event,datestring) => {
    console.log(datestring)
  }

filterName = (dni,name,obj) => {
    this.setState({dataSource:[]})
    let newMap = [];
    obj.map((data) => {
      if(data.sucursal === name){
        newMap.push(data) 
      }
      if (data.direccion == dni) {
        newMap.push(data)
      }
    })

    return newMap
  }

  handleSubmit = (event) => {
    this.setState({dataSource:[]})    
    event.preventDefault();
    let datos = this.filterName(event.target.dni.value,event.target.nombre.value,this.state.dataSource)
    this.setState({
      dataSource:datos
    })
    if (event.target.nombre.value === '' && event.target.dni.value === '') {
      this.setState({
        dataSource:dataSource
      })
    }  
  }  

  render(){
    return (
      <div style={{padding: '30px' }}>
        <h3>Tú Seccion de Usuarios asociadas</h3>
        <Row gutter={16}>
          <Col span={8}>
            <Card title="Tasa de cambio" extra={<a href="#">Actualizar <Icon type="reload" /></a>} style={{ height:200, width: 300 }}>
              <h2><center>8.000 VEF</center></h2>
              <p>Datos pueden cambiar segun avance el dia</p>
            </Card> 
          </Col>
          <Col span={8}>        
          <Card  title="Busqueda Inteligente" extra={<Link to='/usuarios/registro'>Nuevo Usuario <Icon type="plus-circle" /></Link>} style={{ height:200, width: 650 }}>
            <Form layout='inline' onSubmit={this.handleSubmit}>
                <Form.Item label="Nombres">
                  <Input name='nombre'/>
                </Form.Item>          
                <Form.Item label="Documento de identidad">
              <Input name='dni'/> 
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
        <center><Table columns={columns} dataSource={this.state.dataSource}/></center>
      </div>
    );
  };
}
export default Usuarios;
