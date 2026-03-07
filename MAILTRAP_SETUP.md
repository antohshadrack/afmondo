# Configuring Mailtrap for Supabase Auth

By default, Supabase only allows 3 emails per hour for testing using their built-in email server, which causes rate-limiting errors when repeatedly testing signups and password changes. 

To bypass this limit, we can connect Supabase Auth to Mailtrap's Sandbox Server.

### Step 1: Get your Mailtrap Credentials
1. Create a free account at [Mailtrap](https://mailtrap.io).
2. Go to **Email Testing** (Sandbox) → **Inboxes** → **My Inbox**.
3. In the "Integration" dropdown, select **SMTP**. You will see your assigned SMTP settings (Host, Port, Username, and Password).

### Step 2: Configure Supabase
1. Go to your [Supabase Dashboard](https://supabase.com/dashboard/projects) → **Authentication** → **Providers** → **Email**.
2. Scroll to the **Custom SMTP** section and toggle **"Enable Custom SMTP"**.
3. Enter the details from Mailtrap:
   * **Host:** `sandbox.smtp.mailtrap.io`
   * **Port Number:** `2525`
   * **Username:** _(Your Mailtrap Username)_
   * **Password:** _(Your Mailtrap Password)_
   * **Sender email:** `no-reply@afmondo.com`
   * **Sender name:** `Afmondo Auth`
4. Click **Save**.

### Step 3: Test
Try signing up a new account on your Afmondo store (`http://localhost:3000/account/login`). It will no longer fail with the `email rate limit` error!

Instead of going to a real email address, the confirmation email will be caught instantly and displayed beautifully in your Mailtrap Inbox!
