# app-runner-deploy

A npx command to deploy your apps in AWS's App Runner

## Usage
```bash
npx app-runner-deploy@latest \
  --region AWS_AR_REGION \
  --accessKeyId AWS_AR_ACCESS_KEY_ID \
  --secretAccessKey AWS_AR_SECRET_ACCESS_KEY \
  --serviceArn AWS_AR_SERVICE_ARN
```

## Why? Monorepos
When using a monorepo, on every push to your repository, AWS App Runner will deploy your app, even if nothing has changed in it.

With `app-runner-deploy`, you can now use GitHub Actions to just deploy your app whenever it has changed.

## Example using GitHub Actions
This is a example of how you can create a GitHub Action, using secrets.

In this example, the deployment depends on the "API CI" GitHub Action to be completed successfully.

```yml
name: API CD
on:
  workflow_run:
    workflows: ["API CI"]
    branches: [main]
    types: 
      - completed

jobs:
  build:
    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [18.x]

    steps:
      - uses: actions/checkout@v3
      - name: Use Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v3
        with:
          node-version: ${{ matrix.node-version }}
      - run: |
          npx app-runner-deploy@latest \
          --region "${{ secrets.AWS_REGION }}" \
          --accessKeyId "${{ secrets.AWS_ACCESS_KEY_ID }}" \
          --secretAccessKey "${{ secrets.AWS_SECRET_ACCESS_KEY }}" \
          --serviceArn "${{ secrets.AWS_SERVICE_ARN }}"
```

> Remember: You need to configure your AWS App Runner to be deployed manually

## People
The original author of app-runner-deploy is [itaibo](https://github.com/itaibo)
