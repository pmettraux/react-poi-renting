import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';
import './main-header.scss';
import { NavLink } from "react-router-dom";

class MainHeader extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            logout: props.logout,
            isAuthenticated: props.isAuthenticated,
            loginWithRedirect: props.loginWithRedirect,
        };

        this.logout = this.logout.bind(this);
        this.login = this.login.bind(this);
    }

    // logout button is pressed
    logout(e) {
        e.preventDefault();
        this.state.logout({ returnTo: process.env.REACT_APP_BASE_URL });
    }

    // login button is pressed
    login(e) {
        e.preventDefault();
        this.state.loginWithRedirect();
    }

    // text in search input changed
    searchTextChanged(e) {
        console.log(`Search text changed : ${e.target.value}`);
    }

    render() {
        return (
            <div className="main-header">
                <AppBar position="static">
                    <Toolbar>
                    <NavLink className="inactive nav"  activeClassName="active" to="/" exact>
                        <Typography className="title">
                            Home
                        </Typography>
                    </NavLink>
                    <NavLink className="inactive nav" activeClassName="active" to="/about">
                        <Typography className="title">
                            About
                        </Typography>
                    </NavLink>
                    <Typography variant="h6" className="title">
                        APP TITLE
                    </Typography>
                    {this.state.isAuthenticated && (
                        <Button
                            className="logout-button"
                            onClick={this.logout}>
                            Logout
                        </Button>
                    )}
                    {!this.state.isAuthenticated && (
                        <Button
                            className="login-button"
                            onClick={this.login}>
                            Login
                        </Button>
                    )}
                    </Toolbar>
                </AppBar>
            </div>
        );
    }
}

MainHeader.propTypes = {
    logout: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool.isRequired,
    loginWithRedirect: PropTypes.func.isRequired,
}

export default MainHeader;
