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
		axios.post(baseURL,{
  		variables:{
  			name:this.state.formValue.name,
  			country:this.state.formValue.country,
  		},
  		query:`
			mutation createNewBank($name: String!, $country: ID!){
  			createBank(name: $name, country: $country) {
    			id,
    			name,
    			country{
     				id,
      			name,
      			states
      		currency{
        		id,
        		name,
        		short
      	},
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
			this.props.history.push('/bancos');
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
	  return (
	  	<div style={{padding: '30px' }}>
	      <h3>Tú Seccion de registro de bancos asociados</h3>	  
			<Link to='/bancos'>Regresar <Icon type="undo" /></Link>			
			<Form layout='vertical' onSubmit={this.handleSubmit}>
				<Form.Item label="Nombre del banco">
					<Input name="name" value={this.state.formValue.name} onChange={this.handleChange}/>
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
					<Button type="primary" htmlType="submit">Registrar nuevo banco</Button>
				</Form.Item>																   
			</Form>
	    </div>
	  );
	};
}

export default BancoCreate

