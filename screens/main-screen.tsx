import React, { useEffect, useState, useCallback } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  TouchableOpacity,
  View,
  Text,
  SafeAreaView,
  TextInput,
  Alert,
} from "react-native";
import styled from "styled-components/native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { FontAwesome } from "@expo/vector-icons";

const MainScreen = () => {
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

  // 줌 인/아웃 핸들러
  const handleZoom = (factor: number) => {
    setMapRegion((prevRegion) => ({
      ...prevRegion,
      latitudeDelta: prevRegion.latitudeDelta * factor,
      longitudeDelta: prevRegion.longitudeDelta * factor,
    }));
  };

  return (
    <SafeContainer>
      <Header>
        <MenuButton onPress={() => setShowButtons(!showButtons)}>
          <FontAwesome name="bars" size={24} color="black" />
        </MenuButton>
        <HeaderText>의료 앱</HeaderText>
      </Header>

      <Container>
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
        <SearchAddressContainer>
          <SearchContainer>
            <SearchBar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              handleSearch={handleSearch}
            />
          </SearchContainer>
          <AddressContainer>
            <AddressText>
              {address ? `주소: ${address}` : "위치를 선택하세요"}
            </AddressText>
            {errorMsg && <ErrorText>{errorMsg}</ErrorText>}
          </AddressContainer>
        </SearchAddressContainer>

        <ZoomButtonContainer>
          <ZoomButton onPress={() => handleZoom(0.5)}>
            <FontAwesome name="plus" size={24} color="black" />
          </ZoomButton>
          <ZoomButton onPress={() => handleZoom(2)}>
            <FontAwesome name="minus" size={24} color="black" />
          </ZoomButton>
        </ZoomButtonContainer>
      </Container>

      <ButtonContainer show={showButtons}>
        {[
          { title: "응급실", screen: "EmergencyRoomScreen" },
          { title: "응급처치", screen: "FirstAidScreen" },
          { title: "즐겨찾기", screen: "BookmarkScreen" },
          { title: "응급실조건검색", screen: "EmergencyConditionSearchScreen" },
          { title: "상세페이지(테스트용)", screen: "TestScreen" },
        ].map((button) => (
          <ActionButton
            key={button.screen}
            onPress={() => navigation.navigate(button.screen)} // Add this line
          >
            <ActionButtonText>{button.title}</ActionButtonText>
          </ActionButton>
        ))}
      </ButtonContainer>

      <ToggleButton onPress={() => setShowButtons(!showButtons)}>
        <FontAwesome
          name={showButtons ? "chevron-down" : "chevron-up"}
          size={24}
          color="black"
        />
      </ToggleButton>
    </SafeContainer>
  );
};

// SearchBar 컴포넌트를 분리하고 메모이제이션을 적용하여 불필요한 리렌더링 방지
const SearchBar = React.memo(
  ({ searchQuery, setSearchQuery, handleSearch }: any) => (
    <SearchContainer>
      <SearchInput
        placeholder="위치 검색"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <SearchButton onPress={handleSearch}>
        <SearchButtonText>검색</SearchButtonText>
      </SearchButton>
    </SearchContainer>
  )
);

// Styled components
const SafeContainer = styled(SafeAreaView)`
  flex: 1;
  background-color: #f5f5f5;
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

const MenuButton = styled(TouchableOpacity)`
  width: 50px;
  height: 50px;
  align-items: center;
  justify-content: center;
`;

const Container = styled(View)`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const MapV = styled(MapView)`
  width: 100%;
  height: 100%;
`;

const SearchAddressContainer = styled(View)`
  align-items: center;
  width: 100%;
  height: 130px;
  position: absolute;
  top: 10;
`;

const SearchContainer = styled(View)`
  flex-direction: row;
  align-items: center;
  width: 90%;
  position: absolute;
  top: 30px;
`;

const SearchInput = styled(TextInput)`
  width: 95%;
  height: 50px;
  border-radius: 5px;
  border: 1px solid #ccc;
  padding: 10px;
  background-color: white;
`;

const SearchButton = styled(TouchableOpacity)`
  background-color: #ff8520;
  padding: 10px;
  border-radius: 5px;
  height: 45px;
  left: 15;
`;

const SearchButtonText = styled(Text)`
  color: white;
  text-align: center;
`;

const ZoomButtonContainer = styled(View)`
  position: absolute;
  right: 10px;
  top: 190px;
  flex-direction: column;
  align-items: center;
`;

const ZoomButton = styled(TouchableOpacity)`
  width: 50px;
  height: 50px;
  background-color: #ff8520;
  border-radius: 25px;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
`;

const AddressContainer = styled(View)`
  position: absolute;
  left: 20px;
  right: 20px;
  background-color: white;
  padding: 15px;
  border-radius: 10px;
`;

const AddressText = styled(Text)`
  font-size: 16px;
  font-weight: bold;
`;

const ErrorText = styled(Text)`
  color: red;
`;

const ButtonContainer = styled(View)<{ show: boolean }>`
  padding: 10px;
  background-color: #f5f5f5;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  position: absolute;
  bottom: 40px;
  left: 0;
  right: 0;
  display: ${(props) => (props.show ? "flex" : "none")};
`;

const ActionButton = styled(TouchableOpacity)`
  width: 22%;
  height: 80px;
  margin-bottom: 10px;
  background-color: #ff8520;
  border-radius: 10px;
  align-items: center;
  justify-content: center;
`;

const ActionButtonText = styled(Text)`
  font-size: 14px;
  color: black;
  font-weight: bold;
`;

const ToggleButton = styled(TouchableOpacity)`
  position: absolute;
  bottom: 10px;
  right: 10px;
  background-color: #ff8520;
  padding: 10px;
  border-radius: 50px;
  align-items: center;
  justify-content: center;
`;

export default MainScreen;
