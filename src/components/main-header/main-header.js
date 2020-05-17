import React from "react";

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';

import SearchIcon from '@material-ui/icons/Search';
import "./main-header.scss";

export default class MainHeader extends React.Component {

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
                            />
                        </div>
                    </Toolbar>
                </AppBar>
            </div>
        );
    }

}