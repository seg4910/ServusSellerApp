import React, { Component } from "react";
import {
    TextInput,
    Picker,
    Text,
    View,
    Button,
    TimePickerAndroid
} from "react-native";
import { Calendar, CalendarList, Agenda, Arrow } from 'react-native-calendars';
import moment from 'moment';


class SchedulingView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            serviceName: "",
            serviceCategory: "",
            serviceDescription: "",
            city: "",
            minPrice: 0,
            maxPrice: 0,
            priceHr: 0,

            serviceInfo: [],
            startHour: null,
            endHour: null,
            day: null,
            markedDates: {}
        }
        this.startHourTimePicker = this.startHourTimePicker.bind(this)
        this.endHourTimePicker = this.endHourTimePicker.bind(this)
    };

    startHourTimePicker() {
        TimePickerAndroid.open({
            startHour: this.state.startHour
        })
            .then((startHour) => {
                const { hour, minute, action } = startHour
                if (action === 'timeSetAction') {
                    selectedStartTime = moment().minute(minute).hour(hour).format('HH:mm:ss')
                    startHour = this.state.day + ' ' + selectedStartTime
                    this.setState({ startHour })
                }
            })
    }
    endHourTimePicker() {
        TimePickerAndroid.open({
            endHour: this.state.endHour
        })
            .then((endHour) => {
                const { hour, minute, action } = endHour
                if (action === 'timeSetAction') {
                    selectedEndTime = moment().minute(minute).hour(hour).format('HH:mm:ss')
                    endHour = this.state.day + ' ' + selectedEndTime
                    this.setState({ endHour })
                }
            })
    }

    setMarkedDates(key) {
        let markedDates = {};
        if (typeof this.state.markedDates[key] !== 'undefined') {
            markedDates = { [key]: { selected: !this.state.markedDates[key].selected } };
        } else {
            markedDates = { [key]: { selected: true } };
        }

        this.setState((prevState) => {
            return { ...prevState, markedDates };
        })
    }

    render() {
        return (
            <View>
                <View>
                    <Calendar
                    markedDates={this.state.markedDates}
                    onDayPress={(day) => {
                        console.log('selected day', day)
                        this.setState({ day: moment(day).format('YYYY-MM-DD') })
                        this.setMarkedDates(day.dateString)
                    }}
                    onDayLongPress={(day) => {
                        console.log('selected day', day)
                        this.setState({ day: moment(day).format('YYYY-MM-DD') })
                    }}
                    monthFormat={'MMMM yyyy'}

                /></View>
                <View>
                    <Text onPress={this.startHourTimePicker} style={st.heading2}> Select start time </Text>
                </View>
                <View>
                    <Text onPress={this.endHourTimePicker} style={st.heading2}> Select end time </Text>
                </View>

                <View>
                    <Button title='Add' onPress={() => this.props.setSchedule(this.state)} />
                </View>
            </View>
        );
    }
}

const st = require("../../../styles/style.js")
export default SchedulingView;