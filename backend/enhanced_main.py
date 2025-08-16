from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import os
import uvicorn
from datetime import datetime
import uuid
from enhanced_document_generator import EnhancedDocumentGenerator

app = FastAPI(
    title="University Document Automation System",
    description="AI-powered document generation system for universities",
    version="2.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize document generator
document_generator = EnhancedDocumentGenerator()

# Pydantic models for request/response
class StudentData(BaseModel):
    student_name: str
    roll_number: str
    course: str
    department: str
    year_of_study: str
    admission_date: str
    email: Optional[str] = None
    phone: Optional[str] = None
    purpose: str

class DocumentRequest(BaseModel):
    university_code: str
    document_type: str
    student_data: StudentData

class DocumentResponse(BaseModel):
    success: bool
    filename: str
    download_url: str
    message: str
    generated_at: str

class UniversityInfo(BaseModel):
    code: str
    name: str
    address: str
    phone: str
    website: str

class DocumentTypeInfo(BaseModel):
    value: str
    label: str
    description: str

class SystemInfo(BaseModel):
    universities: List[UniversityInfo]
    document_types: List[DocumentTypeInfo]
    courses: List[str]
    departments: List[str]
    year_options: List[str]

# Sample data for the system
SAMPLE_COURSES = [
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
]

SAMPLE_DEPARTMENTS = [
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
]

SAMPLE_YEAR_OPTIONS = [
    "1st Year",
    "2nd Year", 
    "3rd Year",
    "4th Year",
    "5th Year",
    "6th Year"
]

@app.get("/")
async def root():
    """Root endpoint with system information"""
    return {
        "message": "University Document Automation System API",
        "version": "2.0.0",
        "status": "running",
        "endpoints": {
            "generate_document": "/generate-document",
            "download_document": "/download/{filename}",
            "system_info": "/system-info",
            "health": "/health"
        }
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "service": "Document Automation System"
    }

@app.get("/system-info", response_model=SystemInfo)
async def get_system_info():
    """Get system information including universities, document types, and options"""
    universities = []
    for code, data in document_generator.universities.items():
        universities.append(UniversityInfo(
            code=code,
            name=data["name"],
            address=data["address"],
            phone=data["phone"],
            website=data["website"]
        ))
    
    document_types = []
    for value, data in document_generator.document_templates.items():
        document_types.append(DocumentTypeInfo(
            value=value,
            label=data["title"].replace("_", " ").title(),
            description=f"Generate {data['title'].lower()} for students"
        ))
    
    return SystemInfo(
        universities=universities,
        document_types=document_types,
        courses=SAMPLE_COURSES,
        departments=SAMPLE_DEPARTMENTS,
        year_options=SAMPLE_YEAR_OPTIONS
    )

@app.post("/generate-document", response_model=DocumentResponse)
async def generate_document(request: DocumentRequest):
    """Generate a document based on the request"""
    try:
        # Validate university code
        if request.university_code not in document_generator.universities:
            raise HTTPException(status_code=400, detail=f"Invalid university code: {request.university_code}")
        
        # Validate document type
        if request.document_type not in document_generator.document_templates:
            raise HTTPException(status_code=400, detail=f"Invalid document type: {request.document_type}")
        
        # Convert student data to the format expected by the generator
        student_data = {
            "student_name": request.student_data.student_name,
            "roll_number": request.student_data.roll_number,
            "course": request.student_data.course,
            "department": request.student_data.department,
            "admission_date": request.student_data.admission_date,
            "purpose": request.student_data.purpose
        }
        
        # Generate the document
        result = document_generator.generate_and_save(
            request.university_code,
            request.document_type,
            student_data
        )
        
        return DocumentResponse(
            success=result["success"],
            filename=result["filename"],
            download_url=result["download_url"],
            message=result["message"],
            generated_at=datetime.now().isoformat()
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating document: {str(e)}")

@app.get("/download/{filename}")
async def download_document(filename: str):
    """Download a generated document"""
    try:
        file_path = os.path.join("generated", filename)
        
        if not os.path.exists(file_path):
            raise HTTPException(status_code=404, detail="Document not found")
        
        return FileResponse(
            path=file_path,
            filename=filename,
            media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error downloading document: {str(e)}")

@app.get("/documents")
async def list_documents():
    """List all generated documents"""
    try:
        generated_dir = "generated"
        if not os.path.exists(generated_dir):
            return {"documents": []}
        
        documents = []
        for filename in os.listdir(generated_dir):
            if filename.endswith('.docx'):
                file_path = os.path.join(generated_dir, filename)
                file_stat = os.stat(file_path)
                
                documents.append({
                    "filename": filename,
                    "size": file_stat.st_size,
                    "created_at": datetime.fromtimestamp(file_stat.st_ctime).isoformat(),
                    "download_url": f"/download/{filename}"
                })
        
        # Sort by creation date (newest first)
        documents.sort(key=lambda x: x["created_at"], reverse=True)
        
        return {"documents": documents}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error listing documents: {str(e)}")

@app.delete("/documents/{filename}")
async def delete_document(filename: str):
    """Delete a generated document"""
    try:
        file_path = os.path.join("generated", filename)
        
        if not os.path.exists(file_path):
            raise HTTPException(status_code=404, detail="Document not found")
        
        os.remove(file_path)
        
        return {"message": f"Document {filename} deleted successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting document: {str(e)}")

@app.post("/validate-request")
async def validate_document_request(request: DocumentRequest):
    """Validate a document request without generating the document"""
    errors = []
    
    # Validate university code
    if request.university_code not in document_generator.universities:
        errors.append(f"Invalid university code: {request.university_code}")
    
    # Validate document type
    if request.document_type not in document_generator.document_templates:
        errors.append(f"Invalid document type: {request.document_type}")
    
    # Validate student data
    if not request.student_data.student_name.strip():
        errors.append("Student name is required")
    
    if not request.student_data.roll_number.strip():
        errors.append("Roll number is required")
    
    if not request.student_data.course:
        errors.append("Course is required")
    
    if not request.student_data.department:
        errors.append("Department is required")
    
    if not request.student_data.admission_date:
        errors.append("Admission date is required")
    
    if not request.student_data.purpose.strip():
        errors.append("Purpose is required")
    
    # Validate email if provided
    if request.student_data.email and not "@" in request.student_data.email:
        errors.append("Invalid email format")
    
    return {
        "valid": len(errors) == 0,
        "errors": errors
    }

@app.get("/sample-data")
async def get_sample_data():
    """Get sample student data for testing"""
    return {
        "sample_students": [
            {
                "name": "John Smith",
                "roll_number": "CS2024001",
                "course": "Bachelor of Science (B.Sc.)",
                "department": "Computer Science",
                "year_of_study": "2nd Year",
                "admission_date": "2023-08-15",
                "email": "john.smith@university.edu",
                "phone": "+1-555-0123",
                "purpose": "Internship application"
            },
            {
                "name": "Sarah Johnson",
                "roll_number": "EE2024002", 
                "course": "Bachelor of Engineering (B.E.)",
                "department": "Electrical Engineering",
                "year_of_study": "3rd Year",
                "admission_date": "2022-09-01",
                "email": "sarah.johnson@university.edu",
                "phone": "+1-555-0124",
                "purpose": "Study abroad program"
            },
            {
                "name": "Michael Chen",
                "roll_number": "MBA2024003",
                "course": "Master of Business Administration (M.B.A.)",
                "department": "Business Administration", 
                "year_of_study": "1st Year",
                "admission_date": "2024-01-15",
                "email": "michael.chen@university.edu",
                "phone": "+1-555-0125",
                "purpose": "Professional certification"
            }
        ]
    }

if __name__ == "__main__":
    # Create generated directory if it doesn't exist
    os.makedirs("generated", exist_ok=True)
    
    print("Starting University Document Automation System...")
    print("API Documentation available at: http://localhost:8000/docs")
    print("Frontend should be running at: http://localhost:3000")
    
    uvicorn.run(
        "enhanced_main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
