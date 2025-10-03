import React, { useState, useEffect, useCallback } from 'react';
import { Search, Filter, UserPlus, Eye, MessageSquare } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useToast } from '../../hooks/use-toast';
import { mockApi } from '../../lib/mock';

const CANDIDATE_STAGES = {
  APPLIED: 'applied',
  SCREEN: 'screen',
  TECH: 'tech',
  OFFER: 'offer',
  HIRED: 'hired',
  REJECTED: 'rejected'
};
// Removed problematic imports for now

const CandidateCard = ({ candidate, style, onView, onUpdateStage }) => {
  const stageColors = {
    applied: 'bg-blue-100 text-blue-800',
    screen: 'bg-yellow-100 text-yellow-800',
    tech: 'bg-purple-100 text-purple-800',
    offer: 'bg-green-100 text-green-800',
    hired: 'bg-green-200 text-green-900',
    rejected: 'bg-red-100 text-red-800'
  };

  return (
    <div style={style} className="px-2 py-1">
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="font-medium text-gray-900">{candidate.name}</h3>
              <p className="text-sm text-gray-600">{candidate.email}</p>
            </div>
            <Badge className={stageColors[candidate.stage] || 'bg-gray-100 text-gray-800'}>
              {candidate.stage}
            </Badge>
          </div>
          
          <div className="flex justify-between items-center text-xs text-gray-500 mb-3">
            <span>Applied: {new Date(candidate.appliedAt).toLocaleDateString()}</span>
            <span>Job ID: {candidate.jobId}</span>
          </div>
          
          <div className="flex space-x-2">
            <Button size="sm" variant="outline" onClick={() => onView(candidate)}>
              <Eye className="h-3 w-3 mr-1" />
              View
            </Button>
            <Button size="sm" variant="outline">
              <MessageSquare className="h-3 w-3 mr-1" />
              Notes
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const CandidatesBoard = () => {
  const [candidates, setCandidates] = useState([]);
  const [filteredCandidates, setFilteredCandidates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [stageFilter, setStageFilter] = useState('');
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'kanban'
  const { toast } = useToast();

  const loadCandidates = useCallback(async () => {
    setLoading(true);
    try {
      const response = await mockApi.getCandidates({
        search: searchTerm,
        stage: stageFilter,
        page: 1,
        pageSize: 1000 // Load all candidates for virtualization
      });
      
      setCandidates(response.candidates);
      setFilteredCandidates(response.candidates);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load candidates',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  }, [searchTerm, stageFilter, toast]);

  useEffect(() => {
    loadCandidates();
  }, [loadCandidates]);

  // Client-side filtering for real-time search
  useEffect(() => {
    let filtered = candidates;
    
    if (searchTerm) {
      filtered = filtered.filter(candidate => 
        candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidate.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (stageFilter) {
      filtered = filtered.filter(candidate => candidate.stage === stageFilter);
    }
    
    setFilteredCandidates(filtered);
  }, [candidates, searchTerm, stageFilter]);

  const handleUpdateCandidateStage = async (candidateId, newStage) => {
    try {
      await mockApi.updateCandidate(candidateId, { stage: newStage });
      
      // Update local state
      setCandidates(prev => 
        prev.map(candidate => 
          candidate.id === candidateId 
            ? { ...candidate, stage: newStage }
            : candidate
        )
      );
      
      toast({
        title: 'Success',
        description: 'Candidate stage updated successfully'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update candidate stage',
        variant: 'destructive'
      });
    }
  };

  const handleViewCandidate = (candidate) => {
    // In a real app, this would navigate to candidate profile
    toast({
      title: 'Candidate Profile',
      description: `Viewing profile for ${candidate.name}`
    });
  };

  const CandidateListItem = ({ index, style }) => {
    const candidate = filteredCandidates[index];
    return (
      <CandidateCard
        key={candidate.id}
        candidate={candidate}
        style={style}
        onView={handleViewCandidate}
        onUpdateStage={handleUpdateCandidateStage}
      />
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Candidates</h1>
          <p className="text-gray-600 mt-1">
            {filteredCandidates.length} candidates found
          </p>
        </div>
        
        <div className="flex space-x-2">
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            onClick={() => setViewMode('list')}
          >
            List View
          </Button>
          <Button
            variant={viewMode === 'kanban' ? 'default' : 'outline'}
            onClick={() => setViewMode('kanban')}
          >
            Kanban View
          </Button>
          <Button>
            <UserPlus className="h-4 w-4 mr-2" />
            Add Candidate
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex gap-2">
              <Select value={stageFilter || "all"} onValueChange={(value) => setStageFilter(value === "all" ? "" : value)}>
                <SelectTrigger className="w-40">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="All Stages" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Stages</SelectItem>
                  {Object.values(CANDIDATE_STAGES).map(stage => (
                    <SelectItem key={stage} value={stage} className="capitalize">
                      {stage}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      {loading ? (
        <div className="text-center py-8">Loading candidates...</div>
      ) : viewMode === 'kanban' ? (
        <Card>
          <CardContent className="p-6">
            <div className="text-center py-8">
              <p className="text-gray-500">Kanban view will be implemented in the backend phase</p>
            </div>
          </CardContent>
        </Card>
      ) : filteredCandidates.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No candidates found</p>
        </div>
      ) : (
        /* Simple List */
        <div className="grid grid-cols-1 gap-4">
          {filteredCandidates.slice(0, 50).map((candidate) => (
            <Card key={candidate.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-medium text-gray-900">{candidate.name}</h3>
                    <p className="text-sm text-gray-600">{candidate.email}</p>
                  </div>
                  <Badge variant="outline" className="capitalize">
                    {candidate.stage}
                  </Badge>
                </div>
                
                <div className="flex justify-between items-center text-xs text-gray-500 mb-3">
                  <span>Applied: {new Date(candidate.appliedAt).toLocaleDateString()}</span>
                  <span>Job ID: {candidate.jobId}</span>
                </div>
                
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline" onClick={() => handleViewCandidate(candidate)}>
                    <Eye className="h-3 w-3 mr-1" />
                    View
                  </Button>
                  <Button size="sm" variant="outline">
                    <MessageSquare className="h-3 w-3 mr-1" />
                    Notes
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          {filteredCandidates.length > 50 && (
            <div className="text-center py-4 text-gray-500">
              Showing first 50 candidates of {filteredCandidates.length}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CandidatesBoard;