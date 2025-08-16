import React, { useState, useEffect } from 'react';
import './App.css';
import DocumentForm from './components/DocumentForm';

// Application Data
const appData = {
  universities: [
    {
      name: "Harvard University",
      code: "harvard",
      address: "Cambridge, MA 02138",
      phone: "(617) 495-1000",
      website: "harvard.edu"
    },
    {
      name: "Stanford University",
      code: "stanford",
      address: "Stanford, CA 94305",
      phone: "(650) 723-2300",
      website: "stanford.edu"
    },
    {
      name: "MIT",
      code: "mit",
      address: "Cambridge, MA 02139",
      phone: "(617) 253-1000",
      website: "mit.edu"
    },
    {
      name: "Generic Template",
      code: "generic",
      address: "University Address",
      phone: "University Phone",
      website: "university.edu"
    }
  ],
  documentTypes: [
    {
      value: "bonafide",
      label: "Bonafide Certificate",
      description: "Certificate confirming student enrollment"
    },
    {
      value: "noc",
      label: "No Objection Certificate (NOC)",
      description: "Certificate stating no objection to student activities"
    },
    {
      value: "character",
      label: "Character Certificate",
      description: "Certificate of student character and conduct"
    },
    {
      value: "transfer",
      label: "Transfer Certificate",
      description: "Certificate for transferring to another institution"
    },
    {
      value: "fee_structure",
      label: "Fee Structure Letter",
      description: "Official fee structure documentation"
    },
    {
      value: "transcript",
      label: "Academic Transcript Request",
      description: "Request for official academic transcripts"
    }
  ],
  courses: [
    "Bachelor of Science (B.Sc.)",
    "Bachelor of Arts (B.A.)",
    "Bachelor of Engineering (B.E.)",
    "Bachelor of Technology (B.Tech)",
    "Bachelor of Business Administration (B.B.A.)",
    "Master of Science (M.Sc.)",
    "Master of Arts (M.A.)",
    "Master of Engineering (M.E.)",
    "Master of Technology (M.Tech)",
    "Master of Business Administration (M.B.A.)",
    "Doctor of Philosophy (Ph.D.)",
    "Bachelor of Medicine (M.B.B.S.)",
    "Bachelor of Laws (L.L.B.)",
    "Master of Laws (L.L.M.)"
  ],
  departments: [
    "Computer Science",
    "Electrical Engineering",
    "Mechanical Engineering",
    "Civil Engineering",
    "Chemical Engineering",
    "Biotechnology",
    "Mathematics",
    "Physics",
    "Chemistry",
    "Biology",
    "Economics",
    "Business Administration",
    "Law",
    "Medicine",
    "Arts and Humanities",
    "Social Sciences"
  ],
  yearOptions: [
    "1st Year",
    "2nd Year", 
    "3rd Year",
    "4th Year",
    "5th Year",
    "6th Year"
  ],
  sampleStudents: [
    {
      name: "John Smith",
      rollNumber: "CS2024001",
      course: "Bachelor of Science (B.Sc.)",
      department: "Computer Science",
      year: "2nd Year",
      admissionDate: "2023-08-15",
      email: "john.smith@university.edu",
      phone: "+1-555-0123",
      purpose: "Internship application"
    },
    {
      name: "Sarah Johnson",
      rollNumber: "EE2024002", 
      course: "Bachelor of Engineering (B.E.)",
      department: "Electrical Engineering",
      year: "3rd Year",
      admissionDate: "2022-09-01",
      email: "sarah.johnson@university.edu",
      phone: "+1-555-0124",
      purpose: "Study abroad program"
    },
    {
      name: "Michael Chen",
      rollNumber: "MBA2024003",
      course: "Master of Business Administration (M.B.A.)",
      department: "Business Administration", 
      year: "1st Year",
      admissionDate: "2024-01-15",
      email: "michael.chen@university.edu",
      phone: "+1-555-0125",
      purpose: "Professional certification"
    }
  ]
};

function App() {
  const [currentSampleIndex, setCurrentSampleIndex] = useState(0);
  const [generatedDocumentData, setGeneratedDocumentData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [successMessage, setSuccessMessage] = useState('');

  return (
    <div className="container">
      <header className="app-header">
        <h1>University Document Automation System</h1>
        <p className="app-subtitle">Generate official university documents instantly</p>
      </header>

      <main className="app-main">
        <DocumentForm 
          appData={appData}
          currentSampleIndex={currentSampleIndex}
          setCurrentSampleIndex={setCurrentSampleIndex}
          generatedDocumentData={generatedDocumentData}
          setGeneratedDocumentData={setGeneratedDocumentData}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          errors={errors}
          setErrors={setErrors}
          successMessage={successMessage}
          setSuccessMessage={setSuccessMessage}
        />
      </main>
    </div>
  );
}

export default App;
