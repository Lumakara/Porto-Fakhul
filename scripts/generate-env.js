#!/usr/bin/env node

/**
 * EmailJS Environment File Generator
 * Run: node scripts/generate-env.js
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const questions = [
  {
    name: 'publicKey',
    question: 'Enter EmailJS Public Key (user_xxxxxxxx): ',
    validate: (val) => val.startsWith('user_')
  },
  {
    name: 'serviceId',
    question: 'Enter EmailJS Service ID (service_xxxxxx): ',
    validate: (val) => val.startsWith('service_')
  },
  {
    name: 'templateContact',
    question: 'Enter Notification Template ID (template_xxxxxx): ',
    validate: (val) => val.startsWith('template_')
  },
  {
    name: 'templateAutoReply',
    question: 'Enter Auto-Reply Template ID (template_yyyyyy) [optional, press Enter to skip]: ',
    validate: (val) => !val || val.startsWith('template_')
  }
];

async function askQuestion(questionObj) {
  return new Promise((resolve) => {
    rl.question(questionObj.question, (answer) => {
      if (questionObj.validate && !questionObj.validate(answer.trim())) {
        console.log(`❌ Invalid format. Expected: ${questionObj.validate.toString()}`);
        resolve(askQuestion(questionObj));
      } else {
        resolve(answer.trim());
      }
    });
  });
}

async function main() {
  console.log('\n📧 EmailJS Environment File Generator');
  console.log('=====================================\n');
  
  console.log('ℹ️  Get your credentials from EmailJS dashboard:\n');
  console.log('1. Public Key: Dashboard → Account → API Keys → Public Key');
  console.log('2. Service ID: Dashboard → Email Services → Your Service → Service ID');
  console.log('3. Template IDs: Dashboard → Email Templates → Your Templates → Template ID\n');
  
  const answers = {};
  
  for (const q of questions) {
    answers[q.name] = await askQuestion(q);
  }
  
  const envContent = `# EmailJS Configuration
VITE_EMAILJS_PUBLIC_KEY=${answers.publicKey}
VITE_EMAILJS_SERVICE_ID=${answers.serviceId}
VITE_EMAILJS_TEMPLATE_CONTACT=${answers.templateContact}
${answers.templateAutoReply ? `VITE_EMAILJS_TEMPLATE_AUTOREPLY=${answers.templateAutoReply}` : '# VITE_EMAILJS_TEMPLATE_AUTOREPLY='}

# Development Notes
# 1. Restart dev server after updating this file
# 2. Check console logs for debugging
# 3. Test with real email addresses
# 4. Monitor EmailJS dashboard for usage

# Security Configuration
# Add these domains to EmailJS Security → Allowed Origins:
# - http://localhost:5173
# - https://porto-fakhul.vercel.app
`;
  
  const envPath = path.join(process.cwd(), '.env');
  
  if (fs.existsSync(envPath)) {
    console.log(`\n⚠️  .env file already exists at: ${envPath}`);
    const overwrite = await askQuestion({
      question: 'Overwrite existing file? (y/n): ',
      validate: (val) => ['y', 'n', 'yes', 'no'].includes(val.toLowerCase())
    });
    
    if (!['y', 'yes'].includes(overwrite.toLowerCase())) {
      console.log('❌ Operation cancelled.');
      rl.close();
      return;
    }
  }
  
  fs.writeFileSync(envPath, envContent);
  
  console.log('\n✅ .env file created successfully!');
  console.log(`📁 Location: ${envPath}\n`);
  
  console.log('📋 Next Steps:');
  console.log('==============');
  console.log('1. Restart development server:');
  console.log('   npm run dev\n');
  console.log('2. Test the contact form:');
  console.log('   - Go to Contact section');
  console.log('   - Fill out the form');
  console.log('   - Check your email\n');
  console.log('3. Configure EmailJS Security:');
  console.log('   - Login to EmailJS dashboard');
  console.log('   - Go to Security → Allowed Origins');
  console.log('   - Add: http://localhost:5173\n');
  console.log('🔗 Helpful Links:');
  console.log('================');
  console.log('• EmailJS Dashboard: https://dashboard.emailjs.com');
  console.log('• Setup Guide: docs/EMAILJS_SETUP_GUIDE.md');
  console.log('• Troubleshooting: docs/EMAILJS_SETUP_GUIDE.md#troubleshooting\n');
  
  if (!answers.templateAutoReply) {
    console.log('ℹ️  Note: Auto-reply is disabled (template not set)');
    console.log('   Visitors will not receive confirmation emails.\n');
  }
  
  rl.close();
}

main().catch(console.error);