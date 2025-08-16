import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  MenuItem,
  Grid,
  Alert,
  CircularProgress,
  Paper,
  Chip
} from '@mui/material';
import { Download, Send } from '@mui/icons-material';
import axios from 'axios';

interface University {
  name: string;
  code: string;
  address: string;
  phone: string;
  website: string;
}

interface DocumentType {
  value: string;
  label: string;
  description: string;
}

interface SampleStudent {
  name: string;
  rollNumber: string;
  course: string;
  department: string;
  year: string;
  admissionDate: string;
  email: string;
  phone: string;
  purpose: string;
}

interface AppData {
  universities: University[];
  documentTypes: DocumentType[];
  courses: string[];
  departments: string[];
  yearOptions: string[];
  sampleStudents: SampleStudent[];
}

interface FormData {
  universityTemplate: string;
  documentType: string;
  studentName: string;
  rollNumber: string;
  course: string;
  department: string;
  yearOfStudy: string;
  admissionDate: string;
  email: string;
  phone: string;
  purpose: string;
}

interface DocumentFormProps {
  appData: AppData;
  currentSampleIndex: number;
  setCurrentSampleIndex: (index: number) => void;
  generatedDocumentData: any;
  setGeneratedDocumentData: (data: any) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  errors: string[];
  setErrors: (errors: string[]) => void;
  successMessage: string;
  setSuccessMessage: (message: string) => void;
}

const DocumentForm: React.FC<DocumentFormProps> = ({
  appData,
  currentSampleIndex,
  setCurrentSampleIndex,
  generatedDocumentData,
  setGeneratedDocumentData,
  isLoading,
  setIsLoading,
  errors,
  setErrors,
  successMessage,
  setSuccessMessage
}) => {
  const [formData, setFormData] = useState<FormData>({
    universityTemplate: 'harvard',
    documentType: '',
    studentName: '',
    rollNumber: '',
    course: '',
    department: '',
    yearOfStudy: '',
    admissionDate: '',
    email: '',
    phone: '',
    purpose: ''
  });

  const [showPreviewModal, setShowPreviewModal] = useState(false);

  useEffect(() => {
    updatePreview();
  }, [formData]);

  const updateFormData = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const debounce = (func: Function, wait: number) => {
    let timeout: NodeJS.Timeout;
    return function executedFunction(...args: any[]) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };

  const updatePreview = debounce(() => {
    // Preview update logic will be handled in the render
  }, 300);

  const getFieldDisplay = (value: string, placeholder: string, isPreview: boolean) => {
    if (value && value.trim() && value !== 'Mr./Ms. ') {
      return isPreview ? `<span class="highlight-field">${value}</span>` : value;
    }
    return isPreview ? `<span class="placeholder-field">[${placeholder}]</span>` : `[${placeholder}]`;
  };

  const generateDocumentHTML = (formData: FormData, university: University, documentType: DocumentType, isPreview: boolean = false) => {
    const currentDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const templateClass = `${university.code}-template`;

    let documentTitle = '';
    let documentBody = '';

    switch (documentType.value) {
      case 'bonafide':
        documentTitle = 'BONAFIDE CERTIFICATE';
        documentBody = `This is to certify that ${getFieldDisplay('Mr./Ms. ' + formData.studentName, 'STUDENT_NAME', isPreview)}, Roll No: ${getFieldDisplay(formData.rollNumber, 'ROLL_NUMBER', isPreview)}, is a bonafide student of this institution. He/She has been studying in this institution since ${getFieldDisplay(formData.admissionDate, 'ADMISSION_DATE', isPreview)} in the ${getFieldDisplay(formData.course, 'COURSE_NAME', isPreview)} program in the Department of ${getFieldDisplay(formData.department, 'DEPARTMENT', isPreview)}. This certificate is issued for the purpose of ${getFieldDisplay(formData.purpose, 'PURPOSE', isPreview)}.`;
        break;
      case 'noc':
        documentTitle = 'NO OBJECTION CERTIFICATE';
        documentBody = `This is to certify that we have no objection to ${getFieldDisplay('Mr./Ms. ' + formData.studentName, 'STUDENT_NAME', isPreview)}, Roll No: ${getFieldDisplay(formData.rollNumber, 'ROLL_NUMBER', isPreview)}, a student of ${getFieldDisplay(formData.course, 'COURSE_NAME', isPreview)} program in the Department of ${getFieldDisplay(formData.department, 'DEPARTMENT', isPreview)}, for ${getFieldDisplay(formData.purpose, 'PURPOSE', isPreview)}. The student is in good academic standing and has no disciplinary issues.`;
        break;
      case 'character':
        documentTitle = 'CHARACTER CERTIFICATE';
        documentBody = `This is to certify that ${getFieldDisplay('Mr./Ms. ' + formData.studentName, 'STUDENT_NAME', isPreview)}, Roll No: ${getFieldDisplay(formData.rollNumber, 'ROLL_NUMBER', isPreview)}, is a student of ${getFieldDisplay(formData.course, 'COURSE_NAME', isPreview)} program in the Department of ${getFieldDisplay(formData.department, 'DEPARTMENT', isPreview)}. During his/her stay in this institution, his/her character and conduct have been found to be satisfactory. This certificate is issued for ${getFieldDisplay(formData.purpose, 'PURPOSE', isPreview)}.`;
        break;
      case 'transfer':
        documentTitle = 'TRANSFER CERTIFICATE';
        documentBody = `This is to certify that ${getFieldDisplay('Mr./Ms. ' + formData.studentName, 'STUDENT_NAME', isPreview)}, Roll No: ${getFieldDisplay(formData.rollNumber, 'ROLL_NUMBER', isPreview)}, was a student of this institution from ${getFieldDisplay(formData.admissionDate, 'ADMISSION_DATE', isPreview)} studying ${getFieldDisplay(formData.course, 'COURSE_NAME', isPreview)} in the Department of ${getFieldDisplay(formData.department, 'DEPARTMENT', isPreview)}. He/She is now seeking transfer for ${getFieldDisplay(formData.purpose, 'PURPOSE', isPreview)}. His/Her character and conduct during the stay were satisfactory.`;
        break;
      case 'fee_structure':
        documentTitle = 'FEE STRUCTURE LETTER';
        documentBody = `This letter provides the official fee structure for ${getFieldDisplay('Mr./Ms. ' + formData.studentName, 'STUDENT_NAME', isPreview)}, Roll No: ${getFieldDisplay(formData.rollNumber, 'ROLL_NUMBER', isPreview)}, enrolled in ${getFieldDisplay(formData.course, 'COURSE_NAME', isPreview)} program in the Department of ${getFieldDisplay(formData.department, 'DEPARTMENT', isPreview)}. This information is provided for ${getFieldDisplay(formData.purpose, 'PURPOSE', isPreview)}. Please contact the finance office for detailed fee breakdown.`;
        break;
      case 'transcript':
        documentTitle = 'ACADEMIC TRANSCRIPT REQUEST';
        documentBody = `This acknowledges the request for official academic transcripts for ${getFieldDisplay('Mr./Ms. ' + formData.studentName, 'STUDENT_NAME', isPreview)}, Roll No: ${getFieldDisplay(formData.rollNumber, 'ROLL_NUMBER', isPreview)}, enrolled in ${getFieldDisplay(formData.course, 'COURSE_NAME', isPreview)} program in the Department of ${getFieldDisplay(formData.department, 'DEPARTMENT', isPreview)}. The transcripts are requested for ${getFieldDisplay(formData.purpose, 'PURPOSE', isPreview)}. Official transcripts will be processed within 5-7 business days.`;
        break;
      default:
        documentTitle = 'OFFICIAL CERTIFICATE';
        documentBody = `This is an official document for ${getFieldDisplay('Mr./Ms. ' + formData.studentName, 'STUDENT_NAME', isPreview)}.`;
    }

    return `
      <div class="document-template ${templateClass}">
        <div class="document-header">
          <div class="university-name">${university.name.toUpperCase()}</div>
          <div class="office-subtitle">Office of the Registrar</div>
          <div class="university-address">${university.address}</div>
          <div class="university-phone">Tel: ${university.phone}</div>
        </div>

        <div class="certificate-title">${documentTitle}</div>

        <div class="certificate-body">
          ${documentBody}
        </div>

        <div class="document-footer">
          <div class="footer-left">
            <div><strong>Date:</strong> ${currentDate}</div>
            <div><strong>Place:</strong> ${university.name}</div>
          </div>
          <div class="footer-right">
            <div class="signature-line"></div>
            <div class="signature-title">Registrar</div>
            <div class="university-seal">${university.name}</div>
          </div>
        </div>
      </div>
    `;
  };

  const validateForm = (): string[] => {
    const errors: string[] = [];

    if (!formData.universityTemplate) errors.push('University template is required');
    if (!formData.documentType) errors.push('Document type is required');
    if (!formData.studentName.trim()) errors.push('Student name is required');
    if (!formData.rollNumber.trim()) errors.push('Roll number is required');
    if (!formData.course) errors.push('Course/Program is required');
    if (!formData.department) errors.push('Department is required');
    if (!formData.yearOfStudy) errors.push('Year of study is required');
    if (!formData.admissionDate) errors.push('Admission date is required');
    if (!formData.purpose.trim()) errors.push('Purpose is required');

    if (formData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.push('Please enter a valid email address');
    }

    return errors;
  };

  const clearForm = () => {
    setFormData({
      universityTemplate: 'harvard',
      documentType: '',
      studentName: '',
      rollNumber: '',
      course: '',
      department: '',
      yearOfStudy: '',
      admissionDate: '',
      email: '',
      phone: '',
      purpose: ''
    });
    setErrors([]);
    setSuccessMessage('');
  };

  const loadSampleData = () => {
    const sample = appData.sampleStudents[currentSampleIndex];
    setFormData({
      universityTemplate: 'harvard',
      documentType: 'bonafide',
      studentName: sample.name,
      rollNumber: sample.rollNumber,
      course: sample.course,
      department: sample.department,
      yearOfStudy: sample.year,
      admissionDate: sample.admissionDate,
      email: sample.email,
      phone: sample.phone,
      purpose: sample.purpose
    });
    setCurrentSampleIndex((currentSampleIndex + 1) % appData.sampleStudents.length);
    setErrors([]);
    setSuccessMessage('');
  };

  const handleShowPreviewModal = () => {
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }
    setShowPreviewModal(true);
  };

  const closePreviewModal = () => {
    setShowPreviewModal(false);
  };

  const generateDocument = async () => {
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors([]);
    setIsLoading(true);

    try {
      const university = appData.universities.find(u => u.code === formData.universityTemplate);
      const documentType = appData.documentTypes.find(d => d.value === formData.documentType);

      if (!university || !documentType) {
        throw new Error('Invalid university or document type');
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      const generatedData = {
        formData,
        university,
        documentType,
        content: generateDocumentHTML(formData, university, documentType, false),
        filename: `${documentType.value}_${formData.studentName.replace(/\s+/g, '_')}_${new Date().getTime()}.html`
      };

      setGeneratedDocumentData(generatedData);
      setSuccessMessage('Document generated successfully! You can now download it.');
      setIsLoading(false);
    } catch (error) {
      console.error('Error generating document:', error);
      setErrors(['Error generating document. Please try again.']);
      setIsLoading(false);
    }
  };

  const generateFromPreview = () => {
    closePreviewModal();
    generateDocument();
  };

  const downloadDocument = () => {
    if (!generatedDocumentData) {
      console.error('No document data available for download');
      return;
    }

    try {
      const fullHTML = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>${generatedDocumentData.filename}</title>
    <style>
        body {
          font-family: 'Times New Roman', serif;
          margin: 40px;
          line-height: 1.6;
          color: #000;
          background: white;
        }
        .document-header {
          text-align: center;
          margin-bottom: 40px;
          border-bottom: 2px solid #000;
          padding-bottom: 20px;
        }
        .university-name {
          font-size: 24px;
          font-weight: bold;
          margin-bottom: 10px;
        }
        .office-subtitle {
          font-size: 16px;
          margin-bottom: 5px;
        }
        .university-address, .university-phone {
          font-size: 14px;
          margin-bottom: 5px;
        }
        .certificate-title {
          font-size: 20px;
          font-weight: bold;
          text-align: center;
          margin: 40px 0;
          text-decoration: underline;
        }
        .certificate-body {
          margin: 30px 0;
          line-height: 1.8;
          text-align: justify;
        }
        .document-footer {
          margin-top: 40px;
          display: flex;
          justify-content: space-between;
        }
        .footer-right {
          text-align: center;
        }
        .signature-line {
          border-bottom: 1px solid #000;
          width: 200px;
          margin: 30px auto 10px;
        }
        .signature-title {
          font-weight: bold;
        }
        .university-seal {
          margin-top: 20px;
          font-size: 12px;
        }
        @media print {
          body { margin: 20px; }
        }
    </style>
</head>
<body>
    ${generatedDocumentData.content}
</body>
</html>`;

      const blob = new Blob([fullHTML], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = generatedDocumentData.filename;
      a.style.display = 'none';

      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading document:', error);
      setErrors(['Error downloading document. Please try again.']);
    }
  };

  const university = appData.universities.find(u => u.code === formData.universityTemplate);
  const documentType = appData.documentTypes.find(d => d.value === formData.documentType);

  return (
    <div className="form-section">
      <div className="card">
        <div className="card__header">
          <h2>Document Generation Form</h2>
        </div>
        <div className="card__body">
          <form className="document-form" onSubmit={(e) => { e.preventDefault(); generateDocument(); }}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="universityTemplate" className="form-label">University Template *</label>
                <select 
                  id="universityTemplate" 
                  className="form-control" 
                  required
                  value={formData.universityTemplate}
                  onChange={(e) => updateFormData('universityTemplate', e.target.value)}
                >
                  {appData.universities.map(uni => (
                    <option key={uni.code} value={uni.code}>{uni.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="documentType" className="form-label">Document Type *</label>
                <select 
                  id="documentType" 
                  className="form-control" 
                  required
                  value={formData.documentType}
                  onChange={(e) => updateFormData('documentType', e.target.value)}
                >
                  <option value="">Select Document Type</option>
                  {appData.documentTypes.map(docType => (
                    <option key={docType.value} value={docType.value}>{docType.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="studentName" className="form-label">Student Name *</label>
                <input 
                  type="text" 
                  id="studentName" 
                  className="form-control" 
                  required
                  placeholder="Enter student full name"
                  value={formData.studentName}
                  onChange={(e) => updateFormData('studentName', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="rollNumber" className="form-label">Roll Number *</label>
                <input 
                  type="text" 
                  id="rollNumber" 
                  className="form-control" 
                  required
                  placeholder="Enter roll number"
                  value={formData.rollNumber}
                  onChange={(e) => updateFormData('rollNumber', e.target.value)}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="course" className="form-label">Course/Program *</label>
                <select 
                  id="course" 
                  className="form-control" 
                  required
                  value={formData.course}
                  onChange={(e) => updateFormData('course', e.target.value)}
                >
                  <option value="">Select Course</option>
                  {appData.courses.map(course => (
                    <option key={course} value={course}>{course}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="department" className="form-label">Department *</label>
                <select 
                  id="department" 
                  className="form-control" 
                  required
                  value={formData.department}
                  onChange={(e) => updateFormData('department', e.target.value)}
                >
                  <option value="">Select Department</option>
                  {appData.departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="yearOfStudy" className="form-label">Year of Study *</label>
                <select 
                  id="yearOfStudy" 
                  className="form-control" 
                  required
                  value={formData.yearOfStudy}
                  onChange={(e) => updateFormData('yearOfStudy', e.target.value)}
                >
                  <option value="">Select Year</option>
                  {appData.yearOptions.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="admissionDate" className="form-label">Admission Date *</label>
                <input 
                  type="date"
                  id="admissionDate" 
                  className="form-control" 
                  required
                  value={formData.admissionDate}
                  onChange={(e) => updateFormData('admissionDate', e.target.value)}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="email" className="form-label">Email Address</label>
                <input 
                  type="email" 
                  id="email" 
                  className="form-control" 
                  placeholder="Enter email address"
                  value={formData.email}
                  onChange={(e) => updateFormData('email', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone" className="form-label">Phone Number</label>
                <input 
                  type="tel" 
                  id="phone" 
                  className="form-control" 
                  placeholder="Enter phone number"
                  value={formData.phone}
                  onChange={(e) => updateFormData('phone', e.target.value)}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group full-width">
                <label htmlFor="purpose" className="form-label">Purpose *</label>
                <textarea 
                  id="purpose" 
                  className="form-control" 
                  required 
                  placeholder="Enter the purpose for which this document is required"
                  rows={3}
                  value={formData.purpose}
                  onChange={(e) => updateFormData('purpose', e.target.value)}
                />
              </div>
            </div>

            <div className="form-actions">
              <div className="action-buttons">
                <button type="button" className="btn btn-secondary" onClick={clearForm}>
                  Clear Form
                </button>
                <button type="button" className="btn btn-secondary" onClick={loadSampleData}>
                  Load Sample
                </button>
                                 <button type="button" className="btn btn-primary" onClick={handleShowPreviewModal}>
                   Preview Document
                 </button>
              </div>
              <button type="submit" className="btn btn-success" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <span className="loading-spinner"></span>
                    <span className="btn-text hidden">Generating...</span>
                  </>
                ) : (
                  <>
                    <span className="btn-text">Generate Document</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Error Messages */}
      {errors.length > 0 && (
        <div id="errorMessages" className="message error-message">
          <h3>Please fix the following errors:</h3>
          <ul className="error-list">
            {errors.map((error, index) => <li key={index}>{error}</li>)}
          </ul>
        </div>
      )}

      {/* Success Message */}
      {successMessage && (
        <div id="successMessage" className="message success-message">
          <h3>Success!</h3>
          <p>{successMessage}</p>
          {generatedDocumentData && (
            <button className="btn btn-primary" onClick={downloadDocument}>
              Download Document
            </button>
          )}
        </div>
      )}

      {/* Document Preview */}
      <div className="card">
        <div className="card__header">
          <h2>Document Preview</h2>
        </div>
        <div className="card__body">
          <div id="documentPreview" className="document-preview">
            {university && documentType ? (
              <div dangerouslySetInnerHTML={{ 
                __html: generateDocumentHTML(formData, university, documentType, true) 
              }} />
            ) : (
              <div className="preview-placeholder">
                <p>Select document type and university to see preview</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreviewModal && (
        <div id="previewModal" className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Document Preview</h3>
              <button className="modal-close" onClick={closePreviewModal}>×</button>
            </div>
            <div className="modal-body">
              <div id="fullDocumentPreview" className="full-document-preview">
                {university && documentType && (
                  <div dangerouslySetInnerHTML={{ 
                    __html: generateDocumentHTML(formData, university, documentType, false) 
                  }} />
                )}
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={closePreviewModal}>
                Close
              </button>
              <button className="btn btn-success" onClick={generateFromPreview}>
                Generate Document
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentForm;
