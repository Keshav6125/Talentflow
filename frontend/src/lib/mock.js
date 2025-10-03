// Mock data and API functions for TalentFlow

// Job stages/statuses
export const JOB_STATUSES = {
  ACTIVE: 'active',
  ARCHIVED: 'archived'
};

// Candidate stages
export const CANDIDATE_STAGES = {
  APPLIED: 'applied',
  SCREEN: 'screen', 
  TECH: 'tech',
  OFFER: 'offer',
  HIRED: 'hired',
  REJECTED: 'rejected'
};

// Question types for assessments
export const QUESTION_TYPES = {
  SINGLE_CHOICE: 'single_choice',
  MULTI_CHOICE: 'multi_choice',
  SHORT_TEXT: 'short_text',
  LONG_TEXT: 'long_text',
  NUMERIC: 'numeric',
  FILE_UPLOAD: 'file_upload'
};

// Mock Jobs Data
export const mockJobs = [
  {
    id: '1',
    title: 'Senior Frontend Developer',
    slug: 'senior-frontend-developer',
    status: JOB_STATUSES.ACTIVE,
    tags: ['React', 'TypeScript', 'Remote'],
    order: 1,
    description: 'We are looking for a senior frontend developer to join our team.',
    requirements: ['5+ years React experience', 'TypeScript proficiency', 'Team leadership'],
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: '2',
    title: 'Backend Engineer',
    slug: 'backend-engineer',
    status: JOB_STATUSES.ACTIVE,
    tags: ['Node.js', 'Python', 'AWS'],
    order: 2,
    description: 'Backend engineer for scalable applications.',
    requirements: ['3+ years backend experience', 'Cloud platforms', 'API design'],
    createdAt: '2025-01-02T00:00:00Z'
  },
  {
    id: '3',
    title: 'Product Manager',
    slug: 'product-manager',
    status: JOB_STATUSES.ACTIVE,
    tags: ['Strategy', 'Analytics', 'Leadership'],
    order: 3,
    description: 'Lead product strategy and roadmap execution.',
    requirements: ['Product management experience', 'Data analysis', 'Cross-functional leadership'],
    createdAt: '2025-01-03T00:00:00Z'
  },
  {
    id: '4',
    title: 'DevOps Engineer',
    slug: 'devops-engineer',
    status: JOB_STATUSES.ARCHIVED,
    tags: ['Docker', 'Kubernetes', 'CI/CD'],
    order: 4,
    description: 'Infrastructure and deployment automation.',
    requirements: ['Container orchestration', 'CI/CD pipelines', 'Monitoring'],
    createdAt: '2025-01-04T00:00:00Z'
  },
  {
    id: '5',
    title: 'UX Designer',
    slug: 'ux-designer',
    status: JOB_STATUSES.ACTIVE,
    tags: ['Figma', 'User Research', 'Prototyping'],
    order: 5,
    description: 'Create exceptional user experiences.',
    requirements: ['Design portfolio', 'User research', 'Prototyping tools'],
    createdAt: '2025-01-05T00:00:00Z'
  }
];

