import React from "react";
import {Form, Button,Icon,Input} from "antd";
import {Link} from 'react-router-dom'
import axios from 'axios';
import { baseURL } from 'util/environment';

class Divisas extends React.Component{
	
	state = {
		formValue:{},
		token:localStorage.getItem("token")
	}
	handleSubmit = (event) => {
		console.log(this.state.token)
		event.preventDefault();
		axios.post(baseURL,{
  		variables:{
  			name:this.state.formValue.name,
  			short:this.state.formValue.short
  		},
  		query:`
			mutation createNewCurrency($name: String!, $short: String!){
			  createCurrency(name: $name, short: $short){
			    id,
			    name,   
			    short
			  }
			}  			
  		`,
		headers: {
    		'x-token':this.state.token,
    		'Content-Type': 'application/json'

  		},  		
		}).then((data) => {
			console.log(data.data)
			this.props.history.push('/divisas');
		}).catch((err) => {
			console.log(err.message)
		})
	};

	handleChange = (event) => {
		this.setState({
			formValue:{
				...this.state.formValue,
				[event.target.name]:event.target.value
		}
		})
	}

	render(){
		return (
		<div style={{padding: '30px' }}>
			<h3>Tú Seccion de registro de divisas</h3>	  
			<Link to='/divisas'>Regresar <Icon type="undo" /></Link>			
			<Form layout='vertical' onSubmit={this.handleSubmit}>
				<Form.Item label="Nombre de divisa">
					<Input name='name' value={this.state.formValue.name} onChange={this.handleChange}/>
				</Form.Item>
				<Form.Item label="Codigo internacional">
					<Input name="short" value={this.state.formValue.short} onChange={this.handleChange}/>
				</Form.Item>			
				<Form.Item>
					<Button type="primary" htmlType="submit">Registrar nueva divisa</Button>
				</Form.Item>																   
			</Form>
		</div>
		);
	}
}
export default Divisas;
