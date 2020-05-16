import React from "react";
import IconButton from '@material-ui/core/IconButton'
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer'
import NavigateNext from '@material-ui/icons/NavigateNext';
import NavigateBefore from '@material-ui/icons/NavigateBefore';
import "./side-panel.scss";

export default class SidePanelComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isOpen: false };

    this.toggleDrawer = this.toggleDrawer.bind(this);
  }

  toggleDrawer() {
    this.setState(state => ({
      isOpen: !state.isOpen
    }));
  }

  render() {
    let iconButton;
    if (this.state.isOpen) {
      iconButton = <NavigateBefore color="grey" />;
    } else {
      iconButton = <NavigateNext color="grey" />;
    }
    return (
      <div className="side-panel">  
        <IconButton onClick={this.toggleDrawer} className="button-toggle">
            {iconButton}
        </IconButton>      
        <SwipeableDrawer
          anchor="left"
          open={this.state.isOpen}
          onClose={this.toggleDrawer}
          onOpen={this.toggleDrawer}
        >asdasdas
        </SwipeableDrawer>
      </div>
    );
  }
}