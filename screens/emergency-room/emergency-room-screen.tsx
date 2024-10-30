import { useNavigation } from "@react-navigation/native";
import { useCallback, useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  Alert,
  TouchableOpacity,
} from "react-native";
import styled from "styled-components/native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import axios from "axios";
import EmergencyRoomData from "./emergency-room-data";

const EmergencyRoomScreen = () => {
  const SafeContainer = styled(SafeAreaView)`
    flex: 1;
    /* background-color: gray; */
    justify-content: space-between;
  `;

  const Header = styled(View)`
    width: 100%;
    padding: 20px;
    background-color: #ff8520;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  `;

  const HeaderText = styled(Text)`
    color: black;
    font-size: 24px;
    font-weight: bold;
    flex: 1;
    text-align: center;
  `;

  const MapContainer = styled(View)`
    flex: 1;
    justify-content: start;
    align-items: center;
    height: 60%;
    top: 20px;
    bottom: 600px;
  `;

  const MapV = styled(MapView)`
    width: 100%;
    height: 50%;
  `;

  const ActionButton = styled(TouchableOpacity)`
    width: 32%;
    height: 60px;
    margin-bottom: 10px;
    background-color: #ff8520;
    border-radius: 10px;
    align-items: center;
    justify-content: center;
  `;

  const ButtonContainer = styled(View)<{ show: boolean }>`
    padding: 10px;
    background-color: #f5f5f5;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
    position: absolute;
    bottom: 10px;
    left: 0;
    right: 0;
    display: ${(props) => (props.show ? "flex" : "none")};
  `;

  const ActionButtonText = styled(Text)`
    font-size: 14px;
    color: black;
    font-weight: bold;
  `;

  const EmergencyContainer = styled(View)`
    width: 100%;
    height: 50%;
    background-color: blue;
    bottom: 160px;
  `;

  const EmergencyData = styled(Text)`
    font-size: 60px;
    color: black;
    font-weight: bold;
  `;

  const [location, setLocation] =
    useState<Location.LocationObjectCoords | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [emergencyRooms, setEmergencyRooms] = useState<EmergencyRoomData[]>([]);
  const [nearestRooms, setNearestRooms] = useState<EmergencyRoomData[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [mapRegion, setMapRegion] = useState({
    latitude: 37.5665,
    longitude: 126.978,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  const navigation = useNavigation();

  // 현재 위치 권한 요청 및 설정
  const locationPermissions = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("위치에 대한 액세스 권한이 거부되었습니다.");
        return;
      }
      const userLocation = await Location.getCurrentPositionAsync({});
      setLocation(userLocation.coords);
      setMapRegion({
        latitude: userLocation.coords.latitude,
        longitude: userLocation.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
      fetchEmergencyRoomData(
        userLocation.coords.latitude,
        userLocation.coords.longitude
      );
    } catch (error) {
      setErrorMsg("현재 위치를 가져오는 데 실패했습니다.");
    }
  };

  // 주변 병원 데이터를 가져오는 함수
  const fetchEmergencyRoomData = async (
    latitude: number,
    longitude: number
  ) => {
    try {
      const response = await axios.get<EmergencyRoomData[]>(
        "https://hospital-main-api.minq.work/swagger-ui/index.html"
      );
      const data = response.data;
      const filteredRooms = data.filter((room) => {
        const distance = calculateDistance(
          latitude,
          longitude,
          room.latitude,
          room.longitude
        );
        return distance <= 5; // 반경 5km 내의 병원만 필터링
      });
      setEmergencyRooms(filteredRooms);
      setNearestRooms(filteredRooms);
    } catch (error) {
      console.error("병원 데이터를 가져오는 중 오류 발생:", error);
    }
  };

  // 두 지점 간의 거리 계산 (위도/경도를 이용한 Haversine 공식을 사용)
  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ) => {
    const R = 6371; // 지구 반지름 (km)
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // 거리 반환 (km)
  };

  useEffect(() => {
    locationPermissions();
  }, []);

  return (
    <SafeContainer>
      <Header>
        <HeaderText>응급실 위치</HeaderText>
      </Header>
      <MapContainer>
        <MapV region={mapRegion} showsUserLocation={true}>
          {location && (
            <Marker
              coordinate={{
                latitude: location.latitude,
                longitude: location.longitude,
              }}
              title="현재 위치"
            />
          )}
          {nearestRooms.map((room) => (
            <Marker
              key={room.id}
              coordinate={{
                latitude: room.latitude,
                longitude: room.longitude,
              }}
              title={room.name}
            />
          ))}
        </MapV>
      </MapContainer>

      <EmergencyContainer>
        {nearestRooms.length > 0 ? (
          nearestRooms.map((room) => (
            <View key={room.id}>
              <EmergencyData>{room.name}</EmergencyData>
              <Text>{room.location}</Text>
              <Text>Available Beds: {room.availableBeds}</Text>
            </View>
          ))
        ) : (
          <EmergencyData>근처 병원이 없습니다.</EmergencyData>
        )}
      </EmergencyContainer>

      <ButtonContainer show={true}>
        {[
          { title: "공유", screen: "ShareScreen" },
          { title: "전화", screen: "CallScreen" },
          { title: "길찾기", screen: "DirectionsScreen" },
        ].map((button) => (
          <ActionButton
            key={button.screen}
            onPress={() => navigation.navigate(button.screen)}
          >
            <ActionButtonText>{button.title}</ActionButtonText>
          </ActionButton>
        ))}
      </ButtonContainer>
    </SafeContainer>
  );
};

export default EmergencyRoomScreen;
