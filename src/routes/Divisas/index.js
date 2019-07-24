import React from "react";
import {Form, Table, Button,Icon, Input, Card, Col, Row } from "antd";
import {Link} from 'react-router-dom';
import axios from 'axios';
import { baseURL } from 'util/environment';
const columns = [
  {
    title: 'Nombre de la divisa',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Codigo Internacional',
    dataIndex: 'short',
    key: 'short',
  }
];

class Sucursales extends React.Component{
  state ={
    dataSource:[]
  }

  componentDidMount(){
    axios.post(baseURL,{
      query:`
        {
          currencies{
            edges{
              name,
              short,
              id
            }
          }
        }
      `
    }).then((res) => {
      this.setState({
        dataSource:res.data.data.currencies.edges
      })
    }).catch((err) =>{
      console.log(err.message)
    })
  }

  render(){
  return (
    <div style={{padding: '30px' }}>
      <h3>Tú Seccion de Divisas asociadas</h3>
      <Row gutter={16}>
        <Col span={8}>
          <Card title="Tasa de cambio" extra={<Link to="#">Actualizar <Icon type="reload" /></Link>} style={{ height:170, width: 300 }}>
            <h2><center>8.000 VEF</center></h2>
            <p>Datos pueden cambiar segun avance el dia</p>
          </Card> 
        </Col>
        <Col span={8}>        
        <Card  title="Busqueda Inteligente" extra={<Link to='/divisas/registro'>Nueva Divisa <Icon type="plus-circle" /></Link>} style={{ height:170, width: 500 }}>
          <Form layout='inline' onSubmit={this.handleSubmit}>
              <Form.Item label="Nombres">
                <Input name='nombre'/>
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
        <Table columns={columns} dataSource={this.state.dataSource} rowKey={this.state.dataSource.id}/>        
      </div>
    </div>
  );
};

}
export default Sucursales;
