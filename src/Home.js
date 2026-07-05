import React from 'react';
import { Link } from 'react-router-dom';
import './App.css';

const steps = [
  {
    title: 'Choose a service',
    body: 'Browse what each doctor offers and how long a visit takes.'
  },
  {
    title: 'Pick an open slot',
    body: 'See real availability for that doctor, 30 minutes at a time.'
  },
  {
    title: 'Confirm instantly',
    body: 'Your slot is held the moment you book it — no calls, no waiting on hold.'
  }
];

const Home = () => {
  return (
    <>
      <section className="hero-section">
        <div className="hero-content">
          <span className="hero-eyebrow">Online booking, not a hold queue</span>
          <h1>See a doctor without the hold music.</h1>
          <p>Pick a service, see real-time availability, and reserve your slot online — no phone calls required.</p>
          <div className="hero-actions">
            <Link to="/service" className="btn btn-primary">Browse services</Link>
            <Link to="/register" className="btn btn-secondary">Create an account</Link>
          </div>
        </div>
        <div className="hero-media">
          <img src="/hero-illustration.svg" alt="Availability calendar showing bookable time slots" />
        </div>
      </section>

      <section className="steps-section">
        <h2>How booking works</h2>
        <div className="steps-board">
          {steps.map((step, i) => (
            <div className="step-row" key={step.title}>
              <span className="step-index">{String(i + 1).padStart(2, '0')}</span>
              <div>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default Home;