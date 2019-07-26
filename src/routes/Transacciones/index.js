import React from "react";
import { Form, Table, Button, Icon, DatePicker, Input, Card, Col, Row, message } from "antd";
import { Link } from 'react-router-dom'
import { OrderService } from "../../services/orders.service";
const { RangePicker } = DatePicker;

class Transacciones extends React.Component {

  state = {
    dataSource: [],
    endCursor: null,
    hasNextPage: null
  }

  componentDidMount() {
    this.getOrders();
  }

  getOrders = () => {
    OrderService.getOrders()
      .then(orders => {
        this.setState({
          dataSource: orders.edges,
          endCursor: orders.pageInfo.endCursor,
          hasNextPage: orders.pageInfo.hasNextPage
        });
      })
      .catch(err => message.error(err.toString()));
  }

  render() {
    return (
      <div style={{ padding: '30px' }}>
        <h3>Tú seccion de Transacciones</h3>
        <Row gutter={16}>
          <Col span={8}>
            <Card title="Tasa de cambio" extra={<Link to="/transacciones">Actualizar <Icon type="reload" /></Link>} style={{ height: 200, width: 300 }}>
              <h2><center>8.000 VEF</center></h2>
              <p>Datos pueden cambiar segun avance el dia</p>
            </Card>
          </Col>
          <Col span={8}>
            <Card title="Busqueda Inteligente" extra={<Link to='/transacciones/registro'>Nueva Transaccion <Icon type="plus-circle" /></Link>} style={{ height: 200, width: 650 }}>
              <Form layout='inline' onSubmit={this.handleSubmit}>
                <Form.Item label="Nombres">
                  <Input name='nombre' />
                </Form.Item>
                <Form.Item label="Fechas">
                  <RangePicker style={{ width: 240 }} />
                </Form.Item>
                <Form.Item label="Banco">
                  <Input name='banco' />
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
        <Table columns={columns} dataSource={this.state.dataSource} />
      </div>
    );
  };
}

const columns = [
  {
    title: 'Cedula Emisor',
    dataIndex: 'sender.dni',
    key: 'sender.dni',
  },
  {
    title: 'Nombre Emisor',
    dataIndex: 'nombre',
    key: 'Nombre',
  },
  {
    title: 'Banco Emisor',
    dataIndex: 'origin_bank.name',
    key: 'origin_bank.name',
  },
  {
    title: 'Cedula Receptor',
    dataIndex: 'receiver_dni',
    key: 'receiver_dni',
  },
  {
    title: 'Nombre Receptor',
    dataIndex: 'nombre_receptor',
    key: 'nombre_receptor',
  },
  {
    title: 'Banco Receptor',
    dataIndex: 'destination_bank.name',
    key: 'destination_bank.name',
  },
  {
    title: 'Monto Enviado',
    dataIndex: 'amount',
    key: 'amount',
    render: (amount, record) => `${amount} ${record.origin_country.currency.short}`
  },
  {
    title: 'Monto a recibir',
    dataIndex: 'destination_amount',
    key: 'destination_amount',
    render: (destination_amount, record) => `${destination_amount} ${record.destination_country.currency.short}`
  },
  {
    title: 'Estatus Transaccion',
    dataIndex: 'status',
    key: 'status',
  },
];

export default Transacciones;
