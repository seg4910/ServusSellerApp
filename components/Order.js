import React, { Component } from "react";
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity
} from "react-native";
import Moment from 'moment';
import Icon2 from "react-native-vector-icons/MaterialCommunityIcons";
import Modal from "react-native-modal";

const fetch = require("node-fetch");

// notification payloads
const acceptTitle = "Order Accepted!";
const acceptBody = "Your order has been accepted and is now confirmed";

const declineTitle = "Order Declined";
const declineBody = "Your order has been declined. Try a different time or seller";

const cancelTitle = "Order Cancelled";
const cancelBody = "The seller has cancelled your order";

const beginTitle = "Order started!";
const beginBody = "The seller has checked in and begun your order";

const completeTitle = "Order complete!";
const completeBody = "The seller has completed your order. Please review."

class Order extends Component {
    constructor(props) {
        super(props);
        this.state = {
            orderInfo: null,
            buyerInfo: null,
            isAccModalVisible: false,
            isDecModalVisible: false,
            isCancelModalVisible: false,
            isBeginServiceModalVisible: false,
            isCompleteServiceModalVisible: false,
            orderId: null,
            orderActive: false
        };
    }

    componentDidMount() {
        const { navigation } = this.props;
        const orderId = JSON.parse(JSON.stringify(navigation.getParam('id', 'NO-ORDER')));
        this.setState({ orderId: orderId });

        fetch('http://localhost:8080/api/viewOrder?id=' + orderId)
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({
                    orderInfo: responseJson.order
                }, () => {
                    fetch('http://localhost:8080/api/getAccountInfo?type=users&id=' + this.state.orderInfo[0].buyerId)
                        .then((response) => response.json())
                        .then((responseJson) => {
                            this.setState({
                                buyerInfo: responseJson
                            })
                        });

                    const currentTime = Moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
                    if (currentTime >= this.state.orderInfo[0].dateScheduled) {
                        this.setState({ orderActive: true });
                    }
                });
            })
            .catch((error) => {
                console.error(error);
            });
    }

    // hide or display the pop up for executing different actions on an order
    toggleRequestModal(resp) {
        if (resp == 'ACCEPT') {
            // seller accepts the order request
            this.setState({ isAccModalVisible: !this.state.isAccModalVisible });
        } else if (resp == 'DECLINE') {
            // seller declines the order request
            this.setState({ isDecModalVisible: !this.state.isDecModalVisible });
        } else if (resp == 'CANCEL') {
            this.setState({ isCancelModalVisible: !this.state.isCancelModalVisible });
        } else if (resp == 'BEGIN') {
            this.setState({ isBeginServiceModalVisible: !this.state.isBeginServiceModalVisible });
        } else if (resp == 'COMPLETEP') {
            this.setState({ isCompleteServiceModalVisible: !this.state.isCompleteServiceModalVisible });
        }
    }

    sendNotificationToBuyer = (title, body) => {
        //select buyer fcm token from db
        //send notification to buyer

        console.log("sending notification");

        fetch(`https://fcm.googleapis.com/fcm/send`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'key=AAAAHyv-GIg:APA91bFcrY4DEMCl5SyfH4V8kjehp20BVYo7Ly5CQj5D5IJUSEQ6TKOl0cvlywN5wFdxgXBCTfCkxrR0z0iBCyhrdMnjYurwcAyu2MJU5Eq-BuX7gHojKCMb1TsQlJIYfx8_oDI5YND5'
            },
            body: JSON.stringify({
                "to": this.state.buyerInfo.fcmToken,
                "notification": {
                    "body": body,
                    "title": title,
                    "content_available": true,
                    "priority": "high"
                },
                "data": {
                    "body": body,
                    "title": title,
                    "orderId": "yeet",
                    "content_available": true,
                    "priority": "high"
                }
            })
        })
            .then(response => response.json())
            .then(responseJson => {
                console.log('here');
                console.log(responseJson);
            })
            .catch(error => {
                console.log(error);
            });
    }

    // cancel, accept or decline an order
    // move all this into one statement using params, no need to repeat
    updateOrderStatus(resp) {
        if (resp == 'ACCEPT') {
            // seller accepts the order request
            this.setState({ isAccModalVisible: !this.state.isAccModalVisible });

            console.log(this.state.buyerInfo.fcmToken);

            fetch('http://localhost:8080/api/respondToRequest?resp=ACCEPTED&id=' + this.state.orderId, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
            })
                .catch((error) => {
                    console.error(error);
                });

            this.sendNotificationToBuyer(acceptTitle, acceptBody);
            this.props.navigation.state.params.onGoBack();
            this.props.navigation.goBack();

        } else if (resp == 'DECLINE') {
            // seller declines the order request
            this.setState({ isDecModalVisible: !this.state.isDecModalVisible });

            fetch('http://localhost:8080/api/respondToRequest?resp=DECLINED&id=' + this.state.orderId, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
            })
                .catch((error) => {
                    console.error(error);
                });

            this.sendNotificationToBuyer(declineTitle, declineBody);
            this.props.navigation.state.params.onGoBack();
            this.props.navigation.goBack();

        } else if (resp == 'CANCEL') {

            this.setState({ isCancelModalVisible: !this.state.isCancelModalVisible });

            fetch('http://localhost:8080/api/respondToRequest?resp=CANCELLED&id=' + this.state.orderId, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
            })
                .catch((error) => {
                    console.error(error);
                });

            this.sendNotificationToBuyer(cancelTitle, cancelBody);
            this.props.navigation.state.params.onGoBack();
            this.props.navigation.goBack();

        } else if (resp == 'ACTIVE') {

            this.setState({ isBeginServiceModalVisible: !this.state.isBeginServiceModalVisible });

            fetch('http://localhost:8080/api/respondToRequest?resp=ACTIVE&id=' + this.state.orderId, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
            })
                .catch((error) => {
                    console.error(error);
                });

            fetch('http://localhost:8080/api/startstopService?&action=timeStarted&id=' + this.state.orderId, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
            })
                .catch((error) => {
                    console.error(error);
                });


            this.sendNotificationToBuyer(beginTitle, beginBody);
            this.props.navigation.state.params.onGoBack();
            this.props.navigation.goBack();

        } else if (resp == 'COMPLETEP') {

            this.setState({ isCompleteServiceModalVisible: !this.state.isCompleteServiceModalVisible });

            fetch('http://localhost:8080/api/respondToRequest?resp=COMPLETEP&id=' + this.state.orderId, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
            })
                .catch((error) => {
                    console.error(error);
                });

            fetch('http://localhost:8080/api/startstopService?&action=timeCompleted&id=' + this.state.orderId, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
            })
                .catch((error) => {
                    console.error(error);
                });
        
            this.sendNotificationToBuyer(completeTitle, completeBody);
            this.props.navigation.state.params.onGoBack();
            this.props.navigation.goBack();

        }
    }

    render() {
        const { navigation } = this.props;
        let duration = null;
        if (this.state.orderInfo) {
            if (this.state.orderInfo[0].size == 'SM') {
                duration = '0 - 1 Hours'
            } else if (this.state.orderInfo[0].size == 'MD') {
                duration = '1 - 2 Hours'
            } else if (this.state.orderInfo[0].size == 'LG') {
                duration = '2 - 3 Hours'
            }
        }

        return (
            <View style={{ flex: 1 }}>
                {this.state.buyerInfo && (
                    <View style={{ flex: 1, padding: 20 }}>
                        <View style={{ marginBottom: 40, padding: 10, borderBottomColor: '#dfe6e9', borderBottomWidth: 2 }}>

                            {this.state.orderInfo[0].status == 'PENDING' && (
                                <Text style={{ fontSize: 25, fontWeight: 'bold' }}>Order Request</Text>
                            )}

                            {this.state.orderInfo[0].status == 'ACCEPTED' && (
                                <Text style={{ fontSize: 25, fontWeight: 'bold' }}>Upcoming Order</Text>
                            )}

                            {this.state.orderInfo[0].status == 'COMPLETE' && (
                                <Text style={{ fontSize: 25, fontWeight: 'bold' }}>Completed Service</Text>
                            )}

                            {this.state.orderInfo[0].status == 'COMPLETEP' && (
                                <Text style={{ fontSize: 25, fontWeight: 'bold' }}>Pending Completion</Text>
                            )}

                            {this.state.orderInfo[0].status == 'ACTIVE' && (
                                <Text style={{ fontSize: 25, fontWeight: 'bold' }}>Active</Text>
                            )}

                        </View>

                        <View style={{ paddingBottom: 25, borderBottomColor: '#dfe6e9', borderBottomWidth: 2 }}>
                            <View style={{ marginBottom: 10 }}>
                                <Text style={{ fontSize: 24 }}>{this.state.buyerInfo.name}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', paddingTop: 10 }}>
                                <Icon2 style={{ paddingRight: 10, color: '#7f8c8d' }} name="calendar" size={25} />
                                <Text style={{ fontSize: 20 }}>{Moment(this.state.orderInfo[0].dateScheduled).format('MMMM Do YYYY')}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', paddingTop: 10 }}>
                                <Icon2 style={{ paddingRight: 10, color: '#7f8c8d' }} name="clock-outline" size={25} />
                                <Text style={{ fontSize: 20 }}>{Moment(this.state.orderInfo[0].dateScheduled).format('hh:mm a')}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', paddingTop: 10 }}>
                                <Icon2 style={{ paddingRight: 10, color: '#7f8c8d' }} name="map-marker" size={25} />
                                <Text style={{ fontSize: 20 }}>Location goes here</Text>
                            </View>

                            <View style={{ marginTop: 30 }}>
                                <Text style={{ fontSize: 20 }}>{this.state.buyerInfo.email}</Text>
                                <Text style={{ fontSize: 20 }}>{this.state.buyerInfo.phone}</Text>
                            </View>
                        </View>

                        <View style={{ marginLeft: 20, marginTop: 20 }}>
                            <Text style={{ fontSize: 20 }}>Duration: {duration}</Text>
                        </View>

                        {this.state.orderInfo[0].status == 'PENDING' && (
                            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'flex-end' }}>
                                <TouchableOpacity onPress={() => this.toggleRequestModal('ACCEPT')} style={{ borderRadius: 5, backgroundColor: '#2ecc71', flex: 1, height: 50, margin: 10, justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={{ fontWeight: 'bold' }}>ACCEPT</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => this.toggleRequestModal('DECLINE')} style={{ borderRadius: 5, backgroundColor: '#e74c3c', flex: 1, height: 50, margin: 10, justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={{ fontWeight: 'bold' }}>DECLINE</Text>
                                </TouchableOpacity>
                            </View>
                        )}

                        {this.state.orderInfo[0].status == 'ACCEPTED' && this.state.orderActive == false && (
                            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'flex-end' }}>
                                <TouchableOpacity onPress={() => this.toggleRequestModal('CANCEL')} style={{ borderRadius: 5, backgroundColor: '#e74c3c', flex: 1, height: 50, margin: 10, justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={{ fontWeight: 'bold' }}>CANCEL</Text>
                                </TouchableOpacity>
                            </View>
                        )}

                        {this.state.orderInfo[0].status == 'ACCEPTED' && this.state.orderActive == true && (
                            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'flex-end' }}>
                                <TouchableOpacity onPress={() => this.toggleRequestModal('BEGIN')} style={{ borderRadius: 5, backgroundColor: '#E88D72', flex: 1, height: 50, margin: 10, justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={{ fontWeight: 'bold' }}>BEGIN SERVICE</Text>
                                </TouchableOpacity>
                            </View>
                        )}

                        {this.state.orderInfo[0].status == 'ACTIVE' && this.state.orderActive == true && (
                            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'flex-end' }}>
                                <TouchableOpacity onPress={() => this.toggleRequestModal('COMPLETEP')} style={{ borderRadius: 5, backgroundColor: '#E88D72', flex: 1, height: 50, margin: 10, justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={{ fontWeight: 'bold' }}>COMPLETED</Text>
                                </TouchableOpacity>
                            </View>
                        )}



                    </View>
                )}


                <Modal isVisible={this.state.isCancelModalVisible}>
                    <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                        <View style={{ height: 200, width: 350, backgroundColor: '#fff', borderRadius: 20 }}>
                            <View style={{ flex: 1, flexDirection: 'column' }}>
                                <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 25, paddingHorizontal: 20, paddingTop: 30 }}>Cancel Order</Text>
                                <Text style={{ textAlign: 'center', fontSize: 20, padding: 20 }}>Are you sure?</Text>
                                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'flex-end' }}>
                                    <TouchableOpacity
                                        style={{ flex: 1, backgroundColor: '#bf745e', justifyContent: 'center', alignItems: 'center', height: 55, borderBottomLeftRadius: 20 }}
                                        onPress={() => this.toggleRequestModal('CANCEL')}>
                                        <Text style={{ textAlign: 'center', fontSize: 19, fontWeight: 'bold', color: '#fff' }}>NO</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={{ flex: 1, backgroundColor: '#E88D72', justifyContent: 'center', alignItems: 'center', height: 55, borderBottomRightRadius: 20, }}
                                        onPress={() => this.updateOrderStatus('CANCEL')}>
                                        <Text style={{ textAlign: 'center', fontSize: 19, fontWeight: 'bold', color: '#fff' }}>YES</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>
                </Modal>


                <Modal isVisible={this.state.isAccModalVisible}>
                    <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                        <View style={{ height: 200, width: 350, backgroundColor: '#fff', borderRadius: 20 }}>
                            <View style={{ flex: 1, flexDirection: 'column' }}>
                                <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 25, paddingHorizontal: 20, paddingTop: 30 }}>Accept Order</Text>
                                <Text style={{ textAlign: 'center', fontSize: 20, padding: 20 }}>Are you sure?</Text>
                                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'flex-end' }}>
                                    <TouchableOpacity
                                        style={{ flex: 1, backgroundColor: '#bf745e', justifyContent: 'center', alignItems: 'center', height: 55, borderBottomLeftRadius: 20 }}
                                        onPress={() => this.toggleRequestModal('ACCEPT')}>
                                        <Text style={{ textAlign: 'center', fontSize: 19, fontWeight: 'bold', color: '#fff' }}>NO</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={{ flex: 1, backgroundColor: '#E88D72', justifyContent: 'center', alignItems: 'center', height: 55, borderBottomRightRadius: 20, }}
                                        onPress={() => this.updateOrderStatus('ACCEPT')}>
                                        <Text style={{ textAlign: 'center', fontSize: 19, fontWeight: 'bold', color: '#fff' }}>YES</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>
                </Modal>


                <Modal isVisible={this.state.isDecModalVisible}>
                    <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                        <View style={{ height: 200, width: 350, backgroundColor: '#fff', borderRadius: 20 }}>
                            <View style={{ flex: 1, flexDirection: 'column' }}>
                                <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 25, paddingHorizontal: 20, paddingTop: 30 }}>Decline Offer</Text>
                                <Text style={{ textAlign: 'center', fontSize: 20, padding: 20 }}>Are you sure?</Text>
                                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'flex-end' }}>
                                    <TouchableOpacity
                                        style={{ flex: 1, backgroundColor: '#bf745e', justifyContent: 'center', alignItems: 'center', height: 55, borderBottomLeftRadius: 20 }}
                                        onPress={() => this.toggleRequestModal('DECLINE')}>
                                        <Text style={{ textAlign: 'center', fontSize: 19, fontWeight: 'bold', color: '#fff' }}>NO</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={{ flex: 1, backgroundColor: '#E88D72', justifyContent: 'center', alignItems: 'center', height: 55, borderBottomRightRadius: 20, }}
                                        onPress={() => this.updateOrderStatus('DECLINE')}>
                                        <Text style={{ textAlign: 'center', fontSize: 19, fontWeight: 'bold', color: '#fff' }}>YES</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>
                </Modal>

                <Modal isVisible={this.state.isBeginServiceModalVisible}>
                    <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                        <View style={{ height: 200, width: 350, backgroundColor: '#fff', borderRadius: 20 }}>
                            <View style={{ flex: 1, flexDirection: 'column' }}>
                                <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 25, paddingHorizontal: 20, paddingTop: 30 }}>Begin Order</Text>
                                <Text style={{ textAlign: 'center', fontSize: 20, padding: 20 }}>Are you sure?</Text>
                                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'flex-end' }}>
                                    <TouchableOpacity
                                        style={{ flex: 1, backgroundColor: '#bf745e', justifyContent: 'center', alignItems: 'center', height: 55, borderBottomLeftRadius: 20 }}
                                        onPress={() => this.toggleRequestModal('BEGIN')}>
                                        <Text style={{ textAlign: 'center', fontSize: 19, fontWeight: 'bold', color: '#fff' }}>NO</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={{ flex: 1, backgroundColor: '#E88D72', justifyContent: 'center', alignItems: 'center', height: 55, borderBottomRightRadius: 20, }}
                                        onPress={() => this.updateOrderStatus('ACTIVE')}>
                                        <Text style={{ textAlign: 'center', fontSize: 19, fontWeight: 'bold', color: '#fff' }}>YES</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>
                </Modal>

                <Modal isVisible={this.state.isCompleteServiceModalVisible}>
                    <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                        <View style={{ height: 200, width: 350, backgroundColor: '#fff', borderRadius: 20 }}>
                            <View style={{ flex: 1, flexDirection: 'column' }}>
                                <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 25, paddingHorizontal: 20, paddingTop: 30 }}>Confirm Order Completion</Text>
                                <Text style={{ textAlign: 'center', fontSize: 20, padding: 20 }}>Are you sure?</Text>
                                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'flex-end' }}>
                                    <TouchableOpacity
                                        style={{ flex: 1, backgroundColor: '#bf745e', justifyContent: 'center', alignItems: 'center', height: 55, borderBottomLeftRadius: 20 }}
                                        onPress={() => this.toggleRequestModal('COMPLETEP')}>
                                        <Text style={{ textAlign: 'center', fontSize: 19, fontWeight: 'bold', color: '#fff' }}>NO</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={{ flex: 1, backgroundColor: '#E88D72', justifyContent: 'center', alignItems: 'center', height: 55, borderBottomRightRadius: 20, }}
                                        onPress={() => this.updateOrderStatus('COMPLETEP')}>
                                        <Text style={{ textAlign: 'center', fontSize: 19, fontWeight: 'bold', color: '#fff' }}>YES</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>
                </Modal>
            </View>
        )
    }
}

const st = require("../styles/style.js");
const styles = StyleSheet.create({});

export default Order;