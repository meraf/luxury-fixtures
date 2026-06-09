'use client';
import React, { useState, useEffect } from 'react';
import { Loader2, Trash2, UserPlus, AlertCircle, ShieldAlert } from 'lucide-react';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface UserManagementProps {
  currentUserRole?: string; // Pass 'ADMIN', 'MANAGER', or 'CASHIER' from your auth session
}

export default function UserManagement({ currentUserRole = 'ADMIN' }: UserManagementProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('CASHIER');
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isAdmin = currentUserRole === 'ADMIN';

  // --- FETCH USERS ---
  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/users');
      if (!res.ok) throw new Error('Failed to load user list');
      const data = await res.json();
      setUsers(data);
    } catch (err: any) {
      setError(err.message || 'Error loading users.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // --- ADD USER HANDLER ---
  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) {
      setError('Unauthorized: Only administrators can record new users.');
      return;
    }
    if (!name || !email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, role, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to record internal database entry.');
      }

      // Reset form fields on successful database write
      setName('');
      setEmail('');
      setPassword('');
      setRole('CASHIER');
      fetchUsers();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- DELETE USER HANDLER ---
  const handleDeleteUser = async (id: number) => {
    if (!isAdmin) {
      alert('Unauthorized: Only administrators can remove users.');
      return;
    }
    if (!confirm('Are you sure you want to remove this user entry?')) return;
    try {
      const res = await fetch(`/api/users?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Could not delete user.');
      fetchUsers();
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow border border-slate-100">
      <h2 className="text-xl font-bold mb-6 text-slate-900 flex items-center gap-2">
        Manage Users
      </h2>
      
      {/* Error Alert Display */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Conditional Add New User Form: Only rendered if logged-in account is ADMIN */}
      {isAdmin ? (
        <form onSubmit={handleAddUser} className="grid grid-cols-1 sm:grid-cols-5 gap-4 mb-8 bg-slate-50 p-4 rounded-xl border border-slate-200">
          <input 
            type="text"
            placeholder="Name" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-white border border-slate-300 p-2 rounded-lg text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-800"
            required
          />        
          <input 
            type="password"
            placeholder="Password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-white border border-slate-300 p-2 rounded-lg text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-800"
            required
          />
          <input 
            type="email"
            placeholder="Email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-white border border-slate-300 p-2 rounded-lg text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-800"
            required
          />
          <select 
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="bg-white border border-slate-300 p-2 rounded-lg text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-800"
          >
            <option value="CASHIER">Cashier</option>
            <option value="MANAGER">Manager</option>
            <option value="ADMIN">Admin</option>
          </select>
          <button 
            type="submit"
            disabled={isSubmitting}
            className="bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-bold text-sm transition-colors flex justify-center items-center gap-2 disabled:bg-slate-300 py-2"
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                <span>Add User</span>
              </>
            )}
          </button>
        </form>
      ) : (
        <div className="mb-8 p-4 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-sm flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 flex-shrink-0" />
          <span>User creation form is restricted. You must be logged in as an administrator to provision new accounts.</span>
        </div>
      )}

      {/* User List Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 text-slate-500 text-xs uppercase font-bold tracking-wider">
              <th className="pb-3 pl-2">Name</th>
              <th className="pb-3">Email</th>
              <th className="pb-3">Password</th>
              <th className="pb-3">Role</th>
              <th className="pb-3 text-right pr-2">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {isLoading ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-slate-400">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-slate-400" />
                  Loading database entries...
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-slate-400 font-medium">
                  No records found.
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 pl-2 font-bold text-slate-900">{user.name}</td>
                  <td className="py-3 text-slate-600 font-medium">{user.email}</td>
                  <td className="py-3 text-slate-400 font-mono text-xs select-none">••••••••</td>
                  <td className="py-3">
                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                      user.role === 'ADMIN' ? 'bg-red-100 text-red-700' :
                      user.role === 'MANAGER' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="py-3 text-right pr-2">
                    <button 
                      onClick={() => handleDeleteUser(user.id)}
                      disabled={!isAdmin}
                      className="text-slate-400 hover:text-red-600 disabled:opacity-30 disabled:hover:text-slate-400 transition-colors p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}