// Generate mock candidates
const generateMockCandidates = (count = 1000) => {
  const firstNames = ['John', 'Jane', 'Michael', 'Sarah', 'David', 'Lisa', 'Robert', 'Emily', 'James', 'Emma'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];
  const stages = Object.values(CANDIDATE_STAGES);
  const jobIds = mockJobs.map(job => job.id);
  
  const candidates = [];
  
  for (let i = 1; i <= count; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const stage = stages[Math.floor(Math.random() * stages.length)];
    const jobId = jobIds[Math.floor(Math.random() * jobIds.length)];
    
    candidates.push({
      id: i.toString(),
      name: `${firstName} ${lastName}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
      stage,
      jobId,
      appliedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      notes: []
    });
  }
  
  return candidates;
};

export const mockCandidates = generateMockCandidates();

// Mock Assessments
export const mockAssessments = {
  '1': {
    jobId: '1',
    title: 'Frontend Developer Assessment',
    sections: [
      {
        id: 'section1',
        title: 'Technical Skills',
        questions: [
          {
            id: 'q1',
            type: QUESTION_TYPES.SINGLE_CHOICE,
            question: 'What is your primary frontend framework?',
            options: ['React', 'Vue', 'Angular', 'Svelte'],
            required: true
          },
          {
            id: 'q2',
            type: QUESTION_TYPES.MULTI_CHOICE,
            question: 'Which of these have you worked with?',
            options: ['TypeScript', 'GraphQL', 'Redux', 'Next.js'],
            required: true
          }
        ]
      }
    ]
  }
};

// Local storage keys
export const STORAGE_KEYS = {
  JOBS: 'talentflow_jobs',
  CANDIDATES: 'talentflow_candidates',
  ASSESSMENTS: 'talentflow_assessments',
  RESPONSES: 'talentflow_responses'
};

// Mock API delay
const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

// Mock API functions
export const mockApi = {
  // Jobs API
  async getJobs(params = {}) {
    await delay();
    const { search = '', status = '', page = 1, pageSize = 10, sort = 'order' } = params;
    
    let filtered = mockJobs.filter(job => {
      if (search && !job.title.toLowerCase().includes(search.toLowerCase())) return false;
      if (status && job.status !== status) return false;
      return true;
    });
    
    // Sort
    if (sort === 'order') {
      filtered.sort((a, b) => a.order - b.order);
    } else if (sort === 'title') {
      filtered.sort((a, b) => a.title.localeCompare(b.title));
    }
    
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    
    return {
      jobs: filtered.slice(start, end),
      total: filtered.length,
      page,
      pageSize,
      totalPages: Math.ceil(filtered.length / pageSize)
    };
  },

  async createJob(jobData) {
    await delay();
    const newJob = {
      id: Date.now().toString(),
      ...jobData,
      order: mockJobs.length + 1,
      createdAt: new Date().toISOString()
    };
    mockJobs.push(newJob);
    return newJob;
  },

  async updateJob(id, updates) {
    await delay();
    const jobIndex = mockJobs.findIndex(job => job.id === id);
    if (jobIndex !== -1) {
      mockJobs[jobIndex] = { ...mockJobs[jobIndex], ...updates };
      return mockJobs[jobIndex];
    }
    throw new Error('Job not found');
  },

  async reorderJobs(fromOrder, toOrder) {
    await delay();
    // Simulate occasional failure for testing rollback
    if (Math.random() < 0.1) {
      throw new Error('Reorder failed');
    }
    
    // Reorder logic would go here
    return { success: true };
  },

  // Candidates API
  async getCandidates(params = {}) {
    await delay();
    const { search = '', stage = '', page = 1, pageSize = 50 } = params;
    
    let filtered = mockCandidates.filter(candidate => {
      if (search && !candidate.name.toLowerCase().includes(search.toLowerCase()) && 
          !candidate.email.toLowerCase().includes(search.toLowerCase())) return false;
      if (stage && candidate.stage !== stage) return false;
      return true;
    });
    
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    
    return {
      candidates: filtered.slice(start, end),
      total: filtered.length,
      page,
      pageSize,
      hasMore: end < filtered.length
    };
  },

  async updateCandidate(id, updates) {
    await delay();
    const candidateIndex = mockCandidates.findIndex(candidate => candidate.id === id);
    if (candidateIndex !== -1) {
      mockCandidates[candidateIndex] = { ...mockCandidates[candidateIndex], ...updates };
      return mockCandidates[candidateIndex];
    }
    throw new Error('Candidate not found');
  },

  // Assessments API
  async getAssessment(jobId) {
    await delay();
    return mockAssessments[jobId] || null;
  },

  async saveAssessment(jobId, assessmentData) {
    await delay();
    mockAssessments[jobId] = assessmentData;
    return assessmentData;
  }
};