# Resonate - Sonic Therapy App

A scientific and pseudo-scientific soundscape generator built with React, Web Audio API, and Tailwind CSS.

## 🚀 Running Locally

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Start Development Server**:
    ```bash
    npm run dev
    ```
    Open the URL shown in your terminal (usually http://localhost:5173).

## 📦 Building for Production

To create a static build (HTML/CSS/JS) for deployment:

```bash
npm run build
```
The output will be in the `dist/` folder.

## 🌐 Deploying to GitHub Pages

You can automate deployment using GitHub Actions.

1.  Commit this code to a GitHub repository.
2.  Ensure the `.github/workflows/deploy.yml` file exists (see below).
3.  Go to your repository **Settings** > **Pages**.
4.  Under "Build and deployment", select **Source: GitHub Actions**.
5.  Push your changes. GitHub will automatically build and publish the site.

## 🛠 Configuration Details

-   **Vite**: Used as the bundler. Configuration is in `vite.config.ts`. `base: './'` is set to ensure assets load correctly on sub-paths (like `username.github.io/repo-name`).
-   **Tailwind**: Currently loaded via CDN for simplicity in `index.html`.
-   **Audio**: Uses the native Web Audio API. No external audio files are required; all sounds are synthesized in real-time.
