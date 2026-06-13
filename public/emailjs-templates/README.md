# 📧 EmailJS Templates Directory

This directory contains HTML templates for EmailJS integration in the Porto-Fakhul portfolio.

## 📁 Files

### 1. `contact-notification.html`
**Purpose:** Notification email sent TO YOU when someone submits the contact form.

**EmailJS Template Setup:**
- **Template Name:** `Portfolio Contact Notification`
- **Subject:** `New Message from {{name}}`
- **To Email:** `fakhulrohman2@gmail.com`
- **From Name:** `{{name}}`
- **From Email:** `{{email}}`
- **Reply To:** `{{reply_to}}`

**Variables Used:**
- `{{name}}` - Visitor's name
- `{{email}}` - Visitor's email
- `{{message}}` - Message content
- `{{time}}` - Timestamp (WIB)
- `{{reply_to}}` - Reply-to email

### 2. `simple-autoreply.html`
**Purpose:** Auto-reply email sent TO VISITOR after form submission.

**EmailJS Template Setup:**
- **Template Name:** `Portfolio Auto Reply`
- **Subject:** `Thank You, {{name}}!`
- **To Email:** `{{to_email}}` ⚠️ **IMPORTANT: Must use {{to_email}}**
- **From Name:** `Fakhul Rohman`
- **From Email:** `fakhulrohman2@gmail.com`

**Variables Used:**
- `{{name}}` - Visitor's name
- `{{message}}` - Their message (echoed back)
- `{{time}}` - Timestamp (WIB)
- `{{to_email}}` - Visitor's email (auto-filled by EmailJS)

## 🚀 How to Use These Templates

### Step 1: Create Templates in EmailJS
1. Login to [EmailJS Dashboard](https://dashboard.emailjs.com)
2. Go to **Email Templates** → **Create New Template**
3. Copy HTML from the template file
4. Paste into **Code Editor** (not visual editor)
5. Configure the fields as shown above
6. Save and note the **Template ID**

### Step 2: Update Environment Variables
In your `.env` file:

```env
VITE_EMAILJS_TEMPLATE_CONTACT=template_notification_id
VITE_EMAILJS_TEMPLATE_AUTOREPLY=template_autoreply_id
```

### Step 3: Test the Templates
1. Fill contact form on your portfolio
2. Check your email (notification)
3. Check visitor's email (auto-reply)
4. Verify formatting looks correct

## 🎨 Customization Tips

### Colors
The templates use the Porto-Fakhul color palette:
- Primary: `#C68A7C` (Terracotta)
- Secondary: `#A3B19B` (Sage)
- Background: `#FDFBF7` (Sand)
- Text: `#2A2A2A` (Charcoal)

### Images
To add images:
1. Host images on a CDN or imgur
2. Use absolute URLs in `src` attributes
3. Optimize for email clients (max width: 600px)

### Responsive Design
- All templates are mobile-friendly
- Use percentage widths, not fixed pixels
- Test on multiple email clients

## 🔧 Troubleshooting

### Images not loading
- Use absolute URLs (https://)
- Some email clients block external images
- Consider using background colors instead

### Formatting issues
- Test in Gmail, Outlook, Apple Mail
- Use inline styles (email clients strip `<style>` tags)
- Avoid complex CSS (flexbox, grid)

### Variables not showing
- Check variable names match EmailJS template
- Variables are case-sensitive
- Test with sample data in EmailJS preview

## 📝 Best Practices

1. **Keep it simple** - Email clients have limited CSS support
2. **Use tables for layout** - Most reliable for email
3. **Include alt text** for accessibility
4. **Test before deploying** - Use EmailJS preview feature
5. **Monitor bounces** - Check EmailJS dashboard regularly

## 🔄 Updating Templates

1. Edit the HTML files in this directory
2. Copy updated HTML to EmailJS
3. Save and publish the template
4. Test with the contact form
5. No code changes needed (templates are server-side)

## 📚 Resources

- [EmailJS Template Documentation](https://www.emailjs.com/docs/email-templates/html-email-templates/)
- [HTML Email Development Guide](https://www.campaignmonitor.com/dev-resources/guides/coding-html-emails/)
- [Email Client CSS Support](https://www.caniemail.com/)
- [Email Testing Tools](https://litmus.com/)

---

**Last Updated:** June 13, 2026  
**Maintainer:** Fakhul Rohman  
**Email:** fakhulrohman2@gmail.com