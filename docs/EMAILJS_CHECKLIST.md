# ✅ EmailJS Setup Checklist

Use this checklist to ensure your EmailJS integration is properly configured and working.

## 🔧 Pre-Setup Requirements

### Account & Services
- [ ] EmailJS account created (free tier)
- [ ] Email service added (Gmail/other)
- [ ] Service is active and connected

### Portfolio Application
- [ ] Portfolio is running locally/production
- [ ] Contact form section is accessible
- [ ] Console logs are visible (F12 → Console)

## 📋 Environment Configuration

### .env File
- [ ] `.env` file exists in project root
- [ ] File contains all required variables:
  - [ ] `VITE_EMAILJS_PUBLIC_KEY`
  - [ ] `VITE_EMAILJS_SERVICE_ID`
  - [ ] `VITE_EMAILJS_TEMPLATE_CONTACT`
  - [ ] `VITE_EMAILJS_TEMPLATE_AUTOREPLY` (optional)

### Variable Values
- [ ] Public Key starts with `user_`
- [ ] Service ID starts with `service_`
- [ ] Template IDs start with `template_`
- [ ] No extra spaces or quotes in values

## 🎨 Email Templates

### Notification Template (To You)
- [ ] Template created in EmailJS dashboard
- [ ] Template name: `Portfolio Contact Notification`
- [ ] **To Email:** `fakhulrohman2@gmail.com`
- [ ] **From Name:** `{{name}}`
- [ ] **From Email:** `{{email}}`
- [ ] **Reply To:** `{{reply_to}}`
- [ ] **Subject:** `New Message from {{name}}`
- [ ] HTML content added (from template)
- [ ] Template is **Published** (not draft)

### Auto-Reply Template (To Visitor) - Optional
- [ ] Template created in EmailJS dashboard
- [ ] Template name: `Portfolio Auto Reply`
- [ ] **To Email:** `{{to_email}}` ⚠️ **CRITICAL**
- [ ] **From Name:** `Fakhul Rohman`
- [ ] **From Email:** `fakhulrohman2@gmail.com`
- [ ] **Subject:** `Thank you for reaching out, {{name}}! ✨`
- [ ] HTML content added (from template)
- [ ] Template is **Published** (not draft)

## 🔒 Security Configuration

### Allowed Origins
- [ ] Local development: `http://localhost:5173`
- [ ] Production: `https://porto-fakhul.vercel.app`
- [ ] Any other domains used

### Rate Limits
- [ ] Checked monthly email limit (200 on free tier)
- [ ] Usage monitoring enabled

## 🧪 Testing Procedure

### Step 1: Initial Test
- [ ] Restart development server
- [ ] Navigate to contact form
- [ ] Fill test data:
  - Name: `Test User`
  - Email: `your-real-email@gmail.com`
  - Message: `This is a test message`
- [ ] Submit form

### Step 2: Console Verification
- [ ] Console shows "Initialising EmailJS transport…"
- [ ] Console shows "→ Sending notification to fakhulrohman2@gmail.com…"
- [ ] Console shows "✓ Notification delivered (HTTP 200)"
- [ ] If auto-reply enabled: "→ Sending auto-reply to…"
- [ ] No error messages in console

### Step 3: Email Delivery Check
- [ ] **Your Inbox:** Received notification email
- [ ] **Your Spam:** Check spam/junk folder
- [ ] **Visitor Email:** Received auto-reply (if enabled)
- [ ] Email formatting looks correct
- [ ] All variables populated correctly

### Step 4: Error Scenarios
- [ ] Test with invalid email format (should show validation error)
- [ ] Test with empty fields (should show validation errors)
- [ ] Test with very long message (should be truncated)
- [ ] Test network offline (should show network error)

## 📊 Monitoring Setup

### EmailJS Dashboard
- [ ] Activity Log accessible
- [ ] Usage statistics visible
- [ ] Error logs monitored

### Application Logs
- [ ] Console logs show detailed progress
- [ ] Error messages are descriptive
- [ ] Status indicators work (success/error)

## 🚀 Production Readiness

### Before Deployment
- [ ] Test on production domain
- [ ] Update allowed origins in EmailJS
- [ ] Verify SSL certificate (https)
- [ ] Test with multiple email providers

### Post-Deployment
- [ ] Monitor first 24 hours of usage
- [ ] Check EmailJS activity log daily
- [ ] Test contact form weekly
- [ ] Update templates as needed

## 🔄 Maintenance Schedule

### Weekly
- [ ] Check EmailJS usage statistics
- [ ] Test contact form functionality
- [ ] Review error logs

### Monthly
- [ ] Verify email limits not exceeded
- [ ] Update templates if needed
- [ ] Review security settings

### Quarterly
- [ ] Test with new email clients
- [ ] Update documentation
- [ ] Review integration code

## 🆘 Troubleshooting Guide

### Common Issues & Solutions

#### ❌ "EmailJS is not configured"
- [ ] Check `.env` file exists
- [ ] Verify variable names are correct
- [ ] Restart development server

#### ❌ "HTTP 400/403 Error"
- [ ] Check allowed origins in EmailJS
- [ ] Verify template IDs are correct
- [ ] Ensure templates are published

#### ❌ "Email not received"
- [ ] Check spam/junk folder
- [ ] Verify email service is connected
- [ ] Test with different email address

#### ❌ "Auto-reply not sending"
- [ ] Check `VITE_EMAILJS_TEMPLATE_AUTOREPLY` is set
- [ ] Verify template uses `{{to_email}}`
- [ ] Check visitor email is valid

#### ❌ "Variables not showing"
- [ ] Check variable names match template
- [ ] Test with EmailJS preview feature
- [ ] Verify template is using correct variables

## 📝 Documentation

### Files to Review
- [ ] `docs/EMAILJS_SETUP_GUIDE.md`
- [ ] `docs/MANUAL_SETUP.md`
- [ ] `public/emailjs-templates/README.md`
- [ ] `.env.example`

### Code References
- [ ] `src/config/email.ts`
- [ ] `src/lib/emailService.ts`
- [ ] `src/sections/Contact.tsx`

## ✅ Final Verification

### Complete Setup
- [ ] All checkboxes above are checked
- [ ] Contact form sends emails successfully
- [ ] Auto-reply works (if enabled)
- [ ] Error handling works properly
- [ ] Console logs are informative
- [ ] Email formatting is correct

### User Experience
- [ ] Form validation works
- [ ] Loading states are visible
- [ ] Success/error messages are clear
- [ ] No JavaScript errors in console

### Performance
- [ ] Emails send within 5 seconds
- [ ] No impact on page performance
- [ ] Works with slow network

---

**Checklist Status:**  
Date Completed: _______________  
Tested By: ____________________  
Notes: _________________________

---

**Support Contacts:**  
- EmailJS Support: https://www.emailjs.com/contact/
- Portfolio Issues: https://github.com/Lumakara/Porto-Fakhul/issues
- Developer: fakhulrohman2@gmail.com