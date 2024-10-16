import { FlatList, SafeAreaView, View, Text } from "react-native";
import styled from "styled-components";
import axios from "axios";
import { useEffect, useState } from "react";
import EmergencyRoomData from "./emergency-room-data";

const EmergencyRoomList = () => {
  const [emergencyRooms, setEmergencyRooms] = useState<EmergencyRoomData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchEmergencyRoomData();
        setEmergencyRooms(data);
      } catch (error) {
        console.error("Error loading emergency room data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // 빈 배열은 컴포넌트가 처음 렌더링될 때만 실행되도록 합니다.

  if (loading) {
    return <Text>Loading...</Text>;
  }

  const SafeContainer = styled(SafeAreaView)`
    flex: 1;
    /* background-color: gray; */
    justify-content: space-between;
  `;

  return (
    <SafeContainer>
      <View>
        <FlatList
          data={emergencyRooms}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View>
              <Text>{item.name}</Text>
              <Text>{item.location}</Text>
              <Text>Available Beds: {item.availableBeds}</Text>
            </View>
          )}
        />
      </View>
    </SafeContainer>
  );
};

export default EmergencyRoomList;
