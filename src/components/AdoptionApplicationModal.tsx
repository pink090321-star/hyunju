import React, { useState } from 'react';
import { X, Heart, ShieldCheck, CheckCircle2, AlertTriangle, ArrowRight, ArrowLeft, Camera, Sparkles, Building, User, FileText } from 'lucide-react';
import { RescueCat } from '../types';
import { useAdoption } from '../context/AdoptionContext';

interface AdoptionApplicationModalProps {
  cat: RescueCat | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (appId: string) => void;
}

export const AdoptionApplicationModal: React.FC<AdoptionApplicationModalProps> = ({
  cat,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { submitApplication } = useAdoption();

  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Form states
  const [applicantName, setApplicantName] = useState('이서준');
  const [phone, setPhone] = useState('010-8765-4321');
  const [email, setEmail] = useState('applicant@example.com');
  const [address, setAddress] = useState('서울 마포구 공덕동 104동');
  const [housingType, setHousingType] = useState<'아파트' | '빌라/다세대' | '단독주택' | '오피스텔/원룸'>('아파트');
  const [isPetAllowed, setIsPetAllowed] = useState(true);
  const [familyMembersCount, setFamilyMembersCount] = useState(2);
  const [familyAgreement, setFamilyAgreement] = useState(true);
  const [hasAllergyChecked, setHasAllergyChecked] = useState(true);

  // Step 2
  const [catExperience, setCatExperience] = useState<'초보 집사 (첫 반려)' | '1~3년' | '3년 이상 베테랑' | '현재 고양이 반려 중'>('1~3년');
  const [currentPets, setCurrentPets] = useState('없음 (부모님 댁에서 5년 케어 경험)');
  const [hoursAloneDaily, setHoursAloneDaily] = useState(4);
  const [monthlyBudget, setMonthlyBudget] = useState(25);
  const [safetyScreenInstalled, setSafetyScreenInstalled] = useState(true);
  const [safetyScreenPhotoUrl, setSafetyScreenPhotoUrl] = useState('https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80');
  const [emergencyCarePlan, setEmergencyCarePlan] = useState('도보 5분 거리 24시 동물의료원 확인 완료 및 비상 진료비 준비됨');

  // Step 3
  const [reasonForAdoption, setReasonForAdoption] = useState('혼자 힘겹게 길에서 버텨온 아이에게 따뜻하고 안전한 평생 가족의 온기를 선물해주고 싶습니다.');
  const [pledges, setPledges] = useState({
    noAbandon: true,
    indoorOnly: true,
    medicalCare: true,
    lifeChanges: true,
    postCareShare: true,
  });

  if (!isOpen || !cat) return null;

  const allPledgesChecked = Object.values(pledges).every(Boolean);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!familyAgreement) {
      alert('가족/동거인 전원의 입양 동의가 필수입니다.');
      return;
    }
    if (!safetyScreenInstalled) {
      alert('고양이의 추락/실종 사고 방지를 위해 방묘창 설치 동의가 필수입니다.');
      return;
    }
    if (!allPledgesChecked) {
      alert('모든 평생 양육 서약 조항에 동의해주세요.');
      return;
    }

    const newAppId = submitApplication({
      catId: cat.id,
      catName: cat.name,
      catBreed: cat.breed,
      catPhoto: cat.mainPhoto,
      shelterName: cat.shelterName,
      applicantName,
      phone,
      email,
      address,
      housingType,
      isPetAllowed,
      familyMembersCount,
      hasAllergyChecked,
      familyAgreement,
      currentPets,
      catExperience,
      hoursAloneDaily,
      monthlyBudget,
      safetyScreenInstalled,
      safetyScreenPhotoUrl,
      reasonForAdoption,
      emergencyCarePlan,
      lifetimePledge: true,
    });

    onSuccess(newAppId);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-900/60 backdrop-blur-xs overflow-y-auto">
      <div
        className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-stone-100 my-6 flex flex-col max-h-[92vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div className="bg-amber-600 text-white p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <img
              src={cat.mainPhoto}
              alt={cat.name}
              className="w-12 h-12 rounded-xl object-cover border-2 border-white/40 shadow-xs"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs bg-amber-700 text-amber-100 px-2 py-0.5 rounded-md font-semibold">
                  공식 입양 신청서
                </span>
                <span className="text-xs text-amber-200">{cat.shelterName}</span>
              </div>
              <h2 className="text-lg font-bold">
                '{cat.name}'의 평생 가족이 되어주세요
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1.5 rounded-lg hover:bg-amber-700/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Wizard Progress Header */}
        <div className="bg-stone-50 border-b border-stone-200 px-6 py-3 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  currentStep >= 1 ? 'bg-amber-600 text-white' : 'bg-stone-200 text-stone-600'
                }`}
              >
                1
              </span>
              <span className={`text-xs font-semibold ${currentStep === 1 ? 'text-amber-900' : 'text-stone-500'}`}>
                신청자 & 주거환경
              </span>
            </div>
            <div className="h-0.5 w-12 bg-stone-200" />
            <div className="flex items-center gap-2">
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  currentStep >= 2 ? 'bg-amber-600 text-white' : 'bg-stone-200 text-stone-600'
                }`}
              >
                2
              </span>
              <span className={`text-xs font-semibold ${currentStep === 2 ? 'text-amber-900' : 'text-stone-500'}`}>
                케어 환경 & 방묘창
              </span>
            </div>
            <div className="h-0.5 w-12 bg-stone-200" />
            <div className="flex items-center gap-2">
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  currentStep >= 3 ? 'bg-amber-600 text-white' : 'bg-stone-200 text-stone-600'
                }`}
              >
                3
              </span>
              <span className={`text-xs font-semibold ${currentStep === 3 ? 'text-amber-900' : 'text-stone-500'}`}>
                입양 서약 & 자동심사
              </span>
            </div>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-6">
          {/* STEP 1 */}
          {currentStep === 1 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="bg-amber-50/60 p-3 rounded-xl border border-amber-200/60 text-xs text-amber-900 flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  보호소에서는 아이가 평생 안전하게 지낼 수 있는지 환경을 가장 최우선으로 검토합니다. 솔직하고 상세하게 작성해주세요.
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    신청자 성명 <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={applicantName}
                    onChange={(e) => setApplicantName(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    placeholder="홍길동"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    연락처 (휴대전화) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    placeholder="010-1234-5678"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    이메일 주소 <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    placeholder="example@naver.com"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    거주 주소지 (시/구/동) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    placeholder="서울 마포구 공덕동"
                  />
                </div>
              </div>

              {/* Housing Details */}
              <div className="border-t border-stone-200 pt-3 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      주거 형태
                    </label>
                    <select
                      value={housingType}
                      onChange={(e: any) => setHousingType(e.target.value)}
                      className="w-full text-xs px-3 py-2 border border-stone-300 rounded-lg bg-white"
                    >
                      <option value="아파트">아파트</option>
                      <option value="빌라/다세대">빌라 / 다세대주택</option>
                      <option value="단독주택">단독주택</option>
                      <option value="오피스텔/원룸">오피스텔 / 원룸</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      함께 거주하는 가족 수
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={10}
                      value={familyMembersCount}
                      onChange={(e) => setFamilyMembersCount(Number(e.target.value))}
                      className="w-full text-xs px-3 py-2 border border-stone-300 rounded-lg"
                    />
                  </div>
                </div>

                {/* Confirmations */}
                <div className="space-y-2 bg-stone-50 p-3 rounded-xl border border-stone-200 text-xs">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isPetAllowed}
                      onChange={(e) => setIsPetAllowed(e.target.checked)}
                      className="w-4 h-4 text-amber-600 rounded"
                    />
                    <span className="font-semibold text-stone-800">
                      반려동물 양육이 가능한 주거지입니까? (자가 또는 임대인 동의 완료)
                    </span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={familyAgreement}
                      onChange={(e) => setFamilyAgreement(e.target.checked)}
                      className="w-4 h-4 text-amber-600 rounded"
                    />
                    <span className="font-semibold text-stone-800">
                      동거 가족/룸메이트 전원이 고양이 입양에 100% 동의하셨습니까? <span className="text-rose-500">*</span>
                    </span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={hasAllergyChecked}
                      onChange={(e) => setHasAllergyChecked(e.target.checked)}
                      className="w-4 h-4 text-amber-600 rounded"
                    />
                    <span className="font-semibold text-stone-800">
                      가족 구성원 중 고양이 알레르기 여부를 확인하셨습니까? (알레르기 없음 또는 면역치료/약물 관리 준비됨)
                    </span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {currentStep === 2 && (
            <div className="space-y-4 animate-fadeIn">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  반려묘 양육 경험
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {(['초보 집사 (첫 반려)', '1~3년', '3년 이상 베테랑', '현재 고양이 반려 중'] as const).map((opt) => (
                    <button
                      type="button"
                      key={opt}
                      onClick={() => setCatExperience(opt)}
                      className={`p-2.5 rounded-lg border text-left font-medium transition-all ${
                        catExperience === opt
                          ? 'border-amber-500 bg-amber-50 text-amber-900 font-bold'
                          : 'border-stone-200 text-stone-700 hover:bg-stone-50'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    현재 함께 사는 다른 반려동물
                  </label>
                  <input
                    type="text"
                    value={currentPets}
                    onChange={(e) => setCurrentPets(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-stone-300 rounded-lg"
                    placeholder="없음 or 강아지 1마리, 고양이 1마리 등"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    고양이가 홀로 있는 일일 평균 시간 (시간)
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={24}
                    value={hoursAloneDaily}
                    onChange={(e) => setHoursAloneDaily(Number(e.target.value))}
                    className="w-full text-xs px-3 py-2 border border-stone-300 rounded-lg"
                  />
                  <span className="text-[10px] text-stone-500 mt-0.5 block">
                    8시간 이하 권장 (원격근무/가족 교대 등)
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  예상 월 양육 예산 (만원)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min={10}
                    max={60}
                    step={5}
                    value={monthlyBudget}
                    onChange={(e) => setMonthlyBudget(Number(e.target.value))}
                    className="flex-1 accent-amber-600"
                  />
                  <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
                    약 {monthlyBudget} 만원 / 월
                  </span>
                </div>
                <span className="text-[10px] text-stone-500">
                  양질의 사료, 모래, 정기 구충, 심장사상충, 비상 진료비 저축 권장
                </span>
              </div>

              {/* Crucial Safety Screen Section */}
              <div className="bg-amber-50/80 border border-amber-300 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-amber-700" />
                    <div>
                      <h4 className="text-xs font-bold text-amber-950">
                        방묘창 및 방묘문 필수 안전 시설 점검 <span className="text-rose-500">*</span>
                      </h4>
                      <p className="text-[11px] text-amber-800">
                        유기묘 입양 시 추락사 및 현관문 이탈 방지를 위해 안전망 설치가 필수입니다.
                      </p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={safetyScreenInstalled}
                      onChange={(e) => setSafetyScreenInstalled(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-stone-300 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
                  </label>
                </div>

                <div className="pt-2 border-t border-amber-200">
                  <label className="block text-[11px] font-bold text-amber-950 mb-1.5 flex items-center gap-1.5">
                    <Camera className="w-3.5 h-3.5 text-amber-700" />
                    창문/베란다 방묘창 인증 사진 URL (실사 증빙)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={safetyScreenPhotoUrl}
                      onChange={(e) => setSafetyScreenPhotoUrl(e.target.value)}
                      className="text-xs flex-1 px-3 py-1.5 border border-amber-300 rounded-lg bg-white"
                      placeholder="https://... 방묘창 설치 사진 링크"
                    />
                  </div>
                  {safetyScreenPhotoUrl && (
                    <div className="mt-2 flex items-center gap-2">
                      <img
                        src={safetyScreenPhotoUrl}
                        alt="방묘창 사진 미리보기"
                        className="w-14 h-14 object-cover rounded-lg border border-amber-200 shadow-xs"
                      />
                      <span className="text-[11px] text-amber-800 font-medium">
                        ✓ 안전망 사진이 등록되었습니다. 서류 심사 시 자동 반영됩니다.
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  응급 상황 대처 및 연계 동물병원
                </label>
                <input
                  type="text"
                  value={emergencyCarePlan}
                  onChange={(e) => setEmergencyCarePlan(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-stone-300 rounded-lg"
                  placeholder="예: 집 근처 24시 동물의료원 확인 완료, 응급 수술비 저축 200만원 보유"
                />
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {currentStep === 3 && (
            <div className="space-y-4 animate-fadeIn">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  '{cat.name}'을(를) 입양하고자 하는 동기와 다짐 <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  value={reasonForAdoption}
                  onChange={(e) => setReasonForAdoption(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                  placeholder="아이에게 전하고 싶은 마음, 평생 함께할 각오를 적어주세요."
                />
              </div>

              {/* Lifetime Care Pledge */}
              <div className="border border-rose-200 bg-rose-50/40 rounded-xl p-4 space-y-2.5">
                <div className="flex items-center gap-2 mb-1">
                  <Heart className="w-4 h-4 text-rose-600 fill-rose-600" />
                  <h4 className="text-xs font-bold text-rose-950">
                    반려묘 평생 양육 책임 서약 (필수 조항)
                  </h4>
                </div>

                <label className="flex items-start gap-2 cursor-pointer text-xs">
                  <input
                    type="checkbox"
                    checked={pledges.noAbandon}
                    onChange={(e) => setPledges((p) => ({ ...p, noAbandon: e.target.checked }))}
                    className="w-4 h-4 text-rose-600 rounded mt-0.5"
                  />
                  <span className="text-stone-800">
                    1. 어떠한 경우에도 고양이를 유기하거나 제3자에게 임의 재분양하지 않으며, 불가피한 사유 발생 시 반드시 보호소와 먼저 협의하겠습니다.
                  </span>
                </label>

                <label className="flex items-start gap-2 cursor-pointer text-xs">
                  <input
                    type="checkbox"
                    checked={pledges.indoorOnly}
                    onChange={(e) => setPledges((p) => ({ ...p, indoorOnly: e.target.checked }))}
                    className="w-4 h-4 text-rose-600 rounded mt-0.5"
                  />
                  <span className="text-stone-800">
                    2. 100% 완전 실내 양육을 원칙으로 하며, 마당에 묶거나 외출묘(자유방임)로 키우지 않겠습니다.
                  </span>
                </label>

                <label className="flex items-start gap-2 cursor-pointer text-xs">
                  <input
                    type="checkbox"
                    checked={pledges.medicalCare}
                    onChange={(e) => setPledges((p) => ({ ...p, medicalCare: e.target.checked }))}
                    className="w-4 h-4 text-rose-600 rounded mt-0.5"
                  />
                  <span className="text-stone-800">
                    3. 정기적인 종합백신, 구충, 사상충 예방 및 질병 발생 시 수의학적 치료를 적극적으로 제공하겠습니다.
                  </span>
                </label>

                <label className="flex items-start gap-2 cursor-pointer text-xs">
                  <input
                    type="checkbox"
                    checked={pledges.lifeChanges}
                    onChange={(e) => setPledges((p) => ({ ...p, lifeChanges: e.target.checked }))}
                    className="w-4 h-4 text-rose-600 rounded mt-0.5"
                  />
                  <span className="text-stone-800">
                    4. 결혼, 임신, 출산, 이사, 취업 등 환경의 변화가 발생하더라도 끝까지 가족으로서 양육 책임을 다하겠습니다.
                  </span>
                </label>

                <label className="flex items-start gap-2 cursor-pointer text-xs">
                  <input
                    type="checkbox"
                    checked={pledges.postCareShare}
                    onChange={(e) => setPledges((p) => ({ ...p, postCareShare: e.target.checked }))}
                    className="w-4 h-4 text-rose-600 rounded mt-0.5"
                  />
                  <span className="text-stone-800">
                    5. 입양 후 플랫폼의 '사후 관리 대시보드'를 통해 첫 1년간 아이의 적응 일지와 건강 소식을 성실히 공유하겠습니다.
                  </span>
                </label>
              </div>

              {/* Automated Evaluation Summary Preview */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-900 flex items-center justify-between">
                <div>
                  <span className="font-bold block">✨ 실시간 서류 적합도 자동 평가</span>
                  <span className="text-[11px] text-emerald-700">
                    방묘창 완비(+15점), 가족 전원 동의(+10점), 반려 환경 적합(+15점)
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-lg font-black text-emerald-700">
                    {safetyScreenInstalled && familyAgreement ? '96점 (우수)' : '75점'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Form Wizard Navigation Controls */}
          <div className="pt-4 border-t border-stone-200 flex items-center justify-between gap-3">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={() => setCurrentStep((s) => (s - 1) as any)}
                className="px-4 py-2 rounded-xl border border-stone-300 text-xs font-bold text-stone-700 hover:bg-stone-100 flex items-center gap-1.5 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                이전 단계
              </button>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-stone-300 text-xs font-bold text-stone-600 hover:bg-stone-100 transition-colors"
              >
                신청 취소
              </button>
            )}

            {currentStep < 3 ? (
              <button
                type="button"
                onClick={() => {
                  if (currentStep === 1 && !familyAgreement) {
                    alert('가족 전원의 입양 동의가 필요합니다.');
                    return;
                  }
                  setCurrentStep((s) => (s + 1) as any);
                }}
                className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all"
              >
                다음 단계로
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="submit"
                id="submit-adoption-form-btn"
                disabled={!allPledgesChecked}
                className={`px-6 py-2.5 rounded-xl text-white text-xs font-bold flex items-center gap-2 shadow-md transition-all ${
                  allPledgesChecked
                    ? 'bg-amber-600 hover:bg-amber-700 hover:scale-[1.02]'
                    : 'bg-stone-400 cursor-not-allowed'
                }`}
              >
                <Heart className="w-4 h-4 fill-white" />
                입양 신청서 최종 제출하기
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
