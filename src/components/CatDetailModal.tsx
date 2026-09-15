import React from 'react';
import { X, Heart, Shield, CheckCircle2, AlertCircle, MapPin, Calendar, Activity, Sparkles, MessageCircle } from 'lucide-react';
import { RescueCat } from '../types';
import { useAdoption } from '../context/AdoptionContext';

interface CatDetailModalProps {
  cat: RescueCat | null;
  onClose: () => void;
  onApply: (cat: RescueCat) => void;
  onInquire: (cat: RescueCat) => void;
}

export const CatDetailModal: React.FC<CatDetailModalProps> = ({
  cat,
  onClose,
  onApply,
  onInquire,
}) => {
  if (!cat) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-stone-900/60 backdrop-blur-xs overflow-y-auto animate-fadeIn">
      <div
        className="bg-white rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl border border-stone-100 my-8 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with image */}
        <div className="relative h-64 sm:h-80 w-full bg-stone-100 shrink-0">
          <img
            src={cat.mainPhoto}
            alt={cat.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-black/40 hover:bg-black/70 text-white p-2 rounded-full transition-colors backdrop-blur-xs"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Status badge */}
          <div className="absolute top-4 left-4 flex gap-2">
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold shadow-xs ${
                cat.status === '입양대기'
                  ? 'bg-emerald-500 text-white'
                  : cat.status === '심사중'
                  ? 'bg-amber-500 text-white'
                  : 'bg-stone-600 text-white'
              }`}
            >
              {cat.status}
            </span>
            <span className="bg-white/90 backdrop-blur-xs text-stone-800 px-2.5 py-1 rounded-full text-xs font-semibold">
              {cat.breed}
            </span>
          </div>

          {/* Hero title on image */}
          <div className="absolute bottom-4 left-6 right-6 text-white">
            <div className="flex items-baseline gap-3">
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">{cat.name}</h2>
              <span className="text-sm text-stone-200 font-medium">
                {cat.age} · {cat.gender} · {cat.isNeutered ? '중성화 완료' : '중성화 예정'} · {cat.weight}kg
              </span>
            </div>
            <div className="flex items-center gap-4 text-xs text-stone-300 mt-1">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                구조지: {cat.rescueLocation}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                구조일: {cat.rescueDate}
              </span>
            </div>
          </div>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
          {/* Personality tags */}
          <div>
            <h3 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              성격 및 매력 포인트
            </h3>
            <div className="flex flex-wrap gap-2">
              {cat.personalityTags.map((tag, idx) => (
                <span
                  key={idx}
                  className="bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold px-2.5 py-1 rounded-lg"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Rescue Story */}
          <div className="bg-amber-50/50 rounded-xl p-4 sm:p-5 border border-amber-100">
            <h3 className="text-sm font-bold text-amber-950 mb-2 flex items-center gap-2">
              <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
              {cat.name}의 구조 사연
            </h3>
            <p className="text-sm text-stone-700 leading-relaxed whitespace-pre-line">
              {cat.story}
            </p>
          </div>

          {/* Medical & Health Status */}
          <div className="border border-stone-200 rounded-xl p-5 bg-stone-50/60">
            <h3 className="text-sm font-bold text-stone-900 mb-3 flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-600" />
              건강 검진 및 접종 이력
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="bg-white p-3 rounded-lg border border-stone-200">
                <span className="text-stone-500 block mb-1">FIV / FeLV (백혈병/에이즈)</span>
                <span className="font-bold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {cat.healthInfo.fivFelv}
                </span>
              </div>
              <div className="bg-white p-3 rounded-lg border border-stone-200">
                <span className="text-stone-500 block mb-1">예방 접종 현황</span>
                <span className="font-bold text-stone-800">{cat.healthInfo.vaccinations}</span>
              </div>
              <div className="bg-white p-3 rounded-lg border border-stone-200">
                <span className="text-stone-500 block mb-1">마이크로칩 등록 여부</span>
                <span className="font-bold text-stone-800">
                  {cat.healthInfo.isChipped ? '내장형 마이크로칩 삽입 완료' : '입양 시 삽입 지원'}
                </span>
              </div>
              <div className="bg-white p-3 rounded-lg border border-stone-200">
                <span className="text-stone-500 block mb-1">특이사항 및 케어 안내</span>
                <span className="font-medium text-stone-700">
                  {cat.healthInfo.specialCare || '특이 소견 없음. 건강 양호.'}
                </span>
              </div>
            </div>
          </div>

          {/* Compatibility */}
          <div>
            <h3 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">
              환경 적합도 가이드
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="p-2.5 rounded-lg border border-stone-200 text-center bg-white">
                <span className="text-stone-500 block text-[11px] mb-1">초보 집사</span>
                <span className={`font-bold ${cat.compatibility.firstTimeOwner ? 'text-emerald-600' : 'text-amber-600'}`}>
                  {cat.compatibility.firstTimeOwner ? '추천' : '경험자 우대'}
                </span>
              </div>
              <div className="p-2.5 rounded-lg border border-stone-200 text-center bg-white">
                <span className="text-stone-500 block text-[11px] mb-1">다른 고양이와</span>
                <span className={`font-bold ${cat.compatibility.withOtherCats ? 'text-emerald-600' : 'text-stone-600'}`}>
                  {cat.compatibility.withOtherCats ? '친화적 (합사가능)' : '외동묘 권장'}
                </span>
              </div>
              <div className="p-2.5 rounded-lg border border-stone-200 text-center bg-white">
                <span className="text-stone-500 block text-[11px] mb-1">어린이와</span>
                <span className={`font-bold ${cat.compatibility.withChildren ? 'text-emerald-600' : 'text-stone-600'}`}>
                  {cat.compatibility.withChildren ? '어울림' : '조용한 가정 권장'}
                </span>
              </div>
              <div className="p-2.5 rounded-lg border border-stone-200 text-center bg-white">
                <span className="text-stone-500 block text-[11px] mb-1">활동성 레벨</span>
                <span className="font-bold text-stone-800">{cat.compatibility.activityLevel}</span>
              </div>
            </div>
          </div>

          {/* Mandatory Adoption Requirements */}
          <div className="bg-rose-50/60 border border-rose-200 rounded-xl p-4 text-xs">
            <h4 className="font-bold text-rose-900 mb-2 flex items-center gap-1.5 text-sm">
              <Shield className="w-4 h-4 text-rose-600" />
              보호소 필수 입양 조건
            </h4>
            <ul className="space-y-1.5 text-stone-700">
              {cat.adoptionRequirements.map((req, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Shelter contact info */}
          <div className="flex items-center justify-between text-xs text-stone-500 border-t border-stone-200 pt-4">
            <div>
              <span className="font-semibold text-stone-700">{cat.shelterName}</span>
              <span className="ml-2">문의: {cat.shelterContact}</span>
            </div>
            <button
              onClick={() => onInquire(cat)}
              className="text-amber-700 hover:text-amber-800 font-semibold flex items-center gap-1 hover:underline"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              보호소에 1:1 질문하기
            </button>
          </div>
        </div>

        {/* Modal Bottom Action Footer */}
        <div className="p-4 sm:p-5 bg-stone-50 border-t border-stone-200 flex items-center justify-between gap-3 shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-stone-300 text-stone-700 text-sm font-semibold hover:bg-stone-100 transition-colors"
          >
            닫기
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onInquire(cat)}
              className="px-4 py-2.5 rounded-xl border border-amber-300 text-amber-800 bg-amber-50 hover:bg-amber-100 text-sm font-semibold transition-colors flex items-center gap-1.5"
            >
              <MessageCircle className="w-4 h-4" />
              상담 문의
            </button>
            <button
              id={`apply-btn-${cat.id}`}
              disabled={cat.status === '입양완료'}
              onClick={() => onApply(cat)}
              className={`px-6 py-2.5 rounded-xl text-white text-sm font-bold flex items-center gap-2 shadow-sm transition-all ${
                cat.status === '입양완료'
                  ? 'bg-stone-400 cursor-not-allowed'
                  : 'bg-amber-600 hover:bg-amber-700 shadow-amber-200 hover:scale-[1.02]'
              }`}
            >
              <Heart className="w-4 h-4 fill-white" />
              {cat.status === '입양완료' ? '입양 완료된 고양이' : '입양 신청서 작성하기'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
