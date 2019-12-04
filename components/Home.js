import React, { Component } from "react";
import { View, Text, ScrollView, AsyncStorage, TouchableOpacity, RefreshControl, Dimensions } from "react-native";
import HomeView from './views/appViews/HomeView.js';
import Moment from 'moment';
import Icon2 from "react-native-vector-icons/MaterialCommunityIcons";
import firebase from 'react-native-firebase';
import LottieView from 'lottie-react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';

const WIDTH = Math.round(Dimensions.get("window").width);

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sellerOrders: undefined,
      pending: [],
      upcoming: [],
      past: [],
      buyerInfo: {},
      refreshing: false,
      routes: [
        { key: 'first', title: 'Accepted' },
        { key: 'second', title: 'Pending' },
        { key: 'third', title: 'Completed' }
      ],
      index: 0,
    }
  };

  componentDidMount() {
    // always update the users fcm token to the current device that they are using
    firebase.messaging().hasPermission()
      .then(enabled => {
        if (enabled) {
          firebase.messaging().getToken().then(token => {

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
                  fieldType: "fcmToken",
                  fieldValue: token,
                }),
              });
            });


          })
        }
      });

    this.retrieveOrderInfo();
  }

  // maybe we can listen for navigation 'goBack' and automatically update?
  _onRefresh = () => {
    this.setState({ refreshing: true });
    this.retrieveOrderInfo();
    this.setState({ refreshing: false });
  }

  retrieveOrderInfo = () => {
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
                  fetch(`http://localhost:8080/api/getLocation?id=${responseJson.locationId}`)
                    .then((response) => response.json())
                    .then((locationResponseJson) => {
                      !this.state.buyerInfo[order.buyerId] ? this.state.buyerInfo[order.buyerId] = {
                        postalCode: locationResponseJson.locationInfo[0].postalCode,
                        buyerCity: locationResponseJson.locationInfo[0].city,
                        buyerName: responseJson.name,
                      }
                      : 'null';
                    })
                    .catch((error) => {
                      console.error(error);
                    });
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
    const {
      sellerOrders,
      buyerInfo
    } = this.state;
    let duration;
    if (sellerOrders) {

      const currentTime = Moment(new Date()).format('YYYY-MM-DD HH:mm:ss');

      return sellerOrders.map((order) => {
        var timeUntilOrderStart = Moment(currentTime).diff(order.dateScheduled, 'minutes');

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
              padding: 20, height: 165, margin: 20, marginBottom: 5, borderRadius: 8, backgroundColor: '#fff',
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
                  <Text style={{ fontSize: 20 }}>
                    { buyerInfo[order.buyerId] ? buyerInfo[order.buyerId].buyerName : null }
                  </Text>
                  <View style={{ paddingTop: 10, flexDirection: 'row' }}>
                    <Icon2 style={{ paddingRight: 10, color: '#7f8c8d' }} name="clock-outline" size={25} />
                    <Text style={{ fontSize: 16 }}>{duration}</Text>
                  </View>
                  <View style={{ paddingTop: 0, flexDirection: 'row' }}>
                    <Icon2 style={{ paddingRight: 10, color: '#7f8c8d' }} name="map-marker" size={25} />
                    <Text style={{ fontSize: 16 }}>
                    {
                      buyerInfo[order.buyerId] ? `${buyerInfo[order.buyerId].buyerCity}, ${buyerInfo[order.buyerId].postalCode}` : null
                    }
                    </Text>
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
                  {order.status == 'COMPLETEP' && (
                    <Text style={{ marginTop: 10, fontSize: 16, color: 'green', paddingBottom: 5 }}>COMPLETE</Text>
                  )}
                  {order.status == 'ACTIVE' && (
                    <Text style={{ marginTop: 10, fontSize: 16, color: 'green', paddingBottom: 5 }}>ACTIVE</Text>
                  )}

                </View>
                <View style={{ alignItems: 'center' }}>
                  <Text style={{ fontSize: 45, fontWeight: 'bold', color: '#E88D72' }}>{Moment(order.dateScheduled).format('DD')}</Text>
                  <Text style={{ fontSize: 20, color: '#E88D72', marginTop: -13 }}>{Moment(order.dateScheduled).format('MMMM')}</Text>
                  <Text style={{ fontSize: 16, color: '#7f8c8d', paddingTop: 7 }}>{order.shiftTime}</Text>
                </View>
              </View>
            </TouchableOpacity>
          );

        }
      })
    } else if (sellerOrders==null) {
      return [];
    }
  }


  isUndefined = (currentIndex) => {
    return currentIndex == undefined;
  }


  getAccepted = () => {

    var checkCompletep = !this.getOrders('COMPLETEP').every(this.isUndefined);
    var checkActive = !this.getOrders('ACTIVE').every(this.isUndefined);
    var checkAccepted = !this.getOrders('ACCEPTED').every(this.isUndefined);
    var checkActiveOrCompletep = checkCompletep || checkActive;
    var checkAnyAccepted = checkCompletep || checkActive || checkAccepted;


    if (checkAnyAccepted) {
      return (<ScrollView refreshControl={
        <RefreshControl
          refreshing={this.state.refreshing}
          onRefresh={this._onRefresh}
        />
      }>

        {checkActiveOrCompletep && (
          <View style={{
            paddingBottom: 20, shadowColor: 'black',
            shadowOffset: {
              width: 0,
              height: 3
            },
            shadowRadius: 5,
            shadowOpacity: 1.0,
            elevation: 5,
            backgroundColor:'#f5dcd5'

          }}>
            {!this.getOrders('COMPLETEP').every(this.isUndefined) && (
              <View>
                <Text style={{ margin: 20, marginBottom: 0, fontWeight: 'bold', fontSize: 25 }}>Pending Completion</Text>
                {this.getOrders('COMPLETEP')}
              </View>
            )}
            {!this.getOrders('ACTIVE').every(this.isUndefined) && (
              <View style={{ paddingBottom: 20 }}>
                <Text style={{ margin: 20, marginBottom: 5, fontWeight: 'bold', fontSize: 25 }}>Active</Text>
                {this.getOrders('ACTIVE')}
              </View>
            )}
          </View>
        )}

        {!this.getOrders('ACCEPTED').every(this.isUndefined) && (
          <View style={{paddingBottom:20}}>
            <Text style={{ margin: 20, marginBottom: 10, fontWeight: 'bold', fontSize: 25 }}>Upcoming Orders</Text>
            {this.getOrders('ACCEPTED')}
          </View>
        )}

      </ScrollView>)
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
            <Text style={{ fontSize: 22, paddingTop: 15 }}>NO ACTIVE ORDERS</Text>
            <Text style={{ fontSize: 16, paddingTop: 10 }}>You don't have any active orders</Text>
          </View>
        </ScrollView>
      )
    };
  }

  getPending = () => {
    var checkPending = !this.getOrders('PENDING').every(this.isUndefined);
    if (checkPending) {
      return (
        <ScrollView refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh}
          />
        }>
          <Text style={{ margin: 20, marginBottom: 10, fontWeight: 'bold', fontSize: 25 }}>Requests</Text>
          {this.getOrders('PENDING')}
        </ScrollView>
      );
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
            <Text style={{ fontSize: 22, paddingTop: 15 }}>NO PENDING ORDERS</Text>
            <Text style={{ fontSize: 16, paddingTop: 10 }}>You don't have any pending orders</Text>
          </View>
        </ScrollView>
      )
    }
  }

  getComplete = () => {
    var checkComplete = !this.getOrders('COMPLETE').every(this.isUndefined);
    if (checkComplete) {
      return (
        <ScrollView refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh}
          />
        }>
          <Text style={{ margin: 20, marginBottom: 10, fontWeight: 'bold', fontSize: 25 }}>Past Orders</Text>
          {this.getOrders('COMPLETE')}
        </ScrollView>
      );
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
            <Text style={{ fontSize: 22, paddingTop: 15 }}>NO COMPLETE ORDERS</Text>
            <Text style={{ fontSize: 16, paddingTop: 10 }}>You don't have any orders in your history</Text>
          </View>
        </ScrollView>
      )
    }
  }



  render() {
    if (this.state.sellerOrders !== undefined) {

      return (

        <TabView
          navigationState={this.state}
          renderScene={({ route }) => {
            switch (route.key) {
              case 'first':
                return this.getAccepted();
              case 'second':
                return this.getPending();
              case 'third':
                return this.getComplete();
              default:
                return null;
            }
          }}
          onIndexChange={index => this.setState({ index })}
          initialLayout={{ width: Dimensions.get('window').width }}
          renderTabBar={props =>
            <TabBar
              {...props}
              indicatorStyle={{ backgroundColor: 'white' }}
              style={{ backgroundColor: '#E88D72' }}
            />
          }
        />


      )
    } else {
      return (
        <View style={{ flex: 1 }}>
          <LottieView style={{ flex: 1 }} source={require('../image/loading.json')} autoPlay loop={true} />
        </View>
      )
    }
  }
}


export default Home;