import React from 'react';
import './about.scss';

class AboutContent extends React.Component {
    render() {
        return (
            <div className="about-content">
                <h2 className="header">About</h2>
                <p className="main-content">Welcome to AppTitle, an application designed from the ground up
                    using reactJS. Our application should let you manage all your
                    renting needs. Create points of interest, delete them, like them
                    , see their status, the list is endless. Our project aims to 
                    push the limits of what is possible and start a new wave of 
                    incredible mono-page applications, the likes of which the world 
                    has never seen. Thank you for supporting us!
                </p>
                <p className="subheader">Our developers : </p>
                <p>Patrick Star</p>
                <p>Ben PicklesOnion</p>
                <p>Diogo Sat-down</p>
                <p>Dylan Trump</p>
        </div>
        );
    }
}

export default AboutContent;
