import React, { Component } from "react";
import {
    Text,
    View,
    TimePickerAndroid,
    TouchableOpacity
} from "react-native";
import { Calendar } from 'react-native-calendars';
import moment from 'moment';
import Icon2 from "react-native-vector-icons/MaterialCommunityIcons";


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
            <View style={{ flex: 1 }}>
                <View>
                    <Calendar
                        markedDates={this.state.markedDates}
                        onDayPress={(day) => {
                            console.log('selected day', day)
                            this.setState({ day: moment(day.dateString).format('YYYY-MM-DD') })
                            this.setMarkedDates(day.dateString)
                        }}
                        onDayLongPress={(day) => {
                            console.log('selected day', day)
                            this.setState({ day: moment(day.dateString).format('YYYY-MM-DD') })
                        }}
                        monthFormat={'MMMM yyyy'}

                    />
                </View>

                <View style={{ flex: 1 }}>
                    <View style={{ borderTopWidth: 2, borderTopColor: '#dfe6e9', marginTop: 15, flexDirection: 'row', padding: 20 }}>
                        <View style={{ borderWidth: 2, borderColor: '#E88D72', borderRadius: 10, flex: 1, marginRight: 5 }}>
                            {this.state.startHour == null && (
                                <Text onPress={this.startHourTimePicker} style={st.heading2}> Start Hour </Text>
                            )}
                            {this.state.startHour !== null && (
                                <Text onPress={this.startHourTimePicker} style={st.heading2}> {moment(this.state.startHour).format('hh:mm')} </Text>
                            )}
                        </View>
                        <View style={{ borderWidth: 2, borderColor: '#E88D72', borderRadius: 10, flex: 1 }}>
                            {this.state.endHour == null && (
                                <Text onPress={this.endHourTimePicker} style={st.heading2}> End Hour </Text>
                            )}
                            {this.state.endHour !== null && (
                                <Text onPress={this.endHourTimePicker} style={st.heading2}> {moment(this.state.endHour).format('hh:mm')} </Text>
                            )}
                        </View>
                    </View>

                    <View style={{ borderTopWidth: 2, borderTopColor: '#dfe6e9', alignItems: 'center', justifyContent: 'center', flex: 1, paddingTop: 25 }}>
                        {this.state.day && (
                            <View style={{flexDirection:'row', marginBottom:20}}>
                                <Icon2 style={{ paddingRight: 10, color: '#7f8c8d' }} name="calendar" size={30} />
                                <Text style={{ fontSize: 20, textAlign:'left' }}>{moment(this.state.day).format('LL')}</Text>
                            </View>)}
                        {this.state.endHour && this.state.startHour && (
                            <View style={{flexDirection:'row'}}>
                                <Icon2 style={{ paddingRight: 10, color: '#7f8c8d' }} name="clock-outline" size={30} />
                                <Text style={{ fontSize: 20, textAlign:'left' }}>{moment(this.state.startHour).format('hh:mm a')} - {moment(this.state.endHour).format('hh:mm a')}</Text>
                            </View>
                        )}
                        <Text></Text>
                    </View>

                    <View style={{ marginLeft: 30, marginRight: 30, marginBottom: 20 }}>
                        <TouchableOpacity
                            style={st.btnPrimary}
                            onPress={() => this.props.setSchedule(this.state)}>
                            <Text style={st.btnText}>Add Availability</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    }
}

const st = require("../../../styles/style.js")
export default SchedulingView;