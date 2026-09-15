import React from 'react';
import { Heart, Cat, FileText, LayoutDashboard, ShieldCheck, MessageCircle, RefreshCw, User, Building2 } from 'lucide-react';
import { useAdoption } from '../context/AdoptionContext';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, setCurrentTab }) => {
  const {
    userRole,
    setUserRole,
    applications,
    messages,
    postAdoptionRecords,
    resetAllData,
  } = useAdoption();

  // Active applications for adopter
  const activeUserApps = applications.filter((a) => a.stage !== 'REJECTED');
  // Pending applications needing review for shelter
  const pendingShelterApps = applications.filter(
    (a) => a.stage === 'STAGE_1_SUBMITTED' || a.stage === 'STAGE_2_DOC_REVIEW'
  );
  // Unread messages
  const unreadCount = messages.filter((m) => !m.isRead && m.sender !== userRole).length;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-amber-100 shadow-xs">
      {/* Top Banner: Role Switcher & System Status */}
      <div className="bg-amber-50/80 border-b border-amber-100/60 px-4 py-1.5 text-xs text-amber-900 flex flex-wrap items-center justify-between gap-2 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 font-medium bg-amber-200/70 text-amber-950 px-2 py-0.5 rounded-full text-[11px]">
            🐾 사지 말고 입양하세요
          </span>
          <span className="hidden sm:inline text-amber-800">
            유기묘에게 따뜻한 평생 가족을 찾아주는 안심 입양 & 사후 케어 플랫폼
          </span>
        </div>

        {/* Role Toggle Switcher */}
        <div className="flex items-center gap-2">
          <span className="text-stone-500 font-medium hidden md:inline">현재 모드:</span>
          <div className="bg-amber-200/50 p-0.5 rounded-lg flex items-center border border-amber-200">
            <button
              id="role-adopter-btn"
              onClick={() => setUserRole('adopter')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
                userRole === 'adopter'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-amber-900 hover:bg-amber-200/60'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              입양 희망자
            </button>
            <button
              id="role-shelter-btn"
              onClick={() => setUserRole('shelter')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
                userRole === 'shelter'
                  ? 'bg-amber-800 text-white shadow-xs'
                  : 'text-amber-900 hover:bg-amber-200/60'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              보호소 관리자
              {pendingShelterApps.length > 0 && (
                <span className="bg-rose-500 text-white text-[10px] px-1 rounded-full font-bold">
                  {pendingShelterApps.length}
                </span>
              )}
            </button>
          </div>

          <button
            onClick={() => {
              if (window.confirm('초기 데모 데이터로 초기화하시겠습니까?')) {
                resetAllData();
              }
            }}
            title="데모 데이터 초기화"
            className="text-stone-500 hover:text-stone-800 p-1 rounded-md hover:bg-amber-100 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <div
          onClick={() => setCurrentTab('catalog')}
          className="flex items-center gap-2.5 cursor-pointer group select-none"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-400 flex items-center justify-center text-white shadow-sm shadow-amber-200 group-hover:scale-105 transition-transform">
            <Cat className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-xl tracking-tight text-stone-900">묘연</span>
              <span className="text-xs font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-sm border border-amber-200">
                猫緣
              </span>
            </div>
            <p className="text-[11px] text-stone-700 font-medium">유기묘 입양 & 안심 사후 관리</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden lg:flex items-center gap-1">
          <button
            id="nav-tab-catalog"
            onClick={() => setCurrentTab('catalog')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
              currentTab === 'catalog'
                ? 'bg-amber-50 text-amber-800'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
            }`}
          >
            <Cat className="w-4 h-4 text-amber-600" />
            유기묘 분양·입양
          </button>

          <button
            id="nav-tab-guide"
            onClick={() => setCurrentTab('guide')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
              currentTab === 'guide'
                ? 'bg-amber-50 text-amber-800'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            입양 절차 안내
          </button>

          <button
            id="nav-tab-applications"
            onClick={() => setCurrentTab('applications')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition-colors relative ${
              currentTab === 'applications'
                ? 'bg-amber-50 text-amber-800'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
            }`}
          >
            <FileText className="w-4 h-4 text-blue-600" />
            내 입양 신청 현황
            {activeUserApps.length > 0 && (
              <span className="bg-amber-600 text-white text-[11px] px-1.5 py-0.2 rounded-full font-bold">
                {activeUserApps.length}
              </span>
            )}
          </button>

          <button
            id="nav-tab-postcare"
            onClick={() => setCurrentTab('postcare')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
              currentTab === 'postcare'
                ? 'bg-amber-50 text-amber-800'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
            }`}
          >
            <Heart className="w-4 h-4 text-rose-500 fill-rose-500/20" />
            사후 관리 대시보드
            {postAdoptionRecords.length > 0 && (
              <span className="bg-rose-100 text-rose-700 text-[11px] px-1.5 py-0.2 rounded-full font-bold">
                {postAdoptionRecords.length}
              </span>
            )}
          </button>

          <button
            id="nav-tab-shelter"
            onClick={() => setCurrentTab('shelter')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
              currentTab === 'shelter'
                ? 'bg-amber-100 text-amber-900'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
            }`}
          >
            <LayoutDashboard className="w-4 h-4 text-amber-700" />
            보호소 관리 센터
            {pendingShelterApps.length > 0 && (
              <span className="bg-rose-500 text-white text-[11px] px-1.5 py-0.2 rounded-full font-bold animate-pulse">
                {pendingShelterApps.length}건 대기
              </span>
            )}
          </button>

          <button
            id="nav-tab-messages"
            onClick={() => setCurrentTab('messages')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition-colors relative ${
              currentTab === 'messages'
                ? 'bg-amber-50 text-amber-800'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
            }`}
          >
            <MessageCircle className="w-4 h-4 text-indigo-600" />
            1:1 소통함
            {unreadCount > 0 && (
              <span className="bg-indigo-600 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                {unreadCount}
              </span>
            )}
          </button>
        </nav>

        {/* Right CTA / Mobile quick menu */}
        <div className="flex items-center gap-2">
          {userRole === 'shelter' ? (
            <button
              onClick={() => setCurrentTab('shelter')}
              className="bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold px-3.5 py-2 rounded-lg flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <Building2 className="w-3.5 h-3.5" />
              보호소 관리자 모드 중
            </button>
          ) : (
            <button
              onClick={() => setCurrentTab('catalog')}
              className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold px-3.5 py-2 rounded-lg flex items-center gap-1.5 shadow-xs shadow-amber-200 transition-colors"
            >
              <Heart className="w-3.5 h-3.5 fill-white" />
              입양 기다리는 냥이 보기
            </button>
          )}
        </div>
      </div>

      {/* Mobile scrollable tabs */}
      <div className="lg:hidden flex items-center gap-1 overflow-x-auto px-4 py-2 bg-stone-50 border-t border-stone-200 text-xs no-scrollbar">
        <button
          onClick={() => setCurrentTab('catalog')}
          className={`shrink-0 px-2.5 py-1.5 rounded-md font-semibold ${
            currentTab === 'catalog' ? 'bg-amber-600 text-white' : 'text-stone-600 bg-white border border-stone-200'
          }`}
        >
          🐱 유기묘 분양
        </button>
        <button
          onClick={() => setCurrentTab('guide')}
          className={`shrink-0 px-2.5 py-1.5 rounded-md font-semibold ${
            currentTab === 'guide' ? 'bg-amber-600 text-white' : 'text-stone-600 bg-white border border-stone-200'
          }`}
        >
          📋 입양 절차
        </button>
        <button
          onClick={() => setCurrentTab('applications')}
          className={`shrink-0 px-2.5 py-1.5 rounded-md font-semibold flex items-center gap-1 ${
            currentTab === 'applications' ? 'bg-amber-600 text-white' : 'text-stone-600 bg-white border border-stone-200'
          }`}
        >
          📝 신청 현황
          {activeUserApps.length > 0 && (
            <span className="bg-amber-200 text-amber-900 text-[10px] px-1 rounded-full font-bold">
              {activeUserApps.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setCurrentTab('postcare')}
          className={`shrink-0 px-2.5 py-1.5 rounded-md font-semibold ${
            currentTab === 'postcare' ? 'bg-amber-600 text-white' : 'text-stone-600 bg-white border border-stone-200'
          }`}
        >
          🏠 사후 관리
        </button>
        <button
          onClick={() => setCurrentTab('shelter')}
          className={`shrink-0 px-2.5 py-1.5 rounded-md font-semibold flex items-center gap-1 ${
            currentTab === 'shelter' ? 'bg-amber-800 text-white' : 'text-stone-600 bg-white border border-stone-200'
          }`}
        >
          🏢 보호소 센터
          {pendingShelterApps.length > 0 && (
            <span className="bg-rose-500 text-white text-[10px] px-1 rounded-full font-bold">
              {pendingShelterApps.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setCurrentTab('messages')}
          className={`shrink-0 px-2.5 py-1.5 rounded-md font-semibold ${
            currentTab === 'messages' ? 'bg-amber-600 text-white' : 'text-stone-600 bg-white border border-stone-200'
          }`}
        >
          💬 소통함
        </button>
      </div>
    </header>
  );
};
