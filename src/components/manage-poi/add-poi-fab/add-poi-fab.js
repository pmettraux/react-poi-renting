import React from 'react';
import Button from '@material-ui/core/Button';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';

export default class AddPoiFab extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <Fab color="primary" aria-label="add">
                <AddIcon />
            </Fab>
        );
    }
}
