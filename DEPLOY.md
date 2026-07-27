# Deploying to GitHub Pages

Free hosting — no credit card, no server. Takes about 5 minutes.

---

## Step 1 — Create a GitHub account
Go to https://github.com and sign up if you don't have an account.

---

## Step 2 — Create a new repository

1. Click the **+** icon in the top-right corner → **New repository**
2. Name it `noise-deleter` (or anything you like)
3. Set visibility to **Public**
4. Leave everything else as default → Click **Create repository**

---

## Step 3 — Upload the site files

On the new repository page, click **uploading an existing file**.

Upload ALL of the following files and folders:
```
noise-deleter/
├── index.html               ← main website
├── turntable.html           ← 360° assembled viewer
├── turntable-dissected.html ← exploded component viewer
├── final-report.pdf         ← embedded report
└── img/
    ├── device-exploded.png
    ├── device-front.png
    ├── device-array.png
    ├── photo-front.jpg
    ├── photo-grass.jpg
    ├── photo-top.jpg
    ├── photo-lab.jpg
    ├── photo-build.jpg
    ├── photo-breadboard.jpg
    └── photo-pcb.jpg
```

> IMPORTANT: Keep the folder structure exactly as shown above.
> The `img/` folder must be uploaded as a folder, not individual files dropped in the root.

After selecting all files, scroll down and click **Commit changes**.

---

## Step 4 — Enable GitHub Pages

1. Go to your repository → **Settings** tab
2. Scroll down to **Pages** in the left sidebar
3. Under **Source**, select **Deploy from a branch**
4. Choose branch: **main** (or **master**)
5. Folder: **/ (root)**
6. Click **Save**

---

## Step 5 — Access your site

After 1-2 minutes, your site will be live at:

```
https://YOUR-GITHUB-USERNAME.github.io/noise-deleter/
```

GitHub will show you the exact URL in the Pages settings once it's deployed.

---

## Updating the site later

To update any content, go to the file in your repository, click the **pencil icon** to edit,
make changes, and commit. Changes go live within ~1 minute.

To add videos: host them on YouTube or Vimeo and paste the embed code into `index.html`
at the relevant section. Look for the `<!-- embed video here -->` comment placeholder, or
add an `<iframe>` wherever you want the video to appear.

---

## Custom domain (optional)

If you have a domain (e.g. `noisedeleter.ca`):
1. In GitHub Pages settings → **Custom domain** → enter your domain
2. Add a `CNAME` record in your DNS provider pointing to `YOUR-USERNAME.github.io`
