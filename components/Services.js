import React, { Component } from "react";
import ServicePreview from "./ServicePreview.js";
import {
    TextInput,
    Picker,
    Text,
    View,
    Button,
    ScrollView,
    TouchableOpacity
} from "react-native";

class Services extends Component {
    constructor(props) {
        super(props);
    }

    createService = () => {
        this.props.navigation.navigate('CreateService');
    }

    selectService = (id) => {
        if (id !== 0) {
          this.props.navigation.navigate("Service", {selectedService:id});
        }
      };    

    render() {
        return (
            <View style={{ flex: 1 }}>
                <ScrollView style={{ flex:1 }}>
                    <ServicePreview
                        style={{ flexDirection: "row" }}
                        navigation={this.props.navigation}
                        selectService={this.selectService} />
                </ScrollView>

                <View style={{justifyContent:'flex-end', marginBottom:20, alignItems:'center'}}>
                     <TouchableOpacity
                        style={st.btn}
                        onPress={() => this.createService()}>
                        <Text style={st.btnText}>CREATE SERVICE</Text>
                    </TouchableOpacity> 
                </View>
            </View>
        )
    }
}
const st = require("../styles/style.js");


export default Services;