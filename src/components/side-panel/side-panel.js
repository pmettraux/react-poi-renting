import React from 'react';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import NavigateNext from '@material-ui/icons/NavigateNext';
import './side-panel.scss';

export default class SidePanelComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isOpen: false };

    this.toggleDrawer = this.toggleDrawer.bind(this);
  }

  toggleDrawer() {
    this.setState((state) => ({
      isOpen: !state.isOpen,
    }));
  }

  render() {
    return (
      <div className="side-panel">
        <div className={`button-toggle${this.state.isOpen ? ' open' : ''}`} onClick={this.toggleDrawer}>
          <NavigateNext className="toggle-text" />
        </div>
        <SwipeableDrawer
          anchor="left"
          open={this.state.isOpen}
          onClose={this.toggleDrawer}
          onOpen={this.toggleDrawer}
        >
          asdasdas
        </SwipeableDrawer>
      </div>
    );
  }
}
