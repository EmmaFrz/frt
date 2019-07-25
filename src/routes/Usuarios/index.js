import React from "react";
import { Form, Table, Button, Icon, Input, Card, Col, Row, message } from "antd";
import { Link } from 'react-router-dom'
import UserService from "../../services/user.service";

class Usuarios extends React.Component {

  state = {
    users: []
  }

  componentDidMount() {
    this.fetchUsers();
  }

  fetchUsers = () => {
    UserService.getUsers()
      .then(users => {
        console.log(users);
        //this.setState({ users });
      })
      .catch(error => message.error('Ha ocurrido un error al solicitar los usuarios.'));
  }

  render() {
    return (
      <div style={{ padding: '30px' }}>
        <h3>Tú Seccion de Usuarios asociadas</h3>
        <Row gutter={16}>
          <Col span={8}>
            <Card title="Tasa de cambio" extra={<Link to="/usuarios">Actualizar <Icon type="reload" /></Link>} style={{ height: 200, width: 300 }}>
              <h2><center>8.000 VEF</center></h2>
              <p>Datos pueden cambiar segun avance el dia</p>
            </Card>
          </Col>
          <Col span={8}>
            <Card title="Busqueda Inteligente" extra={<Link to='/usuarios/registro'>Nuevo Usuario <Icon type="plus-circle" /></Link>} style={{ height: 200, width: 650 }}>
              <Form layout='inline' onSubmit={this.handleSubmit}>
                <Form.Item label="Nombres">
                  <Input name='nombre' />
                </Form.Item>
                <Form.Item label="Documento de identidad">
                  <Input name='dni' />
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
        <center><Table columns={columns} dataSource={this.state.users} /></center>
      </div>
    );
  };
}

const columns = [
  {
    title: 'Id',
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: 'Usuario',
    dataIndex: 'username',
    key: 'username',
  },
  {
    title: 'Cedula/DNI',
    dataIndex: 'dni',
    key: 'dni',
  },
  {
    title: 'Email',
    dataIndex: 'email',
    key: 'email',
  },
  {
    title: 'Telefono',
    dataIndex: 'phone',
    key: 'phone',
  }
];

export default Usuarios;
