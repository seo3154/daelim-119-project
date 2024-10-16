import { User } from "firebase/auth";
import { View, Text, Image, Button, TouchableOpacity } from "react-native";
import styled from "styled-components";
import { MyUser } from "../screens/profile/profile-container";
import { defaultImage } from "../utils/utils";

const Container = styled(View)``;
const Info = styled(View)`
  flex-direction: row;
`;
const Data = styled(View)`
  justify-content: center;
`;
const Name = styled(Text)`
  font-size: 35px;
  font-weight: bold;
`;
const Email = styled(Text)`
  font-size: 20px;
  color: black;
`;
const JoinDate = styled(Text)`
  font-size: 20px;
  color: #363636;
  font-weight: 400;
`;
const ProfileImg = styled(Image)`
  width: 150px;
  height: 200px;
  margin-right: 10px;
  border-radius: 7px;
  background-color: red;
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
          <JoinDate>{user?.creationTime}</JoinDate>
        </Data>
      </Info>
    </Container>
  );
};
