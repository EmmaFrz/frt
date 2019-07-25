import React from "react";
import { Form, Table, Button, Icon, DatePicker, Select, Input, Card, Col, Row, Tabs } from "antd";
import { pending, done, rejected, cities } from "./data";
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;
const { Option } = Select;

const Dashboard = () => {
  return (
    <React.Fragment>
      <h2>Bienvenido al dashboard de la plataforma</h2>
      <Row gutter={16}>
        <Col span={12}>
          <Card title="Busqueda por ciudades" style={{ height: 300, width: "100%" }}>
            <Form layout='inline' style={{ width: "100%" }}>
              <Form.Item style={{ width: '100%' }} label="Ciudad a buscar">
                <Select defaultValue="Seleccione ciudad" style={{width:120}}>
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
          <Card style={{width: '100%' }}>
            <h2>Reportes de transacciones</h2>
            <Tabs defaultActiveKey="1">
              <TabPane tab="Pendientes" key="1">
                <Table columns={columns} dataSource={pending} />
              </TabPane>
              <TabPane tab="Realizadas" key="2">
                <Table columns={columns} dataSource={done} />
              </TabPane>
              <TabPane tab="Rechazadas" key="3">
                <Table columns={columns} dataSource={rejected} />
              </TabPane>
            </Tabs>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  );
};

const columns = [
  {
    title: 'Id',
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: 'Cedula Emisor',
    dataIndex: 'cedula',
    key: 'cedula',
  },
  {
    title: 'Nombre Emisor',
    dataIndex: 'nombre',
    key: 'Nombre',
  },
  {
    title: 'Banco Emisor',
    dataIndex: 'banco',
    key: 'banco',
  },
  {
    title: 'Cedula Receptor',
    dataIndex: 'cedula_receptor',
    key: 'cedula_receptor',
  },
  {
    title: 'Nombre Receptor',
    dataIndex: 'nombre_receptor',
    key: 'nombre_receptor',
  },
  {
    title: 'Banco Receptor',
    dataIndex: 'banco_receptor',
    key: 'banco_receptor',
  },
  {
    title: 'Monto Enviado',
    dataIndex: 'monto_enviado',
    key: 'monto_enviado',
  },
  {
    title: 'Estatus Transaccion ',
    dataIndex: 'status',
    key: 'status',
  },
];

export default Dashboard;
