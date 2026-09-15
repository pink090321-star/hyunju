import React, { useState } from 'react';
import {
  FileText,
  CheckCircle2,
  Clock,
  MessageCircle,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  Calendar,
  AlertCircle,
  Home,
  Heart,
  ArrowUpRight,
} from 'lucide-react';
import { AdoptionApplication, AdoptionStage } from '../types';
import { useAdoption } from '../context/AdoptionContext';

const STAGES_ORDER: { key: AdoptionStage; title: string; step: number; desc: string }[] = [
  { key: 'STAGE_1_SUBMITTED', step: 1, title: '서류 접수', desc: '온라인 신청서 및 환경 사진 접수' },
  { key: 'STAGE_2_DOC_REVIEW', step: 2, title: '서류 심사', desc: '주거환경 및 알레르기 적합성 검토' },
  { key: 'STAGE_3_INTERVIEW', step: 3, title: '심층 상담', desc: '보호소 담당자와 비대면/대면 면담' },
  { key: 'STAGE_4_HOME_SAFETY', step: 4, title: '안전 점검', desc: '방묘창 및 가정 환경 안전성 실사' },
  { key: 'STAGE_5_TRIAL_CONTRACT', step: 5, title: '계약 체결', desc: '입양 계약서 작성 및 아이 인도' },
  { key: 'STAGE_6_ADOPTED', step: 6, title: '입양 확정', desc: '평생 가족 등록 & 사후 케어 시작' },
];

interface ApplicationTrackerProps {
  onOpenChat: (appId: string) => void;
  onGoToPostCare: () => void;
}

