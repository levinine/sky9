import React, { Component } from 'react'
import {API} from 'aws-amplify'
export default class UpdateAccountView extends React.Component {
   constructor(props){
       super(props);
       this.state = {
           account:{},
           email: "",
           name: "",
           status: "",
           IAMUsers: "",
           id: ""
       }
       this.updateAccount = this.updateAccount.bind(this);  
       this.handleChange = this.handleChange.bind(this);
       this.handleSubmit = this.handleSubmit.bind(this);
   }

   handleChange(event){
       console.log(event.target);
       this.setState({
            [event.target.id]:event.target.value
       })
   }

   handleSubmit(event) {
       event.preventDefault();
       this.updateAccount();
   }
    getAccount = async(id) => {
        const account = await API.get("accounts",  "/accounts/c8e455a0-053e-11ea-a6fc-9d92540b60af")
        console.log(account);
         this.setState({
            id: account.Item.id,
            account: account.Item,
            name: account.Item.name,
            email: account.Item.email,
            status: account.Item.status,
            IAMUsers: account.Item.IAMUsers,
         })    
         
   }
   componentDidMount(){
       this.getAccount();
   }
   updateAccount = async() => {
     try{
       let apiName ='accounts';
       let path = '/accounts/c8e455a0-053e-11ea-a6fc-9d92540b60af';
       let account = {
           body:{
               IAMUsers: this.state.IAMUsers,
               email: this.state.email,
               name: this.state.name,
               status: this.state.status,
               id:this.state.id
           }
            
       }
       console.log(account);
      const up =  await API.put(apiName, path, account)
      console.log(up);
     } catch(error){
         console.log(error);
     } 
   }

   isDisabled = () => {
       
    if (this.state.account.name === this.state.name &&
        this.state.account.email === this.state.email &&
        this.state.account.status === this.state.status &&
        this.state.account.IAMUsers === this.state.IAMUsers) 
    {
        return false;
    }
    return true;
   }

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
              <label>
                  Email:
                  <input type="text" value={this.state.email} id="email" onChange={this.handleChange}/>
              </label>
              <label>
                  Name:
                  <input type="text" value={this.state.name} id="name" onChange={this.handleChange}/>
              </label>
              <label>
                  Status:
                  <input type="text" value={this.state.status} id="status" onChange={this.handleChange}/>
              </label>
              <label>
                  IAM Users:
                  <input type="text" value={this.state.IAMUsers} id="IAMUsers" onChange={this.handleChange}/>
              </label>
              <button type="submit" disabled={!this.isDisabled()}> submit </button>  
            </form>
        )
    }
}
