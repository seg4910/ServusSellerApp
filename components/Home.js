import React, { Component } from "react";
import { View, Text, ScrollView, AsyncStorage } from "react-native";
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
        buyerEmail: ''
      }
    };

    componentDidMount() {
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
              this.state.sellerOrders.map((order) => {
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
                  .catch((error) =>{
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

    getOrders = (status) => {
      if (this.state.sellerOrders) {
        return this.state.sellerOrders.map((order) => {

            if(order.status == status) { 

              if (order.size == 'SM') {
                  duration = '0-1 Hours'
              } else if (order.size == 'MD') {
                  duration = '1-2 Hours'
              } else if (order.size == 'LG') {
                  duration = '2-3 Hours'
              }

              return (
                <View key={order.id} elevation={2} style={{padding: 20, height:150, margin: 20, marginBottom:5, borderRadius:8, backgroundColor: '#fff',
                shadowColor:'black',
                shadowOffset: {
                  width: 0,
                  height: 3
                },
                shadowRadius: 5,
                shadowOpacity: 1.0,
                elevation: 5,
                }}>
                  <View style={{flexDirection:'row'}}>
                    <View style={{flex:1}}>
                      <Text style={{fontSize:20}}>{
                        this.state.buyerNames.map((name) => name.buyerId === order.buyerId ? name.buyerName : "")
                      }</Text>
                      <View style={{paddingTop:10, flexDirection:'row'}}>
                        <Icon2 style={{paddingRight:10, color:'#7f8c8d'}} name="clock-outline" size={25} />
                        <Text style={{fontSize:16}}>{duration}</Text>                        
                      </View>
                      <View style={{paddingTop:0, flexDirection:'row'}}>
                        <Icon2 style={{paddingRight:10, color:'#7f8c8d'}} name="map-marker" size={25} />
                        <Text style={{fontSize:16}}>300 Bank Street, Ottawa</Text>                        
                      </View>

                      {order.status=='PENDING' && (
                          <Text style={{marginTop:10,fontSize:16, color:'grey', paddingBottom:5}}>{order.status}</Text>  
                      )}
                      {order.status=='CONFIRMED' && (
                          <Text style={{marginTop:10,fontSize:16, color:'green', paddingBottom:5}}>{order.status}</Text>  
                      )}  
                      {order.status=='COMPLETE' && (
                          <Text style={{marginTop:10,fontSize:16, color:'black', paddingBottom:5}}>{order.status}</Text>  
                      )}   

                    </View>
                    <View style={{alignItems:'center'}}>
                      <Text style={{fontSize:45, fontWeight:'bold', color:'#E88D72'}}>{Moment(order.dateScheduled).format('DD')}</Text>
                      <Text style={{fontSize:20, color: '#E88D72', marginTop:-13}}>{Moment(order.dateScheduled).format('MMMM')}</Text>
                      <Text style={{fontSize:16, color:'#7f8c8d', paddingTop:7}}>{Moment(order.dateScheduled).format('LT')}</Text>

                    </View>                   
                  </View>
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
              {this.getOrders('PENDING')}
              <Text style={{margin:20,marginBottom:10,fontWeight:'bold', fontSize:25}}>Upcoming Orders</Text>
              {this.getOrders('CONFIRMED')}
              <Text style={{margin:20,marginBottom:10,fontWeight:'bold', fontSize:25}}>Past Orders</Text>
              {this.getOrders('COMPLETE')}

            </ScrollView> 
        )
    }
}
      

export default Home;