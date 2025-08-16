# 🎓 University Document Automation System

A comprehensive, AI-powered document automation system for universities and institutions. Generate official university documents instantly with a beautiful, modern interface.

## ✨ Features

### 🎨 **Beautiful Modern UI**
- Responsive design with dark/light mode support
- Real-time document preview
- Interactive form with validation
- Modal preview functionality
- Professional document templates

### 🏫 **Multiple University Support**
- **Harvard University** - Official Harvard-styled documents
- **Stanford University** - Stanford Cardinal themed documents  
- **MIT** - MIT-styled document templates
- **Generic Template** - Customizable for any institution

### 📄 **Comprehensive Document Types**
- **Bonafide Certificate** - Student enrollment verification
- **No Objection Certificate (NOC)** - Official permission letters
- **Character Certificate** - Student conduct verification
- **Transfer Certificate** - Student transfer documentation
- **Fee Structure Letter** - Official fee documentation
- **Academic Transcript Request** - Transcript request letters

### 🔧 **Advanced Features**
- Unique filename generation with timestamps
- Document watermarking and metadata
- Professional document formatting
- Download in DOCX format
- Form validation and error handling
- Sample data loading for testing

### 🚀 **Technical Excellence**
- **Frontend**: React TypeScript with modern CSS
- **Backend**: FastAPI with comprehensive API
- **Document Generation**: Python-docx with professional formatting
- **Real-time Preview**: Live document preview as you type
- **Responsive Design**: Works on all devices

## 🛠️ Installation & Setup

### Prerequisites
- **Python 3.8+**
- **Node.js 16+**
- **npm** (comes with Node.js)

### Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd document-automation-system
   ```

2. **Run the startup script**
   ```bash
   python start_system.py
   ```

The startup script will automatically:
- ✅ Check system dependencies
- 📦 Install Python backend dependencies
- 📦 Install React frontend dependencies
- 🚀 Start both backend and frontend servers
- 🔍 Monitor system health

### Manual Setup (Alternative)

#### Backend Setup
```bash
cd backend
pip install -r requirements.txt
python enhanced_main.py
```

#### Frontend Setup
```bash
cd frontend
npm install
npm start
```

## 🌐 System Access

Once started, access the system at:

- **📱 Frontend Application**: http://localhost:3000
- **🔧 Backend API**: http://localhost:8000
- **📚 API Documentation**: http://localhost:8000/docs
- **💚 Health Check**: http://localhost:8000/health

## 📖 Usage Guide

### 1. **Select University Template**
Choose from Harvard, Stanford, MIT, or Generic templates. Each has its own styling and branding.

### 2. **Choose Document Type**
Select the appropriate document type for your needs:
- **Bonafide Certificate**: For student enrollment verification
- **NOC**: For official permission letters
- **Character Certificate**: For conduct verification
- **Transfer Certificate**: For student transfers
- **Fee Structure**: For fee documentation
- **Transcript Request**: For academic transcripts

### 3. **Fill Student Information**
Enter comprehensive student details:
- Student name and roll number
- Course and department
- Year of study and admission date
- Contact information (optional)
- Purpose of the document

### 4. **Preview and Generate**
- Use the **Preview Document** button to see the final document
- Click **Generate Document** to create the official document
- Download the generated DOCX file

### 5. **Sample Data**
Use the **Load Sample** button to quickly populate the form with test data.

## 🏗️ System Architecture

```
document-automation-system/
├── frontend/                 # React TypeScript Frontend
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── App.tsx         # Main application
│   │   └── App.css         # Comprehensive styling
│   └── package.json
├── backend/                  # FastAPI Python Backend
│   ├── enhanced_main.py     # Main API server
│   ├── enhanced_document_generator.py  # Document generation
│   ├── requirements.txt     # Python dependencies
│   └── generated/           # Generated documents
└── start_system.py          # System startup script
```

## 🔌 API Endpoints

### Core Endpoints
- `GET /` - System information
- `GET /health` - Health check
- `GET /system-info` - Get universities, document types, and options
- `POST /generate-document` - Generate a document
- `GET /download/{filename}` - Download generated document

### Management Endpoints
- `GET /documents` - List all generated documents
- `DELETE /documents/{filename}` - Delete a document
- `POST /validate-request` - Validate document request
- `GET /sample-data` - Get sample student data

## 🎨 Document Templates

### Harvard University Style
- Professional dark red branding
- Official Harvard University header
- Times New Roman typography
- Formal document structure

### Stanford University Style
- Cardinal red theming
- Stanford University branding
- Professional formatting
- Official letterhead design

### MIT Style
- Blue violet theming
- MIT branding and styling
- Technical document format
- Professional appearance

### Generic Template
- Neutral styling
- Customizable branding
- Professional format
- Universal applicability

## 🔧 Configuration

### Adding New Universities
Edit `backend/enhanced_document_generator.py`:

```python
self.universities = {
    "your_university": {
        "name": "Your University Name",
        "address": "University Address",
        "phone": "University Phone",
        "website": "university.edu",
        "color": "HEX_COLOR_CODE"
    }
}
```

### Adding New Document Types
Add to the `document_templates` dictionary:

```python
"new_document_type": {
    "title": "DOCUMENT TITLE",
    "template": "Document template text with {placeholders}"
}
```

## 🚀 Deployment

### Production Deployment
1. **Build the frontend**:
   ```bash
   cd frontend
   npm run build
   ```

2. **Deploy backend**:
   ```bash
   cd backend
   pip install -r requirements.txt
   gunicorn enhanced_main:app -w 4 -k uvicorn.workers.UvicornWorker
   ```

3. **Configure reverse proxy** (nginx example):
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       
       location / {
           root /path/to/frontend/build;
           try_files $uri $uri/ /index.html;
       }
       
       location /api/ {
           proxy_pass http://localhost:8000/;
       }
   }
   ```

## 🐛 Troubleshooting

### Common Issues

**Frontend won't start:**
- Check if Node.js is installed: `node --version`
- Clear npm cache: `npm cache clean --force`
- Delete node_modules and reinstall: `rm -rf node_modules && npm install`

**Backend won't start:**
- Check Python version: `python --version`
- Install dependencies: `pip install -r requirements.txt`
- Check port availability: `netstat -an | grep 8000`

**Document generation fails:**
- Check generated directory permissions
- Verify all required fields are filled
- Check backend logs for specific errors

### Logs and Debugging
- **Frontend logs**: Check browser console (F12)
- **Backend logs**: Check terminal where backend is running
- **System logs**: Use the startup script for comprehensive logging

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **React** for the frontend framework
- **FastAPI** for the backend API
- **python-docx** for document generation
- **Modern CSS** for beautiful styling

## 📞 Support

For support and questions:
- Create an issue in the repository
- Check the API documentation at `/docs`
- Review the troubleshooting section

---

**🎓 University Document Automation System** - Making document generation simple, professional, and efficient.
