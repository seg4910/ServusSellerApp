import React, { Component } from "react";
import {
  Text,
  View,
  Button,
  TouchableOpacity
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

class AccountView extends Component {
    constructor(props) {
        super(props);
        this.state = {
          edit: false,
          photo: null
        }
    };

    handleChoosePhoto = () => {}

    editAccountInfo = () => {
      this.props.navigation.navigate("EditAccountInfo");   
    }

    changePassword = () => {
      this.props.navigation.navigate("ChangePassword");   
    }    

  render() {

    const { photo } = this.state;
    return (
      <View style={{flex:1}}>
          <View style={{marginBottom:40, padding:20, borderBottomColor:'#dfe6e9', borderBottomWidth:2}}>       
            <Text style={{fontSize:25, fontWeight:'bold'}}>{this.props.name}</Text>
            <Text style={{color:'#7f8c8d'}}>{this.props.phone}</Text>
            <Text style={{color:'#7f8c8d'}}>{this.props.email}</Text>
          </View>

          <TouchableOpacity
                  style={{borderBottomWidth:1,borderBottomColor:'#dfe6e9',padding:20, flexDirection:'row'}}
                  onPress={() => this.editAccountInfo()}>
                  <View style={{flexDirection:'row', flex:1, marginLeft:15}}>
                    <Icon style={{alignSelf:'center'}} name="edit" size={23} />                  
                    <Text style={{fontSize:20,paddingLeft:20}}>Edit Account</Text>
                  </View>
                  <Icon style={{alignSelf:'center', paddingRight:20}} name="chevron-right" size={18} />                  
          </TouchableOpacity>     

          <TouchableOpacity
                  style={{borderBottomWidth:1,borderBottomColor:'#dfe6e9',padding:20, flexDirection:'row'}}
                  onPress={() => this.changePassword()}>
                  <View style={{flexDirection:'row', flex:1, marginLeft:17}}>
                    <Icon style={{alignSelf:'center'}} name="unlock-alt" size={23} />                  
                    <Text style={{fontSize:20,paddingLeft:20}}>Change Password</Text>
                  </View>
                  <Icon style={{alignSelf:'center', paddingRight:20}} name="chevron-right" size={18} />                  
          </TouchableOpacity>   

          <TouchableOpacity
                  style={{borderBottomWidth:1,borderBottomColor:'#dfe6e9',padding:20, flexDirection:'row'}}
                  onPress={this.props.paymentInfo}>
                  <View style={{flexDirection:'row', flex:1, marginLeft:12}}>
                    <Icon style={{alignSelf:'center'}} name="credit-card" size={23} />                  
                    <Text style={{fontSize:20,paddingLeft:20}}>Payment Info</Text>
                  </View>
                  <Icon style={{alignSelf:'center', paddingRight:20}} name="chevron-right" size={18} />                  
          </TouchableOpacity>  

          <TouchableOpacity
                  style={{borderBottomWidth:1,borderBottomColor:'#dfe6e9',padding:20, flexDirection:'row'}}
                  onPress={this.handleChoosePhoto}>
                  <View style={{flexDirection:'row', flex:1, marginLeft:17}}>
                    <Icon style={{alignSelf:'center'}} name="user" size={23} />                  
                    <Text style={{fontSize:20,paddingLeft:20}}>Account Photo</Text>
                  </View>
                  <Icon style={{alignSelf:'center', paddingRight:20}} name="chevron-right" size={18} />                  
          </TouchableOpacity>      
      </View>
    );
  }
}

const st = require("../../../styles/style.js");
export default AccountView;
