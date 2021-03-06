import React, { PureComponent } from 'react';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';

class ImageCropper extends PureComponent {
  constructor(props) {
    super(props);
    this.cropper = React.createRef();
  }

  _crop() {
    return this.cropper.current
      .getCroppedCanvas()
      .toBlob(blob => this.props.cropped(blob));
  }

  render() {
    return (
      <Cropper
        ref={this.cropper}
        src={this.props.image}
        style={{ height: 400, width: '100%' }}
        minCropBoxHeight={400}
        aspectRatio={16 / 9}
        cropBoxResizable={false}
        viewMode={3}
        dragMode="move"
        guides={false}
        crop={() => this._crop()}
      />
    );
  }
}

export default ImageCropper;
