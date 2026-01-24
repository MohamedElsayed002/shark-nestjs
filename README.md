<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

### Deploying to Vercel

This project is configured for deployment on Vercel. Follow these steps:

1. **Install Vercel CLI** (optional, for local testing):
   ```bash
   npm i -g vercel
   ```

2. **Set up environment variables** in Vercel Dashboard:
   - Go to your project settings in Vercel
   - Navigate to "Environment Variables"
   - Add the following required variables:
     - `MONGO_URI`: Your MongoDB connection string
     - `JWT_SECRET`: Your JWT secret key (if used)
     - Any other environment variables your app requires

3. **Deploy via Vercel Dashboard**:
   - Push your code to GitHub/GitLab/Bitbucket
   - Import the repository in Vercel
   - Vercel will automatically detect the `vercel.json` configuration
   - The build will run automatically

4. **Deploy via CLI**:
   ```bash
   vercel
   ```
   Follow the prompts to deploy. For production:
   ```bash
   vercel --prod
   ```

5. **Build Configuration**:
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

**Note**: Make sure your MongoDB database is accessible from the internet (not just localhost) for Vercel to connect to it.

### Other Deployment Options

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).

Reviewing the project structure to understand the setup.


[3 tools called]


Reviewing `vercel.json` and `main.ts` to configure Vercel deployment:


[2 tools called]


Updating configuration for Vercel: modifying `main.ts` to export the app instance and updating `vercel.json` accordingly.


[2 tools called]


Updating `main.ts` and `vercel.json` for Vercel:


[2 tools called]


Creating the `api` directory and handler for Vercel:


[2 tools called]


Revising the approach. Creating the `api` directory structure for Vercel:


[2 tools called]


Creating a proper Vercel handler. Creating the `api` directory and updating the configuration:


[3 tools called]


Improving the API handler and checking for issues:


[2 tools called]


Creating a `.vercelignore` file and a deployment guide:


[1 tool called]


Improving the API handler and adding deployment documentation:


[2 tools called]


Verifying the setup is correct. Checking `src/main.ts` for proper exports:


[1 tool called]


Checking TypeScript configuration to ensure exports are compatible:


[1 tool called]


TypeScript is configured for ES modules (`nodenext`). Updating the API handler to use dynamic import for ES modules:


[1 tool called]


## Summary

Configured your NestJS project for Vercel deployment:

### Changes made

1. Updated `src/main.ts`:
   - Exported the `bootstrap` function for Vercel
   - Maintained local development functionality
   - Added app initialization for serverless environments

2. Created `api/index.js`:
   - Vercel serverless function handler
   - Caches the NestJS app instance
   - Uses dynamic import for ES module compatibility

3. Updated `vercel.json`:
   - Configured build settings
   - Set up routing to forward all requests to the API handler

4. Updated `README.md`:
   - Added Vercel deployment instructions

### Next steps to deploy

1. Set environment variables in Vercel:
   - `MONGO_URI` — MongoDB connection string
   - `JWT_SECRET` — JWT secret (if used)
   - Other variables your app needs

2. Deploy:
   - Option A: Via Vercel Dashboard
     - Push code to GitHub/GitLab/Bitbucket
     - Import repository in Vercel
     - Vercel will auto-detect the configuration
   - Option B: Via CLI
     ```bash
     npm i -g vercel
     vercel
     ```

### Important notes

- Make sure your MongoDB database is accessible from the internet (not just localhost)
- The build command `npm run build` will compile your TypeScript to the `dist` folder
- All routes are forwarded to `/api`, which serves your NestJS application

The project is ready to deploy. Configure environment variables and deploy.