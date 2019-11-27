import React, { Component } from "react";
import ServicePreview from "./ServicePreview.js";
import {
    TextInput,
    Picker,
    Text,
    View,
    Button,
    ScrollView,
    TouchableOpacity,
    AsyncStorage
} from "react-native";
import LottieView from 'lottie-react-native';
import Icon2 from "react-native-vector-icons/MaterialCommunityIcons";

class Services extends Component {
    constructor(props) {
        super(props);
        this.state = {
            servicePreviews: undefined
        }
    }

    componentDidMount() {
        this.loadServices();
    }

    loadServices = () => {
        this.setState({servicePreviews:undefined});
        AsyncStorage.getItem('userId', (err, result) => {
            fetch(`http://localhost:8080/api/getSellerServicePreviews?id=${result}`)
                .then(response => response.json())
                .then(responseJson => {
                    this.setState(
                        {
                            servicePreviews: responseJson.servicePreviews
                        });
                })
                .catch(error => {
                    console.error(error);
                });
        });
    }

    createService = () => {
        this.props.navigation.navigate('CreateService', {
            loadServices: this.loadServices
        });
    }

    selectService = (id) => {
        if (id !== 0) {
            this.props.navigation.navigate("Service", { selectedService: id });
        }
    };

    render() {
        if (this.state.servicePreviews !== undefined) {
            return (
                <View style={{ flex: 1, justifyContent: 'center', alignItems:'center' }}>
                    {this.state.servicePreviews && (
                        <ScrollView contentContainerStyle={{}}>
                            <ServicePreview
                                style={{ }}
                                navigation={this.props.navigation}
                                selectService={this.selectService}
                                servicePreviews={this.state.servicePreviews}
                            />
                        </ScrollView>
                    )}
                    {!this.state.servicePreviews && (
                        <View style={{ flex: 1, justifyContent: 'center' }}>
                            <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginBottom: 150 }}>
                                <Icon2 style={{ alignSelf: 'center', color: '#E88D72' }} name="file-alert-outline" size={100} />
                                <Text style={{ fontSize: 22, paddingTop: 15 }}>NO SERVICES</Text>
                                <Text style={{ fontSize: 16, paddingTop: 10 }}>You don't have any services</Text>
                            </View>
                        </View>
                    )}

                    <View style={{ justifyContent: 'flex-end', marginBottom: 20, alignItems: 'center' }}>
                        <TouchableOpacity
                            style={st.btn}
                            onPress={() => this.createService()}>
                            <Text style={st.btnText}>CREATE SERVICE</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )
        } else {
            return (
                <View style={{ flex: 1 }}>
                    <LottieView style={{ flex: 1 }} source={require('../image/loading.json')} autoPlay loop={true} />
                </View>
            )
        }
    }
}
const st = require("../styles/style.js");


export default Services;