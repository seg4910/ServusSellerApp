import React, { Component } from "react";
import SchedulingView from "./views/appViews/SchedulingView.js";
import {AsyncStorage} from "react-native";

class SetSchedule extends Component {
    constructor(props) {
        super(props);
    }

    setSchedule = (userInput) => {
        const serviceId = this.props.navigation.getParam("serviceId", 1);
        AsyncStorage.getItem('userId', (err, result) => {
            fetch(
                `http://localhost:8080/api/setSellerAvailability/?sellerId=${result}&startHour=${userInput.startHour}&endHour=${userInput.endHour}&day=${userInput.day}&serviceId=${serviceId}`
            )
                .then(response => response.json())
                .then(responseJson => {
                    alert("Added to schedule!")
                    this.props.navigation.navigate('Home')
                })
                .catch(error => {
                    console.error(error);
                });
        });
    }

    render() {
        return (
            <SchedulingView
                setSchedule={this.setSchedule}
            />
        )
    }
}
export default SetSchedule;