import { SafeAreaView } from "react-native";
import styled from "styled-components";

const TestScreen = () => {
  const SafeContainer = styled(SafeAreaView)`
    flex: 1;
    background-color: gray;
    justify-content: space-between;
  `;

  return <SafeContainer></SafeContainer>;
};

export default TestScreen;
