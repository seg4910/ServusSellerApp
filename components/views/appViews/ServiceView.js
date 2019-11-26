import React, { Component } from "react";
import {
  TextInput,
  Picker,
  Text,
  View,
  Button, 
  ScrollView, 
  TouchableOpacity
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

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
      isFocused: false
    }
  };

  handleFocus = event => {
    this.setState({ isFocused: true });
    if (this.props.onFocus) {
      this.props.onFocus(event);
    }
  };

  handleBlur = event => {
    this.setState({ isFocused: false });
    if (this.props.onBlur) {
      this.props.onBlur(event);
    }
  };

  render() {
    const { isFocused } = this.state;
    const { onFocus, onBlur } = this.props;
    return (
      <ScrollView style={{ flex: 1 }}>
        <View style={{
          marginTop: 30, marginLeft: 30, marginRight: 30,
          marginBottom: 30
        }}>
          <Text style={{ fontSize: 20 }}>Service Name </Text>
          <TextInput
            style={{ fontSize: 17, height: 40, paddingLeft: 5 }}
            type="text"
            selectionColor={'teal'}
            underlineColorAndroid={isFocused ? 'teal' : 'lightgrey'}
            onChangeText={text => this.setState({ serviceName: text })}
            onFocus={this.handleFocus}
            onBlur={this.handleBlur}
          />
        </View>
        <View style={{ marginLeft: 30, marginRight: 30, marginBottom: 30 }}>
          <Text style={{ fontSize: 20 }}>Service Category </Text>
          <Picker
            style={{ height: 50, width: 350 }}
            selectedValue={this.state.serviceCategory}
            onValueChange={(itemValue, itemIndex) =>
              this.setState({ serviceCategory: itemValue })}
          >
            <Picker.Item label="Lawn Mowing" value="LM" />
            <Picker.Item label="Handiman" value="HM" />
            <Picker.Item label="Snow Shoveling" value="SS" />
          </Picker>
        </View>
        <View style={{ marginLeft: 30, marginRight: 30, marginBottom: 30 }}>
          <Text style={{ fontSize: 20 }}>City </Text>
          <TextInput
            style={{ fontSize: 17, height: 40, paddingLeft: 5 }}
            type="text"
            selectionColor={'teal'}
            underlineColorAndroid={isFocused ? 'teal' : 'lightgrey'}
            onChangeText={text => this.setState({ city: text })}
            onFocus={this.handleFocus}
            onBlur={this.handleBlur}
          />
        </View>
        <View style={{ marginLeft: 30, marginRight: 30, marginBottom: 30 }}>
          <Text style={{ fontSize: 20 }}>Price/hr ($) </Text>
          <TextInput
            style={{ fontSize: 17, height: 40, paddingLeft: 5 }}
            type="number"
            selectionColor={'teal'}
            underlineColorAndroid={isFocused ? 'teal' : 'lightgrey'}
            onChangeText={num => this.setState({ priceHr: num })}
            onFocus={this.handleFocus}
            onBlur={this.handleBlur}
          />
        </View>
        <View style={{ marginLeft: 30, marginRight: 30, marginBottom: 30 }}>
          <Text style={{ fontSize: 20 }}>Service Description </Text>
          <TextInput
            style={{ fontSize: 17, height: 40, paddingLeft: 5 }}
            type="text"
            selectionColor={'teal'}
            underlineColorAndroid={isFocused ? 'teal' : 'lightgrey'}
            onChangeText={text => this.setState({ serviceDescription: text })}
            onFocus={this.handleFocus}
            onBlur={this.handleBlur}
          />
        </View>
        <View style={{ marginLeft: 30, marginRight: 40 }}>
          <TouchableOpacity
            style={st.btn}
            onPress={() => this.props.createService(this.state)}>
            <Text style={st.btnText}>CREATE SERVICE</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );

  }
}

const st = require("../../../styles/style.js");

export default CreateServiceView;
