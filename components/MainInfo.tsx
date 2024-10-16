import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import styled from "styled-components/native";
import { MyUser } from "../screens/main/main-container";
import { defaultImage } from "../utils/utils";

const Container = styled(View)`
  flex-direction: row;
  align-items: center;
`;
const Info = styled(View)`
  flex-direction: row;
  align-items: center;
`;
const Data = styled(View)`
  justify-content: center;
`;
const Name = styled(Text)`
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 5px;
`;
const Email = styled(Text)`
  font-size: 15px;
  color: black;
  margin-bottom: 5px;
`;
const JoinDate = styled(Text)`
  font-size: 15px;
  color: #363636;
  font-weight: 400;
`;
const ProfileImg = styled(Image)`
  width: 80px;
  height: 80px;
  margin-right: 10px;
  border-radius: 40px;
  background-color: #ffc44f;
`;
const CustomButton = styled(TouchableOpacity)``;

type Props = {
  user: MyUser | undefined;
  onEditImage: () => void;
};

export default ({ user, onEditImage }: Props) => {
  return (
    <Container>
      <Info>
        <CustomButton onPress={onEditImage}>
          <ProfileImg source={defaultImage(user?.photoURL)} />
        </CustomButton>
        <Data>
          <Name>{user?.name}</Name>
          <Email>{user?.email}</Email>
          <JoinDate>가입일: {user?.creationTime}</JoinDate>
        </Data>
      </Info>
    </Container>
  );
};
