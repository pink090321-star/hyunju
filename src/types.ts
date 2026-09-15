export type AdoptionStage =
  | 'STAGE_1_SUBMITTED'       // 서류 접수 완료
  | 'STAGE_2_DOC_REVIEW'      // 서류 심사 중
  | 'STAGE_3_INTERVIEW'       // 1차 심층 상담 (유선/대면)
  | 'STAGE_4_HOME_SAFETY'     // 가정 환경 & 안전점검 (방묘창 확인)
  | 'STAGE_5_TRIAL_CONTRACT'  // 입양 계약서 체결 및 인도
  | 'STAGE_6_ADOPTED'         // 입양 완료 및 사후 관리 전환
  | 'REJECTED';               // 반려

export type CatStatus = '입양대기' | '심사중' | '입양완료' | '임시보호중';

export interface RescueCat {
  id: string;
  name: string;
  breed: string; // e.g. 코리안 숏헤어 치즈태비, 턱시도, 삼색이, 고등어, 러시안블루 믹스
  age: string;   // e.g. 3개월령, 1세 추정, 2세 추정
  gender: '남아' | '여아';
  isNeutered: boolean;
  weight: number; // kg
  rescueLocation: string; // e.g. 서울 마포구 연남동 골목
  rescueDate: string;
  shelterName: string;
  shelterContact: string;
  status: CatStatus;
  mainPhoto: string;
  additionalPhotos: string[];
  personalityTags: string[];
  story: string;
  healthInfo: {
    fivFelv: '음성 (건강)' | '양성' | '검사예정';
    vaccinations: string; // e.g. 종합백신 3차 완료, 광견병 완료
    specialCare?: string;
    isChipped: boolean;
  };
  compatibility: {
    firstTimeOwner: boolean; // 초보 집사 추천
    withOtherCats: boolean;  // 다른 고양이와 친화적
    withChildren: boolean;   // 아이 있는 가정 가능
    activityLevel: '조용함' | '보통' | '활발함';
  };
  adoptionRequirements: string[];
}

export interface AdoptionApplication {
  id: string;
  catId: string;
  catName: string;
  catBreed: string;
  catPhoto: string;
  shelterName: string;
  applicantName: string;
  phone: string;
  email: string;
  address: string;
  housingType: '아파트' | '빌라/다세대' | '단독주택' | '오피스텔/원룸';
  isPetAllowed: boolean;
  familyMembersCount: number;
  hasAllergyChecked: boolean;
  familyAgreement: boolean;
  currentPets: string;
  catExperience: '초보 집사 (첫 반려)' | '1~3년' | '3년 이상 베테랑' | '현재 고양이 반려 중';
  hoursAloneDaily: number;
  monthlyBudget: number; // 만원 단위
  safetyScreenInstalled: boolean; // 방묘창/방묘문 설치 여부
  safetyScreenPhotoUrl?: string; // 사진 인증
  reasonForAdoption: string;
  emergencyCarePlan: string;
  lifetimePledge: boolean; // 평생 양육 및 유기 방지 서약
  appliedAt: string;
  stage: AdoptionStage;
  stageHistory: {
    stage: AdoptionStage;
    date: string;
    note: string;
  }[];
  shelterNotes?: string;
  interviewDate?: string;
  homeCheckDate?: string;
  contractDate?: string;
  score: number; // 0-100점 자동 환경 적합도 평가 점수
}

export interface DirectMessage {
  id: string;
  applicationId?: string;
  catId?: string;
  sender: 'adopter' | 'shelter' | 'system';
  senderName: string;
  content: string;
  timestamp: string;
  attachmentUrl?: string;
  isRead: boolean;
}

export interface PostAdoptionCareRecord {
  id: string;
  catId: string;
  catName: string;
  adopterName: string;
  adoptionDate: string;
  currentWeek: number; // 입양 후 경과 주차
  status: '적응중' | '건강양호' | '집중관찰' | '완전적응';
  adaptationDiary: {
    id: string;
    date: string;
    title: string;
    content: string;
    photoUrl: string;
    weightKg: number;
    mood: '편안함 (골골송)' | '활발히 뛰어놂' | '약간 긴장/숨음' | '병원 방문';
    shelterFeedback?: string;
    shelterFeedbackDate?: string;
  }[];
  vaccineSchedule: {
    id: string;
    name: string; // e.g. 종합백신 FVRCP 추가접종, 심장사상충 구충, 정기 구강검진
    dueDate: string;
    completedDate?: string;
    isCompleted: boolean;
    hospitalName?: string;
  }[];
  weightHistory: {
    date: string;
    weight: number;
  }[];
}
