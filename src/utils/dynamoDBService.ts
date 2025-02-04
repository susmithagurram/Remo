import { DynamoDBClient, CreateTableCommand, DescribeTableCommand } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, PutCommand, QueryCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';
import { RemoWallet } from '../agent/agentkit/types';
import { encryptPrivateKey, decryptPrivateKey } from './encryption';

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

const USER_TABLE = 'remo_users';
const WALLET_TABLE = 'remo_wallets';

export interface UserData {
  userId: string;  // This will be the wallet address or unique identifier
  username: string;
  createdAt: number;
  updatedAt: number;
}

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const ensureTable = async (tableName: string, keySchema: any) => {
  try {
    // Check if table exists
    try {
      await client.send(new DescribeTableCommand({ TableName: tableName }));
      console.log(`Table ${tableName} exists`);
      return;
    } catch (error: any) {
      if (error.name !== 'ResourceNotFoundException') {
        throw error;
      }
    }

    // Create table if it doesn't exist
    console.log(`Creating table ${tableName}...`);
    await client.send(
      new CreateTableCommand({
        TableName: tableName,
        KeySchema: keySchema,
        AttributeDefinitions: keySchema.map((key: any) => ({
          AttributeName: key.AttributeName,
          AttributeType: 'S',
        })),
        BillingMode: 'PAY_PER_REQUEST',
      })
    );

    console.log(`Table ${tableName} created successfully`);
  } catch (error) {
    console.error(`Error ensuring table ${tableName}:`, error);
    throw error;
  }
};

// Initialize tables
(async () => {
  try {
    await ensureTable(USER_TABLE, [
      { AttributeName: 'userId', KeyType: 'HASH' },
    ]);
    
    await ensureTable(WALLET_TABLE, [
      { AttributeName: 'userId', KeyType: 'HASH' },
      { AttributeName: 'walletId', KeyType: 'RANGE' },
    ]);
  } catch (error) {
    console.error('Error initializing tables:', error);
  }
})();

export const dynamoDBService = {
  async getUserData(userId: string): Promise<UserData | null> {
    try {
      console.log('Fetching user data for:', userId);
      const command = new GetCommand({
        TableName: USER_TABLE,
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
        TableName: USER_TABLE,
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

  async saveWallet(userId: string, wallet: RemoWallet): Promise<boolean> {
    try {
      console.log('Starting wallet save process for user:', userId);
      
      // Encrypt the private key
      try {
        console.log('Encrypting private key...');
        const { encryptedData, iv } = await encryptPrivateKey(wallet.privateKey);
        console.log('Private key encrypted successfully');

        const command = new PutCommand({
          TableName: WALLET_TABLE,
          Item: {
            userId,
            walletId: wallet.id,
            address: wallet.address,
            name: wallet.name,
            type: wallet.type,
            createdAt: wallet.createdAt,
            balance: wallet.balance,
            encryptedPrivateKey: encryptedData,
            iv,
            updatedAt: Date.now(),
          },
        });

        console.log('Sending wallet data to DynamoDB...');
        await docClient.send(command);
        console.log('Wallet saved successfully to DynamoDB');
        return true;
      } catch (encryptError: any) {
        console.error('Encryption failed:', encryptError);
        throw new Error(`Encryption failed: ${encryptError.message}`);
      }
    } catch (error: any) {
      console.error('Error in saveWallet:', {
        error: error.message,
        name: error.name,
        code: error.$metadata?.httpStatusCode,
        userId,
        walletAddress: wallet.address,
      });
      throw error;
    }
  },

  async getUserWallets(userId: string): Promise<RemoWallet[]> {
    try {
      console.log('Fetching wallets for user:', userId);
      const command = new QueryCommand({
        TableName: WALLET_TABLE,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
          ':userId': userId,
        },
      });

      console.log('Sending query to DynamoDB...');
      const response = await docClient.send(command);
      console.log('Retrieved wallets from DynamoDB:', response.Items?.length || 0, 'wallets found');

      const wallets = await Promise.all((response.Items || []).map(async (item, index) => {
        try {
          console.log(`Decrypting wallet ${index + 1}/${response.Items?.length || 0}...`);
          const decryptedKey = await decryptPrivateKey(
            item.encryptedPrivateKey,
            item.iv,
          );
          console.log(`Wallet ${index + 1} decrypted successfully`);

          return {
            id: item.walletId,
            address: item.address,
            name: item.name,
            type: item.type,
            createdAt: item.createdAt,
            balance: item.balance,
            privateKey: decryptedKey,
          };
        } catch (decryptError: any) {
          console.error(`Failed to decrypt wallet ${index + 1}:`, decryptError);
          throw new Error(`Failed to decrypt wallet: ${decryptError.message}`);
        }
      }));

      console.log('Successfully processed all wallets');
      return wallets;
    } catch (error: any) {
      console.error('Error in getUserWallets:', {
        error: error.message,
        name: error.name,
        code: error.$metadata?.httpStatusCode,
        userId,
      });
      throw error;
    }
  },

  async deleteWallet(userId: string, walletId: string): Promise<boolean> {
    try {
      const command = new DeleteCommand({
        TableName: WALLET_TABLE,
        Key: {
          userId,
          walletId,
        },
      });

      await docClient.send(command);
      return true;
    } catch (error) {
      console.error('Error deleting wallet:', error);
      throw error;
    }
  },
}; 