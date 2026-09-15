import React, { useState, useMemo } from 'react';
import { Search, Filter, Heart, Sparkles, MapPin, ShieldCheck, ArrowRight, Eye, CheckCircle2 } from 'lucide-react';
import { RescueCat, CatStatus } from '../types';
import { useAdoption } from '../context/AdoptionContext';

interface CatCatalogProps {
  onSelectCat: (cat: RescueCat) => void;
  onApplyCat: (cat: RescueCat) => void;
}

export const CatCatalog: React.FC<CatCatalogProps> = ({ onSelectCat, onApplyCat }) => {
  const { cats } = useAdoption();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedAgeGroup, setSelectedAgeGroup] = useState<string>('ALL');
  const [selectedTag, setSelectedTag] = useState<string>('ALL');

  // Stats
  const totalCats = cats.length;
  const waitingCats = cats.filter((c) => c.status === '입양대기').length;
  const adoptedCats = cats.filter((c) => c.status === '입양완료').length;

  const filteredCats = useMemo(() => {
    return cats.filter((cat) => {
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const match =
          cat.name.toLowerCase().includes(q) ||
          cat.breed.toLowerCase().includes(q) ||
          cat.rescueLocation.toLowerCase().includes(q) ||
          cat.shelterName.toLowerCase().includes(q) ||
          cat.personalityTags.some((t) => t.toLowerCase().includes(q));
        if (!match) return false;
      }

      // Status filter
      if (selectedStatus !== 'ALL' && cat.status !== selectedStatus) {
        return false;
      }

      // Age group
      if (selectedAgeGroup === 'KITTEN') {
        if (!cat.age.includes('개월')) return false;
      } else if (selectedAgeGroup === 'ADULT') {
        if (cat.age.includes('개월') || parseInt(cat.age) >= 7) return false;
      } else if (selectedAgeGroup === 'SENIOR') {
        if (parseInt(cat.age) < 7) return false;
      }

      // Personality Tag
      if (selectedTag !== 'ALL') {
        if (!cat.personalityTags.includes(selectedTag)) return false;
      }

      return true;
    });
  }, [cats, searchQuery, selectedStatus, selectedAgeGroup, selectedTag]);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Hero Banner with mission statement */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-600 via-orange-500 to-amber-500 text-white shadow-lg p-6 sm:p-10">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-amber-200" />
            보호소 연계 투명 입양 시스템
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
            길 위의 차가운 기억 대신,<br />
            따뜻한 온기를 선물해 주세요.
          </h1>
          <p className="text-sm text-amber-100 font-normal leading-relaxed">
            모든 아이들은 구조 후 철저한 건강검진(FIV/FeLV, 백신, 중성화)을 마쳤습니다.
            자동화된 안심 입양 절차와 사후 케어 시스템으로 첫 만남부터 평생까지 함께합니다.
          </p>

          {/* Quick Stats in Hero */}
          <div className="pt-2 flex flex-wrap gap-4 sm:gap-6 text-xs sm:text-sm">
            <div className="bg-black/15 backdrop-blur-xs px-3.5 py-2 rounded-xl">
              <span className="text-amber-200 block text-[11px]">입양을 기다리는 아이</span>
              <span className="font-extrabold text-base sm:text-lg">{waitingCats} 마리</span>
            </div>
            <div className="bg-black/15 backdrop-blur-xs px-3.5 py-2 rounded-xl">
              <span className="text-amber-200 block text-[11px]">새 가족을 찾은 아이</span>
              <span className="font-extrabold text-base sm:text-lg">{adoptedCats} 마리</span>
            </div>
            <div className="bg-black/15 backdrop-blur-xs px-3.5 py-2 rounded-xl">
              <span className="text-amber-200 block text-[11px]">방묘창 안전 검증률</span>
              <span className="font-extrabold text-base sm:text-lg">100% 안심보장</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar Section */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
          {/* Search Input */}
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="이름, 품종, 쉼터, 성격 키워드로 검색..."
              className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all"
            />
          </div>

          {/* Status Filter buttons */}
          <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            {[
              { id: 'ALL', label: '전체 냥이' },
              { id: '입양대기', label: '🌟 입양 대기중' },
              { id: '심사중', label: '⏳ 심사 진행중' },
              { id: '입양완료', label: '🏡 입양 완료' },
            ].map((st) => (
              <button
                key={st.id}
                onClick={() => setSelectedStatus(st.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedStatus === st.id
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>
        </div>

        {/* Secondary Filter Chips: Age and Personality */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-stone-100 text-xs">
          <span className="text-stone-400 font-semibold text-[11px] flex items-center gap-1">
            <Filter className="w-3 h-3" /> 연령별:
          </span>
          {[
            { id: 'ALL', label: '전체 연령' },
            { id: 'KITTEN', label: '아기냥 (1세 미만)' },
            { id: 'ADULT', label: '청소년·성묘 (1~7세)' },
          ].map((ag) => (
            <button
              key={ag.id}
              onClick={() => setSelectedAgeGroup(ag.id)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                selectedAgeGroup === ag.id
                  ? 'bg-amber-100 text-amber-900 font-bold'
                  : 'bg-stone-50 text-stone-600 hover:bg-stone-100'
              }`}
            >
              {ag.label}
            </button>
          ))}

          <span className="text-stone-300 mx-1">|</span>

          <span className="text-stone-400 font-semibold text-[11px]">특성 태그:</span>
          {['ALL', '무릎냥이', '골골송 장인', '초보집사 강추', '신사적인 성격', '우다다 대장'].map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                selectedTag === tag
                  ? 'bg-orange-100 text-orange-900 font-bold border border-orange-200'
                  : 'bg-stone-50 text-stone-600 hover:bg-stone-100'
              }`}
            >
              {tag === 'ALL' ? '전체 태그' : `#${tag}`}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Stray Cats */}
      {filteredCats.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-stone-200 space-y-3">
          <div className="w-16 h-16 bg-stone-100 text-stone-400 rounded-full flex items-center justify-center mx-auto">
            <Heart className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-stone-800">해당 조건의 고양이가 없습니다</h3>
          <p className="text-xs text-stone-500">
            검색어나 필터를 초기화하여 더 많은 아이들을 만나보세요.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedStatus('ALL');
              setSelectedAgeGroup('ALL');
              setSelectedTag('ALL');
            }}
            className="px-4 py-2 bg-amber-600 text-white text-xs font-bold rounded-lg hover:bg-amber-700 transition-colors"
          >
            전체 목록 보기
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCats.map((cat) => (
            <div
              key={cat.id}
              className="bg-white rounded-2xl overflow-hidden border border-stone-200/80 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col group"
            >
              {/* Image Container with hover zoom */}
              <div
                className="relative h-56 overflow-hidden bg-stone-100 cursor-pointer"
                onClick={() => onSelectCat(cat)}
              >
                <img
                  src={cat.mainPhoto}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />

                {/* Status Badge */}
                <div className="absolute top-3 left-3 flex gap-1.5">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-extrabold shadow-xs ${
                      cat.status === '입양대기'
                        ? 'bg-emerald-500 text-white'
                        : cat.status === '심사중'
                        ? 'bg-amber-500 text-white'
                        : 'bg-stone-700 text-white'
                    }`}
                  >
                    {cat.status}
                  </span>
                  {cat.compatibility.firstTimeOwner && (
                    <span className="bg-amber-100/90 backdrop-blur-xs text-amber-900 px-2 py-0.5 rounded-full text-[11px] font-bold border border-amber-200">
                      초보집사 추천
                    </span>
                  )}
                </div>

                {/* Bottom title info over image */}
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <div className="flex items-baseline justify-between">
                    <h3 className="font-extrabold text-xl tracking-tight">{cat.name}</h3>
                    <span className="text-xs text-amber-200 font-semibold">
                      {cat.age} · {cat.gender}
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-300 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-amber-400" />
                    {cat.rescueLocation}
                  </p>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  {/* Breed & Medical check badges */}
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-stone-600">{cat.breed}</span>
                    <span className="text-emerald-700 font-semibold flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      FIV/FeLV 음성
                    </span>
                  </div>

                  {/* Personality Tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {cat.personalityTags.slice(0, 3).map((tag, i) => (
                      <span
                        key={i}
                        className="bg-stone-100 text-stone-700 text-[11px] font-medium px-2 py-0.5 rounded-md"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* Story excerpt */}
                  <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                    {cat.story}
                  </p>
                </div>

                {/* Shelter & Action buttons */}
                <div className="pt-3 border-t border-stone-100 space-y-2">
                  <div className="text-[11px] text-stone-400 flex items-center justify-between">
                    <span>{cat.shelterName}</span>
                    <span>{cat.isNeutered ? '중성화 완료' : '중성화 지원'}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => onSelectCat(cat)}
                      className="px-3 py-2 rounded-xl border border-stone-200 text-stone-700 text-xs font-bold hover:bg-stone-50 flex items-center justify-center gap-1 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      상세 사연
                    </button>
                    <button
                      disabled={cat.status === '입양완료'}
                      onClick={() => onApplyCat(cat)}
                      className={`px-3 py-2 rounded-xl text-white text-xs font-bold flex items-center justify-center gap-1 transition-all ${
                        cat.status === '입양완료'
                          ? 'bg-stone-300 cursor-not-allowed text-stone-500'
                          : 'bg-amber-600 hover:bg-amber-700 shadow-xs shadow-amber-200'
                      }`}
                    >
                      <Heart className="w-3.5 h-3.5 fill-white" />
                      {cat.status === '입양완료' ? '입양완료' : '입양 신청'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
