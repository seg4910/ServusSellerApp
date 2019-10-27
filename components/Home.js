import React, { Component } from "react";
import { View, Text, ScrollView, AsyncStorage } from "react-native";
import HomeView from './views/appViews/HomeView.js';

class Home extends Component {
    constructor(props) {
      super(props);
      this.state = {
        sellerOrders: null,
        pending: [],
        upcoming: [],
        past: [],
        buyerName: '',
        buyerPhone: '',
        buyerEmail: ''
      }
    };

    componentDidMount() {
      AsyncStorage.getItem('userId', (err, result) => {        
        fetch(`http://localhost:8080/api/getSellerOrders?id=${result}`)
        .then(response => response.json())
        .then(responseJson => {
            this.setState({
              sellerOrders: responseJson.orders,
            });
            this.state.pending = this.getRequests('PENDING');
            this.state.upcoming = this.getRequests('CONFIRMED');
            this.state.past = this.getRequests('COMPLETED');
        })
        .catch(error => {
            console.error(error);
        });
      });
    }

    getOrderCard = (order) => {
      console.log('BUYER NAME: ' + this.state.buyerName);
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
          <Text>{order.sellerName} Buyer: {this.state.buyerName}</Text>
        </View>
      );
    }
    
    getRequests = (status) => {
      if (this.state.sellerOrders) {
        return this.state.sellerOrders.map((order) => {

            if(order.status == status) {
              fetch(`http://localhost:8080/api/getAccountInfo?id=${order.buyerId}&type=users`)
              .then(response => response.json())
              .then(responseJson => {
                buyerName = responseJson.name;
                  this.setState({
                    buyerName: responseJson.name,
                    buyerPhone: responseJson.phone,
                    buyerEmail: responseJson.email
                  });
                  console.log(this.state.buyerName);
              })
              .catch(error => {
                  console.error(error);
              });   

              return this.getOrderCard(order);
            }
        })
      }
    }

    render() {
        return (
            <ScrollView style={{}}>
              <Text style={{margin:20,marginBottom:10,fontWeight:'bold', fontSize:25}}>Requests</Text>
              {this.state.pending.map((order) => {
                return order;
              })}
              <Text style={{margin:20,marginBottom:10,fontWeight:'bold', fontSize:25}}>Upcoming Orders</Text>
              <Text style={{margin:20,marginBottom:10,fontWeight:'bold', fontSize:25}}>Past Orders</Text>

            </ScrollView> 
        )
    }
}
      

export default Home;