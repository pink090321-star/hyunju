import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  RescueCat,
  AdoptionApplication,
  DirectMessage,
  PostAdoptionCareRecord,
  AdoptionStage,
} from '../types';
import {
  INITIAL_CATS,
  INITIAL_APPLICATIONS,
  INITIAL_MESSAGES,
  INITIAL_POST_ADOPTION_RECORDS,
} from '../data/mockData';

interface AdoptionContextType {
  cats: RescueCat[];
  applications: AdoptionApplication[];
  messages: DirectMessage[];
  postAdoptionRecords: PostAdoptionCareRecord[];
  userRole: 'adopter' | 'shelter';
  setUserRole: (role: 'adopter' | 'shelter') => void;
  selectedCatForModal: RescueCat | null;
  setSelectedCatForModal: (cat: RescueCat | null) => void;
  isApplyModalOpen: boolean;
  openApplyModal: (cat: RescueCat) => void;
  closeApplyModal: () => void;
  activeChatAppId: string | null;
  setActiveChatAppId: (appId: string | null) => void;
  
  // Actions
  submitApplication: (appData: Omit<AdoptionApplication, 'id' | 'appliedAt' | 'stage' | 'stageHistory' | 'score'>) => string;
  updateApplicationStage: (appId: string, stage: AdoptionStage, note: string, interviewDate?: string) => void;
  sendMessage: (content: string, applicationId?: string, catId?: string, attachmentUrl?: string) => void;
  addRescueCat: (cat: Omit<RescueCat, 'id'>) => void;
  updateRescueCat: (id: string, updates: Partial<RescueCat>) => void;
  addPostCareDiary: (recordId: string, diary: { title: string; content: string; photoUrl: string; weightKg: number; mood: any }) => void;
  addShelterFeedbackToDiary: (recordId: string, diaryId: string, feedback: string) => void;
  toggleVaccineStatus: (recordId: string, vaccineId: string, hospitalName?: string) => void;
  resetAllData: () => void;
}

const AdoptionContext = createContext<AdoptionContextType | null>(null);

const STORAGE_KEYS = {
  CATS: 'myo_yeon_cats_v1',
  APPS: 'myo_yeon_apps_v1',
  MSGS: 'myo_yeon_msgs_v1',
  POST_CARE: 'myo_yeon_post_care_v1',
  ROLE: 'myo_yeon_user_role_v1',
};

