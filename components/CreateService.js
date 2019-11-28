import React, { Component } from "react";
import CreateServiceView from "./views/appViews/ServiceView.js";

class CreateService extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <CreateServiceView
                {...this.props}
            />
        )
    }
}
export default CreateService;