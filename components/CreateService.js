import React, { Component } from "react";
import CreateServiceView from "./views/appViews/ServiceView.js";

class CreateService extends Component {
    constructor(props) {
        super(props);
    }
    createService = (serviceInfo) => {
        const id = this.props.navigation.getParam("id","NO-ID");
        const name = this.props.navigation.getParam("name","NO-NAME");
        fetch(
            `http://localhost:8080/api/createService/?sellerId=${id}&sellerName=${name}&serviceName=${serviceInfo.serviceName}&serviceCategory=${serviceInfo.serviceCategory}&serviceDescription=${serviceInfo.serviceDescription}&city=${serviceInfo.city}&minPrice=${serviceInfo.minPrice}&maxPrice=${serviceInfo.maxPrice}&priceHr=${serviceInfo.priceHr}`
            )
            .then(response => response.json())
            .then(responseJson => {
              alert("Service created!")
              this.props.navigation.navigate('Home')
            })
            .catch(error => {
              console.error(error);
            });
          }
    render() {
        return (
            // enter email (sign in/regsiter)
            <CreateServiceView
                createService = {this.createService}
            />
        )
    }
}
export default CreateService;