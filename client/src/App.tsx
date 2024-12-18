import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { ThemeProvider } from "./components/ui/theme-provider"
import { Toaster } from "./components/ui/toaster"
import { AuthProvider } from "./contexts/AuthContext"
import { Login } from "./pages/Login"
import { Register } from "./pages/Register"
import { Home } from "./pages/Home"
import { Research } from "./pages/Research"
import { Layout } from "./components/Layout"
import { ProtectedRoute } from "./components/ProtectedRoute"
import './i18n/i18n';
import { useEffect, useState } from "react"
import { useTranslation } from 'react-i18next';

function App() {
  const { t, i18n } = useTranslation();
  const [, updateState] = useState({});

  useEffect(() => {
    const handleLanguageChange = () => {
      console.log('Language changed to:', i18n.language);
      updateState({}); // Force re-render
    };

    i18n.on('languageChanged', handleLanguageChange);

    // Initial language setup
    const loadInitialTranslations = async () => {
      try {
        await i18n.loadNamespaces('translation');
        console.log('Initial translations loaded successfully');
        console.log('Initial language:', i18n.language);
        console.log('Initial translations:', i18n.getResourceBundle(i18n.language, 'translation'));
      } catch (error) {
        console.error('Error loading initial translations:', error);
      }
    };

    loadInitialTranslations();

    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, [i18n]);

  useEffect(() => {
    // Monitor language changes and translation updates
    const translations = i18n.getResourceBundle(i18n.language, 'translation');
    console.log('Language changed - current language:', i18n.language);
    console.log('Current translations:', translations);

    if (!translations || Object.keys(translations).length === 0) {
      console.warn('No translations available for language:', i18n.language);
    }
    
    // Test translation function
    if (t) {
      try {
        const sampleTranslation = t('home');
        console.log('Sample translation test - "home":', sampleTranslation);
      } catch (error) {
        console.error('Error accessing translation:', error);
      }
    }
  }, [i18n.language, t]);

  return (
    <AuthProvider>
      <ThemeProvider defaultTheme="light" storageKey="ui-theme">
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
              <Route index element={<Home />} />
              <Route path="research" element={<Research />} />
            </Route>
          </Routes>
          <Toaster />
        </Router>
      </ThemeProvider>
    </AuthProvider>
  )
}

export default App