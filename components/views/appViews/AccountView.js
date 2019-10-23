import React, { Component } from "react";
import {
  Text,
  View,
  Button
} from "react-native";
class AccountView extends Component {
    constructor(props) {
        super(props);
        this.state = {
          edit: false,
          photo: null
        }
    };

    goToEditAccountInfo = () => {
      this.props.navigation.navigate("EditAccountInfo");   
    }
    goToCreateService = (id, name) => {
      this.props.navigation.navigate("CreateService", {
        id: id,
        name: name,
      });   
    }

  render() {

    const { photo } = this.state;
    return (
        <View style={st.container}>
            <Text style={st.heading1}>Your Account</Text>
            <Text style={st.heading2}>{this.props.name}</Text>
            <Text style={st.heading2}>{this.props.email}</Text>
            <Button title='Edit Info' onPress={() => this.goToEditAccountInfo()}/>
            <Button title='Payment Info' onPress={this.props.paymentInfo}/>
            <Button title='Create service' onPress={() => this.goToCreateService(this.props.id, this.props.name)}/>

            {photo && (
            <Image
            source={{ uri: photo.uri }}
            style={{ width: 300, height: 300 }}
            />
            )} 
            <Button title="Choose Photo" onPress={this.props.handleChoosePhoto} />  
        </View>
    );
  }
}

const st = require("../../../styles/style.js");
export default AccountView;
