import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './Pages/Home';
import MemoryPage from './components/MemoryPage';
import { UnlockProvider } from './context/UnlockContext';

// Import JSON files
import questionsData from '../public/security/questions.json';
import imagesData from '../public/security/images.json';

interface Question {
  question: string;
  answers: string[];
}

interface SectionData {
  id: string;
  title: string;
  question: Question;
}

interface QuestionsJSON {
  entryQuestion: Question;
  sections: SectionData[];
}

interface ImagesJSON {
  [key: string]: string[];
}

function App() {
  const questions = questionsData as QuestionsJSON;
  const images = imagesData as ImagesJSON;

  // Helper function to find section by ID
  const getSection = (id: string) => {
    return questions.sections.find(section => section.id === id);
  };

  return (
    <UnlockProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          
          {/* Dynamic Routes */}
          <Route 
            path="/3rdsem" 
            element={
              <MemoryPage 
                sectionId="3rd"
                title={getSection('3rd')?.title || '3rd Semester'}
                question={getSection('3rd')?.question || { question: '', answers: [] }}
                images={images['3rd'] || []}
              />
            } 
          />
          
          <Route 
            path="/4thsem" 
            element={
              <MemoryPage 
                sectionId="4th"
                title={getSection('4th')?.title || '4th Semester'}
                question={getSection('4th')?.question || { question: '', answers: [] }}
                images={images['4th'] || []}
              />
            } 
          />
          
          <Route 
            path="/astami" 
            element={
              <MemoryPage 
                sectionId="astami"
                title={getSection('astami')?.title || 'Astami 2025'}
                question={getSection('astami')?.question || { question: '', answers: [] }}
                images={images['astami'] || []}
              />
            } 
          />
          
          <Route 
            path="/summer" 
            element={
              <MemoryPage 
                sectionId="summer"
                title={getSection('summer')?.title || 'Summer Memories 2025'}
                question={getSection('summer')?.question || { question: '', answers: [] }}
                images={images['summer'] || []}
              />
            } 
          />
          
          <Route 
            path="/5thsem" 
            element={
              <MemoryPage 
                sectionId="5th"
                title={getSection('5th')?.title || '5th Semester'}
                question={getSection('5th')?.question || { question: '', answers: [] }}
                images={images['5th'] || []}
              />
            } 
          />
        </Routes>
      </Router>
    </UnlockProvider>
  );
}

export default App;
