import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';
import Button from '@material-ui/core/Button';
import SearchIcon from '@material-ui/icons/Search';
import './main-header.scss';

export default class MainHeader extends React.Component {

    // login button is pressed
    login() {
        console.log('Logging in');
    }

    // enter pressed in search box
    search(e) {
        if (e.key === 'Enter') {
            console.log('Searching...');
        }
    }

    // text in search input changed
    searchTextChanged(e) {
        console.log("Search text changed : " + e.target.value);
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
                        <Button
                            className="login-button"
                            onClick={this.login}>
                            Login
                        </Button>
                    </Toolbar>
                </AppBar>
            </div>
        );
    }

}