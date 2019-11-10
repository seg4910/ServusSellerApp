import React, { Component } from "react";
import { View, Text, ScrollView, AsyncStorage, TouchableOpacity, RefreshControl } from "react-native";
import HomeView from './views/appViews/HomeView.js';
import Moment from 'moment';
import Icon2 from "react-native-vector-icons/MaterialCommunityIcons";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sellerOrders: null,
      pending: [],
      upcoming: [],
      past: [],
      buyerNames: [],
      buyerPhone: '',
      buyerEmail: '',
      refreshing: false
    }
  };

  componentDidMount() {
    this.retrieveOrderInfo();
  }

  // maybe we can listen for navigation 'goBack' and automatically update?
  _onRefresh = () => {
    this.retrieveOrderInfo();
  }

  retrieveOrderInfo = () => {
    function contains(a, obj) {
      var i = a.length;
      while (i--) {
        if (a[i].buyerId === obj.buyerId && a[i].buyerName === obj.buyerName) {
          return true;
        }
      }
      return false;
    }
    AsyncStorage.getItem('userId', (err, result) => {
      fetch(`http://localhost:8080/api/getSellerOrders?id=${result}`)
        .then(response => response.json())
        .then(responseJson => {
          this.setState({
            sellerOrders: responseJson.orders
          }, () => {
            this.state.sellerOrders && this.state.sellerOrders.map((order) => {
              fetch(`http://localhost:8080/api/getAccountInfo?id=${order.buyerId}&type=users`)
                .then((response) => response.json())
                .then((responseJson) => {
                  const temporay_name = {
                    buyerId: responseJson.id,
                    buyerName: responseJson.name,
                  }
                  const newBuyerNames = contains(this.state.buyerNames, temporay_name) ? this.state.buyerNames : this.state.buyerNames.push(temporay_name);
                  this.setState({
                    buyernames: newBuyerNames,
                  })
                })
                .catch((error) => {
                  console.error(error);
                });
            })
          });
        })
        .catch(error => {
          console.error(error);
        });
    });
  }

  viewOrder(orderId) {
    this.props.navigation.navigate('Order', {
      id: orderId,
      onGoBack: () => this._onRefresh()
    });
  }

  getOrders = (status) => {
    if (this.state.sellerOrders) {
      const currentTime = Moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
  
      return this.state.sellerOrders.map((order) => {

        var timeUntilOrderStart = Moment(currentTime).diff(order.dateScheduled, 'minutes');
        //console.log(timeUntilOrderStart);  

        if (order.size == 'SM') {
          duration = '0-1 Hours'
        } else if (order.size == 'MD') {
          duration = '1-2 Hours'
        } else if (order.size == 'LG') {
          duration = '2-3 Hours'
        }

        if (order.status == status) {
          return (
            <TouchableOpacity onPress={() => this.viewOrder(order.id)} key={order.id} elevation={2} style={{
              padding: 20, height: 150, margin: 20, marginBottom: 5, borderRadius: 8, backgroundColor: '#fff',
              shadowColor: 'black',
              shadowOffset: {
                width: 0,
                height: 3
              },
              shadowRadius: 5,
              shadowOpacity: 1.0,
              elevation: 5,
            }}>
              <View style={{ flexDirection: 'row' }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 20 }}>{
                    this.state.buyerNames.map((name) => name.buyerId === order.buyerId ? name.buyerName : "")
                  }</Text>
                  <View style={{ paddingTop: 10, flexDirection: 'row' }}>
                    <Icon2 style={{ paddingRight: 10, color: '#7f8c8d' }} name="clock-outline" size={25} />
                    <Text style={{ fontSize: 16 }}>{duration}</Text>
                  </View>
                  <View style={{ paddingTop: 0, flexDirection: 'row' }}>
                    <Icon2 style={{ paddingRight: 10, color: '#7f8c8d' }} name="map-marker" size={25} />
                    <Text style={{ fontSize: 16 }}>300 Bank Street, Ottawa</Text>
                  </View>

                  {order.status == 'PENDING' && (
                    <Text style={{ marginTop: 10, fontSize: 16, color: 'grey', paddingBottom: 5 }}>{order.status}</Text>
                  )}
                  {order.status == 'ACCEPTED' && (
                    <Text style={{ marginTop: 10, fontSize: 16, color: 'green', paddingBottom: 5 }}>{order.status}</Text>
                  )}
                  {order.status == 'COMPLETE' && (
                    <Text style={{ marginTop: 10, fontSize: 16, color: 'green', paddingBottom: 5 }}>{order.status}</Text>
                  )}

                </View>
                <View style={{ alignItems: 'center' }}>
                  <Text style={{ fontSize: 45, fontWeight: 'bold', color: '#E88D72' }}>{Moment(order.dateScheduled).format('DD')}</Text>
                  <Text style={{ fontSize: 20, color: '#E88D72', marginTop: -13 }}>{Moment(order.dateScheduled).format('MMMM')}</Text>
                  <Text style={{ fontSize: 16, color: '#7f8c8d', paddingTop: 7 }}>{Moment(order.dateScheduled).format('LT')}</Text>
                </View>
              </View>
            </TouchableOpacity>
          );

        } 
      })
    }
  }


  isUndefined = (currentIndex) => {
    return currentIndex == undefined;
  }

  render() {
    console.log(this.state.sellerOrders);
    if (this.state.sellerOrders) {
        return (
            <ScrollView refreshControl={
                <RefreshControl
                    refreshing={this.state.refreshing}
                    onRefresh={this._onRefresh}
                />
            }>
                {this.state.sellerOrders && (
                    <ScrollView style={{marginBottom: 30}}>

                        {!this.getOrders('ACTIVE').every(this.isUndefined) && (
                            <View style={{backgroundColor: '#E88D72', paddingBottom:20}}>
                              <Text style={{ margin: 20, marginBottom: 5, fontWeight: 'bold', fontSize: 25 }}>Active</Text>
                              {this.getOrders('ACTIVE')}
                            </View>    
                          
                        )}

                        <Text style={{ margin: 20, marginBottom: 10, fontWeight: 'bold', fontSize: 25 }}>Upcoming Orders</Text>
                        {this.getOrders('ACCEPTED')}
                        {this.getOrders('ACCEPTED').every(this.isUndefined) && (
                            <Text style={{ marginLeft: 40 }}>You have no upcoming orders</Text>)}
                        
                        <Text style={{ margin: 20, marginBottom: 10, fontWeight: 'bold', fontSize: 25 }}>Requests</Text>
                        {this.getOrders('PENDING')}
                        {this.getOrders('PENDING').every(this.isUndefined) && (
                            <Text style={{ marginLeft: 40 }}>You have no order requests</Text>)}

                        <Text style={{ margin: 20, marginBottom: 10, fontWeight: 'bold', fontSize: 25 }}>Past Orders</Text>
                        {this.getOrders('COMPLETE')}
                        {this.getOrders('COMPLETE').every(this.isUndefined) && (
                            <Text style={{ marginLeft: 40 }}>You have no previous orders</Text>)}
                    </ScrollView>
                )}
            </ScrollView>
        )
    } else {
        return (
            <ScrollView contentContainerStyle={{ flex: 1 }} refreshControl={
                <RefreshControl
                    refreshing={this.state.refreshing}
                    onRefresh={this._onRefresh}
                />
            }>
                <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginBottom: 150 }}>
                    <Icon2 style={{ alignSelf: 'center', color: '#E88D72' }} name="file-alert-outline" size={100} />
                    <Text style={{ fontSize: 22, paddingTop: 15 }}>NO ORDERS</Text>
                    <Text style={{ fontSize: 16, paddingTop: 10 }}>You don't have any orders in your history</Text>
                </View>
            </ScrollView>
        )
    }
  }
}


export default Home;