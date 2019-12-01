import React, { Component } from "react";
import {
  TextInput,
  Picker,
  Text,
  View,
  Button,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Image,
  AsyncStorage
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import ImagePicker from 'react-native-image-picker';
import firebase from 'react-native-firebase';
const screenWidth = Dimensions.get('screen').width;


class CreateServiceView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      serviceName: "",
      serviceCategory: "LM",
      serviceDescription: "",
      city: "",
      priceHr: 0,
      isFocused: false
    }
  };

  createService = () => {
    const {
      serviceName,
      serviceCategory,
      serviceDescription,
      city,
      minPrice,
      maxPrice,
      priceHr,
    } = this.state;

    AsyncStorage.getItem('userId', (err, id) => {
      fetch(
        `http://localhost:8080/api/getAccountInfo/?type=sellers&id=${id}`
      )
        .then(response => response.json())
        .then(responseJson => {
          fetch(
            `http://localhost:8080/api/createService/?sellerId=${id}&sellerName=${responseJson.name}&serviceName=${serviceName}&serviceCategory=${serviceCategory}&serviceDescription=${serviceDescription}&locationId=${responseJson.locationId}&minPrice=${minPrice}&maxPrice=${maxPrice}&priceHr=${priceHr}`
          )
            .then(response => response.json())
            .then(responseJson => {
              this.state.photo ? this.uploadImage(responseJson.serviceId) : this.props.loadAndReturn();
              
            })
            .catch(error => {
              console.error(error);
            });
        })
    });
  }

  handleChoosePhoto = () => {
    const options = {};
    ImagePicker.showImagePicker(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        if (response.uri) {
          var imgPath = ('file://' + response.path).toString();
          const imgUri = response.uri.toString();

          Image.getSize(imgUri, (width, height) => {
            const scaleFactor = width / screenWidth;
            const imageHeight = height / scaleFactor;
            this.setState({
              photo: {
                image: imgUri,
                path: imgPath,
                imageHeight: imageHeight,
                imageWidth: width,
              }
            });
          });
        }
      }
    });
  };

  uploadImage = (serviceId) => {
    const fileName = `service_${serviceId}`;
    const imgRef = firebase.storage().ref('images').child('/services').child(fileName);
    try {
      imgRef.putFile(this.state.photo.path).then((file) => {
        imgRef.getDownloadURL().then((downloadUrl) => {
          fetch('http://localhost:8080/api/editField', {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              type: "services",
              userId: serviceId,
              fieldType: "photo",
              fieldValue: downloadUrl,
            }),
          }).then(() => {
            this.props.loadAndReturn();
          });
        })
      });
    } catch {
      // something going wrong here, error being thrown but upload works fine
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
        <View style={{ flex: 1 }}>
          <View style={{ alignItems: "center", }}>
            {
              this.state.photo ?
                <Image
                  source={{ uri: this.state.photo.image }}
                  style={{
                    padding: 10,
                    height: this.state.photo.imageHeight / 2,
                    width: this.state.photo.imageWidth / 2,
                  }}
                />
                : null
            }
          </View>
          <View style={{
            marginTop: 30, marginLeft: 30, marginRight: 30,
            marginBottom: 30
          }}>
            <Text style={{ fontSize: 20 }}>Service Name </Text>
            <TextInput
              style={{ fontSize: 17, height: 40, paddingLeft: 5 }}
              type="text"
              selectionColor={"#1D8ECE"}
              underlineColorAndroid={isFocused ? "#1D8ECE" : 'lightgrey'}
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
              <Picker.Item label="Lawn Services" value="LM" />
              <Picker.Item label="Handyman Services" value="HM" />
              <Picker.Item label="Snow Removal" value="SR" />
              <Picker.Item label="Cleaning Services" value="CL" />              
            </Picker>
          </View>
          <View style={{ marginLeft: 30, marginRight: 30, marginBottom: 30 }}>
            <Text style={{ fontSize: 20 }}>Price/hr ($) </Text>
            <TextInput
              style={{ fontSize: 17, height: 40, paddingLeft: 5 }}
              type="number"
              selectionColor={"#1D8ECE"}
              underlineColorAndroid={isFocused ? "#1D8ECE" : 'lightgrey'}
              onChangeText={num => this.setState({ priceHr: num })}
              onFocus={this.handleFocus}
              onBlur={this.handleBlur}
              keyboardType="numeric"
            />
          </View>
          <View style={{ marginLeft: 30, marginRight: 30, marginBottom: 30 }}>
            <Text style={{ fontSize: 20 }}>Service Description </Text>
            <TextInput
              style={{ fontSize: 17, height: 40, paddingLeft: 5 }}
              type="text"
              selectionColor="#1D8ECE"
              underlineColorAndroid={isFocused ? "#1D8ECE" : 'lightgrey'}
              onChangeText={text => this.setState({ serviceDescription: text })}
              onFocus={this.handleFocus}
              onBlur={this.handleBlur}
              placeholder="Add some details about your service"
            />
          </View>

          <View style={{ marginLeft: 80, marginRight: 80, marginBottom: 30 }}>
            <TouchableOpacity
              style={st.btnUpload}
              onPress={() => this.handleChoosePhoto()}>
              <Icon name="upload" size={32} color="#1D8ECE" style={{ paddingTop: 5, paddingLeft: 5, paddingRight: 20 }} />
              <Text style={st.btnText1}>Upload photo</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={{ justifyContent:'flex-end', marginLeft: 30, marginRight: 30, marginBottom: 20 }}>
          <TouchableOpacity
            style={st.btnPrimary}
            onPress={() => this.createService(this.state)}>
            <Text style={st.btnText}>CREATE SERVICE</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );

  }
}

const st = require("../../../styles/style.js");

export default CreateServiceView;
