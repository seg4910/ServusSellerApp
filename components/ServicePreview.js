import React, { Component } from "react";
import { View, Text, ScrollView, AsyncStorage } from "react-native";
import { Button, Card } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome";
import ServiceCard from './views/appViews/ServiceCard.js';

const fetch = require("node-fetch");

class ServicePreview extends Component {
    constructor(props) {
      super(props);
      this.state = {
        servicePreviews: [],
        username: "",
        selectedService: 0
      };
    };

    componentDidMount() {
        AsyncStorage.getItem('userId', (err, result) => {        
            fetch(`http://localhost:8080/api/getSellerServicePreviews?id=${result}`)
            .then(response => response.json())
            .then(responseJson => {
                console.log(JSON.stringify(responseJson));
                this.setState(
                {
                    servicePreviews: responseJson.servicePreviews
                },
                function() {
                    if (this.state.servicePreviews) {
                    var serviceCount = Object.keys(this.state.servicePreviews);
                    } else {
                    //navigate to Create Account
                    alert("Something went wrong");
                    }
                }
                );
            })
            .catch(error => {
                console.error(error);
            });
        });
    }    

      selectService = (id) => {
        this.props.selectService(id);
      };
    
      servicePreviewList() {
        return this.state.servicePreviews.map(data => {
          return (
            <ServiceCard 
            id = {data.id}
            sellerName = {data.sellerName}
            serviceName = {data.serviceName}
            serviceDescription = {data.serviceDescription}
            priceHr = {data.priceHr}
            selectService = {this.selectService}
            serviceCat = {data.serviceCategory}
         />
          );
        });
      }
    
      render() {
        const { navigation } = this.props;
        return (
          <ScrollView contentContainerStyle={st.container}>{this.servicePreviewList()}</ScrollView>
        );
      }
}
      
const st = require("./../styles/style.js");
export default ServicePreview;