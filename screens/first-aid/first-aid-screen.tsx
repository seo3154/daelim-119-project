import { SafeAreaView, Text, View } from "react-native";
import styled from "styled-components";

const FirstAidScreen = () => {
  const SafeContainer = styled(SafeAreaView)`
    flex: 1;
    justify-content: space-between;
  `;

  const HeaderText = styled(Text)`
    color: black;
    font-size: 24px;
    font-weight: bold;
    flex: 1;
    text-align: center;
  `;

  const Header = styled(View)`
    width: 100%;
    padding: 20px;
    background-color: #ff8520;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  `;

  return (
    <SafeContainer>
      <Header>
        <HeaderText>응급처치</HeaderText>
      </Header>
    </SafeContainer>
  );
};

export default FirstAidScreen;
