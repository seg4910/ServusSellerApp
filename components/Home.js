import React, { Component } from "react";
import { View, Text, ScrollView, AsyncStorage } from "react-native";
import HomeView from './views/appViews/HomeView.js';

class Home extends Component {
    constructor(props) {
      super(props);
      this.state = {
        sellerOrders: null,
        peding: [],
        upcoming: [],
        past: []
      }
    };

    componentDidMount() {
      AsyncStorage.getItem('userId', (err, result) => {        
        fetch(`http://localhost:8080/api/getSellerOrders?id=${result}`)
        .then(response => response.json())
        .then(responseJson => {
            this.setState({sellerOrders: responseJson.orders});
            //this.categorizeOrders();
        })
        .catch(error => {
            console.error(error);
        });
      });
    }

    getRequests = (status) => {
      if (this.state.sellerOrders) {
        return this.state.sellerOrders.map((order) => {
          console.log(order.status);
          if(order.status == status) {
            return (
              <View elevation={2} style={{padding: 20, height:150, margin: 20, marginBottom:5, borderRadius:8, backgroundColor: '#fff',
              shadowColor:'black',
              shadowOffset: {
                width: 0,
                height: 3
              },
              shadowRadius: 5,
              shadowOpacity: 1.0,
              elevation: 5,
              }}>
                <Text >{order.sellerName}</Text>
              </View>
            );
          }
        })
      }
    }


    render() {

        return (
            <ScrollView style={{}}>
              <Text style={{margin:20,marginBottom:10,fontWeight:'bold', fontSize:25}}>Requests</Text>
              {this.getRequests('PENDING')}
              <Text style={{margin:20,marginBottom:10,fontWeight:'bold', fontSize:25}}>Upcoming Orders</Text>
              {this.getRequests('CONFIRMED')}              
              <Text style={{margin:20,marginBottom:10,fontWeight:'bold', fontSize:25}}>Past Orders</Text>
              {this.getRequests('COMPLETE')}              

            </ScrollView> 
        )
    }
}
      

export default Home;