import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, PutCommand } from '@aws-sdk/lib-dynamodb';

// Log environment variables (without sensitive data)
console.log('AWS Region:', import.meta.env.VITE_AWS_REGION);
console.log('AWS Access Key ID exists:', !!import.meta.env.VITE_AWS_ACCESS_KEY_ID);

const client = new DynamoDBClient({
  region: import.meta.env.VITE_AWS_REGION,
  credentials: {
    accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID as string,
    secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY as string,
  },
});

const docClient = DynamoDBDocumentClient.from(client, {
  marshallOptions: {
    removeUndefinedValues: true,
  },
});

const TABLE_NAME = 'remo_users';

export interface UserData {
  userId: string;  // This will be the wallet address or unique identifier
  username: string;
  createdAt: number;
  updatedAt: number;
}

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const dynamoDBService = {
  async getUserData(userId: string): Promise<UserData | null> {
    try {
      console.log('Fetching user data for:', userId);
      const command = new GetCommand({
        TableName: TABLE_NAME,
        Key: { userId },
      });

      // Add retry logic for table being created
      let retries = 3;
      while (retries > 0) {
        try {
          const response = await docClient.send(command);
          console.log('DynamoDB response:', response);
          return response.Item as UserData || null;
        } catch (error: any) {
          if (error.name === 'ResourceNotFoundException' && retries > 1) {
            console.log('Table not ready yet, waiting...');
            await wait(2000); // Wait 2 seconds before retrying
            retries--;
          } else {
            throw error;
          }
        }
      }
      return null;
    } catch (error: any) {
      console.error('Error fetching user data:', {
        error: error.message,
        name: error.name,
        code: error.$metadata?.httpStatusCode
      });
      throw error;
    }
  },

  async updateUserData(userData: UserData): Promise<boolean> {
    try {
      console.log('Updating user data:', userData);
      const command = new PutCommand({
        TableName: TABLE_NAME,
        Item: {
          ...userData,
          updatedAt: Date.now(),
        },
      });

      // Add retry logic for table being created
      let retries = 3;
      while (retries > 0) {
        try {
          await docClient.send(command);
          console.log('Successfully updated user data');
          return true;
        } catch (error: any) {
          if (error.name === 'ResourceNotFoundException' && retries > 1) {
            console.log('Table not ready yet, waiting...');
            await wait(2000); // Wait 2 seconds before retrying
            retries--;
          } else {
            throw error;
          }
        }
      }
      return false;
    } catch (error: any) {
      console.error('Error updating user data:', {
        error: error.message,
        name: error.name,
        code: error.$metadata?.httpStatusCode
      });
      throw error;
    }
  },
}; 