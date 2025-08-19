'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

interface CustomerProfile {
  custID: number;
  username: string;
  firstName: string;
  lastName: string;
  address?: string;
  mobilePhone?: string;
  gender?: string;
  email?: string;
  imageFile?: string;
  birthdate?: string;
  status?: boolean;
  message?: string;
}

export default function ProfilePage() {
  const { id } = useParams();
  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      setLoading(true);
      setError(null);

      try {
        // Replace with your JWT token logic
        const token = localStorage.getItem('token');
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/profile/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (!data.status) {
          setError(data.message || 'Failed to fetch profile');
        } else {
          setProfile(data);
        }
      } catch (err) {
        setError('Network error');
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchProfile();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!profile) return <div>No profile found.</div>;

  return (
    <div className="max-w-xl mx-auto mt-8 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">User Profile</h2>
      <div className="flex items-center mb-4">
        {profile.imageFile ? (
          <img
            src={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/customer/image/${profile.imageFile}`}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover mr-4"
          />
        ) : (
          <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center mr-4">
            <span className="text-gray-500">No Image</span>
          </div>
        )}
        <div>
          <div className="font-semibold">{profile.firstName} {profile.lastName}</div>
          <div className="text-gray-600">@{profile.username}</div>
        </div>
      </div>
      <div className="mb-2"><strong>Email:</strong> {profile.email || '-'}</div>
      <div className="mb-2"><strong>Mobile:</strong> {profile.mobilePhone || '-'}</div>
      <div className="mb-2"><strong>Gender:</strong> {profile.gender || '-'}</div>
      <div className="mb-2"><strong>Birthdate:</strong> {profile.birthdate || '-'}</div>
      <div className="mb-2"><strong>Address:</strong> {profile.address || '-'}</div>
    </div>
  );
}