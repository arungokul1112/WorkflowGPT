import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { io, Socket } from 'socket.io-client';
import { Send, Bot, User, Sparkles, Activity, Bell, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const USER_ID = 'test-user-1'; // Static for demo purposes

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  actions?: any[];
  timestamp: Date;
}

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const newSocket = io(API_URL);
    setSocket(newSocket);

    newSocket.emit('join', USER_ID);

    newSocket.on('notification', (data) => {
      console.log('Notification received:', data);
      // You could add a toast here
    });

    return () => {
      newSocket.close();
    };
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages, isThinking]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isThinking) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsThinking(true);

    try {
      const response = await axios.post(`${API_URL}/chat`, {
        userId: USER_ID,
        message: input,
      });

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.data.reply,
        actions: response.data.actions,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div className="app-container">
      {/* Sidebar - Tool Monitor */}
      <aside className="sidebar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '2.5rem' }}>
          <div style={{ background: 'var(--accent-gradient)', padding: '0.5rem', borderRadius: '0.8rem' }}>
            <Sparkles size={20} color="white" />
          </div>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 600 }}>WorkflowGPT</h2>
        </div>

        <div style={{ flex: 1 }}>
          <h3 style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}>
            Recent Activities
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {messages.flatMap(m => m.actions || []).slice(-5).map((action, i) => (
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                key={i}
                className="tool-badge"
                style={{ width: '100%', justifyContent: 'space-between' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Activity size={14} />
                  <span>{action.tool}</span>
                </div>
                <ChevronRight size={14} />
              </motion.div>
            ))}
          </div>
        </div>

        <div style={{ paddingTop: '2rem', borderTop: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', color: 'var(--text-muted)' }}>
            <Bell size={18} />
            <span style={{ fontSize: '0.9rem' }}>Agent System: Active</span>
          </div>
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="main-content">
        <header className="chat-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ position: 'relative' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--bg-card)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border)' }}>
                <Bot size={24} color="var(--primary)" />
              </div>
              <div style={{ position: 'absolute', bottom: 0, right: 0, width: '12px', height: '12px', borderRadius: '50%', background: '#22c55e', border: '2px solid var(--bg-dark)' }}></div>
            </div>
            <div>
              <h4 style={{ fontSize: '1rem', fontWeight: 600 }}>Automation Agent</h4>
              <p style={{ fontSize: '0.75rem', color: '#22c55e' }}>Online & Ready</p>
            </div>
          </div>
        </header>

        <section className="messages-container">
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={`message ${msg.role}`}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', opacity: 0.6, fontSize: '0.8rem' }}>
                  {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                  <span>{msg.role === 'user' ? 'You' : 'Agent'}</span>
                </div>
                <div>{msg.content}</div>
                {msg.actions && msg.actions.length > 0 && (
                  <div style={{ marginTop: '0.8rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {msg.actions.map((action, idx) => (
                      <span key={idx} className="tool-badge">
                        <Activity size={12} />
                        Executed: {action.tool}
                      </span>
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
            {isThinking && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="message assistant"
              >
                <div className="thinking-dots">
                  <div className="dot"></div>
                  <div className="dot"></div>
                  <div className="dot"></div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </section>

        <footer className="input-area">
          <form onSubmit={handleSend} className="input-wrapper">
            <input
              type="text"
              placeholder="Type a command (e.g. 'Check finance updates' or 'Notify team')..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isThinking}
            />
            <button type="submit" className="send-btn" disabled={!input.trim() || isThinking}>
              <Send size={20} />
            </button>
          </form>
        </footer>
      </main>
    </div>
  );
};

export default App;
