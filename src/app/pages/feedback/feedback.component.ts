import { Component } from '@angular/core';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss']
})
export class FeedbackComponent {
  feedback = { email: '', comments: '', captcha: '' };
  submitted = false;
  generatedCaptcha: string = '';

  constructor() {
    this.generateCaptcha();
  }

  generateCaptcha() {
    this.generatedCaptcha = Math.random().toString(36).substring(2, 8).toUpperCase(); // Simple Random Captcha
  }

  submitFeedback() {
    if (this.feedback.captcha !== this.generatedCaptcha) {
      alert('Captcha does not match. Please try again.');
      this.generateCaptcha();
      return;
    }

    console.log('Feedback submitted:', this.feedback);
    this.submitted = true;
    this.feedback = { email: '', comments: '', captcha: '' }; // Reset Form
    this.generateCaptcha();
  }
}
