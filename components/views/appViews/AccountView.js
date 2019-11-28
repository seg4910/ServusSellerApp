import React, { Component } from "react";
import {
  Text,
  View,
  Button,
  TouchableOpacity,
  ScrollView,
  Image,
  AsyncStorage,
  Dimensions
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import Svg, {
  Path,
  Circle
} from 'react-native-svg';
import ImagePicker from 'react-native-image-picker';
import firebase from 'react-native-firebase';

const WIDTH = Dimensions.get('screen').width;


class AccountView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      edit: false,
      photo: null,
      downloadUrl: null,
      uploading: false,
    }
  };


  savePhotoUrl = () => {
    // fetch post image url
    console.log('SAVING PHOTO' + this.state.downloadUrl);
    AsyncStorage.getItem('userId', (err, result) => {
      fetch('http://localhost:8080/api/editField', {
        method: 'POST',
        headers: {
           Accept: 'application/json',
           'Content-Type': 'application/json',
        },
        body: JSON.stringify({
           type: "sellers",
           userId: result,
           fieldType: "photo",
           fieldValue: this.state.downloadUrl,
        }),
       });
    })
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

          const image ={
            image: response.uri.toString(),
            path: imgPath
          }
          this.uploadImage(image);

        }
      }
    });
  };

  uploadImage = (image) => {
    let fileName = 'seller'+this.props.id+this.props.email;
    this.setState({ uploading: true });

    var imgRef = firebase.storage().ref('images').child('/sellers').child(fileName);
    try {
      imgRef.putFile(image.path).then((file) => {

        imgRef.getDownloadURL().then((downloadURL) => {
          this.setState({downloadUrl: downloadURL});
          this.savePhotoUrl();
        })
      });
    } catch {
      // something going wrong here, error being thrown but upload works fine
    }

  this.setState({uploading: false});
};

  editAccountInfo = () => {
    this.props.navigation.navigate("EditAccountInfo");
  }

  changePassword = () => {
    this.props.navigation.navigate("ChangePassword");
  }

  render() {

    const { photo } = this.state;
    return (
      <ScrollView style={{ flex: 1 }}>

        <Svg height={110} width={WIDTH}>
          <Circle
            cx={WIDTH / 2}
            cy={`-${898 - 90 + 2}`}
            r="898.5"
            fill="#E88D72"
            stroke="#dfe6e9"
            strokeWidth="2"
          />
        </Svg>
        <Image
          source={{ uri: this.props.photo }}
          style={{
            position: 'absolute',
            top: 20,
            left: WIDTH / 2 - 60,
            width: 120,
            height: 120,
            borderRadius: 75,
            borderWidth: 2,
            borderColor: '#E88D72'

          }}
        />

        <View style={{ marginBottom: 40, padding: 20, borderBottomColor: '#dfe6e9', borderBottomWidth: 2 }}>
          <Text style={{ fontSize: 25, fontWeight: 'bold' }}>{this.props.name}</Text>
          <Text style={{ color: '#7f8c8d' }}>{this.props.phone}</Text>
          <Text style={{ color: '#7f8c8d' }}>{this.props.email}</Text>
        </View>

        <TouchableOpacity
          style={{ borderBottomWidth: 1, borderBottomColor: '#dfe6e9', padding: 20, flexDirection: 'row' }}
          onPress={() => this.editAccountInfo()}>
          <View style={{ flexDirection: 'row', flex: 1, marginLeft: 15 }}>
            <Icon style={{ alignSelf: 'center' }} name="edit" size={23} />
            <Text style={{ fontSize: 20, paddingLeft: 20 }}>Edit Account</Text>
          </View>
          <Icon style={{ alignSelf: 'center', paddingRight: 20 }} name="chevron-right" size={18} />
        </TouchableOpacity>

        <TouchableOpacity
          style={{ borderBottomWidth: 1, borderBottomColor: '#dfe6e9', padding: 20, flexDirection: 'row' }}
          onPress={() => this.changePassword()}>
          <View style={{ flexDirection: 'row', flex: 1, marginLeft: 17 }}>
            <Icon style={{ alignSelf: 'center' }} name="unlock-alt" size={23} />
            <Text style={{ fontSize: 20, paddingLeft: 20 }}>Change Password</Text>
          </View>
          <Icon style={{ alignSelf: 'center', paddingRight: 20 }} name="chevron-right" size={18} />
        </TouchableOpacity>

        <TouchableOpacity
          style={{ borderBottomWidth: 1, borderBottomColor: '#dfe6e9', padding: 20, flexDirection: 'row' }}
          onPress={this.props.paymentInfo}>
          <View style={{ flexDirection: 'row', flex: 1, marginLeft: 12 }}>
            <Icon style={{ alignSelf: 'center' }} name="credit-card" size={23} />
            <Text style={{ fontSize: 20, paddingLeft: 20 }}>Payment Info</Text>
          </View>
          <Icon style={{ alignSelf: 'center', paddingRight: 20 }} name="chevron-right" size={18} />
        </TouchableOpacity>

        <TouchableOpacity
          style={{ borderBottomWidth: 1, borderBottomColor: '#dfe6e9', padding: 20, flexDirection: 'row' }}
          onPress={this.handleChoosePhoto}>
          <View style={{ flexDirection: 'row', flex: 1, marginLeft: 17 }}>
            <Icon style={{ alignSelf: 'center' }} name="user" size={23} />
            <Text style={{ fontSize: 20, paddingLeft: 20 }}>Account Photo</Text>
          </View>
          <Icon style={{ alignSelf: 'center', paddingRight: 20 }} name="chevron-right" size={18} />
        </TouchableOpacity>
      </ScrollView>
    );
  }
}

const st = require("../../../styles/style.js");
export default AccountView;
