import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  AsyncStorage,
  Image,
  Button,
  TouchableOpacity
} from "react-native";

const fetch = require("node-fetch");


class OrderView extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
      console.log(this.props.buyerInfo);
      console.log(this.props.orderInfo);
  }

  render() {
    const { navigation } = this.props;



    return (
      <View style={{flex:1}}>     
          <View style={{marginBottom:40, padding:20, borderBottomColor:'#dfe6e9', borderBottomWidth:2}}>       
            <Text style={{fontSize:25, fontWeight:'bold'}}>Order Request</Text>
          </View>

          <View style={{marginBottom:40, padding:20, borderBottomColor:'#dfe6e9', borderBottomWidth:2}}>       
            <Text style={{fontSize:22, fontWeight:'bold'}}></Text>
          </View>    
      </View>
    );
  }
}


export default OrderView;