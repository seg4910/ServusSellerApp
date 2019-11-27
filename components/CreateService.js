import React, { Component } from "react";
import CreateServiceView from "./views/appViews/CreateServiceView.js";

class CreateService extends Component {
    constructor(props) {
        super(props);
    }
    createService = (serviceInfo) => {

        // TODO: Get seller name here
        const name = this.props.navigation.getParam("name","NO-NAME");
        AsyncStorage.getItem('userId', (err, result) => {
            fetch(
                `http://localhost:8080/api/createService/?sellerId=${result}&sellerName=${name}&serviceName=${serviceInfo.serviceName}&serviceCategory=${serviceInfo.serviceCategory}&serviceDescription=${serviceInfo.serviceDescription}&city=${serviceInfo.city}&minPrice=${serviceInfo.minPrice}&maxPrice=${serviceInfo.maxPrice}&priceHr=${serviceInfo.priceHr}`
                )
                .then(response => response.json())
                .then(responseJson => {
                alert("Service created!")
                this.props.navigation.navigate('Home')
                })
                .catch(error => {
                console.error(error);
                });
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