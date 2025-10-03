import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { Switch } from '../ui/switch';
import { Plus, Trash2, GripVertical, Eye } from 'lucide-react';
import { QUESTION_TYPES } from '../../lib/mock';

const QuestionEditor = ({ question, onUpdate, onDelete }) => {
  const handleUpdate = (field, value) => {
    onUpdate(question.id, { ...question, [field]: value });
  };

  const handleAddOption = () => {
    const newOptions = [...(question.options || []), ''];
    handleUpdate('options', newOptions);
  };

  const handleUpdateOption = (index, value) => {
    const newOptions = [...question.options];
    newOptions[index] = value;
    handleUpdate('options', newOptions);
  };

  const handleRemoveOption = (index) => {
    if (question.options.length > 2) {
      const newOptions = question.options.filter((_, i) => i !== index);
      handleUpdate('options', newOptions);
    }
  };

  const questionTypeNames = {
    [QUESTION_TYPES.SINGLE_CHOICE]: 'Single Choice',
    [QUESTION_TYPES.MULTI_CHOICE]: 'Multiple Choice',
    [QUESTION_TYPES.SHORT_TEXT]: 'Short Text',
    [QUESTION_TYPES.LONG_TEXT]: 'Long Text',
    [QUESTION_TYPES.NUMERIC]: 'Numeric',
    [QUESTION_TYPES.FILE_UPLOAD]: 'File Upload'
  };

  return (
    <Card className="relative">
      <div className="absolute left-2 top-4 cursor-move">
        <GripVertical className="h-4 w-4 text-gray-400" />
      </div>
      
      <CardHeader className="pl-8">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-2">
            <Badge variant="outline">
              {questionTypeNames[question.type]}
            </Badge>
            {question.required && (
              <Badge variant="destructive" className="text-xs">
                Required
              </Badge>
            )}
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onDelete(question.id)}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="pl-8 space-y-4">
        {/* Question Text */}
        <div className="space-y-2">
          <Label>Question</Label>
          <Textarea
            value={question.question}
            onChange={(e) => handleUpdate('question', e.target.value)}
            placeholder="Enter your question..."
            rows={2}
          />
        </div>

        {/* Question Type */}
        <div className="space-y-2">
          <Label>Question Type</Label>
          <Select value={question.type} onValueChange={(value) => handleUpdate('type', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(questionTypeNames).map(([type, name]) => (
                <SelectItem key={type} value={type}>{name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Options for choice questions */}
        {(question.type === QUESTION_TYPES.SINGLE_CHOICE || question.type === QUESTION_TYPES.MULTI_CHOICE) && (
          <div className="space-y-2">
            <Label>Options</Label>
            <div className="space-y-2">
              {(question.options || []).map((option, index) => (
                <div key={index} className="flex space-x-2">
                  <Input
                    value={option}
                    onChange={(e) => handleUpdateOption(index, e.target.value)}
                    placeholder={`Option ${index + 1}`}
                  />
                  {question.options.length > 2 && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleRemoveOption(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleAddOption}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Option
              </Button>
            </div>
          </div>
        )}

        {/* Numeric range */}
        {question.type === QUESTION_TYPES.NUMERIC && (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Min Value</Label>
              <Input
                type="number"
                value={question.minValue || ''}
                onChange={(e) => handleUpdate('minValue', e.target.value ? Number(e.target.value) : undefined)}
                placeholder="No minimum"
              />
            </div>
            <div className="space-y-2">
              <Label>Max Value</Label>
              <Input
                type="number"
                value={question.maxValue || ''}
                onChange={(e) => handleUpdate('maxValue', e.target.value ? Number(e.target.value) : undefined)}
                placeholder="No maximum"
              />
            </div>
          </div>
        )}

        {/* Text length limits */}
        {(question.type === QUESTION_TYPES.SHORT_TEXT || question.type === QUESTION_TYPES.LONG_TEXT) && (
          <div className="space-y-2">
            <Label>Character Limit</Label>
            <Input
              type="number"
              value={question.maxLength || ''}
              onChange={(e) => handleUpdate('maxLength', e.target.value ? Number(e.target.value) : undefined)}
              placeholder="No limit"
            />
          </div>
        )}

        {/* Required toggle */}
        <div className="flex items-center space-x-2">
          <Switch
            checked={question.required}
            onCheckedChange={(checked) => handleUpdate('required', checked)}
          />
          <Label>Required question</Label>
        </div>
      </CardContent>
    </Card>
  );
};

const SectionEditor = ({ section, onUpdate, onDelete, onAddQuestion }) => {
  const handleUpdate = (field, value) => {
    onUpdate(section.id, { ...section, [field]: value });
  };

  const handleUpdateQuestion = (questionId, questionData) => {
    const updatedQuestions = section.questions.map(q => 
      q.id === questionId ? questionData : q
    );
    handleUpdate('questions', updatedQuestions);
  };

  const handleDeleteQuestion = (questionId) => {
    const updatedQuestions = section.questions.filter(q => q.id !== questionId);
    handleUpdate('questions', updatedQuestions);
  };

  const addNewQuestion = () => {
    const newQuestion = {
      id: Date.now().toString(),
      type: QUESTION_TYPES.SHORT_TEXT,
      question: '',
      required: false,
      options: []
    };
    
    onAddQuestion(section.id, newQuestion);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Section: {section.title}</CardTitle>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onDelete(section.id)}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Section Title */}
        <div className="space-y-2">
          <Label>Section Title</Label>
          <Input
            value={section.title}
            onChange={(e) => handleUpdate('title', e.target.value)}
            placeholder="Enter section title..."
          />
        </div>

        <Separator />

        {/* Questions */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="font-medium">Questions ({section.questions?.length || 0})</h4>
            <Button onClick={addNewQuestion} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Question
            </Button>
          </div>

          {section.questions?.map((question) => (
            <QuestionEditor
              key={question.id}
              question={question}
              onUpdate={handleUpdateQuestion}
              onDelete={handleDeleteQuestion}
            />
          ))}

          {(!section.questions || section.questions.length === 0) && (
            <div className="text-center py-8 text-gray-500">
              No questions yet. Add your first question above.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const AssessmentBuilder = ({ jobId, assessment, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    jobId,
    title: '',
    sections: []
  });

  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (assessment) {
      setFormData(assessment);
    } else {
      // Initialize with empty assessment
      setFormData({
        jobId,
        title: '',
        sections: [{
          id: Date.now().toString(),
          title: 'General Questions',
          questions: []
        }]
      });
    }
  }, [assessment, jobId]);

  const handleTitleChange = (value) => {
    setFormData(prev => ({ ...prev, title: value }));
  };

  const handleUpdateSection = (sectionId, sectionData) => {
    setFormData(prev => ({
      ...prev,
      sections: prev.sections.map(section => 
        section.id === sectionId ? sectionData : section
      )
    }));
  };

  const handleDeleteSection = (sectionId) => {
    if (formData.sections.length > 1) {
      setFormData(prev => ({
        ...prev,
        sections: prev.sections.filter(section => section.id !== sectionId)
      }));
    }
  };

  const handleAddSection = () => {
    const newSection = {
      id: Date.now().toString(),
      title: `Section ${formData.sections.length + 1}`,
      questions: []
    };
    
    setFormData(prev => ({
      ...prev,
      sections: [...prev.sections, newSection]
    }));
  };

  const handleAddQuestion = (sectionId, question) => {
    setFormData(prev => ({
      ...prev,
      sections: prev.sections.map(section => 
        section.id === sectionId 
          ? { ...section, questions: [...(section.questions || []), question] }
          : section
      )
    }));
  };

  const handleSave = () => {
    if (!formData.title.trim()) {
      alert('Please enter an assessment title');
      return;
    }

    const hasQuestions = formData.sections.some(section => 
      section.questions && section.questions.length > 0
    );
    
    if (!hasQuestions) {
      alert('Please add at least one question');
      return;
    }

    onSave(formData);
  };

  const totalQuestions = formData.sections.reduce((total, section) => 
    total + (section.questions?.length || 0), 0
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-medium">Assessment Builder</h3>
          <p className="text-sm text-gray-600">
            {formData.sections.length} sections • {totalQuestions} questions
          </p>
        </div>
        
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            onClick={() => setShowPreview(!showPreview)}
          >
            <Eye className="h-4 w-4 mr-2" />
            {showPreview ? 'Hide Preview' : 'Show Preview'}
          </Button>
        </div>
      </div>

      <div className={showPreview ? 'grid grid-cols-2 gap-6' : ''}>
        {/* Builder */}
        <div className="space-y-6">
          {/* Assessment Title */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <Label>Assessment Title</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Enter assessment title..."
                />
              </div>
            </CardContent>
          </Card>

          {/* Sections */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="font-medium">Sections</h4>
              <Button onClick={handleAddSection} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Section
              </Button>
            </div>

            {formData.sections.map((section) => (
              <SectionEditor
                key={section.id}
                section={section}
                onUpdate={handleUpdateSection}
                onDelete={handleDeleteSection}
                onAddQuestion={handleAddQuestion}
              />
            ))}
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t">
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              Save Assessment
            </Button>
          </div>
        </div>

        {/* Preview */}
        {showPreview && (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Live Preview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-medium text-blue-900">
                    {formData.title || 'Untitled Assessment'}
                  </h3>
                </div>

                {formData.sections.map((section, sectionIndex) => (
                  <div key={section.id} className="space-y-3">
                    <h4 className="font-medium border-b pb-2">
                      {sectionIndex + 1}. {section.title}
                    </h4>
                    
                    {section.questions?.map((question, questionIndex) => (
                      <div key={question.id} className="pl-4 space-y-2">
                        <p className="text-sm font-medium">
                          {sectionIndex + 1}.{questionIndex + 1} {question.question || 'Question text...'}
                          {question.required && <span className="text-red-500 ml-1">*</span>}
                        </p>
                        
                        <div className="text-xs text-gray-500">
                          Type: {question.type.replace('_', ' ')}
                        </div>
                      </div>
                    ))}
                    
                    {(!section.questions || section.questions.length === 0) && (
                      <div className="pl-4 text-sm text-gray-500">
                        No questions in this section
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssessmentBuilder;