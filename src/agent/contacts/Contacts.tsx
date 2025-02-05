import React, { useState, useEffect } from 'react';
import { Contact } from '../viem/types';
import { dynamoDBService } from '../../utils/dynamoDBService';
import styles from '../../styles/Profile.module.css';

interface ContactsProps {
  userId: string;
}

const Contacts: React.FC<ContactsProps> = ({ userId }) => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [newContact, setNewContact] = useState({ name: '', walletAddress: '' });
  const [error, setError] = useState<string | null>(null);
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);

  useEffect(() => {
    console.log('Contacts component mounted with userId:', userId);
    loadContacts();
  }, [userId]);

  useEffect(() => {
    if (copiedAddress) {
      const timer = setTimeout(() => setCopiedAddress(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [copiedAddress]);

  const loadContacts = async () => {
    try {
      console.log('Loading contacts for userId:', userId);
      const userContacts = await dynamoDBService.getContacts(userId);
      console.log('Loaded contacts:', userContacts);
      setContacts(userContacts);
    } catch (error: any) {
      console.error('Error loading contacts:', error);
      setError('Failed to load contacts');
    }
  };

  const handleCreateContact = async () => {
    if (!newContact.name.trim() || !newContact.walletAddress.trim()) {
      setError('Both name and wallet address are required');
      return;
    }

    if (!newContact.walletAddress.match(/^0x[a-fA-F0-9]{40}$/)) {
      setError('Invalid wallet address format');
      return;
    }

    // Check for duplicates
    const isDuplicateWallet = contacts.some(
      c => c.walletAddress.toLowerCase() === newContact.walletAddress.toLowerCase()
    );
    if (isDuplicateWallet) {
      setError('This wallet address is already in your contacts');
      return;
    }

    const isDuplicateName = contacts.some(
      c => c.name.toLowerCase() === newContact.name.toLowerCase()
    );
    if (isDuplicateName) {
      setError('This contact name is already in use');
      return;
    }

    setIsCreating(true);
    setError(null);

    try {
      const timestamp = Date.now();
      const contact: Contact = {
        id: `${timestamp}`,
        contactId: `${timestamp}`,
        userId,
        name: newContact.name.trim(),
        walletAddress: newContact.walletAddress.trim(),
        createdAt: timestamp,
        updatedAt: timestamp,
      };

      console.log('Saving new contact:', contact);
      await dynamoDBService.saveContact(contact);
      console.log('Contact saved successfully');
      
      // Reload contacts after saving
      await loadContacts();
      
      setContacts([...contacts, contact]);
      setNewContact({ name: '', walletAddress: '' });
    } catch (error: any) {
      console.error('Error creating contact:', error);
      setError('Failed to create contact');
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteContact = async (contactId: string) => {
    try {
      console.log('Deleting contact with ID:', contactId);
      const success = await dynamoDBService.deleteContact(userId, contactId);
      if (success) {
        setContacts(prev => prev.filter(c => c.id !== contactId));
        setError(null);
      }
    } catch (error: any) {
      console.error('Delete error:', error);
      setError(error.message || 'Failed to delete contact');
    }
  };

  const copyAddress = async (address: string) => {
    try {
      await navigator.clipboard.writeText(address);
      setCopiedAddress(address);
    } catch (err) {
      console.error('Failed to copy address:', err);
    }
  };

  return (
    <div className={styles.profileCard}>
      <h2>👥 Contacts</h2>
      {error && (
        <div className={styles.errorMessage}>
          {error}
        </div>
      )}

      <div className={styles.contactsList}>
        {contacts.map((contact) => (
          <div key={contact.contactId} className={styles.contactItem}>
            <div className={styles.contactInfo}>
              <span className={styles.contactIcon}>👤</span>
              <div className={styles.contactDetails}>
                <span className={styles.contactName}>{contact.name}</span>
                <div className={styles.addressContainer}>
                  <span className={styles.contactAddress}>
                    {contact.walletAddress.slice(0, 6)}...{contact.walletAddress.slice(-4)}
                  </span>
                  <button
                    onClick={() => copyAddress(contact.walletAddress)}
                    className={styles.copyAddressButton}
                    title="Copy full address"
                  >
                    {copiedAddress === contact.walletAddress ? '✓' : '📋'}
                  </button>
                </div>
              </div>
            </div>
            <button
              onClick={() => handleDeleteContact(contact.id)}
              className={styles.deleteButton}
              title="Delete contact"
            >
              🗑️
            </button>
          </div>
        ))}
      </div>

      <div className={styles.createContactForm}>
        <input
          type="text"
          value={newContact.name}
          onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
          placeholder="Contact name"
          className={styles.contactInput}
          disabled={isCreating}
        />
        <input
          type="text"
          value={newContact.walletAddress}
          onChange={(e) => setNewContact({ ...newContact, walletAddress: e.target.value })}
          placeholder="Wallet address (0x...)"
          className={styles.contactInput}
          disabled={isCreating}
        />
        <button
          onClick={handleCreateContact}
          className={styles.createContactButton}
          disabled={isCreating || !newContact.name.trim() || !newContact.walletAddress.trim()}
        >
          {isCreating ? 'Creating...' : 'Add Contact'}
        </button>
      </div>
    </div>
  );
};

export default Contacts; 