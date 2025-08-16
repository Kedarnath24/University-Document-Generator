# 🚀 Deployment Guide

## Quick Start

### Prerequisites
- Python 3.8+
- Node.js 16+
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Kedarnath24/University-Document-Generator.git
   cd University-Document-Generator
   ```

2. **Start the system**
   ```bash
   python start_system.py
   ```

3. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000

## Manual Setup

### Backend Setup
```bash
cd backend
pip install -r requirements.txt
python enhanced_main.py
```

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

## Features

- **Multi-University Support**: Harvard, Stanford, MIT, and Generic templates
- **Document Types**: Bonafide, NOC, Bus Pass, Character Certificate, etc.
- **Real-time Preview**: See document changes instantly
- **Professional Formatting**: Harvard-style document generation
- **Unique Filenames**: Timestamped and UUID-based naming
- **Modern UI**: Responsive design with dark header theme

## API Endpoints

- `GET /` - System information
- `GET /health` - Health check
- `GET /system-info` - University and document type data
- `POST /generate-document` - Generate documents
- `GET /download/{filename}` - Download generated documents
- `GET /documents` - List generated documents
- `DELETE /documents/{filename}` - Delete documents

## Project Structure

```
University-Document-Generator/
├── start_system.py              # Main startup script
├── README.md                   # Project documentation
├── frontend/                   # React TypeScript frontend
│   ├── src/
│   │   ├── App.tsx            # Main application
│   │   ├── App.css            # Styles with black header theme
│   │   └── components/
│   │       └── DocumentForm.tsx # Form component
└── backend/                    # FastAPI backend
    ├── enhanced_main.py        # API server
    ├── enhanced_document_generator.py # Document generation
    └── requirements.txt        # Python dependencies
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is open source and available under the MIT License.
