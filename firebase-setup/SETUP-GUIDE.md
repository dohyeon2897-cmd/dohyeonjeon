# One-time setup: Firebase (Auth + Firestore)

You log in with your existing Google account — no new signup, no credit
card. After this one-time setup, `admin.html` is your permanent posting tool.

---

## Step 1 — Create the Firebase project

1. Go to https://console.firebase.google.com and sign in with your Google account.
2. Click **Add project** (or **Create a project**).
3. Name it anything, e.g. `dohyeonjeon-site` → Continue.
4. It'll ask about Google Analytics — you can **turn it off** (not needed here) → Create project.
5. Wait for it to finish, then **Continue**.

## Step 2 — Turn on Firestore (the database)

1. Left sidebar → **Build → Firestore Database**.
2. Click **Create database**.
3. Choose a location close to you (e.g. `asia-northeast3 (Seoul)` if offered, otherwise any nearby region) → Next.
4. Choose **Start in production mode** → Create.

## Step 3 — Set the security rules

1. Still in Firestore, click the **Rules** tab at the top.
2. Delete everything in the box and paste in the contents of
   `firebase-setup/firestore.rules` (included in this download).
3. Click **Publish**.

   This makes posts publicly readable (so your Info page works for
   everyone) but only writable/deletable by someone signed in — i.e. you,
   from `admin.html`.

## Step 4 — Turn on sign-in (Authentication)

1. Left sidebar → **Build → Authentication** → **Get started**.
2. Under **Sign-in method**, click **Email/Password** → enable the first
   toggle → **Save**.
3. Go to the **Users** tab (next to Sign-in method) → **Add user**.
4. Enter the email and password you want to log into `admin.html` with
   (can be your own email — this is separate from your main Google
   password, so pick a fresh one) → **Add user**.

## Step 5 — Register a Web App and get your config

1. Click the **⚙ gear icon** (top left, next to "Project Overview") →
   **Project settings**.
2. Scroll down to **Your apps** → click the **</>** (Web) icon.
3. Give it a nickname (anything) → **Register app**.
4. Do **not** set up Firebase Hosting — just skip that step.
5. You'll see a code block with a `firebaseConfig = { ... }` object. Copy
   the whole thing.

## Step 6 — Paste the config into your site files

Open these two files (plain text, editable right on GitHub):
- `admin.html`
- `insights.html`

In each, find this block near the top of the `<script>` section:

```js
var firebaseConfig = {
  apiKey: "PASTE_YOUR_API_KEY",
  authDomain: "PASTE_YOUR_PROJECT.firebaseapp.com",
  projectId: "PASTE_YOUR_PROJECT_ID",
  storageBucket: "PASTE_YOUR_PROJECT.appspot.com",
  messagingSenderId: "PASTE_YOUR_SENDER_ID",
  appId: "PASTE_YOUR_APP_ID"
};
```

Replace the whole block with the one you copied in Step 5 (keep the `var
firebaseConfig =` part, just swap in your real values). Commit the change
on GitHub — or send me the copied config and I'll drop it into both files
and hand you the finished versions.

## Step 7 — Authorize your domain

1. Back in Firebase Console → **Authentication → Settings → Authorized domains**.
2. Check that `dohyeonjeon.com` is listed. If not, **Add domain** and add it.
   (`localhost` is there by default, which is fine to leave.)

## Step 8 — Test it

1. Upload the updated files to GitHub as usual.
2. Visit `dohyeonjeon.com/admin.html` → sign in with the email/password from Step 4.
3. Write a test post → **Publish**.
4. Visit `dohyeonjeon.com/insights.html` → your post should be there.

---

### Notes

- `admin.html` isn't linked anywhere in your site's navigation, but it's
  not truly hidden — anyone who finds the URL can open the page. That's
  fine: they still can't publish or delete anything without signing in
  with the email/password from Step 4, and that check happens on
  Google's servers, not in the page itself.
- The `firebaseConfig` values (apiKey, etc.) are meant to be visible in
  your site's code — that's normal for Firebase. They just identify which
  project to talk to; they don't grant write access by themselves. The
  actual protection is the Firestore rule from Step 3 plus the sign-in
  from Step 4.
- Firestore's free (Spark) tier gives 50,000 reads and 20,000 writes per
  day at no cost, no card required — far more than a personal site needs.
- To add more admin users later, repeat Step 4's "Add user" for each
  person.
