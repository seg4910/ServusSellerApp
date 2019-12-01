import React, { Component } from "react";
import CreateServiceView from "./views/appViews/CreateServiceView.js";


class CreateService extends Component {
    constructor(props) {
        super(props);
    }

    loadAndReturn = () => {
        this.props.navigation.state.params.loadServices();
        this.props.navigation.goBack();
    }

    render() {
        return (
            // enter email (sign in/regsiter)
            <CreateServiceView
                {...this.props}
                loadAndReturn = {this.loadAndReturn}
            />
        )
    }
}
export default CreateService;