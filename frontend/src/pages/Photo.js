import { Upload, message } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import 'antd/dist/antd.css';
import './Photo.css'
import React from 'react'
import { Fragment } from 'react';
import store from '../store';
import axios from 'axios';

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
  const isLt2M = file.size / 2048 / 2048 < 2;
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
        imageUrl:props.imageUrl
      };
  }
  sendResponse = (res)=>{
    if(this.props.sendResponse) {
      this.props.sendResponse(res);
    }
  }
  submitPhoto = (options) =>{
    try { 
      axios.defaults.crossDomain=true;
      let formdata = new FormData();
      formdata.append("image",options.file);
      axios.post("http://localhost:5000/user/upload/"+store.getState().id, formdata, {headers:{'Content-Type':'multipart/form-data'}}).then((res)=>{
          options.onSuccess();
          this.sendResponse(res);
      })
    } catch (error) {
      console.log(error);
    }
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
    const id = store.getState().id;
    // action is the post url.
    return (
        <Fragment>
            <Upload
            name="avatar"
            listType="picture-card"
            className="avatar-uploader"
            showUploadList={false}
            customRequest = {this.submitPhoto}
            beforeUpload={beforeUpload}
            onChange={this.handleChange}
            maxCount = {1}
        >
            {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
        </Upload>
        <p className="ant-upload-hint">
        Photo must small than 2MB and no more than 2048*2048
        </p>
        </Fragment>
    );
  }
}

export default Photo
