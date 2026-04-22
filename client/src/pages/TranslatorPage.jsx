import { useState, useEffect, useRef } from 'react';
import './TranslatorPage.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function TranslatorPage() {
  const [sourceLang, setSourceLang] = useState('en'); // 'en' or 'hi'
  const [isListening, setIsListening] = useState(false);
  const [originalText, setOriginalText] = useState('');
  const [translations, setTranslations] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const recognitionRef = useRef(null);

  useEffect(() => {
    // Initialize Web Speech API
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;

      recognitionRef.current.onstart = () => {
        setIsListening(true);
        setError('');
      };

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setOriginalText(prev => (prev ? prev + ' ' + transcript : transcript));
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        if (event.error !== 'no-speech') {
          setError(`Microphone error: ${event.error}`);
        }
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    } else {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setError('Speech Recognition is not supported in this browser. Try Chrome or Edge.');
    }
  }, [sourceLang]);

  // Update language when it changes
  useEffect(() => {
    if (recognitionRef.current) {
      // Fallback to hi-IN for Konkani speech recognition, or en-IN for English
      recognitionRef.current.lang = sourceLang === 'en' ? 'en-IN' : sourceLang === 'hi' ? 'hi-IN' : 'hi-IN';
    }
    // Clear previous results when switching languages
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOriginalText('');
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTranslations(null);
  }, [sourceLang]);

  const toggleListening = () => {
    if (!recognitionRef.current) return;
    
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
  };

  const handleTranslate = async (text, lang) => {
    if (!text) return;
    
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/translate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, sourceLang: lang }),
      });
      const data = await res.json();
      
      if (data.success) {
        setTranslations(data.translations);
      } else {
        setError(data.message || 'Translation failed');
      }
    } catch (err) {
      console.error('Translation error:', err);
      setError('Could not connect to translation server.');
    } finally {
      setLoading(false);
    }
  };

  const speakText = (text, langCode) => {
    if (!window.speechSynthesis) {
      alert('Speech synthesis not supported in this browser.');
      return;
    }
    
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    // Use hi-IN for Konkani fallback as well
    utterance.lang = langCode === 'kok' ? 'hi-IN' : langCode;
    utterance.rate = 0.9; // Slightly slower for clarity
    
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="page-content translator-page">
      <div className="translator-header">
        <div className="container">
          <h1 className="translator-title">GoaGenie Voice Translator 🗣️</h1>
          <p className="translator-subtitle">Speak in English or Hindi, and translate instantly to connect with locals.</p>
        </div>
      </div>

      <div className="container translator-body">
        <div className="translator-card glass-card">
          
          <div className="lang-toggle">
            <span className="toggle-label">I will speak in:</span>
            <div className="toggle-buttons">
              <button 
                className={`lang-btn ${sourceLang === 'en' ? 'active' : ''}`}
                onClick={() => setSourceLang('en')}
              >
                English
              </button>
              <button 
                className={`lang-btn ${sourceLang === 'hi' ? 'active' : ''}`}
                onClick={() => setSourceLang('hi')}
              >
                Hindi
              </button>
              <button 
                className={`lang-btn ${sourceLang === 'kok' ? 'active' : ''}`}
                onClick={() => setSourceLang('kok')}
              >
                Konkani
              </button>
            </div>
          </div>

          {error && <div className="translator-error">{error}</div>}

          <div className="input-container">
            <textarea
              className="translator-input"
              value={originalText}
              onChange={(e) => setOriginalText(e.target.value)}
              placeholder={`Type in ${sourceLang === 'en' ? 'English' : sourceLang === 'hi' ? 'Hindi' : 'Konkani'} or tap mic to speak...`}
              rows="4"
            />
            <div className="input-actions">
              <div className="mic-wrapper">
                <button 
                  className={`icon-btn mic-btn ${isListening ? 'listening' : ''}`}
                  onClick={toggleListening}
                  title={isListening ? 'Stop Listening' : 'Start Listening'}
                  disabled={!!error && !error.includes('no-speech')}
                >
                  {isListening ? '🛑' : '🎤'}
                </button>
                {isListening && <div className="listening-waves"><span></span><span></span><span></span></div>}
              </div>
              <button 
                className="action-btn translate-btn"
                onClick={() => handleTranslate(originalText, sourceLang)}
                disabled={!originalText.trim() || loading}
              >
                {loading ? 'Translating...' : 'Translate'}
              </button>
            </div>
          </div>

          {(loading || translations) && (
            <div className="translation-result animate-fade-up">
              {loading && <div className="translating-indicator">Translating... 🔄</div>}

              {translations && (
                <div className="translated-cards">
                  {/* Show English translation if source was not English */}
                  {sourceLang !== 'en' && translations.english && (
                    <div className="result-card translated">
                      <span className="result-label">English:</span>
                      <p className="result-text">{translations.english}</p>
                      <button 
                        className="speak-btn"
                        onClick={() => speakText(translations.english, 'en-IN')}
                        title="Listen"
                      >
                        🔊
                      </button>
                    </div>
                  )}

                  {/* Show Hindi translation if source was not Hindi */}
                  {sourceLang !== 'hi' && translations.hindi && (
                    <div className="result-card translated">
                      <span className="result-label">Hindi:</span>
                      <p className="result-text">{translations.hindi}</p>
                      <button 
                        className="speak-btn"
                        onClick={() => speakText(translations.hindi, 'hi-IN')}
                        title="Listen"
                      >
                        🔊
                      </button>
                    </div>
                  )}

                  {/* Show Konkani translation if source was not Konkani */}
                  {sourceLang !== 'kok' && translations.konkani && (
                    <div className="result-card translated konkani-card">
                      <span className="result-label">Konkani (Local Language):</span>
                      <p className="result-text">{translations.konkani}</p>
                      <button 
                        className="speak-btn"
                        onClick={() => speakText(translations.konkani, 'kok')}
                        title="Listen (Fallback Voice)"
                      >
                        🔊
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
          
        </div>
        
        <aside className="translator-sidebar">
           <div className="glass-card tips-card">
              <h3>💡 Translation Tips</h3>
              <ul>
                <li>Speak clearly and naturally.</li>
                <li>Keep phrases relatively short for best accuracy.</li>
                <li>Konkani audio uses a fallback voice, so pronunciation might not be 100% native, but locals will understand!</li>
              </ul>
           </div>
        </aside>
      </div>
    </div>
  );
}
