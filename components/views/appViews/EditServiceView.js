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

class EditServiceView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      serviceId: this.props.serviceInfo[0].id,
      serviceName: this.props.serviceInfo[0].serviceName,
      serviceCategory: this.props.serviceInfo[0].serviceCategory,
      serviceDescription: this.props.serviceInfo[0].serviceDescription,
      city: this.props.serviceInfo[0].city,
      priceHr: this.props.serviceInfo[0].priceHr,
      isFocused: false,
      sellerName: this.props.serviceInfo[0].sellerName
    }

  };

  componentDidMount() {
  }

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
            value={this.state.serviceName}
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
            <Picker.Item label="Handyman" value="HM" />
            <Picker.Item label="Snow Shoveling" value="SS" />
          </Picker>
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
            value={this.state.priceHr.toString()}
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
            value={this.state.serviceDescription}
          />
        </View>
        <View style={{ marginLeft: 30, marginRight: 30 }}>
          <TouchableOpacity
            style={st.btnPrimary}
            onPress={() => this.props.updateService(this.state)}>
            <Text style={st.btnText}>Update Service</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );

  }
}

const st = require("../../../styles/style.js");

export default EditServiceView;
