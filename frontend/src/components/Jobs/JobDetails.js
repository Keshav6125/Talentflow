import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Building2, Calendar, Tag, Users, Edit2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { mockJobs, mockCandidates, JOB_STATUSES, CANDIDATE_STAGES } from '../../lib/mock';

const JobDetails = () => {
  const { jobId } = useParams();
  const [job, setJob] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Find the job
    const foundJob = mockJobs.find(j => j.id === jobId);
    if (foundJob) {
      setJob(foundJob);
      // Get candidates for this job
      const jobCandidates = mockCandidates.filter(c => c.jobId === jobId);
      setCandidates(jobCandidates);
    }
    setLoading(false);
  }, [jobId]);

  if (loading) {
    return <div className="text-center py-8">Loading job details...</div>;
  }

  if (!job) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Job not found</p>
        <Link to="/jobs" className="text-blue-600 hover:underline">
          Back to Jobs
        </Link>
      </div>
    );
  }

  const statusColor = job.status === JOB_STATUSES.ACTIVE ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800';

  // Calculate candidate stats
  const candidateStats = Object.values(CANDIDATE_STAGES || {}).reduce((acc, stage) => {
    acc[stage] = candidates.filter(c => c.stage === stage).length;
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link to="/jobs">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Jobs
          </Button>
        </Link>
      </div>

      {/* Job Overview */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <CardTitle className="text-2xl">{job.title}</CardTitle>
              <Badge className={statusColor}>
                {job.status === JOB_STATUSES.ACTIVE ? 'Active' : 'Archived'}
              </Badge>
            </div>
            <Button>
              <Edit2 className="h-4 w-4 mr-2" />
              Edit Job
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <Building2 className="h-4 w-4 text-gray-400" />
              <span>Slug: {job.slug}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-gray-400" />
              <span>Created: {new Date(job.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-gray-400" />
              <span>{candidates.length} Candidates</span>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="font-medium mb-2">Description</h3>
            <p className="text-gray-600">{job.description}</p>
          </div>

          <div>
            <h3 className="font-medium mb-2">Requirements</h3>
            <ul className="space-y-1">
              {job.requirements.map((requirement, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <span className="text-blue-600 mt-1.5">•</span>
                  <span className="text-gray-600">{requirement}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-medium mb-2 flex items-center">
              <Tag className="h-4 w-4 mr-2" />
              Skills & Tags
            </h3>
            <div className="flex flex-wrap gap-2">
              {job.tags.map((tag, index) => (
                <Badge key={index} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Candidate Pipeline */}
      <Card>
        <CardHeader>
          <CardTitle>Candidate Pipeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {Object.entries(candidateStats).map(([stage, count]) => (
              <div key={stage} className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{count}</div>
                <div className="text-sm text-gray-600 capitalize">{stage}</div>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <Link to="/candidates" className="inline-flex">
              <Button variant="outline">
                <Users className="h-4 w-4 mr-2" />
                View All Candidates
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Recent Candidates */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Candidates</CardTitle>
        </CardHeader>
        <CardContent>
          {candidates.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No candidates yet</p>
          ) : (
            <div className="space-y-3">
              {candidates.slice(0, 5).map((candidate) => (
                <div key={candidate.id} className="flex justify-between items-center p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">{candidate.name}</div>
                    <div className="text-sm text-gray-600">{candidate.email}</div>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline" className="capitalize">
                      {candidate.stage}
                    </Badge>
                    <div className="text-xs text-gray-500 mt-1">
                      Applied: {new Date(candidate.appliedAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
              {candidates.length > 5 && (
                <div className="text-center pt-2">
                  <Link to="/candidates" className="text-blue-600 hover:underline text-sm">
                    View all {candidates.length} candidates
                  </Link>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default JobDetails;