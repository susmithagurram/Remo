import { dynamoDBService } from '../../utils/dynamoDBService';
import { Contact } from '../viem/types';

class ContactsService {
  private static instance: ContactsService;
  private contacts: Map<string, Contact[]> = new Map();

  private constructor() {}

  static getInstance(): ContactsService {
    if (!ContactsService.instance) {
      ContactsService.instance = new ContactsService();
    }
    return ContactsService.instance;
  }

  async loadUserContacts(userId: string): Promise<void> {
    console.log('ContactsService: Loading contacts for user:', userId);
    try {
      console.log('ContactsService: Calling DynamoDB getContacts...');
      const contacts = await dynamoDBService.getContacts(userId);
      console.log('ContactsService: Raw contacts from DynamoDB:', contacts);
      
      if (!contacts) {
        console.warn('ContactsService: No contacts returned from DynamoDB');
        this.contacts.set(userId, []);
        return;
      }
      
      this.contacts.set(userId, contacts);
      console.log('ContactsService: Successfully cached contacts:', this.contacts.get(userId));
    } catch (error) {
      console.error('ContactsService: Error loading contacts:', {
        error,
        userId,
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });
      throw error;
    }
  }

  async getUserContacts(userId: string): Promise<Contact[]> {
    console.log('ContactsService: Getting contacts for userId:', userId);
    try {
      await this.loadUserContacts(userId);
      const userContacts = this.contacts.get(userId) || [];
      console.log('ContactsService: Retrieved contacts from cache:', userContacts);
      return userContacts;
    } catch (error) {
      console.error('ContactsService: Error in getUserContacts:', error);
      throw error;
    }
  }

  async findContactByName(userId: string, name: string): Promise<Contact | undefined> {
    console.log('Searching for contact:', { userId, name });
    await this.loadUserContacts(userId);
    const userContacts = this.contacts.get(userId);
    console.log('Available contacts:', userContacts);
    const contact = userContacts?.find(
      contact => contact.name.toLowerCase() === name.toLowerCase()
    );
    console.log('Found contact:', contact);
    return contact;
  }
}

export const contactsService = ContactsService.getInstance(); 