import axios from "axios";
import { useEffect } from "react";

const RestAPIRequest = () => {
  useEffect(() => {
    requestGet();
    requestPost();
    requestPut();
    requestDelete();
  }, []);

  // GET
  const requestGet = async () => {
    try {
      const response = await axios.get(
        "<https://jsonplaceholder.typicode.com/posts>"
      );
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  // POST
  const requestPost = async () => {
    const data = {
      title: "foo",
      body: "bar",
      userId: 1,
    };

    try {
      const response = await axios.post(
        "<https://jsonplaceholder.typicode.com/posts>",
        data
      );
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  // PUT
  const requestPut = async () => {
    const data = {
      title: "foo",
      body: "bar",
      userId: 1,
    };
    try {
      const response = await axios.put(
        "<https://jsonplaceholder.typicode.com/posts/1>",
        data
      );
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  // DELETE
  const requestDelete = async () => {
    try {
      const response = await axios.delete(
        "<https://jsonplaceholder.typicode.com/posts/1>"
      );
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };
};
export default RestAPIRequest;
