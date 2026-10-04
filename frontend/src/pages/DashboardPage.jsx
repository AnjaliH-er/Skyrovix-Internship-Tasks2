import React from 'react';
import { Users, UserCheck, UserX, Clock, ArrowRight, Plus } from 'lucide-react';
import StatCard from '../components/dashboard/StatCard';
import QuickStats from '../components/dashboard/QuickStats';
import RecentStudentsTable from '../components/dashboard/RecentStudentsTable';
import { StatCardSkeleton } from '../components/common/LoadingSkeleton';

export default function DashboardPage({ 
  stats, 
  isLoading, 
  onViewStudent, 
  onNavigateToStudents, 
  onNavigateToAddStudent 
}) {
  const total = stats?.totalStudents ?? 0;
  const active = stats?.activeStudents ?? 0;
  const inactive = stats?.inactiveStudents ?? 0;
  const recent = stats?.recentlyAddedCount ?? 0;

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-700 via-indigo-600 to-indigo-800 p-6 sm:p-8 text-white shadow-lg shadow-indigo-600/15">
        <div className="relative z-10 max-w-2xl">
          <span className="inline-block px-3 py-1 rounded-full bg-white/15 backdrop-blur-sm text-xs font-semibold uppercase tracking-wider text-indigo-100 mb-3">
            Academic Registry Dashboard
          </span>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-white leading-tight">
            Student Management Portal
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-indigo-100 leading-relaxed max-w-xl">
            Streamlined student administration, enrollment tracking, dynamic record search, and academic reporting.
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-5">
            <button
              onClick={onNavigateToAddStudent}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-white text-indigo-700 hover:bg-indigo-50 font-semibold text-xs sm:text-sm rounded-xl shadow-md transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Enroll New Student</span>
            </button>

            <button
              onClick={onNavigateToStudents}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-800/60 hover:bg-indigo-800/80 text-white font-semibold text-xs sm:text-sm rounded-xl border border-white/20 transition-all"
            >
              <span>Explore All Records</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Decorative background shapes */}
        <div className="absolute right-[-40px] bottom-[-40px] w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="absolute right-20 top-[-30px] w-48 h-48 rounded-full bg-indigo-400/20 blur-xl pointer-events-none" />
      </div>

      {/* 4 Core Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {isLoading ? (
          <>
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </>
        ) : (
          <>
            <StatCard
              title="Total Students"
              value={total}
              subtitle="Registered academic records"
              icon={Users}
              color="indigo"
              trend="100% of registry"
              onClick={onNavigateToStudents}
            />

            <StatCard
              title="Active Students"
              value={active}
              subtitle="Currently enrolled & active"
              icon={UserCheck}
              color="emerald"
              trend={total > 0 ? `${Math.round((active / total) * 100)}% active` : '0%'}
              onClick={onNavigateToStudents}
            />

            <StatCard
              title="Inactive Students"
              value={inactive}
              subtitle="Suspended or archived"
              icon={UserX}
              color="rose"
              trend={total > 0 ? `${Math.round((inactive / total) * 100)}% of total` : '0%'}
              onClick={onNavigateToStudents}
            />

            <StatCard
              title="Recently Added"
              value={recent}
              subtitle="Newest batch admissions"
              icon={Clock}
              color="sky"
              trend="Latest"
              onClick={onNavigateToStudents}
            />
          </>
        )}
      </div>

      {/* Visual Analytics & Distribution */}
      <QuickStats
        departmentStats={stats?.departmentStats || []}
        yearStats={stats?.yearStats || []}
        genderStats={stats?.genderStats || []}
        totalStudents={total}
      />

      {/* Recently Added Students Table */}
      <RecentStudentsTable
        students={stats?.recentStudents || []}
        onViewStudent={onViewStudent}
        onViewAll={onNavigateToStudents}
      />
    </div>
  );
}