export const AdoptionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cats, setCats] = useState<RescueCat[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CATS);
    return saved ? JSON.parse(saved) : INITIAL_CATS;
  });

  const [applications, setApplications] = useState<AdoptionApplication[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.APPS);
    return saved ? JSON.parse(saved) : INITIAL_APPLICATIONS;
  });

  const [messages, setMessages] = useState<DirectMessage[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.MSGS);
    return saved ? JSON.parse(saved) : INITIAL_MESSAGES;
  });

  const [postAdoptionRecords, setPostAdoptionRecords] = useState<PostAdoptionCareRecord[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.POST_CARE);
    return saved ? JSON.parse(saved) : INITIAL_POST_ADOPTION_RECORDS;
  });

  const [userRole, setUserRole] = useState<'adopter' | 'shelter'>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ROLE);
    return (saved === 'shelter' || saved === 'adopter') ? saved : 'adopter';
  });

  const [selectedCatForModal, setSelectedCatForModal] = useState<RescueCat | null>(null);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [activeChatAppId, setActiveChatAppId] = useState<string | null>(null);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CATS, JSON.stringify(cats));
  }, [cats]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.APPS, JSON.stringify(applications));
  }, [applications]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MSGS, JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.POST_CARE, JSON.stringify(postAdoptionRecords));
  }, [postAdoptionRecords]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ROLE, userRole);
  }, [userRole]);

  const openApplyModal = (cat: RescueCat) => {
    setSelectedCatForModal(cat);
    setIsApplyModalOpen(true);
  };

  const closeApplyModal = () => {
    setIsApplyModalOpen(false);
  };

  // Submit Adoption Application with automated scoring & stage initialization
  const submitApplication = (appData: Omit<AdoptionApplication, 'id' | 'appliedAt' | 'stage' | 'stageHistory' | 'score'>): string => {
    const newId = `app-${Date.now().toString().slice(-4)}`;
    const nowStr = new Date().toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });

    // Calculate automated suitability score
    let score = 70;
    if (appData.safetyScreenInstalled) score += 15;
    if (appData.familyAgreement) score += 10;
    if (appData.isPetAllowed) score += 5;
    if (appData.hasAllergyChecked) score += 5;
    if (appData.hoursAloneDaily <= 6) score += 5;
    if (appData.monthlyBudget >= 20) score += 5;
    score = Math.min(100, score);

    const newApp: AdoptionApplication = {
      ...appData,
      id: newId,
      appliedAt: nowStr,
      stage: 'STAGE_1_SUBMITTED',
      score,
      stageHistory: [
        {
          stage: 'STAGE_1_SUBMITTED',
          date: nowStr,
          note: '온라인 입양 신청서 접수 완료. 보호소 심사 대기 중.',
        },
      ],
    };

    setApplications((prev) => [newApp, ...prev]);

    // Update cat status to '심사중'
    setCats((prev) =>
      prev.map((c) => (c.id === appData.catId && c.status === '입양대기' ? { ...c, status: '심사중' } : c))
    );

    // Automated system notification message
    const welcomeMsg: DirectMessage = {
      id: `msg-${Date.now()}`,
      applicationId: newId,
      catId: appData.catId,
      sender: 'system',
      senderName: '묘연 심사 시스템',
      content: `🎉 [${appData.catName}] 입양 신청이 정상 접수되었습니다. (서류 적합도 자동평가: ${score}점) 담당 보호소([${appData.shelterName}])에서 24시간 이내 서류 심사를 시작합니다. 궁금한 점은 이 채팅창을 통해 담당자와 바로 소통하실 수 있습니다.`,
      timestamp: nowStr,
      isRead: false,
    };

    setMessages((prev) => [...prev, welcomeMsg]);
    return newId;
  };

  // Move application to next/specific stage & trigger automated system notifications
  const updateApplicationStage = (appId: string, stage: AdoptionStage, note: string, interviewDate?: string) => {
    const nowStr = new Date().toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });

    let targetApp: AdoptionApplication | undefined;

    setApplications((prev) =>
      prev.map((app) => {
        if (app.id === appId) {
          targetApp = {
            ...app,
            stage,
            interviewDate: interviewDate || app.interviewDate,
            stageHistory: [
              ...app.stageHistory,
              {
                stage,
                date: nowStr,
                note: note || getStageDefaultNote(stage),
              },
            ],
          };
          return targetApp;
        }
        return app;
      })
    );

    if (!targetApp) return;

    // Stage labels for automated messaging
    const stageTitles: Record<AdoptionStage, string> = {
      STAGE_1_SUBMITTED: '서류 접수 완료',
      STAGE_2_DOC_REVIEW: '서류 심사 합격 및 승인',
      STAGE_3_INTERVIEW: '1차 심층 상담 (유선/대면)',
      STAGE_4_HOME_SAFETY: '가정 안전점검 (방묘창/환경 실사)',
      STAGE_5_TRIAL_CONTRACT: '입양 계약서 체결 및 인도',
      STAGE_6_ADOPTED: '🎉 최종 입양 확정',
      REJECTED: '신청 반려 안내',
    };

    const notifMsg: DirectMessage = {
      id: `msg-${Date.now()}`,
      applicationId: appId,
      catId: targetApp.catId,
      sender: 'system',
      senderName: '묘연 시스템 알림',
      content: `🔔 [입양 절차 업데이트] '${targetApp.catName}' 입양 절차가 [${stageTitles[stage]}] 단계로 진행되었습니다.\n사유/안내: ${note || getStageDefaultNote(stage)}`,
      timestamp: nowStr,
      isRead: false,
    };
    setMessages((prev) => [...prev, notifMsg]);

    // If final adoption confirmed, auto-generate PostAdoptionCareRecord & update Cat status
    if (stage === 'STAGE_6_ADOPTED') {
      setCats((prev) =>
        prev.map((c) => (c.id === targetApp!.catId ? { ...c, status: '입양완료' } : c))
      );

      // Create new post-adoption care record if not exists
      setPostAdoptionRecords((prev) => {
        const exists = prev.some((r) => r.catId === targetApp!.catId);
        if (exists) return prev;

        const newRecord: PostAdoptionCareRecord = {
          id: `post-${Date.now()}`,
          catId: targetApp!.catId,
          catName: targetApp!.catName,
          adopterName: targetApp!.applicantName,
          adoptionDate: new Date().toISOString().split('T')[0],
          currentWeek: 1,
          status: '적응중',
          adaptationDiary: [
            {
              id: `diary-first-${Date.now()}`,
              date: new Date().toISOString().split('T')[0],
              title: `${targetApp!.catName}의 우리 집 첫날 입주!`,
              content: `보호소에서 정식으로 집으로 입주했습니다. 격리방에 숨숨집과 화장실, 사료를 마련해주었어요. 조금 긴장한 것 같지만 눈빛이 편안해보여요.`,
              photoUrl: targetApp!.catPhoto,
              weightKg: 4.0,
              mood: '약간 긴장/숨음',
              shelterFeedback: '입양 축하드립니다! 첫 3~7일은 격리방에서 무리하게 만지지 마시고 밥과 화장실만 차분히 챙겨주시면 안전하게 적응합니다.',
              shelterFeedbackDate: nowStr,
            },
          ],
          vaccineSchedule: [
            {
              id: `vac-1-${Date.now()}`,
              name: '사후 2주차 적응 점검 및 심장사상충 예방',
              dueDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
              isCompleted: false,
            },
            {
              id: `vac-2-${Date.now()}`,
              name: '종합백신(FVRCP) 보강접종 및 기본 혈액검사',
              dueDate: new Date(Date.now() + 60 * 86400000).toISOString().split('T')[0],
              isCompleted: false,
            },
            {
              id: `vac-3-${Date.now()}`,
              name: '지자체 가을/봄 광견병 관급 백신 접종',
              dueDate: new Date(Date.now() + 120 * 86400000).toISOString().split('T')[0],
              isCompleted: false,
            },
          ],
          weightHistory: [
            { date: new Date().toISOString().split('T')[0], weight: 4.0 },
          ],
        };
        return [newRecord, ...prev];
      });
    }
  };

  const getStageDefaultNote = (stage: AdoptionStage): string => {
    switch (stage) {
      case 'STAGE_1_SUBMITTED':
        return '서류가 정상 제출되었습니다.';
      case 'STAGE_2_DOC_REVIEW':
        return '거주 환경과 서류 심사가 적합 판정되었습니다.';
      case 'STAGE_3_INTERVIEW':
        return '담당 보호소와 1:1 심층 상담이 배정되었습니다.';
      case 'STAGE_4_HOME_SAFETY':
        return '가정 안전 시설(방묘창, 방묘문) 점검이 진행됩니다.';
      case 'STAGE_5_TRIAL_CONTRACT':
        return '정식 입양 계약서 체결 및 가족 맞이 단계입니다.';
      case 'STAGE_6_ADOPTED':
        return '평생 가족이 되신 것을 축하합니다! 사후 관리 대시보드가 활성화되었습니다.';
      case 'REJECTED':
        return '입양 심사 기준 미충족으로 인해 신청이 반려되었습니다.';
    }
  };

  const sendMessage = (content: string, applicationId?: string, catId?: string, attachmentUrl?: string) => {
    const nowStr = new Date().toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });

    const newMsg: DirectMessage = {
      id: `msg-${Date.now()}`,
      applicationId,
      catId,
      sender: userRole,
      senderName: userRole === 'adopter' ? '입양 신청자' : '보호소 담당 매니저',
      content,
      timestamp: nowStr,
      attachmentUrl,
      isRead: false,
    };

    setMessages((prev) => [...prev, newMsg]);
  };

  const addRescueCat = (newCat: Omit<RescueCat, 'id'>) => {
    const created: RescueCat = {
      ...newCat,
      id: `cat-${Date.now().toString().slice(-4)}`,
    };
    setCats((prev) => [created, ...prev]);
  };

  const updateRescueCat = (id: string, updates: Partial<RescueCat>) => {
    setCats((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
  };

  const addPostCareDiary = (
    recordId: string,
    diary: { title: string; content: string; photoUrl: string; weightKg: number; mood: any }
  ) => {
    const nowStr = new Date().toISOString().split('T')[0];
    const newEntry = {
      id: `diary-${Date.now()}`,
      date: nowStr,
      ...diary,
    };

    setPostAdoptionRecords((prev) =>
      prev.map((rec) => {
        if (rec.id === recordId) {
          const updatedDiaries = [newEntry, ...rec.adaptationDiary];
          const updatedWeights = [...rec.weightHistory, { date: nowStr, weight: diary.weightKg }];
          return {
            ...rec,
            adaptationDiary: updatedDiaries,
            weightHistory: updatedWeights,
          };
        }
        return rec;
      })
    );
  };

  const addShelterFeedbackToDiary = (recordId: string, diaryId: string, feedback: string) => {
    const nowStr = new Date().toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });

    setPostAdoptionRecords((prev) =>
      prev.map((rec) => {
        if (rec.id === recordId) {
          return {
            ...rec,
            adaptationDiary: rec.adaptationDiary.map((d) =>
              d.id === diaryId
                ? { ...d, shelterFeedback: feedback, shelterFeedbackDate: nowStr }
                : d
            ),
          };
        }
        return rec;
      })
    );
  };

  const toggleVaccineStatus = (recordId: string, vaccineId: string, hospitalName?: string) => {
    const nowStr = new Date().toISOString().split('T')[0];
    setPostAdoptionRecords((prev) =>
      prev.map((rec) => {
        if (rec.id === recordId) {
          return {
            ...rec,
            vaccineSchedule: rec.vaccineSchedule.map((v) =>
              v.id === vaccineId
                ? {
                    ...v,
                    isCompleted: !v.isCompleted,
                    completedDate: !v.isCompleted ? nowStr : undefined,
                    hospitalName: !v.isCompleted ? hospitalName || '연계 동물병원' : undefined,
                  }
                : v
            ),
          };
        }
        return rec;
      })
    );
  };

  const resetAllData = () => {
    localStorage.removeItem(STORAGE_KEYS.CATS);
    localStorage.removeItem(STORAGE_KEYS.APPS);
    localStorage.removeItem(STORAGE_KEYS.MSGS);
    localStorage.removeItem(STORAGE_KEYS.POST_CARE);
    setCats(INITIAL_CATS);
    setApplications(INITIAL_APPLICATIONS);
    setMessages(INITIAL_MESSAGES);
    setPostAdoptionRecords(INITIAL_POST_ADOPTION_RECORDS);
  };

  return (
    <AdoptionContext.Provider
      value={{
        cats,
        applications,
        messages,
        postAdoptionRecords,
        userRole,
        setUserRole,
        selectedCatForModal,
        setSelectedCatForModal,
        isApplyModalOpen,
        openApplyModal,
        closeApplyModal,
        activeChatAppId,
        setActiveChatAppId,
        submitApplication,
        updateApplicationStage,
        sendMessage,
        addRescueCat,
        updateRescueCat,
        addPostCareDiary,
        addShelterFeedbackToDiary,
        toggleVaccineStatus,
        resetAllData,
      }}
    >
      {children}
    </AdoptionContext.Provider>
  );
};

export const useAdoption = () => {
  const context = useContext(AdoptionContext);
  if (!context) {
    throw new Error('useAdoption must be used within an AdoptionProvider');
  }
  return context;
};
