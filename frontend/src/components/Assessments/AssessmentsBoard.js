import React, { useState, useEffect } from 'react';
import { Plus, Eye, Edit2, Copy, Trash2, FileText } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { useToast } from '../../hooks/use-toast';
import { mockJobs, mockApi } from '../../lib/mock';
import AssessmentBuilder from './AssessmentBuilder';

const AssessmentCard = ({ job, assessment, onEdit, onView, onCopy, onDelete }) => {
  const questionCount = assessment?.sections?.reduce((total, section) => 
    total + (section.questions?.length || 0), 0) || 0;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-medium">{job.title}</CardTitle>
        <Badge variant="outline">
          {questionCount} Questions
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <p className="text-sm text-gray-600">
            {assessment?.title || 'No assessment created'}
          </p>
          
          <div className="text-xs text-gray-500">
            {assessment?.sections?.length || 0} sections
          </div>
          
          <div className="flex space-x-2">
            {assessment ? (
              <>
                <Button size="sm" variant="outline" onClick={() => onView(job.id, assessment)}>
                  <Eye className="h-3 w-3 mr-1" />
                  Preview
                </Button>
                <Button size="sm" variant="outline" onClick={() => onEdit(job.id, assessment)}>
                  <Edit2 className="h-3 w-3 mr-1" />
                  Edit
                </Button>
                <Button size="sm" variant="outline" onClick={() => onCopy(job.id, assessment)}>
                  <Copy className="h-3 w-3 mr-1" />
                  Copy
                </Button>
              </>
            ) : (
              <Button size="sm" onClick={() => onEdit(job.id, null)}>
                <Plus className="h-3 w-3 mr-1" />
                Create
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const AssessmentsBoard = () => {
  const [jobs, setJobs] = useState([]);
  const [assessments, setAssessments] = useState({});
  const [loading, setLoading] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [selectedAssessment, setSelectedAssessment] = useState(null);
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // Load jobs
      const jobsResponse = await mockApi.getJobs({ pageSize: 100 });
      setJobs(jobsResponse.jobs);
      
      // Load assessments for each job
      const assessmentPromises = jobsResponse.jobs.map(job => 
        mockApi.getAssessment(job.id).then(assessment => ({ jobId: job.id, assessment }))
      );
      
      const assessmentResults = await Promise.all(assessmentPromises);
      const assessmentsMap = {};
      assessmentResults.forEach(({ jobId, assessment }) => {
        if (assessment) {
          assessmentsMap[jobId] = assessment;
        }
      });
      
      setAssessments(assessmentsMap);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load assessments',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditAssessment = (jobId, assessment) => {
    setSelectedJobId(jobId);
    setSelectedAssessment(assessment);
    setIsBuilderOpen(true);
  };

  const handleViewAssessment = (jobId, assessment) => {
    setSelectedJobId(jobId);
    setSelectedAssessment(assessment);
    setIsPreviewOpen(true);
  };

  const handleCopyAssessment = async (jobId, assessment) => {
    // In a real app, this would open a dialog to select target job
    toast({
      title: 'Copy Assessment',
      description: 'Assessment copying functionality would be implemented here'
    });
  };

  const handleSaveAssessment = async (assessmentData) => {
    try {
      await mockApi.saveAssessment(selectedJobId, assessmentData);
      
      // Update local state
      setAssessments(prev => ({
        ...prev,
        [selectedJobId]: assessmentData
      }));
      
      toast({
        title: 'Success',
        description: 'Assessment saved successfully'
      });
      
      setIsBuilderOpen(false);
      setSelectedJobId(null);
      setSelectedAssessment(null);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save assessment',
        variant: 'destructive'
      });
    }
  };

  const selectedJob = jobs.find(job => job.id === selectedJobId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Assessments</h1>
          <p className="text-gray-600 mt-1">Create and manage job-specific assessments</p>
        </div>
        
        <Button onClick={() => handleEditAssessment(jobs[0]?.id, null)} disabled={jobs.length === 0}>
          <Plus className="h-4 w-4 mr-2" />
          Create Assessment
        </Button>
      </div>

      {/* Assessments Grid */}
      {loading ? (
        <div className="text-center py-8">Loading assessments...</div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No jobs available. Create a job first to build assessments.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <AssessmentCard
              key={job.id}
              job={job}
              assessment={assessments[job.id]}
              onEdit={handleEditAssessment}
              onView={handleViewAssessment}
              onCopy={handleCopyAssessment}
            />
          ))}
        </div>
      )}

      {/* Assessment Builder Modal */}
      <Dialog open={isBuilderOpen} onOpenChange={setIsBuilderOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedAssessment ? 'Edit Assessment' : 'Create Assessment'} 
              {selectedJob && ` - ${selectedJob.title}`}
            </DialogTitle>
          </DialogHeader>
          {selectedJobId && (
            <AssessmentBuilder
              jobId={selectedJobId}
              assessment={selectedAssessment}
              onSave={handleSaveAssessment}
              onCancel={() => {
                setIsBuilderOpen(false);
                setSelectedJobId(null);
                setSelectedAssessment(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Assessment Preview Modal */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              Preview Assessment - {selectedJob?.title}
            </DialogTitle>
          </DialogHeader>
          {selectedAssessment && (
            <div className="space-y-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-medium text-blue-900">{selectedAssessment.title}</h3>
                <p className="text-sm text-blue-700 mt-1">
                  This is how candidates will see the assessment
                </p>
              </div>
              
              {selectedAssessment.sections?.map((section, sectionIndex) => (
                <div key={section.id} className="space-y-4">
                  <h4 className="text-lg font-medium border-b pb-2">
                    {sectionIndex + 1}. {section.title}
                  </h4>
                  
                  <div className="space-y-4 pl-4">
                    {section.questions?.map((question, questionIndex) => (
                      <div key={question.id} className="space-y-2">
                        <p className="font-medium">
                          {sectionIndex + 1}.{questionIndex + 1} {question.question}
                          {question.required && <span className="text-red-500 ml-1">*</span>}
                        </p>
                        
                        {(question.type === 'single_choice' || question.type === 'multi_choice') && (
                          <div className="space-y-1 pl-4">
                            {question.options?.map((option, optionIndex) => (
                              <label key={optionIndex} className="flex items-center space-x-2">
                                <input 
                                  type={question.type === 'single_choice' ? 'radio' : 'checkbox'}
                                  name={`question_${question.id}`}
                                  disabled
                                  className="text-blue-600"
                                />
                                <span className="text-sm">{option}</span>
                              </label>
                            ))}
                          </div>
                        )}
                        
                        {question.type === 'short_text' && (
                          <input 
                            type="text" 
                            placeholder="Short text answer..." 
                            disabled
                            className="w-full p-2 border rounded-md bg-gray-50"
                          />
                        )}
                        
                        {question.type === 'long_text' && (
                          <textarea 
                            placeholder="Long text answer..." 
                            rows={3}
                            disabled
                            className="w-full p-2 border rounded-md bg-gray-50"
                          />
                        )}
                        
                        {question.type === 'numeric' && (
                          <input 
                            type="number" 
                            placeholder="Enter a number..." 
                            disabled
                            className="w-full p-2 border rounded-md bg-gray-50"
                          />
                        )}
                        
                        {question.type === 'file_upload' && (
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center text-gray-500">
                            File upload area (disabled in preview)
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              
              <div className="flex justify-end pt-4 border-t">
                <Button onClick={() => setIsPreviewOpen(false)}>
                  Close Preview
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AssessmentsBoard;