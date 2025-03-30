# Employee Assist Frontend

This is the frontend application for Employee Assist, built with React and TypeScript.

## Repository Access Methods

### HTTPS Method

1. Generate a Personal Access Token (PAT) on GitHub:

   - Go to GitHub.com → Settings → Developer Settings → Personal Access Tokens → Tokens (classic)
   - Click "Generate new token (classic)"
   - Give it a name (e.g., "Employee Assist Frontend")
   - Select scopes: at minimum, select "repo" for full repository access
   - Click "Generate token"
   - **IMPORTANT**: Copy the token immediately as you won't be able to see it again

2. Set up the repository with HTTPS:
   ```bash
   git remote set-url origin https://username:<your-token>@github.com/yazdan-learning/employee-assist-fe.git
   ```
   Replace `username` with your GitHub username and `<your-token>` with the token you generated.

### SSH Method

1. Generate SSH Key (if you don't have one):

   ```bash
   ssh-keygen -t ed25519 -C "your_email@example.com"
   ```

   Press Enter to accept the default file location and enter a passphrase if desired.

2. Add SSH Key to GitHub:

   - Copy your public key:
     ```bash
     cat ~/.ssh/id_ed25519.pub
     ```
   - Go to GitHub.com → Settings → SSH and GPG keys → New SSH key
   - Give it a title and paste your public key
   - Click "Add SSH key"

3. Set up the repository with SSH:
   ```bash
   git remote set-url origin git@github.com:yazdan-learning/employee-assist-fe.git
   ```

## Getting Started

1. Clone the repository:

   ```bash
   git clone https://github.com/yazdan-learning/employee-assist-fe.git
   # or
   git clone git@github.com:yazdan-learning/employee-assist-fe.git
   ```

2. Install dependencies:

   ```bash
   cd emloyee-assist-fe
   npm install
   ```

3. Start the development server:

   ```bash
   npm start
   ```

4. Build for production:
   ```bash
   npm run build
   ```

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App

## Project Structure

```
src/
  ├── assets/          # Static assets (images, styles, etc.)
  ├── components/      # Reusable components
  ├── pages/          # Page components
  ├── services/       # API services
  ├── slices/         # Redux slices
  ├── utils/          # Utility functions
  └── App.tsx         # Main application component
```

## Contributing

1. Create a new branch for your feature:

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes and commit them:

   ```bash
   git add .
   git commit -m "Description of your changes"
   ```

3. Push your changes:

   ```bash
   git push origin feature/your-feature-name
   ```

4. Create a Pull Request on GitHub

## License

This project is licensed under the MIT License - see the LICENSE file for details.
