"use client";
import React from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  
  const startChat = () => {
    router.push('/chat');
  };
  return (
    <main style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
      <h1>Welcome to GenAI</h1>
      <button onClick={startChat} style={{ marginTop: '2rem', padding: '1rem 2rem', fontSize: '1.2rem', borderRadius: '8px', border: 'none', background: '#0070f3', color: '#fff', cursor: 'pointer' }}>
        Start Chat
      </button>
    </main>
  );
}
