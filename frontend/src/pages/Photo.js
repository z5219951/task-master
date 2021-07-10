import { Upload, message } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import 'antd/dist/antd.css';
import './Photo.css'
import React from 'react'
import { Fragment } from 'react';

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

function beforeUpload(file) {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!');
  }
  return isJpgOrPng && isLt2M;
}

class Photo extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
        loading: false,
        postUrl:props.postUrl,
        imageUrl:''
      };
  }
  // <Photo sendUrl = {this.getUrl}></Photo>
  // in your parent, send a getUrl function to get image url
  sendUrl = ()=>{
      this.props.sendUrl(this.state.imageUrl);
  }

  handleChange = info => {
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === 'error') {
        this.setState({ loading: false });
        message.error('upload failed.');
        return;
      }
    if (info.file.status === 'done') {
        // Get this url from response in real world.
        getBase64(info.file.originFileObj, imageUrl =>
        this.setState({
            imageUrl,
            loading: false,
        }),
        );
        this.sendUrl();
    }
  };

  render() {
    const { loading, imageUrl } = this.state;
    const uploadButton = (
      <div>
        {loading ? <LoadingOutlined /> : <PlusOutlined />}
        <div style={{ marginTop: 8 }}>Upload</div>
      </div>
    );
    // action is the post url.
    return (
        <Fragment>
            <Upload
            name="avatar"
            listType="picture-card"
            className="avatar-uploader"
            showUploadList={false}
            action={this.state.postUrl}
            beforeUpload={beforeUpload}
            onChange={this.handleChange}
            maxCount = {1}
        >
            {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
        </Upload>
        <p className="ant-upload-hint">
        Photo must small than 2MB and no more than 1024*1024
        </p>
        </Fragment>
    );
  }
}

export default Photo
