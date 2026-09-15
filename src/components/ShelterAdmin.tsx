import React, { useState } from 'react';
import {
  Building2,
  Users,
  CheckCircle2,
  Clock,
  AlertCircle,
  Plus,
  ArrowRight,
  ShieldCheck,
  MessageCircle,
  FileText,
  Calendar,
  Heart,
  XCircle,
  Camera,
  Filter,
} from 'lucide-react';
import { AdoptionApplication, AdoptionStage, RescueCat } from '../types';
import { useAdoption } from '../context/AdoptionContext';

interface ShelterAdminProps {
  onOpenChat: (appId: string) => void;
}

export const ShelterAdmin: React.FC<ShelterAdminProps> = ({ onOpenChat }) => {
  const {
    cats,
    applications,
    updateApplicationStage,
    addRescueCat,
    postAdoptionRecords,
  } = useAdoption();

  const [activeTab, setActiveTab] = useState<'applications' | 'cats' | 'postcare'>('applications');
  const [stageFilter, setStageFilter] = useState<string>('ALL');

  // New Cat Registration Modal
  const [isNewCatModalOpen, setIsNewCatModalOpen] = useState(false);
  const [catName, setCatName] = useState('');
  const [catBreed, setCatBreed] = useState('코리안 숏헤어 (고등어태비)');
  const [catAge, setCatAge] = useState('1세 추정');
  const [catGender, setCatGender] = useState<'남아' | '여아'>('남아');
  const [catWeight, setCatWeight] = useState(3.8);
  const [rescueLoc, setRescueLoc] = useState('서울 마포구 합정동 주택가');
  const [catStory, setCatStory] = useState('');
  const [catPhoto, setCatPhoto] = useState('https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=800&q=80');
  const [personalityTagsInput, setPersonalityTagsInput] = useState('애교쟁이, 골골송, 초보집사추천');

  // Action Dialog state
  const [inspectingApp, setInspectingApp] = useState<AdoptionApplication | null>(null);
  const [interviewDateInput, setInterviewDateInput] = useState('2026-09-18 15:00');
  const [adminNoteInput, setAdminNoteInput] = useState('');

  // Stats
  const totalCats = cats.length;
  const pendingApps = applications.filter(
    (a) => a.stage === 'STAGE_1_SUBMITTED' || a.stage === 'STAGE_2_DOC_REVIEW'
  );
  const interviewingApps = applications.filter((a) => a.stage === 'STAGE_3_INTERVIEW');
  const adoptedCount = applications.filter((a) => a.stage === 'STAGE_6_ADOPTED').length;

  const filteredApps = applications.filter((app) => {
    if (stageFilter === 'ALL') return true;
    return app.stage === stageFilter;
  });

  const handleCreateCat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName.trim() || !catStory.trim()) return;

    addRescueCat({
      name: catName,
      breed: catBreed,
      age: catAge,
      gender: catGender,
      isNeutered: true,
      weight: Number(catWeight),
      rescueLocation: rescueLoc,
      rescueDate: new Date().toISOString().split('T')[0],
      shelterName: '나비야 사랑해 마포쉼터',
      shelterContact: '02-715-9923',
      status: '입양대기',
      mainPhoto: catPhoto,
      additionalPhotos: [],
      personalityTags: personalityTagsInput.split(',').map((t) => t.trim()).filter(Boolean),
      story: catStory,
      healthInfo: {
        fivFelv: '음성 (건강)',
        vaccinations: '기본 종합백신 완료',
        isChipped: true,
      },
      compatibility: {
        firstTimeOwner: true,
        withOtherCats: true,
        withChildren: true,
        activityLevel: '보통',
      },
      adoptionRequirements: ['방묘창 및 방묘문 필수', '평생 실내 양육 서약'],
    });

    setIsNewCatModalOpen(false);
    setCatName('');
    setCatStory('');
    alert('새로운 구조묘가 등록되었습니다.');
  };

  const handleAdvanceStage = (app: AdoptionApplication, nextStage: AdoptionStage, defaultNote: string) => {
    updateApplicationStage(app.id, nextStage, adminNoteInput || defaultNote, interviewDateInput);
    setAdminNoteInput('');
    setInspectingApp(null);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Shelter Header & Metric Bar */}
      <div className="bg-stone-900 text-white rounded-3xl p-6 sm:p-8 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-300 border border-amber-500/30 px-3 py-1 rounded-full text-xs font-bold">
              <Building2 className="w-3.5 h-3.5" />
              보호소 통합 관리자 센터
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              나비야 사랑해 마포쉼터 관리 관제탑
            </h1>
            <p className="text-xs sm:text-sm text-stone-300">
              접수된 입양 신청서를 6단계 파이프라인으로 자동 심사하고, 사후 적응 상태를 종합 모니터링합니다.
            </p>
          </div>

          <button
            id="register-new-cat-btn"
            onClick={() => setIsNewCatModalOpen(true)}
            className="px-4 py-2.5 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-md transition-colors shrink-0"
          >
            <Plus className="w-4 h-4" />
            새 구조묘 등록하기
          </button>
        </div>

        {/* 4 Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-6 pt-6 border-t border-stone-800 text-xs">
          <div className="bg-stone-800/80 p-4 rounded-xl border border-stone-700">
            <span className="text-stone-400 block text-[11px] mb-1">보호 중인 고양이</span>
            <span className="text-xl font-black text-white">{totalCats} 마리</span>
          </div>
          <div className="bg-stone-800/80 p-4 rounded-xl border border-stone-700">
            <span className="text-rose-400 block text-[11px] mb-1">심사 대기 신청서</span>
            <span className="text-xl font-black text-rose-400">{pendingApps.length} 건</span>
          </div>
          <div className="bg-stone-800/80 p-4 rounded-xl border border-stone-700">
            <span className="text-amber-400 block text-[11px] mb-1">면담 진행 중</span>
            <span className="text-xl font-black text-amber-400">{interviewingApps.length} 건</span>
          </div>
          <div className="bg-stone-800/80 p-4 rounded-xl border border-stone-700">
            <span className="text-emerald-400 block text-[11px] mb-1">사후 관리 모니터링</span>
            <span className="text-xl font-black text-emerald-400">{postAdoptionRecords.length} 가구</span>
          </div>
        </div>
      </div>

      {/* Sub-tab Navigation */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-2">
        <button
          onClick={() => setActiveTab('applications')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'applications'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
          }`}
        >
          📝 입양 신청 심사 파이프라인 ({applications.length})
        </button>
        <button
          onClick={() => setActiveTab('cats')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'cats'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
          }`}
        >
          🐱 보호묘 현황 관리 ({cats.length})
        </button>
      </div>

      {/* TAB 1: Applications Pipeline */}
      {activeTab === 'applications' && (
        <div className="space-y-4">
          {/* Stage Filter */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <span className="text-stone-400 font-semibold shrink-0">단계별 보기:</span>
            {[
              { id: 'ALL', label: '전체' },
              { id: 'STAGE_1_SUBMITTED', label: '1. 서류 접수' },
              { id: 'STAGE_2_DOC_REVIEW', label: '2. 심사 중' },
              { id: 'STAGE_3_INTERVIEW', label: '3. 심층 면담' },
              { id: 'STAGE_4_HOME_SAFETY', label: '4. 안전 점검' },
              { id: 'STAGE_5_TRIAL_CONTRACT', label: '5. 계약 체결' },
              { id: 'STAGE_6_ADOPTED', label: '6. 입양 확정' },
            ].map((st) => (
              <button
                key={st.id}
                onClick={() => setStageFilter(st.id)}
                className={`px-3 py-1.5 rounded-lg font-semibold shrink-0 transition-colors ${
                  stageFilter === st.id
                    ? 'bg-stone-800 text-white'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>

          {/* Application Cards List */}
          <div className="space-y-3">
            {filteredApps.map((app) => (
              <div
                key={app.id}
                className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs hover:border-amber-400 transition-all"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Left: Applicant & Cat Info */}
                  <div className="flex items-start gap-3.5">
                    <img
                      src={app.catPhoto}
                      alt={app.catName}
                      className="w-14 h-14 rounded-xl object-cover border border-stone-200 shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-extrabold text-stone-900 text-sm">
                          {app.applicantName} 님
                        </span>
                        <span className="text-xs text-stone-500">
                          (신청묘: <strong className="text-amber-700">{app.catName}</strong>)
                        </span>
                        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                          자동 적합도: {app.score}점
                        </span>
                      </div>

                      <p className="text-xs text-stone-600 mt-1">
                        {app.housingType} · 가족 {app.familyMembersCount}인 · 반려경험: {app.catExperience} · 일일 단독 {app.hoursAloneDaily}시간
                      </p>

                      <div className="flex items-center gap-3 text-[11px] text-stone-400 mt-1">
                        <span>연락처: {app.phone}</span>
                        <span>신청일: {app.appliedAt}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Stage Badge & Quick Actions */}
                  <div className="flex items-center gap-2 flex-wrap justify-end">
                    <div className="text-right mr-2">
                      <span className="text-[10px] text-stone-400 block font-medium">현재 단계</span>
                      <span className="text-xs font-extrabold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-lg inline-block">
                        {getStageDisplayName(app.stage)}
                      </span>
                    </div>

                    <button
                      onClick={() => onOpenChat(app.id)}
                      className="px-3 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-bold rounded-xl flex items-center gap-1 transition-colors"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      1:1 상담
                    </button>

                    <button
                      onClick={() => setInspectingApp(app)}
                      className="px-3.5 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold rounded-xl flex items-center gap-1 shadow-xs transition-colors"
                    >
                      심사 및 단계 전환
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: Cat Management */}
      {activeTab === 'cats' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {cats.map((cat) => (
            <div
              key={cat.id}
              className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex items-center gap-3"
            >
              <img
                src={cat.mainPhoto}
                alt={cat.name}
                className="w-16 h-16 rounded-xl object-cover shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-stone-900 truncate">{cat.name}</h4>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                      cat.status === '입양대기'
                        ? 'bg-emerald-100 text-emerald-800'
                        : cat.status === '심사중'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-stone-200 text-stone-700'
                    }`}
                  >
                    {cat.status}
                  </span>
                </div>
                <p className="text-xs text-stone-500 truncate">{cat.breed} · {cat.age}</p>
                <p className="text-[11px] text-stone-400 mt-1 truncate">구조지: {cat.rescueLocation}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal: Application Review & Stage Transition */}
      {inspectingApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
          <div
            className="bg-white rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-2xl border border-stone-100 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <h3 className="text-base font-extrabold text-stone-900">
                  {inspectingApp.applicantName} 님의 입양 신청 심사
                </h3>
                <span className="text-xs text-amber-700 font-bold">
                  신청묘: {inspectingApp.catName} ({inspectingApp.catBreed})
                </span>
              </div>
              <button
                onClick={() => setInspectingApp(null)}
                className="text-stone-400 hover:text-stone-600"
              >
                ✕
              </button>
            </div>

            {/* Quick Proof Snapshot */}
            <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-stone-500">자동 환경 적합도:</span>
                <span className="font-extrabold text-emerald-600">{inspectingApp.score}점</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">방묘창 설치 인증:</span>
                <span className="font-bold text-stone-800">
                  {inspectingApp.safetyScreenInstalled ? '✓ 설치 확인됨' : '미확인'}
                </span>
              </div>
              {inspectingApp.safetyScreenPhotoUrl && (
                <div>
                  <span className="text-stone-500 block mb-1">방묘창 실사 사진:</span>
                  <img
                    src={inspectingApp.safetyScreenPhotoUrl}
                    alt="방묘창 사진"
                    className="w-full h-32 object-cover rounded-lg border border-stone-200"
                  />
                </div>
              )}
            </div>

            {/* One-click Stage Transition Buttons */}
            <div className="space-y-2 pt-2">
              <label className="block text-xs font-bold text-stone-700">
                심사 메모 및 신청자 알림 메시지 (선택)
              </label>
              <input
                type="text"
                value={adminNoteInput}
                onChange={(e) => setAdminNoteInput(e.target.value)}
                placeholder="예: 서류 검토 완료. 16일 비대면 면담 예정입니다."
                className="w-full text-xs px-3 py-2 border border-stone-300 rounded-lg"
              />
            </div>

            {/* Action Buttons for Stage progression */}
            <div className="space-y-2 border-t border-stone-100 pt-3">
              <span className="text-xs font-bold text-stone-500 block">다음 단계로 승인:</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <button
                  onClick={() =>
                    handleAdvanceStage(inspectingApp, 'STAGE_2_DOC_REVIEW', '서류 심사 통과')
                  }
                  className="p-2.5 rounded-xl border border-stone-200 hover:bg-amber-50 hover:border-amber-300 font-bold text-left transition-colors"
                >
                  2단계: 서류 심사 합격 처리
                </button>
                <button
                  onClick={() =>
                    handleAdvanceStage(inspectingApp, 'STAGE_3_INTERVIEW', '1차 심층 상담 배정 완료')
                  }
                  className="p-2.5 rounded-xl border border-stone-200 hover:bg-amber-50 hover:border-amber-300 font-bold text-left transition-colors"
                >
                  3단계: 심층 상담(면담) 배정
                </button>
                <button
                  onClick={() =>
                    handleAdvanceStage(inspectingApp, 'STAGE_4_HOME_SAFETY', '방묘창 및 가정 환경 안전 점검')
                  }
                  className="p-2.5 rounded-xl border border-stone-200 hover:bg-amber-50 hover:border-amber-300 font-bold text-left transition-colors"
                >
                  4단계: 가정 안전점검(방묘창) 통과
                </button>
                <button
                  onClick={() =>
                    handleAdvanceStage(inspectingApp, 'STAGE_5_TRIAL_CONTRACT', '입양 계약서 체결 및 인도 완료')
                  }
                  className="p-2.5 rounded-xl border border-stone-200 hover:bg-amber-50 hover:border-amber-300 font-bold text-left transition-colors"
                >
                  5단계: 입양 계약서 체결
                </button>
              </div>

              {/* Ultimate Adoption Finalizer */}
              <button
                onClick={() =>
                  handleAdvanceStage(
                    inspectingApp,
                    'STAGE_6_ADOPTED',
                    '최종 입양이 확정되었습니다! 사후 관리 대시보드로 자동 연동됩니다.'
                  )
                }
                className="w-full mt-2 p-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-extrabold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
              >
                <Heart className="w-4 h-4 fill-white" />
                🎉 최종 입양 확정 및 사후 관리 대시보드 활성화
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: New Cat Registration */}
      {isNewCatModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
          <div
            className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-stone-100 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="text-base font-extrabold text-stone-900 flex items-center gap-2">
                <Plus className="w-4 h-4 text-amber-600" />
                새로운 유기묘/구조묘 등록
              </h3>
              <button
                onClick={() => setIsNewCatModalOpen(false)}
                className="text-stone-400 hover:text-stone-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCat} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">고양이 이름</label>
                  <input
                    type="text"
                    required
                    value={catName}
                    onChange={(e) => setCatName(e.target.value)}
                    placeholder="예: 까망이"
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">품종/태비</label>
                  <input
                    type="text"
                    required
                    value={catBreed}
                    onChange={(e) => setCatBreed(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">추정 나이</label>
                  <input
                    type="text"
                    value={catAge}
                    onChange={(e) => setCatAge(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">성별</label>
                  <select
                    value={catGender}
                    onChange={(e: any) => setCatGender(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg bg-white text-xs"
                  >
                    <option value="남아">남아</option>
                    <option value="여아">여아</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">체중 (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={catWeight}
                    onChange={(e) => setCatWeight(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">구조 장소</label>
                <input
                  type="text"
                  value={rescueLoc}
                  onChange={(e) => setRescueLoc(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">대표 사진 URL</label>
                <input
                  type="text"
                  value={catPhoto}
                  onChange={(e) => setCatPhoto(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">성격 태그 (쉼표 구분)</label>
                <input
                  type="text"
                  value={personalityTagsInput}
                  onChange={(e) => setPersonalityTagsInput(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">구조 사연 및 성격 소개</label>
                <textarea
                  rows={3}
                  required
                  value={catStory}
                  onChange={(e) => setCatStory(e.target.value)}
                  placeholder="아이를 발견했을 때의 상황과 현재 성격을 상세히 적어주세요."
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewCatModalOpen(false)}
                  className="px-4 py-2 border border-stone-300 rounded-lg font-semibold text-stone-600"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold"
                >
                  등록 완료
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

function getStageDisplayName(stage: AdoptionStage): string {
  switch (stage) {
    case 'STAGE_1_SUBMITTED':
      return '1. 서류 접수 완료';
    case 'STAGE_2_DOC_REVIEW':
      return '2. 서류 심사 중';
    case 'STAGE_3_INTERVIEW':
      return '3. 심층 면담 배정';
    case 'STAGE_4_HOME_SAFETY':
      return '4. 가정 안전점검';
    case 'STAGE_5_TRIAL_CONTRACT':
      return '5. 계약서 체결';
    case 'STAGE_6_ADOPTED':
      return '6. 최종 입양 완료';
    case 'REJECTED':
      return '반려';
  }
}
