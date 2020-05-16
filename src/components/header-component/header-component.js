import React from "react";
import "./header-component.css";

export default class HeaderComponent extends React.Component {

  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className="main-header">
        <div className="main-title">APP TITLE</div>
      </div>
    );
  }

}