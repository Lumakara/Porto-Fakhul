# ⚡ Quick EmailJS Setup Guide

## 1-Minute Setup

### Step 1: Create EmailJS Account
1. Go to [emailjs.com](https://www.emailjs.com)
2. Sign up with Google (free)
3. Verify your email

### Step 2: Add Email Service
1. Dashboard → Email Services → Add New Service
2. Choose Gmail, connect your account
3. Name: `Portfolio Contact`
4. Create Service

### Step 3: Get Your Credentials
1. **Public Key:** Dashboard → Account → API Keys → Public Key
2. **Service ID:** Dashboard → Email Services → Click service → Service ID

### Step 4: Create Templates
1. **Notification Template:**
   - Name: `Portfolio Contact Notification`
   - To: `fakhulrohman2@gmail.com`
   - Subject: `New Message from {{name}}`
   - Use HTML from `public/emailjs-templates/contact-notification.html`
   - Save → Note Template ID

2. **Auto-Reply Template (Optional):**
   - Name: `Portfolio Auto Reply`
   - To: `{{to_email}}` ⚠️ **IMPORTANT**
   - Subject: `Thank you for reaching out, {{name}}! ✨`
   - Use HTML from `public/emailjs-templates/simple-autoreply.html`
   - Save → Note Template ID

### Step 5: Configure Portfolio
Create `.env` file in project root:

```env
VITE_EMAILJS_PUBLIC_KEY=your_public_key_here
VITE_EMAILJS_SERVICE_ID=your_service_id_here
VITE_EMAILJS_TEMPLATE_CONTACT=template_notification_id
VITE_EMAILJS_TEMPLATE_AUTOREPLY=template_autoreply_id
```

### Step 6: Security Settings
1. EmailJS Dashboard → Security
2. Add Allowed Origins:
   - `http://localhost:5173` (development)
   - `https://porto-fakhul.vercel.app` (production)

### Step 7: Test
```bash
npm run dev
```
Open browser → Contact section → Fill form → Check email!

## 🚨 Common Issues & Fixes

### ❌ "EmailJS is not configured"
Check `.env` file exists and has correct values.

### ❌ HTTP 403 Error
Add your domain to EmailJS Security → Allowed Origins.

### ❌ Email not received
Check spam folder. Test with different email.

### ❌ Auto-reply not working
Ensure template uses `{{to_email}}` (not fixed email).

## 📞 Need Help?
- EmailJS Docs: https://www.emailjs.com/docs/
- Portfolio Issues: https://github.com/Lumakara/Porto-Fakhul/issues
- Contact: fakhulrohman2@gmail.com

---

**⏱️ Estimated Setup Time:** 5-10 minutes  
**✅ Success Rate:** 95% with proper following  
**🎯 First Test:** Always use your own email first