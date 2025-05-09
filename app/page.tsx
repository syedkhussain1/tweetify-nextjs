'use client';

import Image from 'next/image';
import TweetGenerator from './components/TweetGenerator';

export default function Home() {
  return (
    <main className="App">
      <div className='container'>
        <TweetGenerator />
      </div>
    </main>
  )
}