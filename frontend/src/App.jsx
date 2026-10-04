import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from './components/layout/Sidebar';
import Navbar from './components/layout/Navbar';
import DashboardPage from './pages/DashboardPage';
import StudentsPage from './pages/StudentsPage';
import AddStudentPage from './pages/AddStudentPage';
import SearchPage from './pages/SearchPage';
import SettingsPage from './pages/SettingsPage';
import StudentDetailsModal from './components/students/StudentDetailsModal';
import { getDashboardStats } from './api/studentApi';
import { NotificationProvider } from './context/NotificationContext';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [stats, setStats] = useState(null);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [viewingStudent, setViewingStudent] = useState(null);

  // Load dashboard aggregated statistics
  const fetchStats = useCallback(async () => {
    setIsLoadingStats(true);
    try {
      const res = await getDashboardStats();
      if (res.success) {
        setStats(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch dashboard stats:', err);
    } finally {
      setIsLoadingStats(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const handleStudentCreated = (newStudent) => {
    fetchStats();
    setActiveTab('students');
  };

  const handleDataModified = () => {
    fetchStats();
  };

  return (
    <NotificationProvider>
      <div className="min-h-screen bg-slate-50 flex">
        {/* Navigation Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
          stats={stats}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 lg:pl-64 transition-all duration-300">
          {/* Top Navbar */}
          <Navbar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onOpenSidebar={() => setIsSidebarOpen(true)}
            searchQuery={searchQuery}
            setSearchQuery={(q) => {
              setSearchQuery(q);
              if (activeTab !== 'search') setActiveTab('search');
            }}
          />

          {/* Main Page View */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            {activeTab === 'dashboard' && (
              <DashboardPage
                stats={stats}
                isLoading={isLoadingStats}
                onViewStudent={(student) => setViewingStudent(student)}
                onNavigateToStudents={() => setActiveTab('students')}
                onNavigateToAddStudent={() => setActiveTab('add-student')}
              />
            )}

            {activeTab === 'students' && (
              <StudentsPage
                onNavigateToAddStudent={() => setActiveTab('add-student')}
                onDataModified={handleDataModified}
              />
            )}

            {activeTab === 'add-student' && (
              <AddStudentPage
                onNavigateToStudents={() => setActiveTab('students')}
                onStudentCreated={handleStudentCreated}
              />
            )}

            {activeTab === 'search' && (
              <SearchPage
                initialQuery={searchQuery}
                onNavigateToAddStudent={() => setActiveTab('add-student')}
                onDataModified={handleDataModified}
              />
            )}

            {activeTab === 'settings' && (
              <SettingsPage
                stats={stats}
                onRefreshData={handleDataModified}
              />
            )}
          </main>

          {/* Footer */}
          <footer className="py-4 px-6 border-t border-slate-200/80 bg-white text-center text-xs text-slate-500">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 max-w-7xl mx-auto">
              <span>
                <strong>Student Management Portal</strong> • Virtual Internship Capstone Project
              </span>
              <span className="text-slate-400">
                Built with React, Express, and Relational SQLite
              </span>
            </div>
          </footer>
        </div>

        {/* Global Student Profile Modal (Accessible from Dashboard recent table) */}
        <StudentDetailsModal
          isOpen={Boolean(viewingStudent)}
          onClose={() => setViewingStudent(null)}
          student={viewingStudent}
          onEdit={() => {
            setViewingStudent(null);
            setActiveTab('students');
          }}
        />
      </div>
    </NotificationProvider>
  );
}
