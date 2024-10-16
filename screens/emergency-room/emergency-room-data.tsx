import axios from "axios";

interface EmergencyRoomData {
  id: number;
  name: string;
  location: string;
  availableBeds: number;
  // 필요한 다른 데이터 필드 추가
}

const fetchEmergencyRoomData = async (): Promise<EmergencyRoomData[]> => {
  try {
    const response = await axios.get<EmergencyRoomData[]>(
      "https://api.example.com/emergency-rooms"
    ); // 백엔드의 API 엔드포인트
    return response.data;
  } catch (error) {
    console.error("Error fetching emergency room data", error);
    throw error; // 에러가 발생하면 예외를 던짐
  }
};

export default EmergencyRoomData;
