import { memo } from 'react';
import { APP_NAME } from '@/constants';

/**
 * Page footer with branding, navigation links, and a newsletter signup.
 * Matches the Phantom-inspired dark theme layout.
 * 
 * @component
 */
const Footer = memo(() => {
  return (
    <footer>
      <div className="footer-left">
        <div className="footer-logo">
          <div className="footer-logo-img"></div>
          {APP_NAME}
        </div>
        <p>
          Your free guide to understanding Indian elections — from registering on the Electoral
          Roll to voting on an EVM. Powered by ECI data. Non-partisan.
        </p>
        <div className="footer-newsletter">
          <input type="email" placeholder="Enter your email" aria-label="Email for election updates" />
          <button type="button">Get Updates</button>
        </div>
      </div>

      <div className="footer-nav">
        <div className="footer-nav-col">
          <h4>Learn</h4>
          <ul>
            <li><a href="#how">How It Works</a></li>
            <li><a href="#timeline">Election Timeline</a></li>
            <li><a href="#glossary">Glossary</a></li>
            <li><a href="#quiz">Take the Quiz</a></li>
          </ul>
        </div>
        <div className="footer-nav-col">
          <h4>Voter Tools</h4>
          <ul>
            <li><a href="#pollmap">Find Polling Stations</a></li>
            <li><a href="#how">Register to Vote</a></li>
            <li><a href="#how">Check Eligibility</a></li>
            <li><a href="#how">Voter ID Rules</a></li>
          </ul>
        </div>
        <div className="footer-nav-col">
          <h4>About</h4>
          <ul>
            <li><a href="#about">Our Mission</a></li>
            <li><a href="#about">Privacy Policy</a></li>
            <li><a href="#about">Terms of Use</a></li>
            <li><a href="#about">Contact Us</a></li>
          </ul>
        </div>
        <div className="footer-nav-col">
          <h4>Follow Us</h4>
          <ul>
            <li><a href="#x">Twitter / X</a></li>
            <li><a href="#instagram">Instagram</a></li>
            <li><a href="#youtube">YouTube</a></li>
            <li><a href="#linkedin">LinkedIn</a></li>
          </ul>
        </div>
      </div>
    </footer>
  );
});

Footer.displayName = 'Footer';

export { Footer };
