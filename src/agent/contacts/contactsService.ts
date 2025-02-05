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
    console.log('Loading contacts for user:', userId);
    const contacts = await dynamoDBService.getContacts(userId);
    console.log('Loaded contacts:', contacts);
    this.contacts.set(userId, contacts);
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