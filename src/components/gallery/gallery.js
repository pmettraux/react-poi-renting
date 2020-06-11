import React from 'react';
import PropTypes from 'prop-types';
import { getFile, fileToImage } from '../../shared/api.service';
import './gallery.scss';
import ImageGallery from 'react-image-gallery';

class GalleryComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fileIds: props.fileIds,
      loginWithRedirect: props.loginWithRedirect,
      getTokenSilently: props.getTokenSilently,
      images: [],
    }
  }

  async componentDidMount() {
    for (let i = 0; i < this.state.fileIds.length; i++) {
        const fileData = await getFile(this.state.fileIds[i], this.state.getTokenSilently, this.state.loginWithRedirect);
        // get the proper path
        let filePath = fileData.data.path.split('/');
        filePath = filePath[filePath.length - 1];
        const imageData = await fileToImage(filePath, this.state.getTokenSilently, this.state.loginWithRedirect);
        this.state.images.push({
          original: `data:image/jpeg;base64,${imageData}`,
        });
    }
  }

  render() {
    return (
      <div className="gallery-container">
        <ImageGallery showThumbnails={false} items={this.state.images} />
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
