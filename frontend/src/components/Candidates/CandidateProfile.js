import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, User, Mail, Calendar, MapPin, MessageSquare, Clock } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { Textarea } from '../ui/textarea';
import { mockCandidates, CANDIDATE_STAGES } from '../../lib/mock';

const CandidateProfile = () => {
  const { candidateId } = useParams();
  const [candidate, setCandidate] = useState(null);
  const [newNote, setNewNote] = useState('');
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const foundCandidate = mockCandidates.find(c => c.id === candidateId);
    if (foundCandidate) {
      setCandidate(foundCandidate);
      // Load notes from localStorage or generate mock ones
      const savedNotes = JSON.parse(localStorage.getItem(`candidate_notes_${candidateId}`)) || [
        {
          id: '1',
          content: 'Initial screening completed. Strong technical background.',
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          author: 'HR Team'
        },
        {
          id: '2',
          content: 'Scheduled for technical interview next week.',
          createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          author: 'Tech Lead'
        }
      ];
      setNotes(savedNotes);
    }
    setLoading(false);
  }, [candidateId]);

  const handleAddNote = () => {
    if (!newNote.trim()) return;
    
    const note = {
      id: Date.now().toString(),
      content: newNote.trim(),
      createdAt: new Date().toISOString(),
      author: 'Current User'
    };
    
    const updatedNotes = [note, ...notes];
    setNotes(updatedNotes);
    localStorage.setItem(`candidate_notes_${candidateId}`, JSON.stringify(updatedNotes));
    setNewNote('');
  };

  if (loading) {
    return <div className="text-center py-8">Loading candidate profile...</div>;
  }

  if (!candidate) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Candidate not found</p>
        <Link to="/candidates" className="text-blue-600 hover:underline">
          Back to Candidates
        </Link>
      </div>
    );
  }

  const stageColors = {
    applied: 'bg-blue-100 text-blue-800',
    screen: 'bg-yellow-100 text-yellow-800',
    tech: 'bg-purple-100 text-purple-800',
    offer: 'bg-green-100 text-green-800',
    hired: 'bg-green-200 text-green-900',
    rejected: 'bg-red-100 text-red-800'
  };

  // Mock timeline data
  const timeline = candidate ? [
    {
      stage: CANDIDATE_STAGES.APPLIED,
      date: candidate.appliedAt,
      description: 'Application submitted'
    },
    {
      stage: CANDIDATE_STAGES.SCREEN,
      date: new Date(new Date(candidate.appliedAt).getTime() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      description: 'Screening interview completed'
    }
  ].filter(item => {
    const stageOrder = Object.values(CANDIDATE_STAGES || {});
    const candidateStageIndex = stageOrder.indexOf(candidate.stage);
    const itemStageIndex = stageOrder.indexOf(item.stage);
    return itemStageIndex <= candidateStageIndex;
  }) : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link to="/candidates">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Candidates
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Profile */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <CardTitle className="text-2xl flex items-center">
                    <User className="h-6 w-6 mr-3" />
                    {candidate.name}
                  </CardTitle>
                  <Badge className={stageColors[candidate.stage] || 'bg-gray-100 text-gray-800'}>
                    {candidate.stage}
                  </Badge>
                </div>
                <Button>Edit Profile</Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span>{candidate.email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span>Applied: {new Date(candidate.appliedAt).toLocaleDateString()}</span>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-medium mb-2">Application Summary</h3>
                <p className="text-gray-600">
                  Applied for Job ID: {candidate.jobId}. Currently in {candidate.stage} stage.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Application Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {timeline.map((event, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <p className="font-medium text-sm capitalize">{event.stage}</p>
                        <time className="text-xs text-gray-500">
                          {new Date(event.date).toLocaleDateString()}
                        </time>
                      </div>
                      <p className="text-sm text-gray-600">{event.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full" variant="outline">
                Schedule Interview
              </Button>
              <Button className="w-full" variant="outline">
                Send Email
              </Button>
              <Button className="w-full" variant="outline">
                Update Stage
              </Button>
              <Button className="w-full" variant="outline">
                Download Resume
              </Button>
            </CardContent>
          </Card>

          {/* Notes */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <MessageSquare className="h-5 w-5 mr-2" />
                Notes & Comments
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Add Note */}
              <div className="space-y-2">
                <Textarea
                  placeholder="Add a note about this candidate..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  rows={3}
                />
                <Button onClick={handleAddNote} disabled={!newNote.trim()}>
                  Add Note
                </Button>
              </div>

              <Separator />

              {/* Notes List */}
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {notes.length === 0 ? (
                  <p className="text-gray-500 text-sm text-center py-4">
                    No notes yet
                  </p>
                ) : (
                  notes.map((note) => (
                    <div key={note.id} className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm">{note.content}</p>
                      <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
                        <span>{note.author}</span>
                        <span className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {new Date(note.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CandidateProfile;