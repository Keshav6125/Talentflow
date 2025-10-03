import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Archive, Eye, Edit2, MoreVertical } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { useToast } from '../../hooks/use-toast';
import { mockApi, JOB_STATUSES } from '../../lib/mock';
import JobForm from './JobForm';

const JobCard = ({ job, onEdit, onArchive, onView }) => {
  const statusColor = job.status === JOB_STATUSES.ACTIVE ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800';
  
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-medium">{job.title}</CardTitle>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onView(job)}>
              <Eye className="h-4 w-4 mr-2" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit(job)}>
              <Edit2 className="h-4 w-4 mr-2" />
              Edit Job
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => onArchive(job)}
              className={job.status === JOB_STATUSES.ACTIVE ? 'text-orange-600' : 'text-green-600'}
            >
              <Archive className="h-4 w-4 mr-2" />
              {job.status === JOB_STATUSES.ACTIVE ? 'Archive' : 'Unarchive'}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <Badge className={statusColor}>
            {job.status === JOB_STATUSES.ACTIVE ? 'Active' : 'Archived'}
          </Badge>
          
          <p className="text-sm text-gray-600 line-clamp-2">
            {job.description}
          </p>
          
          <div className="flex flex-wrap gap-1">
            {job.tags.map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
          
          <div className="flex justify-between items-center text-xs text-gray-500 pt-2 border-t">
            <span>Created: {new Date(job.createdAt).toLocaleDateString()}</span>
            <span>Order: {job.order}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const JobsBoard = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedJob, setSelectedJob] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { toast } = useToast();
  
  const loadJobs = async (page = 1, search = searchTerm, status = statusFilter) => {
    setLoading(true);
    try {
      const response = await mockApi.getJobs({
        search,
        status,
        page,
        pageSize: 12,
        sort: 'order'
      });
      
      setJobs(response.jobs);
      setTotalPages(response.totalPages);
      setCurrentPage(page);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load jobs',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    loadJobs();
  }, []);
  
  const handleSearch = (value) => {
    setSearchTerm(value);
    setCurrentPage(1);
    loadJobs(1, value, statusFilter);
  };
  
  const handleStatusFilter = (value) => {
    const filterValue = value === "all" ? "" : value;
    setStatusFilter(filterValue);
    setCurrentPage(1);
    loadJobs(1, searchTerm, filterValue);
  };
  
  const handleCreateJob = async (jobData) => {
    try {
      await mockApi.createJob(jobData);
      toast({
        title: 'Success',
        description: 'Job created successfully'
      });
      setIsCreateModalOpen(false);
      loadJobs();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create job',
        variant: 'destructive'
      });
    }
  };
  
  const handleEditJob = async (jobData) => {
    try {
      await mockApi.updateJob(selectedJob.id, jobData);
      toast({
        title: 'Success',
        description: 'Job updated successfully'
      });
      setIsEditModalOpen(false);
      setSelectedJob(null);
      loadJobs();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update job',
        variant: 'destructive'
      });
    }
  };
  
  const handleArchiveToggle = async (job) => {
    try {
      const newStatus = job.status === JOB_STATUSES.ACTIVE ? JOB_STATUSES.ARCHIVED : JOB_STATUSES.ACTIVE;
      await mockApi.updateJob(job.id, { status: newStatus });
      
      toast({
        title: 'Success',
        description: `Job ${newStatus === JOB_STATUSES.ARCHIVED ? 'archived' : 'unarchived'} successfully`
      });
      
      loadJobs();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update job status',
        variant: 'destructive'
      });
    }
  };
  
  const handleViewJob = (job) => {
    setSelectedJob(job);
    // In a real app, this would navigate to job details page
    toast({
      title: 'Job Details',
      description: `Viewing details for ${job.title}`
    });
  };
  
  const handleEditClick = (job) => {
    setSelectedJob(job);
    setIsEditModalOpen(true);
  };
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Jobs</h1>
          <p className="text-gray-600 mt-1">Manage your job postings and requirements</p>
        </div>
        
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Job
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Job</DialogTitle>
            </DialogHeader>
            <JobForm onSubmit={handleCreateJob} onCancel={() => setIsCreateModalOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>
      
      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search jobs..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex gap-2">
              <Select value={statusFilter || "all"} onValueChange={handleStatusFilter}>
                <SelectTrigger className="w-40">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value={JOB_STATUSES.ACTIVE}>Active</SelectItem>
                  <SelectItem value={JOB_STATUSES.ARCHIVED}>Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Jobs Grid */}
      {loading ? (
        <div className="text-center py-8">Loading jobs...</div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No jobs found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              onView={handleViewJob}
              onEdit={handleEditClick}
              onArchive={handleArchiveToggle}
            />
          ))}
        </div>
      )}
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center space-x-2">
          <Button
            variant="outline"
            onClick={() => loadJobs(currentPage - 1)}
            disabled={currentPage === 1 || loading}
          >
            Previous
          </Button>
          
          <span className="flex items-center px-4">
            Page {currentPage} of {totalPages}
          </span>
          
          <Button
            variant="outline"
            onClick={() => loadJobs(currentPage + 1)}
            disabled={currentPage === totalPages || loading}
          >
            Next
          </Button>
        </div>
      )}
      
      {/* Edit Job Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Job</DialogTitle>
          </DialogHeader>
          {selectedJob && (
            <JobForm 
              job={selectedJob}
              onSubmit={handleEditJob} 
              onCancel={() => {
                setIsEditModalOpen(false);
                setSelectedJob(null);
              }} 
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default JobsBoard;