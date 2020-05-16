import React from "react";
import "./side-panel.scss";

export default class SidePanelComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isToggleOn: false };

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.setState(state => ({
      isToggleOn: !state.isToggleOn
    }));
  }

  render() {
    return (
      <div className={this.state.isToggleOn ? 'side-panel open' : 'side-panel'}>
        <div className="arrow" onClick={this.handleClick} ></div>
        <div className="content">
          TODO: ADD CONTENT HERE<br/>
          TODO: ADD CONTENT HERE<br/>
          TODO: ADD CONTENT HERE<br/>
          TODO: ADD CONTENT HERE<br/>
          TODO: ADD CONTENT HERE<br/>
          TODO: ADD CONTENT HERE<br/>
          TODO: ADD CONTENT HERE<br/>
          TODO: ADD CONTENT HERE<br/>
        </div>
      </div>
    );
  }
}