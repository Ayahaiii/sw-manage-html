import axios from 'axios';
let qs = require('qs');

axios.defaults.withCredentials = true;

let baseUrl = 'http://localhost:8060/manage';
// let baseUrl = 'http://132.232.161.177:8060/manage';//132测试

/**
 * get 请求
 */
const httpGet = function (url = '', data = {}) {
  const instance = axios.create({
    baseURL: baseUrl,
    headers: {
      'Accept': 'application/json;charset=UTF-8',
      'content-type': 'application/json'
    }
  });
  return instance.get(url, {
    params: data
  }).then((result) => {
    var res = result.data;
    if (res) {
      return Promise.resolve(res);
    } else {
        this.$message({
          message: res.message,
          type: 'info'
        });
      }
  }).catch(() => {
    console.log('网络请求错误');
  })
}

/** 
 * post 请求
 */
const httpPost = function (url = '', data = {}) {
  const instance = axios.create({
    baseURL: baseUrl,
    headers: {
      'Accept': 'application/json;charset=UTF-8',
      'content-type': 'application/json'
    }
  });
  return instance.post(url, JSON.stringify(data)).then((result) => {
    var res = result.data;
    // console.log(res)
    if (res && res.code===0) {
      return Promise.resolve(res);
    } else {
      this.$message({
        message: res.message,
        type: 'info'
      });
    }
  }).catch(() => {
    console.log('网络请求错误');
    console.log(url);
  })
}

export {
  baseUrl,
  httpGet,
  httpPost
}