import React from "react";
import {Form, Table, Button,Icon, DatePicker, Select, Input, Card, Col, Row } from "antd";
import {Link} from 'react-router-dom'
import axios from 'axios';
const baseURL = 'http://74.127.61.115:9900/graphql';
const { RangePicker } = DatePicker;
const { Option } = Select;
const columns = [
  {
    title: 'Nombre de la sucursal',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Direccion',
    dataIndex: 'address',
    key: 'address',
  },
  {
    title: 'Pais',
    dataIndex: 'country.name',
    key: 'country.name',
  },  
  {
    title: 'Estado',
    dataIndex: 'state',
    key: 'state',
  },
  {
    title: 'Moneda aceptada',
    dataIndex: 'country.currency.name',
    key: 'country.currency.name',
  },  
];
class Sucursales extends React.Component{
  state ={
    dataSource: []
  }

  componentDidMount(){
      axios.post(baseURL,{
        query:`
           {
            branchOffices{
              edges{
                id,
                name,
                country{
                  id,
                  name,
                  currency{
                    id,
                    name,
                    short
                  }
                },
                state,
                address
              },
            }
          }
        `
      }).then((res) => {
        this.setState({
          dataSource:res.data.data.branchOffices.edges
        })
        console.log(res)
        console.log(this.state.dataSource)
      }).catch((err) =>{
        console.log(err.message)
      })
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
      </Row>
        <div>
          <Table columns={columns} dataSource={this.state.dataSource}/>
        </div>      
    </div>
  );
};

}
export default Sucursales;
