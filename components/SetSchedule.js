import React, { Component } from "react";
import SchedulingView from "./views/appViews/SchedulingView.js";
import {AsyncStorage} from "react-native";

class SetSchedule extends Component {
    constructor(props) {
        super(props);
    }

    setSchedule = (userInput) => {
        AsyncStorage.getItem('userId', (err, result) => {
            fetch(
                `http://localhost:8080/api/setSellerAvailability/?sellerId=${result}&startHour=${userInput.startHour}&endHour=${userInput.endHour}&day=${userInput.day}`
            )
                .then(response => response.json())
                .then(responseJson => {
                    this.props.navigation.state.params.onGoBack();
                    this.props.navigation.goBack()
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