export const ApplicationTracker: React.FC<ApplicationTrackerProps> = ({
  onOpenChat,
  onGoToPostCare,
}) => {
  const { applications, userRole } = useAdoption();
  const [selectedAppId, setSelectedAppId] = useState<string>(
    applications[0]?.id || ''
  );

  const selectedApp = applications.find((a) => a.id === selectedAppId) || applications[0];

  if (!selectedApp) {
    return (
      <div className="bg-white rounded-2xl p-12 text-center border border-stone-200 space-y-4">
        <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto">
          <FileText className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-stone-800">아직 접수된 입양 신청서가 없습니다</h3>
        <p className="text-xs text-stone-500 max-w-md mx-auto">
          입양을 기다리는 길고양이들의 사연을 확인하고 마음에 품은 아이에게 입양 신청서를 보내보세요.
        </p>
      </div>
    );
  }

  const currentStageIndex = STAGES_ORDER.findIndex((s) => s.key === selectedApp.stage);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-stone-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
              실시간 입양 진행 상황
            </span>
            <span className="text-xs text-stone-400">신청번호 #{selectedApp.id}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-stone-900">
            {selectedApp.applicantName} 님의 입양 신청 현황
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            보호소와 실시간으로 연동되어 모든 심사 단계가 투명하게 기록되고 안내됩니다.
          </p>
        </div>

        {/* Application selector pill list if multiple */}
        {applications.length > 1 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            <span className="text-xs font-bold text-stone-500 shrink-0">신청 목록:</span>
            {applications.map((app) => (
              <button
                key={app.id}
                onClick={() => setSelectedAppId(app.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  selectedApp.id === app.id
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                <img
                  src={app.catPhoto}
                  alt={app.catName}
                  className="w-5 h-5 rounded-full object-cover"
                />
                <span>{app.catName}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Grid: Left is Pipeline Tracker, Right is Application Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Visual 6-Stage Progress Pipeline */}
        <div className="lg:col-span-2 space-y-6">
          {/* Target Cat Snapshot Bar */}
          <div className="bg-white p-5 rounded-2xl border border-stone-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
            <div className="flex items-center gap-4">
              <img
                src={selectedApp.catPhoto}
                alt={selectedApp.catName}
                className="w-16 h-16 rounded-xl object-cover border border-stone-200 shadow-xs"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-stone-900">{selectedApp.catName}</h3>
                  <span className="text-xs text-stone-500">{selectedApp.catBreed}</span>
                </div>
                <p className="text-xs text-stone-600 mt-0.5">
                  관할 보호소: <span className="font-semibold text-stone-800">{selectedApp.shelterName}</span>
                </p>
                <span className="text-[11px] text-stone-400">
                  신청일시: {selectedApp.appliedAt}
                </span>
              </div>
            </div>

            {/* Direct Communication CTA */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={() => onOpenChat(selectedApp.id)}
                className="w-full sm:w-auto px-4 py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-indigo-600" />
                보호소 1:1 상담창 열기
              </button>
            </div>
          </div>

          {/* 6-Stage Pipeline Card */}
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-600" />
                입양 심사 절차 단계별 진행 현황
              </h3>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                자동 환경 적합도: {selectedApp.score}점
              </span>
            </div>

            {/* Stepper Steps */}
            <div className="relative">
              {/* Stepper Timeline List */}
              <div className="space-y-4">
                {STAGES_ORDER.map((stageInfo, idx) => {
                  const isCompleted = currentStageIndex > idx;
                  const isCurrent = currentStageIndex === idx;
                  const isPending = currentStageIndex < idx;

                  return (
                    <div
                      key={stageInfo.key}
                      className={`p-4 rounded-xl border transition-all ${
                        isCurrent
                          ? 'border-amber-500 bg-amber-50/60 shadow-xs ring-1 ring-amber-400'
                          : isCompleted
                          ? 'border-emerald-200 bg-emerald-50/30'
                          : 'border-stone-200 bg-stone-50/40 opacity-70'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                            isCompleted
                              ? 'bg-emerald-600 text-white'
                              : isCurrent
                              ? 'bg-amber-600 text-white animate-pulse'
                              : 'bg-stone-300 text-stone-600'
                          }`}
                        >
                          {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : stageInfo.step}
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center justify-between flex-wrap gap-2">
                            <h4
                              className={`text-xs font-bold ${
                                isCurrent
                                  ? 'text-amber-950 text-sm'
                                  : isCompleted
                                  ? 'text-emerald-950'
                                  : 'text-stone-600'
                              }`}
                            >
                              {stageInfo.step}단계. {stageInfo.title}
                            </h4>
                            <span
                              className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                                isCompleted
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : isCurrent
                                  ? 'bg-amber-200 text-amber-900 font-extrabold'
                                  : 'bg-stone-200 text-stone-600'
                              }`}
                            >
                              {isCompleted ? '완료' : isCurrent ? '진행 중' : '대기'}
                            </span>
                          </div>

                          <p className="text-xs text-stone-600 mt-1">{stageInfo.desc}</p>

                          {/* Details for current stage */}
                          {isCurrent && (
                            <div className="mt-3 bg-white p-3 rounded-lg border border-amber-200 text-xs space-y-1.5">
                              {stageInfo.key === 'STAGE_1_SUBMITTED' && (
                                <p className="text-stone-700">
                                  서류가 보호소 담당자에게 전달되었습니다. 담당자가 거주환경과 안전 시설을 검토 중입니다.
                                </p>
                              )}
                              {stageInfo.key === 'STAGE_2_DOC_REVIEW' && (
                                <p className="text-stone-700">
                                  보호소에서 신청자님의 가족 구성 및 알레르기 점검 서류를 심사하고 있습니다. 곧 심층 면담 안내가 발송됩니다.
                                </p>
                              )}
                              {stageInfo.key === 'STAGE_3_INTERVIEW' && (
                                <div className="space-y-1">
                                  <p className="text-stone-800 font-medium flex items-center gap-1.5">
                                    <Calendar className="w-4 h-4 text-amber-600" />
                                    면담 예정 일시: <span className="font-bold">{selectedApp.interviewDate || '보호소와 조율 중'}</span>
                                  </p>
                                  <p className="text-stone-600 text-[11px]">
                                    입양 시 주의사항 및 아이의 성격에 대해 1:1 심층 상담을 진행합니다.
                                  </p>
                                </div>
                              )}
                              {stageInfo.key === 'STAGE_4_HOME_SAFETY' && (
                                <p className="text-stone-700">
                                  제출하신 방묘창 및 가정 환경 안전 점검을 확인하고 있습니다. 필요 시 사진 추가 보완을 요청할 수 있습니다.
                                </p>
                              )}
                              {stageInfo.key === 'STAGE_5_TRIAL_CONTRACT' && (
                                <p className="text-stone-700">
                                  보호소 방문 또는 전자 계약서를 통해 정식 입양 계약을 체결하고 아이를 인도받는 단계입니다.
                                </p>
                              )}
                              {stageInfo.key === 'STAGE_6_ADOPTED' && (
                                <div className="space-y-2">
                                  <p className="text-emerald-800 font-bold">
                                    축하합니다! 정식 입양이 확정되었습니다. 사후 관리 대시보드에서 냥이의 적응 일지와 건강 일정을 관리하세요.
                                  </p>
                                  <button
                                    onClick={onGoToPostCare}
                                    className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold flex items-center gap-1"
                                  >
                                    <Heart className="w-3.5 h-3.5 fill-white" />
                                    사후 관리 대시보드 열기
                                  </button>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Stage Change History Audit Log */}
            <div className="border-t border-stone-200 pt-4">
              <h4 className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">
                심사 이력 타임라인
              </h4>
              <div className="space-y-2">
                {selectedApp.stageHistory.map((hist, idx) => (
                  <div key={idx} className="text-xs flex items-start gap-2 text-stone-600">
                    <span className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                    <div>
                      <span className="text-stone-400 text-[11px] mr-2">{hist.date}</span>
                      <span className="font-semibold text-stone-800">
                        {STAGES_ORDER.find((s) => s.key === hist.stage)?.title}:
                      </span>
                      <span className="ml-1">{hist.note}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Submitted Application Review Info */}
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-stone-900 border-b border-stone-100 pb-2 flex items-center gap-2">
              <FileText className="w-4 h-4 text-stone-600" />
              제출된 신청서 세부 정보
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-stone-400 block mb-0.5">신청자 정보</span>
                <p className="font-semibold text-stone-800">
                  {selectedApp.applicantName} ({selectedApp.phone})
                </p>
                <p className="text-stone-500 text-[11px]">{selectedApp.email}</p>
                <p className="text-stone-600 text-[11px] mt-0.5">{selectedApp.address}</p>
              </div>

              <div className="border-t border-stone-100 pt-2">
                <span className="text-stone-400 block mb-0.5">주거 형태 및 환경</span>
                <p className="font-semibold text-stone-800">
                  {selectedApp.housingType} · 가족 {selectedApp.familyMembersCount}인 거주
                </p>
                <div className="flex flex-wrap gap-1 mt-1">
                  <span className="bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded text-[10px] font-bold">
                    반려동물 허용 완료
                  </span>
                  <span className="bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded text-[10px] font-bold">
                    가족 전원 동의
                  </span>
                  <span className="bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded text-[10px] font-bold">
                    알레르기 확인
                  </span>
                </div>
              </div>

              <div className="border-t border-stone-100 pt-2">
                <span className="text-stone-400 block mb-0.5">케어 준비도</span>
                <p className="text-stone-700">
                  경험: <span className="font-semibold">{selectedApp.catExperience}</span>
                </p>
                <p className="text-stone-700">
                  일일 단독 시간: <span className="font-semibold">{selectedApp.hoursAloneDaily}시간</span>
                </p>
                <p className="text-stone-700">
                  월 양육 예산: <span className="font-semibold">{selectedApp.monthlyBudget}만원</span>
                </p>
              </div>

              {/* Safety Screen Photo Proof */}
              <div className="border-t border-stone-100 pt-2">
                <span className="text-stone-400 block mb-1">방묘창 설치 인증</span>
                {selectedApp.safetyScreenPhotoUrl ? (
                  <div className="space-y-1">
                    <img
                      src={selectedApp.safetyScreenPhotoUrl}
                      alt="방묘창 사진"
                      className="w-full h-28 object-cover rounded-xl border border-stone-200"
                    />
                    <span className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      안전망 증빙 확인 완료
                    </span>
                  </div>
                ) : (
                  <span className="text-amber-600 text-[11px]">방묘창 사진 등록 필요</span>
                )}
              </div>

              <div className="border-t border-stone-100 pt-2">
                <span className="text-stone-400 block mb-0.5">입양 사유</span>
                <p className="text-stone-700 italic bg-stone-50 p-2.5 rounded-lg border border-stone-100 text-[11px]">
                  "{selectedApp.reasonForAdoption}"
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
