'use client';
import { useState } from 'react';
import { MessageCircle, X, Send, Bot } from 'lucide-react';

const respostas: Record<string, string> = {
  'saldo': 'Seu saldo está disponível no Dashboard. Vá em Finanças para ver detalhes!',
  'investir': 'Você pode investir em Criptomoedas e Ações na seção Investimentos. O valor mínimo é 0.1 unidade.',
  'pix': 'Para fazer um PIX, use a seção Transferências. Você precisa do CPF do destinatário.',
  'extrato': 'Seu extrato completo está na seção Extrato. Lá você pode filtrar e exportar em PDF!',
  'meta': 'Defina suas metas financeiras na seção Metas. Acompanhe seu progresso!',
  'ajuda': 'Posso ajudar com: saldo, investir, pix, extrato, meta, vencimento',
  'vencimento': 'Contas a vencer aparecem como alerta no seu Dashboard. Fique de olho!',
  'ola': 'Olá! Como posso ajudar? Pergunte sobre saldo, investimentos, PIX, extrato ou metas!',
  'oi': 'Oi! Tudo bem? Pergunte sobre saldo, investimentos, PIX, extrato ou metas!',
};

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ text: string; isBot: boolean }[]>([
    { text: 'Olá! Sou o assistente do MiniBank. Pergunte sobre saldo, investimentos, PIX, extrato ou metas! 💬', isBot: true }
  ]);
  const [input, setInput] = useState('');

  function handleSend() {
    if (!input.trim()) return;
    const userMsg = input.toLowerCase().trim();
    setMessages([...messages, { text: input, isBot: false }]);

    let resposta = 'Desculpe, não entendi. Tente: saldo, investir, pix, extrato, meta, ajuda';
    for (const [chave, valor] of Object.entries(respostas)) {
      if (userMsg.includes(chave)) { resposta = valor; break; }
    }

    setTimeout(() => {
      setMessages(prev => [...prev, { text: resposta, isBot: true }]);
    }, 500);
    setInput('');
  }

  return (
    <>
      {!isOpen && (
        <button onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-accent-blue to-accent-purple rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all z-50 animate-float">
          <MessageCircle size={24} className="text-white" />
        </button>
      )}

      {isOpen && (
        <div className="fixed bottom-6 right-6 w-80 h-96 glass-strong rounded-2xl border border-border-medium flex flex-col z-50 animate-scale-in shadow-2xl">
          <div className="flex items-center justify-between p-3 border-b border-border-subtle">
            <div className="flex items-center gap-2"><Bot size={20} className="text-accent-blue" /><span className="text-white font-medium">Assistente MiniBank</span></div>
            <button onClick={() => setIsOpen(false)} className="text-text-muted hover:text-white"><X size={18} /></button>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}>
                <div className={`max-w-[80%] px-4 py-2 rounded-xl text-sm ${msg.isBot ? 'bg-bg-tertiary text-white' : 'bg-gradient-to-r from-accent-blue to-accent-purple text-white'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>
          <div className="p-3 border-t border-border-subtle flex gap-2">
            <input value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder="Digite sua pergunta..." className="flex-1 px-3 py-2 bg-bg-secondary border border-border-medium rounded-xl text-white text-sm" />
            <button onClick={handleSend} className="w-9 h-9 bg-accent-blue rounded-lg flex items-center justify-center"><Send size={14} className="text-white" /></button>
          </div>
        </div>
      )}
    </>
  );
}
