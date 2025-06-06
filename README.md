# essence-tube-api

This project is a Node.js backend application designed to be hosted on Vercel Functions.

## Setup Instructions

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd essence-tube-api
   ```

2. **Install Dependencies**
   Make sure you have Node.js installed. Then run:
   ```bash
   npm install
   ```

3. **Environment Variables**
   Set up the necessary environment variables. You can create a `.env` file in the root directory with the following variables, following the `.env.template` file.

4. **Run the Application Locally**
   You can test the API locally using Vercel CLI:
   ```bash
   vercel dev
   ```

## Deployment

This project is set up for deployment on Vercel. Changes pushed to the main branch will automatically trigger the deployment process defined in the `.github/workflows/deploy-vercel.yml` file.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.
