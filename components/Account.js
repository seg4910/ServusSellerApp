import React, { Component } from "react";
import { View, Text, TextInput, Button, Image, AsyncStorage } from "react-native";
import AccountView from "./views/appViews/AccountView.js";
//import ImagePicker from 'react-native-image-picker';
const fetch = require("node-fetch");

class Account extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      email: '',
      password: '',
      edit: false,
      photo: ''
    }
  };

  componentDidMount() {
    this.loadData();
  }

  loadData = () => {
    AsyncStorage.getItem('userId', (err, result) => {

      fetch(`http://localhost:8080/api/getAccountInfo/?type=${"sellers"}&id=${result}`)
        .then((response) => response.json())
        .then((responseJson) => {
          this.setState({
            id: responseJson.id,
            name: responseJson.name,
            email: responseJson.email,
            password: responseJson.password,
            phone: responseJson.phone,
            photo: responseJson.photo
          });
        })
        .catch((error) => {
          console.error(error);
        });

    });
  }

  handleChoosePhoto = () => {
    const options = {
      noData: true,
    }
    /*         ImagePicker.launchImageLibrary(options, response => {
              if (response.uri) {
                this.setState({ photo: response })
              }
            }) */
  }

  editAccountInfo = () => {
    var style;
    this.setState({
      edit: true,
    });
  }

  paymentInfo = () => {
    this.props.navigation.navigate('PaymentInfo');
  }

  render() {
    const { navigation } = this.props;
    var style;

    if (this.state.edit) {
      style = {
        display: 'none'
      }
    } else {
      style = {
        display: 'flex'
      }
    }

    const { photo } = this.state;
    return (
      <AccountView
        navigation={this.props.navigation}
        paymentInfo={this.paymentInfo}
        editAccountInfo={this.editAccountInfo}
        handleChoosePhoto={this.handleChoosePhoto}
        id={this.state.id}
        name={this.state.name}
        email={this.state.email}
        phone={this.state.phone}
        photo={this.state.photo}
        loadData={this.loadData}
      />
    );
  }
}

const st = require("../styles/style.js");
export default Account;