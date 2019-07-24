import React from "react";
import {Form, Table, Button,Icon, Input, Card, Col, Row } from "antd";
import {Link} from 'react-router-dom'
import axios from 'axios';
import { baseURL } from 'util/environment';
const columns = [
  {
    title: 'Valor del dia',
    dataIndex: 'value',
    key: 'value',
  },
  {
    title: 'Pais de origen',
    dataIndex: 'origin_country.name',
    key: 'origin_country.name',
  },
  {
    title: 'Pais destino',
    dataIndex: 'destination_country.name',
    key: 'destination_country.name',
  },
  {
    title: 'Valido hasta',
    dataIndex: 'createdAt',
    key: 'createdAt',
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
            exchanges{
              edges{
                id,
                value,
                origin_country{
                  id,
                  name,
                  currency{
                    id,
                    name,
                    short
                  },
                  states
                },
                destination_country{
                  id,
                  name,
                  currency{
                    id,
                    name,
                    short
                  },
                  states
                },
                createdAt
              },
              pageInfo{
                hasNextPage,
                endCursor
            }
          }
        }
      `
    }).then((res) => {
      this.setState({
        dataSource:res.data.data.exchanges.edges
      })
    }).catch((err) =>{
      console.log(err.message)
    })
  }

  render(){
    return (
      <div style={{padding: '30px' }}>
        <h3>Tú Seccion de tasas de cambio asociados</h3>
        <Row gutter={16}>
          <Col span={8}>
            <Card title="Tasa de cambio" extra={<Link to="#">Actualizar <Icon type="reload" /></Link>} style={{ height:200, width: 300 }}>
              <h2><center>8.000 VEF</center></h2>
              <p>Datos pueden cambiar segun avance el dia</p>
            </Card> 
          </Col>
          <Col span={8}>        
          <Card  title="Busqueda Inteligente" extra={<Link to='/cambios/registro'>Nueva tasa de cambio <Icon type="plus-circle" /></Link>} style={{ height:200, width: 650 }}>
            <Form layout='inline'>
                <Form.Item label="Pais origen">
                  <Input name='nombre'/>
                </Form.Item>          
                <Form.Item label="Pais destino">
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
        <Table columns={columns} dataSource={this.state.dataSource} rowKey={this.state.dataSource.id} />
      </div>
    );
  };  
}

export default Bancos;
