import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Initial state
const initialState = {
  jobs: [],
  candidates: [],
  assessments: {},
  loading: false,
  error: null,
  selectedJob: null,
  selectedCandidate: null
};

// Action types
export const ActionTypes = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_JOBS: 'SET_JOBS',
  SET_CANDIDATES: 'SET_CANDIDATES',
  SET_ASSESSMENT: 'SET_ASSESSMENT',
  SELECT_JOB: 'SELECT_JOB',
  SELECT_CANDIDATE: 'SELECT_CANDIDATE',
  UPDATE_JOB: 'UPDATE_JOB',
  UPDATE_CANDIDATE: 'UPDATE_CANDIDATE',
  ADD_JOB: 'ADD_JOB',
  REMOVE_JOB: 'REMOVE_JOB'
};

// Reducer
const appReducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.SET_LOADING:
      return { ...state, loading: action.payload };
    
    case ActionTypes.SET_ERROR:
      return { ...state, error: action.payload, loading: false };
    
    case ActionTypes.SET_JOBS:
      return { ...state, jobs: action.payload };
    
    case ActionTypes.SET_CANDIDATES:
      return { ...state, candidates: action.payload };
    
    case ActionTypes.SET_ASSESSMENT:
      return { 
        ...state, 
        assessments: { 
          ...state.assessments, 
          [action.payload.jobId]: action.payload.assessment 
        } 
      };
    
    case ActionTypes.SELECT_JOB:
      return { ...state, selectedJob: action.payload };
    
    case ActionTypes.SELECT_CANDIDATE:
      return { ...state, selectedCandidate: action.payload };
    
    case ActionTypes.UPDATE_JOB:
      return {
        ...state,
        jobs: state.jobs.map(job => 
          job.id === action.payload.id ? action.payload : job
        )
      };
    
    case ActionTypes.UPDATE_CANDIDATE:
      return {
        ...state,
        candidates: state.candidates.map(candidate => 
          candidate.id === action.payload.id ? action.payload : candidate
        )
      };
    
    case ActionTypes.ADD_JOB:
      return { ...state, jobs: [...state.jobs, action.payload] };
    
    case ActionTypes.REMOVE_JOB:
      return { 
        ...state, 
        jobs: state.jobs.filter(job => job.id !== action.payload) 
      };
    
    default:
      return state;
  }
};

// Context
const AppContext = createContext();

// Provider component
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  
  // Load initial data from localStorage
  useEffect(() => {
    const savedJobs = localStorage.getItem('talentflow_jobs');
    const savedCandidates = localStorage.getItem('talentflow_candidates');
    
    if (savedJobs) {
      dispatch({ type: ActionTypes.SET_JOBS, payload: JSON.parse(savedJobs) });
    }
    
    if (savedCandidates) {
      dispatch({ type: ActionTypes.SET_CANDIDATES, payload: JSON.parse(savedCandidates) });
    }
  }, []);
  
  // Save to localStorage when data changes
  useEffect(() => {
    if (state.jobs.length > 0) {
      localStorage.setItem('talentflow_jobs', JSON.stringify(state.jobs));
    }
  }, [state.jobs]);
  
  useEffect(() => {
    if (state.candidates.length > 0) {
      localStorage.setItem('talentflow_candidates', JSON.stringify(state.candidates));
    }
  }, [state.candidates]);
  
  const value = {
    state,
    dispatch,
    // Helper functions
    setLoading: (loading) => dispatch({ type: ActionTypes.SET_LOADING, payload: loading }),
    setError: (error) => dispatch({ type: ActionTypes.SET_ERROR, payload: error }),
    selectJob: (job) => dispatch({ type: ActionTypes.SELECT_JOB, payload: job }),
    selectCandidate: (candidate) => dispatch({ type: ActionTypes.SELECT_CANDIDATE, payload: candidate })
  };
  
  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

// Hook to use the context
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};