import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { SafeAreaView, Text, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import styled from "styled-components";

const EmergencyConditionSearchScreen = () => {
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

  const MapV = styled(MapView)`
    width: 100%;
    height: 100%;
  `;

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

  return (
    <SafeContainer>
      <Header>
        <HeaderText>응급실조건검색</HeaderText>
      </Header>
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
    </SafeContainer>
  );
};

export default EmergencyConditionSearchScreen;
