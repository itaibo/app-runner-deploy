#! /usr/bin/env node
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import { AppRunnerClient, StartDeploymentCommand, StartDeploymentCommandOutput, StartDeploymentRequest } from '@aws-sdk/client-apprunner';

// Type
type AppRunnerDeployInput = {
	region?: string;
	accessKeyId?: string;
	secretAccessKey?: string;
	serviceArn?: string;
};

type RequiredField = 'region' | 'accessKeyId' | 'secretAccessKey' | 'serviceArn';

// Parse commands
const argv: AppRunnerDeployInput = yargs(hideBin(process.argv)).argv as object;

async function main() {
	// Required fields
	const requiredFields: RequiredField[] = [
		'region',
		'accessKeyId', 'secretAccessKey', 
		'serviceArn',
	];

	// Check if requiredFields were provided
	requiredFields.forEach((requiredField: RequiredField) => {
		if (!argv[requiredField]) {
			console.log(`You must provide the --${requiredField}`);
			return process.exit(1);
		}
	});

	// Set variables
	const region = argv.region;
	const accessKeyId = argv.accessKeyId as string;
	const secretAccessKey = argv.secretAccessKey as string;
	const ServiceArn = argv.serviceArn;

	// Initialize client
	const client = new AppRunnerClient({
		region,
		credentials: {
			accessKeyId,
			secretAccessKey,
		},
	});

	// Prepare command
	const input: StartDeploymentRequest = {
		ServiceArn,
	};

	const command = new StartDeploymentCommand(input);

	// Execute command
	let response: StartDeploymentCommandOutput;

	try {
		response = await client.send(command);
	} catch (e) {
		console.log('Could not deploy app. Error:');
		console.error(e);
		return process.exit(1);
	}

	console.log('App being deployed');
	console.log('Operation ID:', response.OperationId);
	process.exit();
}

main().catch(console.error);
