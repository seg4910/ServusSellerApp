import React, { Component } from "react";
import EditServiceView from "./views/appViews/EditServiceView";
import {
    StyleSheet,
    Text,
    View,
    Image,
    Button,
    TouchableOpacity,
    ScrollView,
    AsyncStorage
} from "react-native";
import LottieView from 'lottie-react-native';

class EditService extends Component {
    constructor(props) {
        super(props);
        this.state = {
            service: null
        }
    }

    componentDidMount() {
        const id = this.props.navigation.getParam("id", "NO-ID");

        AsyncStorage.getItem('userId', (err, result) => {
            fetch(
                `http://localhost:8080/api/getServiceInfo/?id=${id}`
            )
                .then(response => response.json())
                .then(responseJson => {
                    this.setState({
                        service: responseJson.serviceInfo
                    }, function () {
                        if (this.state.service) {
                            console.log(this.state.service);
                            this.setState({
                                serviceName: this.state.service.serviceName,
                                serviceCategory: this.state.service.serviceCategory,
                                servicePrice: this.state.service.priceHr,
                                serviceDescription: this.state.service.serviceDescription
                            })
                        }
                    })
                })
                .catch(error => {
                    console.error(error);
                });
        });
    }

    updateService = (serviceInfo) => {

        // TODO: Get seller name here
        const name = this.props.navigation.getParam("name", "NO-NAME");
        AsyncStorage.getItem('userId', (err, result) => {
            fetch(
                `http://localhost:8080/api/updateService/?serviceId=${serviceInfo.serviceId}&sellerId=${result}&sellerName=${name}&serviceName=${serviceInfo.serviceName}&serviceCategory=${serviceInfo.serviceCategory}&serviceDescription=${serviceInfo.serviceDescription}&priceHr=${serviceInfo.priceHr}`
            )
                .then(response => response.json())
                .then(responseJson => {
                    this.props.navigation.state.params.loadServices()
                    this.props.navigation.navigate('Services')
                })
                .catch(error => {
                    console.error(error);
                });
        });
    }

    render() {
        console.log('STATE  ' + JSON.stringify(this.state.service));
        if (this.state.service) {
            return (
                // enter email (sign in/regsiter)
                <EditServiceView
                    updateService={this.updateService}
                    serviceInfo={this.state.service}
                />
            )
        } else {
            return (
                <View style={{ flex: 1 }}>
                    <LottieView style={{ flex: 1 }} source={require('./../image/loading.json')} autoPlay loop={true} />
                </View>
            )
        }
    }
}
export default EditService;