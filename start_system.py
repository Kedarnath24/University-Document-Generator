#!/usr/bin/env python3
"""
University Document Automation System - Startup Script
This script starts both the backend API server and the React frontend.
"""

import os
import sys
import subprocess
import time
import threading
import signal
import platform
from pathlib import Path

class SystemStarter:
    def __init__(self):
        self.project_root = Path(__file__).parent
        self.backend_dir = self.project_root / "backend"
        self.frontend_dir = self.project_root / "frontend"
        self.processes = []
        self.running = True
        
        # Set up signal handlers for graceful shutdown
        signal.signal(signal.SIGINT, self.signal_handler)
        signal.signal(signal.SIGTERM, self.signal_handler)
        
        if platform.system() == "Windows":
            signal.signal(signal.SIGBREAK, self.signal_handler)
    
    def signal_handler(self, signum, frame):
        """Handle shutdown signals"""
        print("\n🛑 Shutting down Document Automation System...")
        self.running = False
        self.stop_all_processes()
        sys.exit(0)
    
    def check_dependencies(self):
        """Check if required dependencies are installed"""
        print("🔍 Checking system dependencies...")
        
        # Check Python version
        if sys.version_info < (3, 8):
            print("❌ Python 3.8 or higher is required")
            return False
        
        # Check if Node.js is installed
        try:
            # Try with shell=True for Windows PATH issues
            result = subprocess.run("node --version", shell=True, capture_output=True, text=True)
            if result.returncode == 0:
                print(f"✅ Node.js is installed (v{result.stdout.strip()})")
            else:
                print("❌ Node.js is not installed. Please install Node.js from https://nodejs.org/")
                return False
        except Exception as e:
            print(f"❌ Error checking Node.js: {e}")
            return False
        
        # Check if npm is installed
        try:
            # Try with shell=True for Windows PATH issues
            result = subprocess.run("npm --version", shell=True, capture_output=True, text=True)
            if result.returncode == 0:
                print(f"✅ npm is installed (v{result.stdout.strip()})")
            else:
                print("❌ npm is not installed or not in PATH")
                print("   Try restarting your terminal or adding npm to your PATH")
                return False
        except Exception as e:
            print(f"❌ Error checking npm: {e}")
            return False
        
        return True
    
    def install_backend_dependencies(self):
        """Install Python backend dependencies"""
        print("📦 Installing backend dependencies...")
        
        requirements_file = self.backend_dir / "requirements.txt"
        if not requirements_file.exists():
            print("❌ requirements.txt not found in backend directory")
            return False
        
        try:
            subprocess.run([
                sys.executable, "-m", "pip", "install", "-r", str(requirements_file)
            ], check=True, cwd=self.backend_dir)
            print("✅ Backend dependencies installed successfully")
            return True
        except subprocess.CalledProcessError as e:
            print(f"❌ Failed to install backend dependencies: {e}")
            return False
    
    def install_frontend_dependencies(self):
        """Install React frontend dependencies"""
        print("📦 Installing frontend dependencies...")
        
        package_json = self.frontend_dir / "package.json"
        if not package_json.exists():
            print("❌ package.json not found in frontend directory")
            return False
        
        try:
            subprocess.run("npm install", shell=True, check=True, cwd=self.frontend_dir)
            print("✅ Frontend dependencies installed successfully")
            return True
        except subprocess.CalledProcessError as e:
            print(f"❌ Failed to install frontend dependencies: {e}")
            return False
    
    def start_backend(self):
        """Start the FastAPI backend server"""
        print("🚀 Starting backend server...")
        
        try:
            # Create generated directory if it doesn't exist
            generated_dir = self.backend_dir / "generated"
            generated_dir.mkdir(exist_ok=True)
            
            # Start the backend server
            process = subprocess.Popen([
                sys.executable, "enhanced_main.py"
            ], cwd=self.backend_dir, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
            
            self.processes.append(("Backend", process))
            
            # Wait a moment for the server to start
            time.sleep(3)
            
            if process.poll() is None:
                print("✅ Backend server started successfully")
                print("   📍 API Documentation: http://localhost:8000/docs")
                print("   📍 Health Check: http://localhost:8000/health")
                return True
            else:
                stdout, stderr = process.communicate()
                print(f"❌ Backend server failed to start:")
                print(f"   STDOUT: {stdout.decode()}")
                print(f"   STDERR: {stderr.decode()}")
                return False
                
        except Exception as e:
            print(f"❌ Failed to start backend server: {e}")
            return False
    
    def start_frontend(self):
        """Start the React frontend development server"""
        print("🚀 Starting frontend server...")
        
        try:
            process = subprocess.Popen(
                "npm start", 
                shell=True,
                cwd=self.frontend_dir, 
                stdout=subprocess.PIPE, 
                stderr=subprocess.PIPE
            )
            
            self.processes.append(("Frontend", process))
            
            # Wait a moment for the server to start
            time.sleep(5)
            
            if process.poll() is None:
                print("✅ Frontend server started successfully")
                print("   📍 Application: http://localhost:3000")
                return True
            else:
                stdout, stderr = process.communicate()
                print(f"❌ Frontend server failed to start:")
                print(f"   STDOUT: {stdout.decode()}")
                print(f"   STDERR: {stderr.decode()}")
                return False
                
        except Exception as e:
            print(f"❌ Failed to start frontend server: {e}")
            return False
    
    def stop_all_processes(self):
        """Stop all running processes"""
        print("🛑 Stopping all processes...")
        
        for name, process in self.processes:
            try:
                if process.poll() is None:  # Process is still running
                    print(f"   Stopping {name}...")
                    process.terminate()
                    
                    # Wait for graceful shutdown
                    try:
                        process.wait(timeout=5)
                    except subprocess.TimeoutExpired:
                        print(f"   Force killing {name}...")
                        process.kill()
                        process.wait()
                        
            except Exception as e:
                print(f"   Error stopping {name}: {e}")
        
        self.processes.clear()
        print("✅ All processes stopped")
    
    def monitor_processes(self):
        """Monitor running processes and restart if needed"""
        while self.running:
            for i, (name, process) in enumerate(self.processes):
                if process.poll() is not None:  # Process has terminated
                    print(f"⚠️  {name} process has stopped unexpectedly")
                    
                    # Remove the dead process
                    self.processes.pop(i)
                    
                    # Restart the process
                    if name == "Backend":
                        if not self.start_backend():
                            print(f"❌ Failed to restart {name}")
                    elif name == "Frontend":
                        if not self.start_frontend():
                            print(f"❌ Failed to restart {name}")
                    
                    break
            
            time.sleep(5)  # Check every 5 seconds
    
    def run(self):
        """Main method to start the system"""
        print("🎓 University Document Automation System")
        print("=" * 50)
        
        # Check dependencies
        if not self.check_dependencies():
            print("❌ System dependencies check failed")
            return False
        
        # Install dependencies
        if not self.install_backend_dependencies():
            print("❌ Backend dependency installation failed")
            return False
        
        if not self.install_frontend_dependencies():
            print("❌ Frontend dependency installation failed")
            return False
        
        # Start backend
        if not self.start_backend():
            print("❌ Backend startup failed")
            return False
        
        # Start frontend
        if not self.start_frontend():
            print("❌ Frontend startup failed")
            self.stop_all_processes()
            return False
        
        print("\n🎉 System started successfully!")
        print("=" * 50)
        print("📱 Frontend: http://localhost:3000")
        print("🔧 Backend API: http://localhost:8000")
        print("📚 API Docs: http://localhost:8000/docs")
        print("💚 Health Check: http://localhost:8000/health")
        print("\n💡 Press Ctrl+C to stop the system")
        print("=" * 50)
        
        # Start monitoring in a separate thread
        monitor_thread = threading.Thread(target=self.monitor_processes, daemon=True)
        monitor_thread.start()
        
        # Keep the main thread alive
        try:
            while self.running:
                time.sleep(1)
        except KeyboardInterrupt:
            print("\n🛑 Received interrupt signal")
        
        self.stop_all_processes()
        return True

def main():
    """Main entry point"""
    starter = SystemStarter()
    success = starter.run()
    
    if success:
        print("✅ System shutdown completed successfully")
    else:
        print("❌ System startup failed")
        sys.exit(1)

if __name__ == "__main__":
    main()
