# How to Use Google SMTP (Gmail)

To send emails securely from your Next.js app using your Gmail account, you need to use a **Google App Password**. This allows the app to send emails on your behalf without requiring your actual Gmail login password, bypassing 2-Step Verification securely.

### Step 1: Create an App Password
1. Go to your Google Account management page: [myaccount.google.com](https://myaccount.google.com)
2. In the left navigation panel, click on **Security**.
3. Under the "How you sign in to Google" section, ensure **2-Step Verification is turned ON** (required for App Passwords).
4. Click on **2-Step Verification** (you may need to sign in again).
5. Scroll all the way to the bottom and click on **App passwords**.
6. Set the App name to "Afmondo Store" and click **Create**.
7. Google will show you a 16-character code in a yellow box. **Copy this code**.

### Step 2: Update your Environment Variables
1. Open your `.env.local` file.
2. Replace `your_google_email@gmail.com` with your actual Gmail address.
3. Replace `your_google_app_password` with the 16-character code you just copied (don't include spaces).
4. **Restart your Next.js development server**.

Once you do this, any guest checking out with an email will immediately receive a digital receipt straight from your official Gmail!
