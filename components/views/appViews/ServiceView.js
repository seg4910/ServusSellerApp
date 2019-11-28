import React, { Component } from "react";
import {
  TextInput,
  Picker,
  Text,
  View,
  Button,
  Image,
  AsyncStorage,
  Dimensions
} from "react-native";
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
      photo: null,
      minPrice: 0,
      maxPrice: 0,
      priceHr: 0,
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
            `http://localhost:8080/api/createService/?sellerId=${id}&sellerName=${responseJson.name}&serviceName=${serviceName}&serviceCategory=${serviceCategory}&serviceDescription=${serviceDescription}&city=${city}&minPrice=${minPrice}&maxPrice=${maxPrice}&priceHr=${priceHr}`
            )
            .then(response => response.json())
            .then(responseJson => {
                alert("Service created!");
                this.state.photo ? this.uploadImage(responseJson.serviceId) : null;
                this.props.navigation.navigate('Home');
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
             });
        })
      });
    } catch {
      // something going wrong here, error being thrown but upload works fine
    }
  };
  render() {
      return (
      <View style={st.container}>
        <View style={{ alignItems: "center", }}>
          {
            this.state.photo ?
              <Image
                source={{ uri: this.state.photo.image }}
                style={{
                  padding:10,
                  height: this.state.photo.imageHeight / 2,
                  width: this.state.photo.imageWidth / 2,
                }}
                  />
            : null
          }
        </View>
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
          <Button title='Upload photo' onPress={() => this.handleChoosePhoto()}/>
        </View>

        <View style={st.container}>
          <Button title='Create Service' onPress={() => this.createService()}/>
        </View>
      </View>
      );
   
  }
}

const st = require("../../../styles/style.js");

export default CreateServiceView;