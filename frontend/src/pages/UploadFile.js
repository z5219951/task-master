import { Upload, Button, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import reqwest from 'reqwest';
import 'antd/dist/antd.css';
import './Photo.css'
import React from 'react'
import { Component } from 'react';
import store from '../store';


class UploadFile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        fileList: [],
        uploading: false,
        taskId:props.taskId
    };
  }
  sendResponse = (res)=>{
    this.props.sendResponse(res);
  }

  handleUpload = () => {
    const { fileList } = this.state;
    const formData = new FormData();
    fileList.forEach(file => {
      formData.append('file', file);
    });

    this.setState({
      uploading: true,
    });
    // You can use any AJAX library you like
    reqwest({
      url: "http://localhost:5000/tasks/upload/"+this.state.taskId,
      method: 'post',
      processData: false,
      data: formData,
      success: (res) => {
        this.setState({
          fileList: [],
          uploading: false,
        });
        message.success('upload successfully.');
        this.sendResponse(res);
      },
      error: () => {
        this.setState({
          uploading: false,
        });
        message.error('upload failed.');
      },
    });
  };

  render() {
    const { uploading, fileList } = this.state;
    const props = {
      onRemove: file => {
        this.setState(state => {
          const index = state.fileList.indexOf(file);
          const newFileList = state.fileList.slice();
          newFileList.splice(index, 1);
          return {
            fileList: newFileList,
          };
        });
      },
      beforeUpload: file => {
        this.setState(state => ({
          fileList: [...state.fileList, file],
        }));
        return false;
      },
      fileList,
    };

    return (
      <>
        <Upload {...props} >
          <Button icon={<UploadOutlined />}>Select File</Button>
        </Upload>
        <Button
          type="primary"
          onClick={this.handleUpload}
          disabled={fileList.length === 0}
          loading={uploading}
          style={{ marginTop: 16 }}
        >
          {uploading ? 'Uploading' : 'Start Upload'}
        </Button>
      </>
    );
  }
}


export default UploadFile;
