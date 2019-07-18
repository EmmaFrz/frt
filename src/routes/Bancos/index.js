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
    title: 'Nombre del banco',
    dataIndex: 'banco',
    key: 'banco',
  },
  {
    title: 'Numero de cuenta',
    dataIndex: 'num_cuenta',
    key: 'num_cuenta',
  },
  {
    title: 'Nombre asociado',
    dataIndex: 'asociado',
    key: 'asociado',
  },
  {
    title: 'Numero del asociado',
    dataIndex: 'num',
    key: 'num',
  },  
  {
    title: 'Pais del banco',
    dataIndex: 'pais_banco',
    key: 'pais_banco',
  }
];

const dataSource = [
  {
    key: '1',
    id:1,
    num_cuenta: 25443711,
    asociado: 'Emmanuel José',
    banco: 'BANESCO',
    pais_banco:'Venezuela',
    num:25447895
  },
  {
    key: '2',
    id:2,
    num_cuenta: 789654123,
    asociado: 'Miguel MArtinez',
    banco: 'Banco Fallabela',
    pais_banco:'Chile',
    num:96485226
  },
  {
    key: '3',
    id:3,
    num_cuenta: 123456789,
    asociado: 'Simon Salazar',
    banco: 'BANCOLOMBIA',
    pais_banco:'Colombia',
    num:26845987
  }   

    ]
class Bancos extends React.Component{
  state = {
    dataSource:dataSource
  }
  filterName = (asoc,name) => {
    this.setState({dataSource:dataSource})
    let newMap = [];
    this.state.dataSource.map((data) => {
      if(data.banco === name){
        newMap.push(data) 
      }
      if(data.asociado === asoc){
        newMap.push(data) 
      }
    })

    return newMap
  }

  handlSubmit = (event) => {
    event.preventDefault();
    let datos = this.filterName(event.target.asociado.value,event.target.nombre.value)
    this.setState({
      dataSource:datos
    })
    if (event.target.nombre.value === '' && event.target.asociado.value === '') {
      this.setState({
        dataSource:dataSource
      })
    }
  }

  render(){
    return (
      <div style={{padding: '30px' }}>
        <h3>Tú Seccion de bancos asociados</h3>
        <Row gutter={16}>
          <Col span={8}>
            <Card title="Tasa de cambio" extra={<a href="#">Actualizar <Icon type="reload" /></a>} style={{ height:200, width: 300 }}>
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
        <Table columns={columns} dataSource={this.state.dataSource}/>
        </Row>
      </div>
    );
  };  
}

export default Bancos;
