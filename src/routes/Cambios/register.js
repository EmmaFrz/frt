import React from "react";
import {Form, Button,Icon,Input, Select} from "antd";
import {Link} from 'react-router-dom'
import axios from 'axios';
const { Option } = Select
const baseURL = 'http://74.127.61.115:9900/graphql';

class BancoCreate extends React.Component{
	state = {
		countries:[],
		formValue:{},
		token:localStorage.getItem("token"),

	}

	handleSubmit = (event) => {
		event.preventDefault();
		console.log(this.state.formValue)
		axios.post(baseURL,{
  		variables:{
  			value:parseInt(this.state.formValue.name),
  			origin_country:this.state.formValue.origin_country,
  			destination_country:this.state.formValue.destination_country
  		},
  		query:`
			mutation createNewExchangeRate(
			  $value: Float!
			  $origin_country: ID!
			  $destination_country: ID!
			) {
			  createExchange(
			    value: $value
			    origin_country: $origin_country
			    destination_country: $destination_country
			  ) {
			    id
			    value
			    origin_country {
			      id
			      name
			      currency {
			        id
			        name
			        short
			      }
			      states
			    }
			    destination_country {
			      id
			      name
			      currency {
			        id
			        name
			        short
			      }
			      states
			    }
			  }
			}
  		`,
		headers: {
    		'x-token':this.state.token,
    		'Content-Type': 'application/json'

  		},  		
		}).then((data) => {
			console.log(data)
			this.props.history.push('/cambios');
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

	handleOriginSelectChange = (event) => {
		this.setState({
			formValue:{
				...this.state.formValue,
				origin_country:event
			}
		})
	}

	handleDestinationSelectChange = (event) => {
		this.setState({
			formValue:{
				...this.state.formValue,
				destination_country:event
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
	  return (
	  	<div style={{padding: '30px' }}>
	      <h3>Tú Seccion de registro de bancos asociados</h3>	  
			<Link to='/cambios'>Regresar <Icon type="undo" /></Link>			
			<Form layout='vertical' onSubmit={this.handleSubmit}>
				<Form.Item label="Tasa de cambio">
					<Input name="name" value={this.state.formValue.name} onChange={this.handleChange}/>
				</Form.Item>
				<Form.Item label="Pais origen">
					<Select defaultValue="Seleccion" onChange={this.handleOriginSelectChange}>
						{this.state.countries.map((data) => {
							return(
								<Option value={data.id}>{data.name}</Option>
							)
						})}
					</Select>
				</Form.Item>
				<Form.Item label="Pais destino">
					<Select defaultValue="Seleccion" onChange={this.handleDestinationSelectChange}>
						{this.state.countries.map((data) => {
							return(
								<Option value={data.id}>{data.name}</Option>
							)
						})}
					</Select>
				</Form.Item>				
				<Form.Item>
					<Button type="primary" htmlType="submit">Registrar nuevo banco</Button>
				</Form.Item>																   
			</Form>
	    </div>
	  );
	};
}

export default BancoCreate

