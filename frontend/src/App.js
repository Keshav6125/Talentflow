import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './contexts/AppContext';
import Layout from './components/Layout';
import JobsBoard from './components/Jobs/JobsBoard';
import CandidatesBoard from './components/Candidates/CandidatesBoard';
import AssessmentsBoard from './components/Assessments/AssessmentsBoard';
import CandidateProfile from './components/Candidates/CandidateProfile';
import JobDetails from './components/Jobs/JobDetails';
import { Toaster } from './components/ui/toaster';
import './App.css';

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <div className="App">
          <Layout>
            <Routes>
              <Route path="/" element={<Navigate to="/jobs" replace />} />
              <Route path="/jobs" element={<JobsBoard />} />
              <Route path="/jobs/:jobId" element={<JobDetails />} />
              <Route path="/candidates" element={<CandidatesBoard />} />
              <Route path="/candidates/:candidateId" element={<CandidateProfile />} />
              <Route path="/assessments" element={<AssessmentsBoard />} />
            </Routes>
          </Layout>
          <Toaster />
        </div>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;