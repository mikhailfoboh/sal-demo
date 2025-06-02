import React from 'react';
import Head from 'next/head';

// Import your main app component
import App from '../app/index';

export default function WebApp() {
  return (
    <>
      <Head>
        <title>Foboh Sales App</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <App />
    </>
  );
} 