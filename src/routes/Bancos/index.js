import React from "react";
import {Form, Table, Button,Icon, Input, Card, Col, Row } from "antd";
import {Link} from 'react-router-dom'
import axios from 'axios';
import { baseURL } from 'util/environment';
const columns = [
  {
    title: 'Nombre del banco',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Moneda asociada',
    dataIndex: 'country.currency.name',
    key: 'country.currency.name',
  },
  {
    title: 'Pais Asociado',
    dataIndex: 'country.name',
    key: 'country.name',
  }, 
];

class Bancos extends React.Component{
  state = {
    dataSource:[],
  }
  componentDidMount(){
    axios.post(baseURL,{
      query:`
        { 
          banks{
            edges{
              id,
              name,
              country{
                name,
                id,
                currency{
                  id,
                  name,
                  short
                }
              }
            }
          }
        }
      `
    }).then((res) => {
      this.setState({
        dataSource:res.data.data.banks.edges
      })
    }).catch((err) =>{
      console.log(err.message)
    })
  }

  render(){
    return (
      <div style={{padding: '30px' }}>
        <h3>Tú Seccion de bancos asociados</h3>
        <Row gutter={16}>
          <Col span={8}>
            <Card title="Tasa de cambio" extra={<Link to="#">Actualizar <Icon type="reload" /></Link>} style={{ height:200, width: 300 }}>
              <h2><center>8.000 VEF</center></h2>
              <p>Datos pueden cambiar segun avance el dia</p>
            </Card> 
          </Col>
          <Col span={8}>        
          <Card  title="Busqueda Inteligente" extra={<Link to='/bancos/registro'>Nuevo Banco <Icon type="plus-circle" /></Link>} style={{ height:200, width: 650 }}>
            <Form layout='inline' onSubmit={this.handlSubmit}>
                <Form.Item label="Nombre del Banco">
                  <Input name='nombre'/>
                </Form.Item>          
                <Form.Item label="Nombre del asociado">
                  <Input name='asociado'/>                  
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
        <Table columns={columns} dataSource={this.state.dataSource} rowKey={this.state.dataSource.id}/>
      </div>
    );
  };  
}

export default Bancos;
