import React from "react";
import {Form, Table, Button,Icon , Input, Card, Col, Row, message } from "antd";
import { Link } from 'react-router-dom';
import { CountryService } from "../../services/config.service";

const columns = [
  {
    title: 'Nombre del pais',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Moneda',
    dataIndex: 'currency.name',
    key: 'currency.name',
  },
  {
    title: 'Estados',
    dataIndex: 'states',
    key: 'states',
    render: states => `${states.join(', ')}.`
  }  
];

class Sucursales extends React.Component{
  
  state = {
    countries: [],
    hasNextPage: false,
    endCursor: ""
  }

  componentDidMount(){
    this.getCountries();
  }

  getCountries = () => {
    CountryService.getCountries()
      .then(countries => {
        this.setState({
          countries: countries.edges,
          hasNextPage: countries.pageInfo.hasNextPage,
          endCursor: countries.pageInfo.endCursor
        })
      }, err => message.error(err.toString()));
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
        <Card  title="Busqueda Inteligente" extra={<Link to='/paises/registro'>Nuevo Pais <Icon type="plus-circle" /></Link>} style={{ height:170, width: 500 }}>
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
        <Table columns={columns} dataSource={this.state.countries} rowKey={this.state.countries.id}/>       
      </div>
    </div>
  );
};

}
export default Sucursales;
