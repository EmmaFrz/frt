import React from "react";
import {Button, Checkbox, Form, Input} from "antd";
import {connect} from "react-redux";
import {Link} from "react-router-dom";

import {userSignIn} from "../appRedux/actions/Auth";
import IntlMessages from "util/IntlMessages";
import InfoView from "components/InfoView";

const FormItem = Form.Item;

class SignIn extends React.Component {

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.userSignIn(values);
      }
    });
  };

  componentDidUpdate() {
    if (this.props.token !== null) {
      this.props.history.push('/');
    }
  }

  render() {
    const {getFieldDecorator} = this.props.form;

    return (
      <div className="gx-app-login-wrap">
        <div className="gx-app-login-container">
          <div className="gx-app-login-main-content">
            <div className="gx-app-logo-content">
              <div className="gx-app-logo-content-bg">
                <img src="https://via.placeholder.com/272x395" alt='Neature'/>
              </div>
              <div className="gx-app-logo-wid">
                <h1><IntlMessages id="app.userAuth.signIn"/></h1>
                <p><IntlMessages id="app.userAuth.bySigning"/></p>
                <p><IntlMessages id="app.userAuth.getAccount"/></p>
              </div>
              <div className="gx-app-logo">
                <img alt="example" src={require("assets/images/logo.png")}/>
              </div>
            </div>
            <div className="gx-app-login-content">
              <Form onSubmit={this.handleSubmit} className="gx-signin-form gx-form-row0">

                <FormItem>
                  {getFieldDecorator('username', {
                    initialValue: "jmedina",
                  })(
                    <Input placeholder="Username"/>
                  )}
                </FormItem>
                <FormItem>
                  {getFieldDecorator('password', {
                    initialValue: "verysecret",
                    rules: [{required: true, message: 'Please input your Password!'}],
                  })(
                    <Input type="password" placeholder="Password"/>
                  )}
                </FormItem>
                <FormItem>
                  {getFieldDecorator('remember', {
                    valuePropName: 'checked',
                    initialValue: true,
                  })(
                    <Checkbox>Recuerdame</Checkbox>
                  )}
                </FormItem>
                <FormItem>
                  <Button type="primary" className="gx-mb-0" htmlType="submit">
                    Iniciar sesion
                  </Button>
                  <span><IntlMessages id="app.userAuth.or"/></span> <Link to="/signup">Registrate</Link>
                </FormItem>
              </Form>
            </div>
            <InfoView/>
          </div>
        </div>
      </div>
    );
  }
}

const WrappedNormalLoginForm = Form.create()(SignIn);

const mapStateToProps = ({auth}) => {
  const {token} = auth;
  return {token}
};

export default connect(mapStateToProps, {userSignIn})(WrappedNormalLoginForm);
