import axios from "axios";

class RequestService {
  requestHttpGet = () => {
    return axios({
      method: "get",
      //   url: "<https://jsonplaceholder.typicode.com/posts>",
    });
  };

  requestHttpPost = (data) => {
    return axios({
      method: "post",
      //   url: "<https://jsonplaceholder.typicode.com/posts>",
      data: data,
    });
  };

  requestHttpPut = (data) => {
    return axios({
      method: "put",
      //   url: "<https://jsonplaceholder.typicode.com/posts>",
      data: data,
    });
  };
  requestHttpDelete = (data) => {
    return axios({
      method: "delete",
      //   url: "<https://jsonplaceholder.typicode.com/posts>",
      data: data,
    });
  };
}
export default new RequestService();
