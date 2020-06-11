import React from 'react';
import PropTypes from 'prop-types';
import { getFile, fileToImage } from '../../../shared/api.service';
import './image-gallery.scss';

class ImageGalleryComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      fileId: props.fileId,
      loginWithRedirect: props.loginWithRedirect,
      getTokenSilently: props.getTokenSilently,
      imageData: '',
    }
  }

  async componentDidMount() {
    const fileData = await getFile(this.state.fileId, this.state.getTokenSilently, this.state.loginWithRedirect);
    // get the proper path
    let filePath = fileData.data.path.split('/');
    filePath = filePath[filePath.length - 1];
    const imageData = await fileToImage(filePath, this.state.getTokenSilently, this.state.loginWithRedirect);
    this.setState({ imageData: imageData });
  }

  render() {
    return (
      <div>
        <img src={`data:image/jpeg;base64,${this.state.imageData}`} width="100px" height="100px" />
      </div>
    );
  }
}

ImageGalleryComponent.propTypes = {
  fileId: PropTypes.string.isRequired,
  loginWithRedirect: PropTypes.func.isRequired,
  getTokenSilently: PropTypes.func.isRequired,
}

export default ImageGalleryComponent;
