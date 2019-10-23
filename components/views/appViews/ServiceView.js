import React, { Component } from "react";
import {
  TextInput,
  Picker,
  Text,
  View,
  Button
} from "react-native";

class CreateServiceView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      serviceName: "",
      serviceCategory: "",
      serviceDescription: "",
      city: "",
      minPrice: 0,
      maxPrice: 0,
      priceHr: 0,
    }
  };

  render() {

      return (
      <View style={st.container}>
        <View style={st.serviceContainer}>
          <Text style={st.heading2}>Service Name: </Text>
          <TextInput
            style={st.input2}
            type="text"
            placeholder="Precision Mowing"
            placeholderTextColor={"rgba(255,255,255,0.7)"}
            onChangeText={text => this.setState({ serviceName: text })}
            underlineColorAndroid="transparent"
          />
        </View>
        <View style={st.serviceContainer}>
          <Text style={st.heading2}>Service Category: </Text>
          <Picker
            style={{height:50, width: 200}}
            selectedValue={this.state.serviceCategory}
            onValueChange={(itemValue, itemIndex) =>
              this.setState({serviceCategory: itemValue})}
          >
            <Picker.Item label="Lawn Mowing" value="LM"/>
          </Picker>
        </View>
        <View style={st.serviceContainer}>
          <Text style={st.heading2}>City: </Text>
          <TextInput
            style={st.input2}
            type="text"
            placeholder="Ottawa"
            placeholderTextColor={"rgba(255,255,255,0.7)"}
            onChangeText={text => this.setState({ city: text })}
            underlineColorAndroid="transparent"
          />
        </View>
        <View style={st.serviceContainer}>
          <Text style={st.heading2}>Min. Price ($): </Text>
          <TextInput
            style={st.input2}
            type="number"
            placeholder="20"
            placeholderTextColor={"rgba(255,255,255,0.7)"}
            onChangeText={num => this.setState({ minPrice: num })}
            underlineColorAndroid="transparent"
          />
        </View>
        <View style={st.serviceContainer}>
          <Text style={st.heading2}>Max Price ($): </Text>
          <TextInput
            style={st.input2}
            type="number"
            placeholder="300"
            placeholderTextColor={"rgba(255,255,255,0.7)"}
            onChangeText={num => this.setState({ maxPrice: num })}
            underlineColorAndroid="transparent"
          />
        </View>
        <View style={st.serviceContainer}>
          <Text style={st.heading2}>Price/hr ($): </Text>
          <TextInput
            style={st.input2}
            type="number"
            placeholder="300"
            placeholderTextColor={"rgba(255,255,255,0.7)"}
            onChangeText={num => this.setState({ priceHr: num })}
            underlineColorAndroid="transparent"
          />
        </View>
        <View style={st.serviceContainer}>
          <Text style={st.heading2}>Service Description: </Text>
          <TextInput
            style={st.input2}
            type="text"
            placeholder="My service is awesome"
            placeholderTextColor={"rgba(255,255,255,0.7)"}
            onChangeText={text => this.setState({ serviceDescription: text })}
            underlineColorAndroid="transparent"
          />
        </View>


        <View style={st.container}>
          <Button title='Create Service' onPress={() => this.props.createService(this.state)}/>
        </View>
      </View>
      );
   
  }
}

const st = require("../../../styles/style.js");

export default CreateServiceView;
