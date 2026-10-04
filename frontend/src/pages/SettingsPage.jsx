import React from 'react';
import SettingsView from '../components/settings/SettingsView';

export default function SettingsPage({ stats, onRefreshData }) {
  return (
    <div>
      <SettingsView stats={stats} onRefreshData={onRefreshData} />
    </div>
  );
}
