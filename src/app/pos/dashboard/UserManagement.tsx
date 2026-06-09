'use client';
import { useState } from 'react';

export default function UserManagement() {
  const [users, setUsers] = useState([]); // In a real app, fetch these from /api/users

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h2 className="text-xl font-bold mb-6">Manage Staff</h2>
      
      {/* Add New User Form */}
      <form className="grid grid-cols-3 gap-4 mb-8">
        <input placeholder="Name" className="border p-2 rounded" />
        <input placeholder="Email" className="border p-2 rounded" />
        <button className="bg-blue-600 text-white rounded font-bold">Add User</button>
      </form>

      {/* User List */}
      <table className="w-full text-left">
        <thead>
          <tr className="border-b text-slate-500 text-sm">
            <th className="pb-3">Name</th>
            <th className="pb-3">Email</th>
            <th className="pb-3">Role</th>
            <th className="pb-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {/* Map your users here */}
        </tbody>
      </table>
    </div>
  );
}