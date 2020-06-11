import React from 'react';
import PropTypes from 'prop-types';
import { getFile, fileToImage } from '../../../shared/api.service';
import './image-gallery.scss';
import ImageGallery from 'react-image-gallery';


class ImageGalleryComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      loginWithRedirect: props.loginWithRedirect,
      getTokenSilently: props.getTokenSilently,
      imageData: '',
      fileIds: props.fileIds,
      images: [],
    }
  }


  async componentDidMount() {
    for (let i = 0; i < this.state.fileIds.length; i++) {
      console.log(this.state.fileIds[i]);
        const fileData = await getFile(this.state.fileIds[i], this.state.getTokenSilently, this.state.loginWithRedirect);
        // get the proper path
        let filePath = fileData.data.path.split('/');
        filePath = filePath[filePath.length - 1];
        const imageData = await fileToImage(filePath, this.state.getTokenSilently, this.state.loginWithRedirect);
        console.log(imageData);
        const newImage =   {
          original: `data:image/jpeg;base64,${imageData}`,
        }
        this.state.images.push(newImage)
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

ImageGalleryComponent.propTypes = {
  fileIds: PropTypes.array.isRequired,
  loginWithRedirect: PropTypes.func.isRequired,
  getTokenSilently: PropTypes.func.isRequired,
}

export default ImageGalleryComponent;
