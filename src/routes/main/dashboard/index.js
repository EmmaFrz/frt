import React from "react";
import { Form, Table, Button, Icon, DatePicker, Select, Input, Card, Col, Row, Tabs, message } from "antd";
import { cities } from "./data";
import { OrderService } from "../../../services/orders.service";
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;
const { Option } = Select;

class Dashboard extends React.Component {

  state = {
    dataSource: [],
    endCursor: null,
    hasNextPage: null,
    loadingData: false
  }

  componentDidMount() {
    this.getOrders();
  }

  getOrders = (status = 'PENDING', limit = 100, cursor = this.state.endCursor, branchOffice = null, country = null) => {
    this.setState({ loadingData: true });
    OrderService.getOrders(cursor, limit, country, branchOffice, status)
      .then(orders => {
        this.setState({
          dataSource: orders.edges,
          endCursor: orders.pageInfo.endCursor,
          hasNextPage: orders.pageInfo.hasNextPage,
          loadingData: false
        });
      })
      .catch(err => {
        this.setState({ loadingData: false });
        message.error(err.toString())
      });
  }

  handleTabChange = (tabStatus) => {
    this.getOrders(tabStatus,);
  }

  render() {
    return (
      <React.Fragment>
        <h2>Bienvenido al dashboard de la plataforma</h2>
        <Row gutter={16}>
          <Col span={12}>
            <Card title="Busqueda por ciudades" style={{ height: 300, width: "100%" }}>
              <Form layout='inline' style={{ width: "100%" }}>
                <Form.Item style={{ width: '100%' }} label="Ciudad a buscar">
                  <Select defaultValue="Seleccione ciudad" style={{ width: 120 }}>
                    {cities.map(city => (
                      <Option key={city} value={city}>{city}</Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item style={{ width: '100%' }} label="Fechas">
                  <RangePicker style={{ width: 240 }} />
                </Form.Item>
                <Form.Item style={{ width: '100%' }} label="Banco">
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
          <Col span={12}>
            <Card title="Tasa de cambio" style={{ height: 300, width: "100%" }}>
              <h2><center>8.000 VEF</center></h2>
              <p>Datos pueden cambiar segun avance el dia</p>
            </Card>
          </Col>
          <Col span={24}>
            <Card style={{ width: '100%' }}>
              <h2>Reportes de transacciones</h2>
              <Tabs defaultActiveKey='PENDING' onChange={this.handleTabChange}>
                <TabPane tab="Pendientes" key='PENDING'>
                  <Table columns={columns} dataSource={this.state.dataSource} />
                </TabPane>
                <TabPane tab="Realizadas" key="DONE">
                  <Table columns={columns} dataSource={this.state.dataSource} />
                </TabPane>
                <TabPane tab="Rechazadas" key="REJECTED">
                  <Table columns={columns} dataSource={this.state.dataSource} />
                </TabPane>
              </Tabs>
            </Card>
          </Col>
        </Row>
      </React.Fragment>
    );
  }

};

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

export default Dashboard;
