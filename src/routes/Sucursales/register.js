import React from "react";
import {Form, Button,Icon,Input, Select} from "antd";
import {Link} from 'react-router-dom'
import axios from 'axios';
import { baseURL } from 'util/environment';
const { Option } = Select


class SucursalRegister extends React.Component{
	state = {
		countries:[],
		formValue:{},
		token:localStorage.getItem("token"),

	}

	handleSubmit = (event) => {
		event.preventDefault();
		axios.post(baseURL,{
  		variables:{
  			name:this.state.formValue.name,
  			country:this.state.formValue.country,
  			state:this.state.formValue.states,
  			address:this.state.formValue.address,
  		},
  		query:`
			mutation createNewBranchOffice($name: String!, $country: ID!, $state: String!, $address: String!){
				createBranchOffice(
			    name: $name,
			    country: $country,
			    state: $state,
			    address: $address
			  ){
			    id,
			    name,
			    country{
			      id,
			      name,
			      currency{
			        id,
			        name,
			        short
			      },
			      states
			    },
			    state,
			    address
			  }
			}
  		`,
		headers: {
    		'x-token':this.state.token,
    		'Content-Type': 'application/json'

  		},  		
		}).then((data) => {
			console.log(data)
			this.props.history.push('/sucursales');
		}).catch((err) => {
			console.log(err.message)
		})
	}	

	componentDidMount(){
	    axios.post(baseURL,{
	      query:`
	        {
	          countries{
	            edges{
	              id,
	              name,
	              currency{
	                name,
	                short,
	                id
	              },
	              states
	            }
	          }
	        }
	      `
	    }).then((res) => {
	      this.setState({
	        countries:res.data.data.countries.edges
	      })
	    }).catch((err) =>{
	      console.log(err.message)
	    })
  	}

	handleSelectChange = (event) => {
		this.setState({
			formValue:{
				...this.state.formValue,
				country:event
			}
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

	render(){	
		console.log(this.state.formValue)
	  return (
	  	<div style={{padding: '30px' }}>
	      <h3>Tú Seccion de registro de sucursales asociados</h3>	  
			<Link to='/sucursales'>Regresar <Icon type="undo" /></Link>			
			<Form layout='vertical' onSubmit={this.handleSubmit}>
				<Form.Item label="Nombre de la sucursal">
					<Input name="name" value={this.state.formValue.name} onChange={this.handleChange}/>
				</Form.Item>
				<Form.Item label="Direccion">
					<Input name="address" value={this.state.formValue.address} onChange={this.handleChange}/>
				</Form.Item>
				<Form.Item label="Estado">
					<Input name="states" value={this.state.formValue.states} onChange={this.handleChange}/>
				</Form.Item>
				<Form.Item label="Pais">
					<Select defaultValue="Seleccion" onChange={this.handleSelectChange}>
						{this.state.countries.map((data) => {
							return(
								<Option value={data.id}>{data.name}</Option>
							)
					})}
					</Select>
				</Form.Item>			
				<Form.Item>
					<Button type="primary" htmlType="submit">Registrar nueva sucursal</Button>
				</Form.Item>																   
			</Form>
	    </div>
	  );
	}
};

export default SucursalRegister;
