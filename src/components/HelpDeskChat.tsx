import { MessageCircle, X, Send, Bot } from 'lucide-react';
import { useState } from 'react';
import { Language } from '../lib/translations';

interface HelpDeskChatProps {
  lang: Language;
}

export default function HelpDeskChat({ lang }: HelpDeskChatProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'bot'; content: string }>>([
    {
      role: 'bot',
      content:
        lang === 'es'
          ? '¡Hola! Soy el asistente virtual de Studio Nexora. ¿En qué puedo ayudarte hoy?'
          : 'Hi! I\'m Studio Nexora\'s virtual assistant. How can I help you today?'
    }
  ]);

  const handleSend = () => {
    if (!message.trim()) return;

    setMessages((prev) => [...prev, { role: 'user', content: message }]);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: 'bot',
          content:
            lang === 'es'
              ? 'Gracias por tu mensaje. Un agente te responderá pronto. Mientras tanto, puedes revisar nuestras preguntas frecuentes.'
              : 'Thanks for your message. An agent will respond soon. In the meantime, you can check our FAQs.'
        }
      ]);
    }, 1000);

    setMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white rounded-full shadow-2xl flex flex-col items-center justify-center transition-all duration-300 hover:scale-110 z-50 group p-4 gap-1"
        >
          <MessageCircle className="w-7 h-7 group-hover:scale-110 transition-transform" />
          <span className="text-[9px] font-semibold whitespace-nowrap">AI Help Desk 24/7</span>
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
        </button>
      )}

      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-white rounded-3xl shadow-2xl flex flex-col z-50 overflow-hidden border-2 border-slate-200">
          <div className="bg-gradient-to-r from-cyan-600 to-blue-600 p-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <div className="font-bold">Studio Nexora</div>
                  <div className="text-xs text-cyan-100">
                    {lang === 'es' ? 'Soporte 24/7' : '24/7 Support'}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl p-4 ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white'
                      : 'bg-white border-2 border-slate-200 text-slate-800'
                  }`}
                >
                  {msg.role === 'bot' && (
                    <div className="flex items-center gap-2 mb-2">
                      <Bot className="w-4 h-4 text-blue-600" />
                      <span className="text-xs font-semibold text-slate-600">
                        {lang === 'es' ? 'Asistente IA' : 'AI Assistant'}
                      </span>
                    </div>
                  )}
                  <p className="text-sm leading-relaxed">{msg.content}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 bg-white border-t-2 border-slate-200">
            <div className="flex gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={lang === 'es' ? 'Escribe tu mensaje...' : 'Type your message...'}
                className="flex-1 px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors text-sm"
              />
              <button
                onClick={handleSend}
                className="px-4 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white rounded-xl transition-colors flex items-center justify-center"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
