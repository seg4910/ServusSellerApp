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
    this.setState({servicePreviews: this.props.servicePreviews})
  }

  selectService = (id) => {
    this.props.selectService(id);
  };

  servicePreviewList() {
    if (this.state.servicePreviews) {
      return this.state.servicePreviews.map(data => {
        return (
          <ServiceCard
            id={data.id}
            sellerName={data.sellerName}
            serviceName={data.serviceName}
            serviceDescription={data.serviceDescription}
            priceHr={data.priceHr}
            selectService={this.selectService}
            serviceCat={data.serviceCategory}
          />
        );
      });
    }
  }

  render() {
    const { navigation } = this.props;
    return (
      <ScrollView contentContainerStyle={{flex:1, justifyContent:'center'}}>{this.servicePreviewList()}</ScrollView>
    );
  }
}

const st = require("./../styles/style.js");
export default ServicePreview;