"use client";
import { useAuthStore } from '@/store/authStore';

export default function AccountPage() {
  const { user } = useAuthStore();

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Profile Information</h1>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-500">Name</label>
          <p className="text-lg font-medium text-gray-900">{user?.name}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-500">Email</label>
          <p className="text-lg font-medium text-gray-900">{user?.email}</p>
        </div>
      </div>
    </div>
  );
}
