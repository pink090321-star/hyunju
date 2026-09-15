import React, { useState } from 'react';
import {
  Heart,
  Calendar,
  Activity,
  CheckCircle2,
  Clock,
  Plus,
  MessageSquare,
  Sparkles,
  Camera,
  AlertCircle,
  PhoneCall,
  Scale,
  Award,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { PostAdoptionCareRecord } from '../types';
import { useAdoption } from '../context/AdoptionContext';

interface PostAdoptionDashboardProps {
  onOpenChatWithShelter?: () => void;
}

export const PostAdoptionDashboard: React.FC<PostAdoptionDashboardProps> = ({
  onOpenChatWithShelter,
}) => {
  const {
    postAdoptionRecords,
    addPostCareDiary,
    addShelterFeedbackToDiary,
    toggleVaccineStatus,
    userRole,
  } = useAdoption();

  const [selectedRecordId, setSelectedRecordId] = useState<string>(
    postAdoptionRecords[0]?.id || ''
  );

  const activeRecord =
    postAdoptionRecords.find((r) => r.id === selectedRecordId) ||
    postAdoptionRecords[0];

  // Modal for new diary entry
  const [isDiaryModalOpen, setIsDiaryModalOpen] = useState(false);
  const [diaryTitle, setDiaryTitle] = useState('');
  const [diaryContent, setDiaryContent] = useState('');
  const [diaryPhotoUrl, setDiaryPhotoUrl] = useState('https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=800&q=80');
  const [diaryWeight, setDiaryWeight] = useState(5.2);
  const [diaryMood, setDiaryMood] = useState<'편안함 (골골송)' | '활발히 뛰어놂' | '약간 긴장/숨음' | '병원 방문'>('편안함 (골골송)');

  // Shelter reply input state
  const [replyingDiaryId, setReplyingDiaryId] = useState<string | null>(null);
  const [shelterReplyText, setShelterReplyText] = useState('');

  // New vaccine schedule input
  const [isVaccineModalOpen, setIsVaccineModalOpen] = useState(false);
  const [newVacName, setNewVacName] = useState('');
  const [newVacDate, setNewVacDate] = useState('');

  if (!activeRecord) {
    return (
      <div className="bg-white rounded-2xl p-12 text-center border border-stone-200 space-y-4">
        <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto">
          <Heart className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-stone-800">아직 등록된 사후 관리 대상 냥이가 없습니다</h3>
        <p className="text-xs text-stone-500 max-w-md mx-auto">
          입양 절차가 최종 완료(6단계)되면 자동으로 전용 사후 관리 대시보드가 생성되어 적응 일지 및 예방접종을 체계적으로 관리하실 수 있습니다.
        </p>
      </div>
    );
  }

  // Calculate days together
  const adoptionTime = new Date(activeRecord.adoptionDate).getTime();
  const nowTime = new Date().getTime();
  const daysTogether = Math.max(1, Math.floor((nowTime - adoptionTime) / (1000 * 60 * 60 * 24)));

  const handleDiarySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!diaryTitle.trim() || !diaryContent.trim()) return;

    addPostCareDiary(activeRecord.id, {
      title: diaryTitle,
      content: diaryContent,
      photoUrl: diaryPhotoUrl,
      weightKg: Number(diaryWeight),
      mood: diaryMood,
    });

    setDiaryTitle('');
    setDiaryContent('');
    setIsDiaryModalOpen(false);
  };

  const handleShelterReplySubmit = (diaryId: string) => {
    if (!shelterReplyText.trim()) return;
    addShelterFeedbackToDiary(activeRecord.id, diaryId, shelterReplyText);
    setShelterReplyText('');
    setReplyingDiaryId(null);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-amber-700 via-orange-600 to-amber-600 rounded-3xl p-6 sm:p-8 text-white shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-amber-200" />
              입양 후 1년 안심 모니터링 시스템
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {activeRecord.catName}와(과) 함께한 지 <span className="underline decoration-amber-300 decoration-4">{daysTogether}일째</span>
            </h1>
            <p className="text-xs sm:text-sm text-amber-100 max-w-xl leading-relaxed">
              입양자 <strong>{activeRecord.adopterName}</strong> 님과 보호소가 함께 기록하는 성장 및 건강 케어 공간입니다.
              정기적인 일지와 접종 기록을 남겨주시면 담당 보호소에서 피드백을 전달해 드립니다.
            </p>
          </div>

          {/* Quick Stat Pill in Hero */}
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 shrink-0">
            <div className="w-12 h-12 rounded-xl bg-amber-500/80 flex items-center justify-center text-white">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] text-amber-200 block font-semibold">적응 모니터링 상태</span>
              <span className="text-lg font-black text-white">{activeRecord.status}</span>
              <span className="text-[10px] text-amber-100 block">경과 {activeRecord.currentWeek}주차 진행 중</span>
            </div>
          </div>
        </div>

        {/* Adopted Cat selector if multiple */}
        {postAdoptionRecords.length > 1 && (
          <div className="mt-6 pt-4 border-t border-white/20 flex items-center gap-2 overflow-x-auto pb-1">
            <span className="text-xs text-amber-200 font-bold shrink-0">입양 가족 선택:</span>
            {postAdoptionRecords.map((rec) => (
              <button
                key={rec.id}
                onClick={() => setSelectedRecordId(rec.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  activeRecord.id === rec.id
                    ? 'bg-white text-amber-900 shadow-xs'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                🐱 {rec.catName} ({rec.adopterName} 님)
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 4-Stage Adaptation Milestones Card */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
          <Activity className="w-4 h-4 text-amber-600" />
          입양 후 4단계 적응 마일스톤 가이드
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {[
            {
              step: '1주차',
              title: '격리방 탐색기',
              desc: '조용한 방에서 사료/물 섭취, 대소변 맛동산 확인 및 숨숨집 안정',
              status: daysTogether >= 7 ? 'completed' : 'current',
            },
            {
              step: '2~4주차',
              title: '영역 확장 & 교감',
              desc: '거실 탐색, 낚싯대 놀이, 콧인사 및 스킨십 적응, 첫 골골송',
              status: daysTogether >= 28 ? 'completed' : daysTogether >= 7 ? 'current' : 'pending',
            },
            {
              step: '1개월차',
              title: '1차 정기 검진',
              desc: '체중 변화 체크, 심장사상충 정기 구충, 보호소 1개월차 안부 일지 제출',
              status: daysTogether >= 30 ? 'current' : 'pending',
            },
            {
              step: '3개월~1년',
              title: '평생 가족 안정기',
              desc: 'FVRCP 종합백신 연례 추가접종, 항체가 검사, 평생 가족 축하 파티',
              status: daysTogether >= 90 ? 'current' : 'pending',
            },
          ].map((milestone, idx) => (
            <div
              key={idx}
              className={`p-3.5 rounded-xl border transition-all ${
                milestone.status === 'completed'
                  ? 'border-emerald-200 bg-emerald-50/50'
                  : milestone.status === 'current'
                  ? 'border-amber-400 bg-amber-50/60 ring-1 ring-amber-300'
                  : 'border-stone-200 bg-stone-50/40 text-stone-400'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-extrabold text-amber-800">{milestone.step}</span>
                {milestone.status === 'completed' ? (
                  <span className="text-emerald-600 font-bold text-[10px] flex items-center gap-0.5">
                    <CheckCircle2 className="w-3 h-3" /> 달성
                  </span>
                ) : milestone.status === 'current' ? (
                  <span className="text-amber-700 font-extrabold text-[10px] bg-amber-200 px-1.5 py-0.2 rounded-md">
                    진행 중
                  </span>
                ) : (
                  <span className="text-stone-400 text-[10px]">예정</span>
                )}
              </div>
              <h4 className="font-bold text-stone-800 mb-1">{milestone.title}</h4>
              <p className="text-[11px] text-stone-600 leading-relaxed">{milestone.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Main Grid: Left is Adaptation Diary, Right is Vaccine/Weight & Emergency SOS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Adaptation Photo Diaries */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                  <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                  {activeRecord.catName}의 적응 일지 & 보호소 피드백
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  집사님이 올린 사진과 기록에 담당 보호소 선생님들이 직접 댓글을 달아드립니다.
                </p>
              </div>

              <button
                id="write-diary-btn"
                onClick={() => setIsDiaryModalOpen(true)}
                className="px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-xs transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                새 안부 일지 작성
              </button>
            </div>

            {/* Diary Entry List */}
            <div className="space-y-5">
              {activeRecord.adaptationDiary.map((diary) => (
                <div
                  key={diary.id}
                  className="bg-stone-50/70 border border-stone-200/90 rounded-2xl p-4 sm:p-5 space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-amber-700 font-extrabold bg-amber-100/70 px-2 py-0.5 rounded-md">
                          {diary.date}
                        </span>
                        <span className="text-xs font-bold text-stone-800 bg-white px-2 py-0.5 rounded-md border border-stone-200">
                          기분: {diary.mood}
                        </span>
                        <span className="text-xs text-stone-600 bg-white px-2 py-0.5 rounded-md border border-stone-200">
                          ⚖️ {diary.weightKg} kg
                        </span>
                      </div>
                      <h4 className="text-sm sm:text-base font-bold text-stone-900 mt-1.5">
                        {diary.title}
                      </h4>
                    </div>
                  </div>

                  {/* Diary Photo & Body */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    {diary.photoUrl && (
                      <img
                        src={diary.photoUrl}
                        alt={diary.title}
                        className="w-full sm:w-44 h-36 object-cover rounded-xl border border-stone-200 shrink-0"
                      />
                    )}
                    <p className="text-xs sm:text-sm text-stone-700 leading-relaxed whitespace-pre-line flex-1">
                      {diary.content}
                    </p>
                  </div>

                  {/* Shelter Feedback Comment Box */}
                  {diary.shelterFeedback ? (
                    <div className="bg-amber-100/60 border border-amber-200/80 rounded-xl p-3.5 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                          <MessageSquare className="w-3.5 h-3.5 text-amber-700" />
                          보호소 선생님의 응원 피드백
                        </span>
                        <span className="text-[10px] text-amber-700">
                          {diary.shelterFeedbackDate}
                        </span>
                      </div>
                      <p className="text-xs text-amber-900 leading-relaxed font-medium">
                        "{diary.shelterFeedback}"
                      </p>
                    </div>
                  ) : (
                    userRole === 'shelter' && (
                      <div className="pt-2 border-t border-stone-200">
                        {replyingDiaryId === diary.id ? (
                          <div className="space-y-2">
                            <textarea
                              rows={2}
                              value={shelterReplyText}
                              onChange={(e) => setShelterReplyText(e.target.value)}
                              placeholder="입양자님에게 전달할 조언이나 응원의 한마디를 적어주세요..."
                              className="w-full text-xs p-2.5 border border-amber-300 rounded-lg bg-white"
                            />
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => setReplyingDiaryId(null)}
                                className="px-2.5 py-1 text-xs text-stone-500 hover:text-stone-700"
                              >
                                취소
                              </button>
                              <button
                                onClick={() => handleShelterReplySubmit(diary.id)}
                                className="px-3 py-1 bg-amber-700 hover:bg-amber-800 text-white text-xs font-bold rounded-lg"
                              >
                                피드백 등록
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() => setReplyingDiaryId(diary.id)}
                            className="text-xs text-amber-800 font-bold hover:underline flex items-center gap-1"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            [보호소 모드] 이 일지에 쉼터 피드백 남기기
                          </button>
                        )}
                      </div>
                    )
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Vaccine Scheduler, Weight Curve & Emergency SOS */}
        <div className="space-y-6">
          {/* Vaccine & Vet Health Scheduler */}
          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-amber-600" />
                예방접종 & 병원 일정
              </h3>
              <span className="text-[11px] text-stone-500">
                완료 {activeRecord.vaccineSchedule.filter((v) => v.isCompleted).length} / {activeRecord.vaccineSchedule.length}
              </span>
            </div>

            <div className="space-y-2.5">
              {activeRecord.vaccineSchedule.map((vac) => (
                <div
                  key={vac.id}
                  onClick={() => toggleVaccineStatus(activeRecord.id, vac.id)}
                  className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                    vac.isCompleted
                      ? 'border-emerald-200 bg-emerald-50/40 text-stone-500'
                      : 'border-stone-200 hover:border-amber-400 bg-white shadow-2xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 ${
                          vac.isCompleted
                            ? 'bg-emerald-600 border-emerald-600 text-white'
                            : 'border-stone-300 bg-stone-50'
                        }`}
                      >
                        {vac.isCompleted && <CheckCircle2 className="w-3.5 h-3.5" />}
                      </div>
                      <span className={`font-semibold ${vac.isCompleted ? 'line-through text-stone-400' : 'text-stone-800'}`}>
                        {vac.name}
                      </span>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                        vac.isCompleted
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {vac.isCompleted ? '완료' : `예정: ${vac.dueDate}`}
                    </span>
                  </div>

                  {vac.isCompleted && vac.hospitalName && (
                    <p className="text-[10px] text-stone-400 ml-6 mt-1">
                      {vac.hospitalName} ({vac.completedDate} 완료)
                    </p>
                  )}
                </div>
              ))}
            </div>

            <p className="text-[11px] text-stone-400 text-center">
              항목을 클릭하면 접종 완료/미완료 상태가 즉시 토글됩니다.
            </p>
          </div>

          {/* Weight Tracker Card */}
          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
              <Scale className="w-4 h-4 text-amber-600" />
              체중 변화 기록 (kg)
            </h3>

            <div className="space-y-2">
              {activeRecord.weightHistory.slice(-4).map((w, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs">
                  <span className="text-stone-500">{w.date}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-28 bg-stone-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-amber-500 h-full rounded-full"
                        style={{ width: `${Math.min(100, (w.weight / 6) * 100)}%` }}
                      />
                    </div>
                    <span className="font-bold text-stone-800 w-12 text-right">
                      {w.weight} kg
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <span className="text-[11px] text-emerald-700 font-medium block text-center">
              ✓ 안정적인 체중 유지 중 (적정 성묘 체중)
            </span>
          </div>

          {/* Emergency SOS & Shelter Direct Hotline */}
          <div className="bg-rose-50 border border-rose-200 rounded-2xl p-5 text-xs space-y-3">
            <div className="flex items-center gap-2 text-rose-900">
              <PhoneCall className="w-4 h-4 text-rose-600 shrink-0" />
              <h4 className="font-bold text-sm">보호소 사후 안심 SOS 핫라인</h4>
            </div>
            <p className="text-rose-800 leading-relaxed text-[11px]">
              24시간 이상 사료를 거부하거나 심한 구토, 배변 곤란, 스트레스로 인한 이물 섭취 등 응급 상황 발생 시 바로 쉼터에 연락해 주세요.
            </p>
            <div className="bg-white p-2.5 rounded-xl border border-rose-200 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-stone-400 block">담당 쉼터 긴급 직통</span>
                <span className="font-extrabold text-stone-900 text-sm">02-715-9923</span>
              </div>
              <button
                onClick={() => {
                  alert('보호소 긴급 당직자 유선 연결 안내: 02-715-9923 (또는 1:1 메시지함에서 실시간 문의 가능)');
                }}
                className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-bold transition-colors"
              >
                연결 안내
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal: Write New Diary */}
      {isDiaryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
          <div
            className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-stone-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
                <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                {activeRecord.catName}의 새 적응 일지 작성
              </h3>
              <button
                onClick={() => setIsDiaryModalOpen(false)}
                className="text-stone-400 hover:text-stone-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleDiarySubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">일지 제목</label>
                <input
                  type="text"
                  required
                  value={diaryTitle}
                  onChange={(e) => setDiaryTitle(e.target.value)}
                  placeholder="예: 3주차: 이제 침대 위로 올라와서 같이 잡니다!"
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">오늘의 기분/상태</label>
                  <select
                    value={diaryMood}
                    onChange={(e: any) => setDiaryMood(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg bg-white text-xs"
                  >
                    <option value="편안함 (골골송)">편안함 (골골송)</option>
                    <option value="활발히 뛰어놂">활발히 뛰어놂</option>
                    <option value="약간 긴장/숨음">약간 긴장/숨음</option>
                    <option value="병원 방문">병원 방문</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">현재 체중 (kg)</label>
                  <input
                    type="number"
                    step="0.05"
                    value={diaryWeight}
                    onChange={(e) => setDiaryWeight(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  사진 URL (Unsplash or 이미지 링크)
                </label>
                <input
                  type="text"
                  value={diaryPhotoUrl}
                  onChange={(e) => setDiaryPhotoUrl(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs"
                  placeholder="https://images.unsplash.com/..."
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">일지 내용 및 적응 소식</label>
                <textarea
                  rows={4}
                  required
                  value={diaryContent}
                  onChange={(e) => setDiaryContent(e.target.value)}
                  placeholder="밥은 잘 먹는지, 배변 상태는 어떤지, 좋아하는 장난감은 무엇인지 적어주세요."
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsDiaryModalOpen(false)}
                  className="px-4 py-2 border border-stone-300 rounded-lg font-semibold text-stone-600"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold"
                >
                  일지 등록하기
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
