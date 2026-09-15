import React, { useState, useRef, useEffect } from 'react';
import {
  MessageCircle,
  Send,
  Camera,
  Image,
  Sparkles,
  CheckCheck,
  Building2,
  User,
  Shield,
  FileText,
} from 'lucide-react';
import { useAdoption } from '../context/AdoptionContext';

interface CommunicationCenterProps {
  initialAppId?: string | null;
}

export const CommunicationCenter: React.FC<CommunicationCenterProps> = ({
  initialAppId,
}) => {
  const {
    applications,
    messages,
    sendMessage,
    userRole,
    activeChatAppId,
    setActiveChatAppId,
  } = useAdoption();

  const [selectedAppId, setSelectedAppId] = useState<string>(
    activeChatAppId || initialAppId || applications[0]?.id || ''
  );
  const [inputText, setInputText] = useState('');
  const [attachmentUrl, setAttachmentUrl] = useState('');
  const [showAttachInput, setShowAttachInput] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Sync if external triggers activeChatAppId
  useEffect(() => {
    if (activeChatAppId) {
      setSelectedAppId(activeChatAppId);
    }
  }, [activeChatAppId]);

  const activeApp =
    applications.find((a) => a.id === selectedAppId) || applications[0];

  // Filter messages for active application (or general)
  const conversationMessages = messages.filter(
    (m) => !m.applicationId || m.applicationId === activeApp?.id
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversationMessages.length]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() && !attachmentUrl.trim()) return;

    sendMessage(
      inputText.trim() || '사진을 전송했습니다.',
      activeApp?.id,
      activeApp?.catId,
      attachmentUrl.trim() || undefined
    );

    setInputText('');
    setAttachmentUrl('');
    setShowAttachInput(false);
  };

  const sendQuickPhrase = (text: string) => {
    sendMessage(text, activeApp?.id, activeApp?.catId);
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden h-[750px] flex flex-col md:flex-row animate-fadeIn">
      {/* Left Sidebar: Application Chat Channels */}
      <div className="w-full md:w-80 border-r border-stone-200 flex flex-col shrink-0 bg-stone-50/50">
        <div className="p-4 border-b border-stone-200 bg-white">
          <h2 className="text-sm font-extrabold text-stone-900 flex items-center gap-2">
            <MessageCircle className="w-4 h-4 text-amber-600" />
            1:1 보호소 소통 채널
          </h2>
          <p className="text-[11px] text-stone-500 mt-0.5">
            심사 안내, 면담 조율, 안전망 사진 제출
          </p>
        </div>

        {/* Conversation Channel List */}
        <div className="overflow-y-auto flex-1 p-2 space-y-1">
          {applications.map((app) => {
            const appMsgs = messages.filter((m) => m.applicationId === app.id);
            const lastMsg = appMsgs[appMsgs.length - 1];

            return (
              <button
                key={app.id}
                onClick={() => {
                  setSelectedAppId(app.id);
                  setActiveChatAppId(app.id);
                }}
                className={`w-full p-3 rounded-xl text-left transition-all flex items-start gap-3 ${
                  selectedAppId === app.id
                    ? 'bg-amber-100/70 border border-amber-200 shadow-2xs'
                    : 'hover:bg-stone-100/80 border border-transparent'
                }`}
              >
                <img
                  src={app.catPhoto}
                  alt={app.catName}
                  className="w-11 h-11 rounded-xl object-cover shrink-0 border border-stone-200"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-stone-900 truncate">
                      {app.catName} ({app.applicantName})
                    </span>
                    <span className="text-[10px] text-stone-400">
                      {lastMsg?.timestamp?.split(' ')[1] || ''}
                    </span>
                  </div>
                  <span className="text-[10px] text-amber-800 font-semibold block truncate">
                    {app.shelterName}
                  </span>
                  <p className="text-[11px] text-stone-500 truncate mt-0.5">
                    {lastMsg ? lastMsg.content : '상담 채널이 개설되었습니다.'}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* User Role Reminder in Sidebar Footer */}
        <div className="p-3 bg-stone-100 border-t border-stone-200 text-[11px] text-stone-600 flex items-center justify-between">
          <span className="flex items-center gap-1.5 font-medium">
            {userRole === 'shelter' ? (
              <Building2 className="w-3.5 h-3.5 text-amber-700" />
            ) : (
              <User className="w-3.5 h-3.5 text-amber-600" />
            )}
            {userRole === 'shelter' ? '보호소 관리자로 발송' : '입양 신청자로 발송'}
          </span>
        </div>
      </div>

      {/* Right Area: Active Chat Window */}
      {activeApp ? (
        <div className="flex-1 flex flex-col bg-white">
          {/* Channel Header Bar */}
          <div className="p-4 border-b border-stone-200 flex items-center justify-between gap-3 bg-stone-50/40 shrink-0">
            <div className="flex items-center gap-3">
              <img
                src={activeApp.catPhoto}
                alt={activeApp.catName}
                className="w-10 h-10 rounded-xl object-cover border border-stone-200"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-sm text-stone-900">
                    {activeApp.catName} 입양 상담 채널
                  </h3>
                  <span className="text-[10px] bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full font-bold">
                    신청자: {activeApp.applicantName} 님
                  </span>
                </div>
                <span className="text-xs text-stone-500">{activeApp.shelterName} 담당자 직통</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 hidden sm:inline">
                적합도: {activeApp.score}점
              </span>
            </div>
          </div>

          {/* Quick Action Suggestion Chips */}
          <div className="bg-amber-50/40 border-b border-amber-100 px-4 py-2 flex items-center gap-2 overflow-x-auto text-[11px]">
            <span className="text-amber-900 font-bold shrink-0">빠른 질문:</span>
            <button
              onClick={() => sendQuickPhrase('방묘창 설치 완료 사진을 추가로 제출합니다.')}
              className="bg-white border border-amber-200 text-amber-900 px-2.5 py-1 rounded-lg hover:bg-amber-100 shrink-0"
            >
              📷 방묘창 사진 추가제출
            </button>
            <button
              onClick={() => sendQuickPhrase('면담 일정을 이번 주 주말로 변경 가능할까요?')}
              className="bg-white border border-amber-200 text-amber-900 px-2.5 py-1 rounded-lg hover:bg-amber-100 shrink-0"
            >
              📅 면담 일정 조율
            </button>
            <button
              onClick={() => sendQuickPhrase('아이가 평소 좋아하는 사료나 간식 브랜드를 알고 싶습니다.')}
              className="bg-white border border-amber-200 text-amber-900 px-2.5 py-1 rounded-lg hover:bg-amber-100 shrink-0"
            >
              🐟 좋아하는 사료/간식 문의
            </button>
          </div>

          {/* Message Stream */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-stone-50/30">
            {conversationMessages.map((msg) => {
              const isMe = msg.sender === userRole;
              const isSystem = msg.sender === 'system';

              if (isSystem) {
                return (
                  <div key={msg.id} className="flex justify-center my-3">
                    <div className="max-w-md bg-amber-50/90 border border-amber-200/80 text-amber-950 text-xs px-4 py-2.5 rounded-2xl text-center shadow-2xs leading-relaxed space-y-1">
                      <span className="font-extrabold text-[11px] text-amber-700 flex items-center justify-center gap-1">
                        <Sparkles className="w-3 h-3 text-amber-600" />
                        {msg.senderName}
                      </span>
                      <p className="whitespace-pre-line">{msg.content}</p>
                      <span className="text-[10px] text-amber-600/80 block mt-1">
                        {msg.timestamp}
                      </span>
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                >
                  <span className="text-[10px] text-stone-400 mb-1 px-1">
                    {msg.senderName} · {msg.timestamp}
                  </span>
                  <div
                    className={`max-w-md rounded-2xl p-3.5 text-xs shadow-2xs leading-relaxed ${
                      isMe
                        ? 'bg-amber-600 text-white rounded-tr-xs'
                        : 'bg-white border border-stone-200 text-stone-800 rounded-tl-xs'
                    }`}
                  >
                    {msg.attachmentUrl && (
                      <img
                        src={msg.attachmentUrl}
                        alt="첨부 사진"
                        className="w-full max-h-48 object-cover rounded-lg mb-2 border border-black/10"
                      />
                    )}
                    <p className="whitespace-pre-line">{msg.content}</p>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Attachment Input Toggle */}
          {showAttachInput && (
            <div className="p-3 bg-amber-50/70 border-t border-amber-200 text-xs flex items-center gap-2">
              <Camera className="w-4 h-4 text-amber-700 shrink-0" />
              <input
                type="text"
                value={attachmentUrl}
                onChange={(e) => setAttachmentUrl(e.target.value)}
                placeholder="전송할 사진 URL을 입력하세요 (예: 방묘창, 캣타워 인증 사진)"
                className="flex-1 px-3 py-1.5 text-xs bg-white border border-amber-300 rounded-lg"
              />
              <button
                type="button"
                onClick={() => setShowAttachInput(false)}
                className="text-stone-500 hover:text-stone-700 px-2"
              >
                닫기
              </button>
            </div>
          )}

          {/* Chat Input Footer */}
          <form
            onSubmit={handleSend}
            className="p-3 sm:p-4 border-t border-stone-200 bg-white flex items-center gap-2 shrink-0"
          >
            <button
              type="button"
              onClick={() => setShowAttachInput(!showAttachInput)}
              className="p-2.5 text-stone-500 hover:text-amber-600 hover:bg-amber-50 rounded-xl transition-colors shrink-0"
              title="사진 첨부"
            >
              <Image className="w-5 h-5" />
            </button>

            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={
                userRole === 'shelter'
                  ? '신청자님에게 전달할 심사 피드백이나 상담 안내를 입력하세요...'
                  : '보호소 담당자에게 문의할 내용이나 안전망 사진 설명을 입력하세요...'
              }
              className="flex-1 px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all"
            />

            <button
              type="submit"
              disabled={!inputText.trim() && !attachmentUrl.trim()}
              className="p-2.5 bg-amber-600 hover:bg-amber-700 disabled:bg-stone-200 disabled:text-stone-400 text-white rounded-xl font-bold transition-all shadow-xs"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center p-8 text-center text-stone-400 text-xs">
          상담할 대화방을 선택해 주세요.
        </div>
      )}
    </div>
  );
};
