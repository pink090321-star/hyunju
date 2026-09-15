import React, { useState } from 'react';
import { AdoptionProvider, useAdoption } from './context/AdoptionContext';
import { Navbar } from './components/Navbar';
import { CatCatalog } from './components/CatCatalog';
import { CatDetailModal } from './components/CatDetailModal';
import { AdoptionApplicationModal } from './components/AdoptionApplicationModal';
import { ApplicationTracker } from './components/ApplicationTracker';
import { PostAdoptionDashboard } from './components/PostAdoptionDashboard';
import { ShelterAdmin } from './components/ShelterAdmin';
import { CommunicationCenter } from './components/CommunicationCenter';
import { AdoptionGuide } from './components/AdoptionGuide';
import { RescueCat } from './types';
import { Heart, Cat, ShieldCheck, Phone, MapPin, Sparkles } from 'lucide-react';

function MainContent() {
  const [currentTab, setCurrentTab] = useState<string>('catalog');
  const [selectedCat, setSelectedCat] = useState<RescueCat | null>(null);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [catForApplication, setCatForApplication] = useState<RescueCat | null>(null);
  const [chatInitialAppId, setChatInitialAppId] = useState<string | null>(null);

  const { setActiveChatAppId, userRole } = useAdoption();

  const handleOpenCatDetail = (cat: RescueCat) => {
    setSelectedCat(cat);
  };

  const handleStartApply = (cat: RescueCat) => {
    setSelectedCat(null);
    setCatForApplication(cat);
    setIsApplyModalOpen(true);
  };

  const handleInquireFromDetail = (cat: RescueCat) => {
    setSelectedCat(null);
    setCurrentTab('messages');
  };

  const handleApplicationSuccess = (appId: string) => {
    setCurrentTab('applications');
    setActiveChatAppId(appId);
  };

  const handleOpenChatWithApp = (appId: string) => {
    setChatInitialAppId(appId);
    setActiveChatAppId(appId);
    setCurrentTab('messages');
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-100/60 text-stone-800">
      {/* Top Navbar */}
      <Navbar currentTab={currentTab} setCurrentTab={setCurrentTab} />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {currentTab === 'catalog' && (
          <CatCatalog
            onSelectCat={handleOpenCatDetail}
            onApplyCat={handleStartApply}
          />
        )}

        {currentTab === 'guide' && (
          <AdoptionGuide onStartAdoption={() => setCurrentTab('catalog')} />
        )}

        {currentTab === 'applications' && (
          <ApplicationTracker
            onOpenChat={handleOpenChatWithApp}
            onGoToPostCare={() => setCurrentTab('postcare')}
          />
        )}

        {currentTab === 'postcare' && (
          <PostAdoptionDashboard
            onOpenChatWithShelter={() => setCurrentTab('messages')}
          />
        )}

        {currentTab === 'shelter' && (
          <ShelterAdmin onOpenChat={handleOpenChatWithApp} />
        )}

        {currentTab === 'messages' && (
          <CommunicationCenter initialAppId={chatInitialAppId} />
        )}
      </main>

      {/* Cat Detail Modal */}
      <CatDetailModal
        cat={selectedCat}
        onClose={() => setSelectedCat(null)}
        onApply={handleStartApply}
        onInquire={handleInquireFromDetail}
      />

      {/* Application Form Modal */}
      <AdoptionApplicationModal
        cat={catForApplication}
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        onSuccess={handleApplicationSuccess}
      />

      {/* Footer */}
      <footer className="bg-white border-t border-stone-200 mt-12 py-10 px-4 sm:px-6 text-xs text-stone-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1.5 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 font-extrabold text-stone-900 text-sm">
              <Cat className="w-4 h-4 text-amber-600" />
              <span>묘연 (猫緣) 유기묘 안심 입양 & 사후 관리 플랫폼</span>
            </div>
            <p className="text-[11px] text-stone-400">
              길 위의 생명들이 평생 안전하고 사랑받는 집고양이가 될 수 있도록 보호소와 입양자를 이어줍니다.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] text-stone-600">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              방묘창 100% 검증 원칙
            </span>
            <span className="flex items-center gap-1">
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
              1년 사후 케어 보장
            </span>
            <span className="flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-amber-600" />
              보호소 핫라인: 02-715-9923
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AdoptionProvider>
      <MainContent />
    </AdoptionProvider>
  );
}
