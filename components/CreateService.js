import React, { Component } from "react";
import CreateServiceView from "./views/appViews/CreateServiceView.js";


class CreateService extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            // enter email (sign in/regsiter)
            <CreateServiceView
                {...this.props}
            />
        )
    }
}
export default CreateService;