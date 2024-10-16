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
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showButtons, setShowButtons] = useState<boolean>(true);
  const [address, setAddress] = useState<string | null>(null);

  const [mapRegion, setMapRegion] = useState({
    latitude: 37.5665,
    longitude: 126.978,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  const navigation = useNavigation();

  // 위치 권한 요청 및 초기 위치 설정
  const locationPermissions = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("위치에 대한 액세스 권한이 거부되었습니다.");
        return;
      }
      const userLocation = await Location.getCurrentPositionAsync({});
      if (
        userLocation.coords.latitude !== location?.latitude ||
        userLocation.coords.longitude !== location?.longitude
      ) {
        setLocation(userLocation.coords);
        setMapRegion({
          latitude: userLocation.coords.latitude,
          longitude: userLocation.coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });
        fetchAddressFromCoords(
          userLocation.coords.latitude,
          userLocation.coords.longitude
        );
      }
    } catch (error) {
      setErrorMsg("Failed to get current location.");
    }
  };

  // 위도, 경도로부터 주소 정보 가져오기
  const fetchAddressFromCoords = async (
    latitude: number,
    longitude: number
  ) => {
    try {
      const [result] = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });
      if (result) {
        // 필요한 필드 추출
        const { region, city, district, street, name } = result;

        // 한글로 주소 문자열 구성
        const fullAddress = [
          region || "", // 시도
          city || "", // 시군구
          district || "", // 읍면동
          street || "", // 상세주소
          name || "", // 기타 이름
        ]
          .filter(Boolean)
          .join(" "); // 비어있지 않은 값만 포함하여 조합

        setAddress(fullAddress);
      } else {
        setAddress("주소를 찾을 수 없습니다.");
      }
    } catch (error) {
      setErrorMsg("역 지오코딩 중 오류가 발생했습니다.");
    }
  };

  useEffect(() => {
    locationPermissions();
  }, []);

  // 검색 함수 (메모이제이션 처리)
  const handleSearch = useCallback(async () => {
    try {
      const results = await Location.geocodeAsync(searchQuery);
      if (results.length > 0) {
        const { latitude, longitude } = results[0];
        setMapRegion({
          latitude,
          longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });
        fetchAddressFromCoords(latitude, longitude);
        setSearchQuery("");
      } else {
        Alert.alert("위치를 찾을 수 없습니다.");
      }
    } catch (error) {
      setErrorMsg("위치 검색 중 오류가 발생했습니다.");
    }
  }, [searchQuery]);

  return (
    <SafeContainer>
      <Header>
        <HeaderText>Test 병원</HeaderText>
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
        </MapV>
      </MapContainer>

      <EmergencyContainer>
        <EmergencyData>응급실 정보 출력 Test</EmergencyData>
      </EmergencyContainer>

      <ButtonContainer show={showButtons}>
        {[
          { title: "공유", screen: "EmergencyRoomScreen" },
          { title: "전화", screen: "FirstAidScreen" },
          { title: "길찾기", screen: "BookmarkScreen" },
        ].map((button) => (
          <ActionButton
            key={button.screen}
            onPress={() => navigation.navigate(button.screen)} // Add this line
          >
            <ActionButtonText>{button.title}</ActionButtonText>
          </ActionButton>
        ))}
      </ButtonContainer>
    </SafeContainer>
  );
};

export default EmergencyRoomScreen;
