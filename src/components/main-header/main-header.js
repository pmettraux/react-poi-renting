import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';
import Button from '@material-ui/core/Button';
import SearchIcon from '@material-ui/icons/Search';
import PropTypes from 'prop-types';
import './main-header.scss';

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
                        <Typography variant="h6" className="title">
                            APP TITLE
                        </Typography>
                        <div className="search-box">
                            <div className="search-icon">
                                <SearchIcon />
                            </div>
                            <InputBase
                                placeholder="Search…"
                                classes={{
                                    root: "input-root",
                                    input: "input-input"
                                }}
                                inputProps={{ 'aria-label': 'search' }}
                                onChange={this.searchTextChanged}
                                onKeyDown={this.search}
                            />
                        </div>
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
    logout: PropTypes.node.isRequired,
    isAuthenticated: PropTypes.node.isRequired,
    loginWithRedirect: PropTypes.node.isRequired,
}

export default MainHeader;
