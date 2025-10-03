import React from 'react';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Eye, MessageSquare, ArrowRight } from 'lucide-react';

const CandidateKanban = ({ candidates = [], onUpdateStage, onViewCandidate }) => {
  const CANDIDATE_STAGES = {
    applied: 'applied',
    screen: 'screen',
    tech: 'tech',
    offer: 'offer',
    hired: 'hired',
    rejected: 'rejected'
  };

  const stageConfig = {
    applied: { 
      title: 'Applied', 
      color: 'bg-blue-50 border-blue-200',
      badgeClass: 'bg-blue-100 text-blue-800'
    },
    screen: { 
      title: 'Screening', 
      color: 'bg-yellow-50 border-yellow-200',
      badgeClass: 'bg-yellow-100 text-yellow-800'
    },
    tech: { 
      title: 'Technical', 
      color: 'bg-purple-50 border-purple-200',
      badgeClass: 'bg-purple-100 text-purple-800'
    },
    offer: { 
      title: 'Offer', 
      color: 'bg-green-50 border-green-200',
      badgeClass: 'bg-green-100 text-green-800'
    },
    hired: { 
      title: 'Hired', 
      color: 'bg-green-100 border-green-300',
      badgeClass: 'bg-green-200 text-green-900'
    },
    rejected: { 
      title: 'Rejected', 
      color: 'bg-red-50 border-red-200',
      badgeClass: 'bg-red-100 text-red-800'
    }
  };

  const groupedCandidates = Object.values(CANDIDATE_STAGES).reduce((acc, stage) => {
    acc[stage] = candidates.filter(candidate => candidate.stage === stage);
    return acc;
  }, {});

  const getNextStage = (currentStage) => {
    const stages = Object.values(CANDIDATE_STAGES);
    const currentIndex = stages.indexOf(currentStage);
    if (currentIndex < stages.length - 2 && currentStage !== 'rejected') {
      return stages[currentIndex + 1];
    }
    return null;
  };

  const CandidateCard = ({ candidate }) => {
    const nextStage = getNextStage(candidate.stage);
    
    return (
      <Card className="mb-3 hover:shadow-md transition-shadow cursor-pointer">
        <CardContent className="p-4">
          <div className="space-y-3">
            <div>
              <h4 className="font-medium text-sm">{candidate.name}</h4>
              <p className="text-xs text-gray-600">{candidate.email}</p>
            </div>
            
            <div className="text-xs text-gray-500">
              Applied: {new Date(candidate.appliedAt).toLocaleDateString()}
            </div>
            
            <div className="flex flex-wrap gap-1">
              <Button 
                size="sm" 
                variant="outline"
                className="text-xs h-7"
                onClick={() => onViewCandidate(candidate)}
              >
                <Eye className="h-3 w-3 mr-1" />
                View
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                className="text-xs h-7"
              >
                <MessageSquare className="h-3 w-3 mr-1" />
                Notes
              </Button>
              
              {nextStage && (
                <Button 
                  size="sm" 
                  variant="default"
                  className="text-xs h-7"
                  onClick={() => onUpdateStage(candidate.id, nextStage)}
                >
                  <ArrowRight className="h-3 w-3 mr-1" />
                  {stageConfig[nextStage].title}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {Object.entries(stageConfig).map(([stage, config]) => {
        const stageCandidates = groupedCandidates[stage] || [];
        
        return (
          <Card key={stage} className={`${config.color} min-h-96`}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex justify-between items-center">
                <span>{config.title}</span>
                <Badge variant="secondary" className="text-xs">
                  {stageCandidates.length}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2">
                {stageCandidates.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 text-sm">
                    No candidates
                  </div>
                ) : (
                  stageCandidates.map((candidate) => (
                    <CandidateCard key={candidate.id} candidate={candidate} />
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default CandidateKanban;