import React, { useState } from 'react';
import {
  ShieldCheck,
  Heart,
  CheckCircle2,
  AlertTriangle,
  Home,
  Clock,
  Sparkles,
  HelpCircle,
  ArrowRight,
} from 'lucide-react';

interface AdoptionGuideProps {
  onStartAdoption: () => void;
}

export const AdoptionGuide: React.FC<AdoptionGuideProps> = ({ onStartAdoption }) => {
  const [checklist, setChecklist] = useState({
    familyConsent: false,
    petAllowed: false,
    safetyScreen: false,
    allergyFree: false,
    budgetReady: false,
    emergencyPlan: false,
  });

  const checkedCount = Object.values(checklist).filter(Boolean).length;
  const isReady = checkedCount >= 5;

  return (
    <div className="space-y-8 animate-fadeIn max-w-5xl mx-auto">
      {/* Title Hero */}
      <div className="text-center space-y-3 py-4">
        <span className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-900 text-xs font-bold px-3 py-1 rounded-full">
          <ShieldCheck className="w-4 h-4 text-amber-700" />
          올바른 유기묘 입양 가이드
        </span>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
          한 생명을 책임지는 가장 따뜻한 약속
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 max-w-2xl mx-auto leading-relaxed">
          고양이는 평균 15~20년을 함께 사는 가족입니다. 묘연의 체계적인 6단계 자동화 프로세스와
          사후 케어 시스템을 통해 실패 없는 안전한 입양을 준비해 보세요.
        </p>
      </div>

      {/* 6-Step Workflow Infographic */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-xs space-y-6">
        <h2 className="text-base font-extrabold text-stone-900 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-600" />
          묘연의 6단계 안심 입양 프로세스
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          {[
            {
              step: '01',
              title: '온라인 신청서 접수',
              desc: '거주환경, 가족 구성, 반려 경험, 방묘창 사진 증빙을 제출합니다.',
              highlight: '실시간 적합도 자동 산출',
            },
            {
              step: '02',
              title: '보호소 서류 심사',
              desc: '쉼터 담당자가 주거 형태, 임대인/가족 동의 여부를 24시간 내 검토합니다.',
              highlight: '적격 심사 피드백',
            },
            {
              step: '03',
              title: '1:1 심층 상담 (면담)',
              desc: '비대면 화상 또는 쉼터 방문을 통해 아이의 성격과 주의사항을 면담합니다.',
              highlight: '1:1 전용 채팅 조율',
            },
            {
              step: '04',
              title: '가정 안전 점검',
              desc: '고양이 추락 및 실종 사고를 방지하기 위해 방묘창과 방묘문을 최종 실사합니다.',
              highlight: '100% 추락사고 예방',
            },
            {
              step: '05',
              title: '입양 계약서 체결 & 인도',
              desc: '법적 효력을 갖춘 표준 입양 계약서를 체결하고 아이를 안전하게 인도받습니다.',
              highlight: '평생 유기 방지 서약',
            },
            {
              step: '06',
              title: '사후 관리 대시보드 전환',
              desc: '적응 일지 공유, 백신 및 건강 스케줄러, 쉼터 전담 피드백을 지원합니다.',
              highlight: '1년 집중 모니터링',
            },
          ].map((s, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-stone-50/70 border border-stone-200 hover:border-amber-400 transition-all space-y-2 group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xl font-black text-amber-600">{s.step}</span>
                <span className="text-[10px] font-bold text-amber-800 bg-amber-100/70 px-2 py-0.5 rounded-md">
                  {s.highlight}
                </span>
              </div>
              <h3 className="font-bold text-sm text-stone-900 group-hover:text-amber-800 transition-colors">
                {s.title}
              </h3>
              <p className="text-stone-600 text-[11px] leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* The 3-3-3 Rule Card */}
      <div className="bg-amber-50/60 border border-amber-200 rounded-3xl p-6 sm:p-8 space-y-4">
        <h2 className="text-base font-extrabold text-amber-950 flex items-center gap-2">
          <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
          입양 후 반드시 알아야 할 '고양이 3-3-3 법칙'
        </h2>
        <p className="text-xs text-stone-600">
          길 위에서의 트라우마가 있는 아이들은 새로운 집에 적응하는 데 충분한 시간과 기다림이 필요합니다.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs pt-2">
          <div className="bg-white p-4 rounded-2xl border border-amber-200 shadow-2xs space-y-1.5">
            <span className="text-xs font-black text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md">
              첫 3일: 감각의 압도기
            </span>
            <h4 className="font-bold text-stone-800">무리하게 만지지 마세요</h4>
            <p className="text-stone-600 text-[11px] leading-relaxed">
              조용한 격리방에서 숨숨집에 숨어 밥과 물만 챙겨주세요. 낯선 냄새와 소리에 익숙해질 때까지 기다려주는 것이 최고의 사랑입니다.
            </p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-amber-200 shadow-2xs space-y-1.5">
            <span className="text-xs font-black text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md">
              첫 3주: 영역 탐색기
            </span>
            <h4 className="font-bold text-stone-800">집사의 루틴을 파악합니다</h4>
            <p className="text-stone-600 text-[11px] leading-relaxed">
              방문을 열고 거실 캣타워와 스크래쳐를 탐색하기 시작합니다. 부드러운 목소리로 이름을 부르고 낚싯대 놀이로 유대감을 쌓으세요.
            </p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-amber-200 shadow-2xs space-y-1.5">
            <span className="text-xs font-black text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md">
              첫 3개월: 평생 가족 확신
            </span>
            <h4 className="font-bold text-stone-800">이곳이 나의 안전한 집!</h4>
            <p className="text-stone-600 text-[11px] leading-relaxed">
              배를 보이며 발라당 눕고, 퇴근길 도어락 소리에 마중을 나옵니다. 아이는 집사를 온전한 평생의 보호자로 신뢰하게 됩니다.
            </p>
          </div>
        </div>
      </div>

      {/* Self-Checklist for Applicants */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-4">
          <div>
            <h2 className="text-base font-extrabold text-stone-900 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              예비 집사 셀프 자격 진단 체크리스트
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              5개 이상 충족 시 준비된 입양 가정이 될 수 있습니다.
            </p>
          </div>
          <span className="text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
            체크 완료: {checkedCount} / 6
          </span>
        </div>

        <div className="space-y-3 text-xs">
          {[
            {
              key: 'familyConsent',
              title: '가족 및 동거인 100% 찬성',
              desc: '함께 사는 가족이나 룸메이트 전원이 고양이 입양에 완벽히 동의하였습니까?',
            },
            {
              key: 'petAllowed',
              title: '반려동물 양육 가능 주거지',
              desc: '자가 또는 전월세 집주인의 반려묘 양육 허락을 확인하셨습니까?',
            },
            {
              key: 'safetyScreen',
              title: '방묘창 및 방묘문 설치 의지',
              desc: '추락사 및 이탈 사고 방지를 위한 다이소 네트망 또는 맞춤 방묘창을 설치할 준비가 되셨습니까?',
            },
            {
              key: 'allergyFree',
              title: '고양이 알레르기 사전 검사',
              desc: '가족 중 심각한 고양이 천식/알레르기가 없음을 내과나 이비인후과 피검사로 확인하셨습니까?',
            },
            {
              key: 'budgetReady',
              title: '매월 15~30만원 양육 예산 준비',
              desc: '양질의 사료, 모래, 정기 구충제 및 만약을 대비한 비상 의료비 저축이 가능합니까?',
            },
            {
              key: 'emergencyPlan',
              title: '환경 변화에도 끝까지 책임',
              desc: '향후 이사, 이직, 결혼, 출산 등의 변화가 있어도 파양하지 않고 평생 함께할 각오가 되어 있습니까?',
            },
          ].map((item) => (
            <label
              key={item.key}
              className={`p-3.5 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                checklist[item.key as keyof typeof checklist]
                  ? 'border-emerald-300 bg-emerald-50/40 text-stone-900'
                  : 'border-stone-200 bg-stone-50/30 text-stone-700 hover:bg-stone-50'
              }`}
            >
              <input
                type="checkbox"
                checked={checklist[item.key as keyof typeof checklist]}
                onChange={(e) =>
                  setChecklist((prev) => ({ ...prev, [item.key]: e.target.checked }))
                }
                className="w-4 h-4 text-emerald-600 rounded mt-0.5"
              />
              <div className="flex-1">
                <h4 className="font-bold text-xs">{item.title}</h4>
                <p className="text-[11px] text-stone-500 mt-0.5">{item.desc}</p>
              </div>
            </label>
          ))}
        </div>

        {/* Readiness Result & Action */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs">
            {isReady ? (
              <span className="text-emerald-700 font-extrabold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                훌륭합니다! 입양을 위한 마음가짐과 환경이 잘 준비되었습니다.
              </span>
            ) : (
              <span className="text-stone-500 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                체크리스트를 꼼꼼히 확인하고 평생 가족 맞이를 준비해 보세요.
              </span>
            )}
          </div>

          <button
            onClick={onStartAdoption}
            className="w-full sm:w-auto px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-xs transition-colors"
          >
            <Heart className="w-4 h-4 fill-white" />
            유기묘 분양 페이지로 이동하기
          </button>
        </div>
      </div>
    </div>
  );
};
