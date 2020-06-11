import React from 'react';
import PropTypes from 'prop-types';
import ImageGallery from './image-gallery/image-gallery';
import './gallery.scss';

class GalleryComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      fileIds: props.fileIds,
      loginWithRedirect: props.loginWithRedirect,
      getTokenSilently: props.getTokenSilently,
    }
  }

  render() {
    return (
      <div>
        {this.state.fileIds.map(fileId => 
          <ImageGallery 
            key={fileId} 
            fileId={fileId}
            loginWithRedirect={this.state.loginWithRedirect}
            getTokenSilently={this.state.getTokenSilently}
          ></ImageGallery>
        )}
      </div>
    );
  }
}

GalleryComponent.propTypes = {
  fileIds: PropTypes.array.isRequired,
  loginWithRedirect: PropTypes.func.isRequired,
  getTokenSilently: PropTypes.func.isRequired,
}

export default GalleryComponent;
