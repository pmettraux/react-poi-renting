import React from "react";
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
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
                        <Button color="inherit">
                            BUTTON
                        </Button>
                    </Toolbar>
                </AppBar>
            </div>
        );
    }

}