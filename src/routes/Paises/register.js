import React from "react";
import {Form, Button, Icon, Input, Select, } from "antd";
import {Link} from 'react-router-dom'
import axios from 'axios';
const baseUrl = 'http://74.127.61.115:9900/graphql';
const { Option } = Select;

class Divisas extends React.Component{
	
	state = {
		formValue:{	
		},
		token:localStorage.getItem("token"),
		dataSource:[],
	}

	handleSubmit = (event) => {
		event.preventDefault();
		console.log(this.state.formValue)
		let arr = []
		arr.push(this.state.formValue.states)
		console.info(arr)
		axios.post(baseUrl,{
  		variables:{
  			name:this.state.formValue.name,
  			currency:this.state.formValue.currency,
  			states:arr
  		},
  		query:`
			mutation createNewCountry($name: String!, $currency: ID!, $states: [String!]!){
			  createCountry(name: $name, currency: $currency, states: $states){
			    id,
			    name,   
			    currency{
			    	id,
			    	name,
			    	short
			    } ,
			    states,
			  }
			}  			
  		`,
		headers: {
    		'x-token':this.state.token,
    		'Content-Type': 'application/json'

  		},  		
		}).then((data) => {
			console.log(data.data)
			this.props.history.push('/paises');
		}).catch((err) => {
			console.log(err.message)
		})
	}

	handleChange = (event) => {
			this.setState({
				formValue:{
					...this.state.formValue,
					[event.target.name]:event.target.value,
				}
			})
	}

	handleCurrencyChange = (event) => {
		this.setState({
			formValue:{
				...this.state.formValue,
				currency:event
			}
		})
	}


	componentDidMount(){
		axios.post(baseUrl,{
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
			<h3>Tú Seccion de registro de paises</h3>	  
			<Link to='/paises'>Regresar <Icon type="undo" /></Link>			
			<Form layout='vertical' onSubmit={this.handleSubmit}>
				<Form.Item label="Nombre del pais">
					<Input name='name' value={this.state.formValue.name} onChange={this.handleChange}/>
				</Form.Item>
				<Form.Item label="Moneda local">
					<Select defaultValue="Seleccion" onChange={this.handleCurrencyChange}>
						{this.state.dataSource.map((data) => {
							return(
								<Option value={data.id}>{data.name}</Option>
							)
						})}
					</Select>
				</Form.Item>
				<Form.Item label="Estados">
					<Input name="states" value={this.state.formValue.states} onChange={this.handleChange}/>
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
