'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { Job, Client, Quote, Invoice } from '@/types';
import { storage } from '@/lib/storage';
import { useConfig } from './ConfigContext';

interface AppContextValue {
  // Jobs
  jobs: Job[];
  addJob: (job: Omit<Job, 'id' | 'createdAt' | 'updatedAt' | 'notes'>) => Job;
  updateJob: (id: string, updates: Partial<Job>) => void;
  deleteJob: (id: string) => void;
  getJob: (id: string) => Job | undefined;
  getJobsByClient: (clientId: string) => Job[];
  getJobsByStatus: (status: string) => Job[];

  // Clients
  clients: Client[];
  addClient: (client: Omit<Client, 'id' | 'createdAt' | 'updatedAt' | 'jobIds'>) => Client;
  updateClient: (id: string, updates: Partial<Client>) => void;
  deleteClient: (id: string) => void;
  getClient: (id: string) => Client | undefined;

  // Quotes
  quotes: Quote[];
  addQuote: (quote: Omit<Quote, 'id' | 'createdAt' | 'updatedAt'>) => Quote;
  updateQuote: (id: string, updates: Partial<Quote>) => void;
  deleteQuote: (id: string) => void;
  getQuote: (id: string) => Quote | undefined;
  getQuotesByJob: (jobId: string) => Quote[];

  // Invoices
  invoices: Invoice[];
  addInvoice: (invoice: Omit<Invoice, 'id' | 'createdAt' | 'updatedAt'>) => Invoice;
  updateInvoice: (id: string, updates: Partial<Invoice>) => void;
  deleteInvoice: (id: string) => void;
  getInvoice: (id: string) => Invoice | undefined;

  // State
  isLoaded: boolean;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const { config } = useConfig();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load data from storage on mount
  useEffect(() => {
    setJobs(storage.getJobs());
    setClients(storage.getClients());
    setQuotes(storage.getQuotes());
    setInvoices(storage.getInvoices());
    setIsLoaded(true);
  }, []);

  // Persist data to storage when it changes
  useEffect(() => {
    if (isLoaded) {
      storage.setJobs(jobs);
    }
  }, [jobs, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      storage.setClients(clients);
    }
  }, [clients, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      storage.setQuotes(quotes);
    }
  }, [quotes, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      storage.setInvoices(invoices);
    }
  }, [invoices, isLoaded]);

  // Job methods
  const addJob = useCallback(
    (jobData: Omit<Job, 'id' | 'createdAt' | 'updatedAt' | 'notes'>): Job => {
      const now = new Date().toISOString();
      const newJob: Job = {
        ...jobData,
        id: uuidv4(),
        notes: [],
        createdAt: now,
        updatedAt: now,
      };
      setJobs((prev) => [...prev, newJob]);

      // Update client's jobIds
      if (jobData.clientId) {
        setClients((prev) =>
          prev.map((c) =>
            c.id === jobData.clientId
              ? { ...c, jobIds: [...c.jobIds, newJob.id], updatedAt: now }
              : c
          )
        );
      }

      return newJob;
    },
    []
  );

  const updateJob = useCallback((id: string, updates: Partial<Job>) => {
    setJobs((prev) =>
      prev.map((job) =>
        job.id === id
          ? { ...job, ...updates, updatedAt: new Date().toISOString() }
          : job
      )
    );
  }, []);

  const deleteJob = useCallback((id: string) => {
    setJobs((prev) => {
      const job = prev.find((j) => j.id === id);
      if (job?.clientId) {
        setClients((clients) =>
          clients.map((c) =>
            c.id === job.clientId
              ? { ...c, jobIds: c.jobIds.filter((jid) => jid !== id) }
              : c
          )
        );
      }
      return prev.filter((j) => j.id !== id);
    });

    // Also delete associated quotes
    setQuotes((prev) => prev.filter((q) => q.jobId !== id));
  }, []);

  const getJob = useCallback((id: string) => jobs.find((j) => j.id === id), [jobs]);

  const getJobsByClient = useCallback(
    (clientId: string) => jobs.filter((j) => j.clientId === clientId),
    [jobs]
  );

  const getJobsByStatus = useCallback(
    (status: string) => jobs.filter((j) => j.status === status),
    [jobs]
  );

  // Client methods
  const addClient = useCallback(
    (clientData: Omit<Client, 'id' | 'createdAt' | 'updatedAt' | 'jobIds'>): Client => {
      const now = new Date().toISOString();
      const newClient: Client = {
        ...clientData,
        id: uuidv4(),
        jobIds: [],
        createdAt: now,
        updatedAt: now,
      };
      setClients((prev) => [...prev, newClient]);
      return newClient;
    },
    []
  );

  const updateClient = useCallback((id: string, updates: Partial<Client>) => {
    setClients((prev) =>
      prev.map((client) =>
        client.id === id
          ? { ...client, ...updates, updatedAt: new Date().toISOString() }
          : client
      )
    );
  }, []);

  const deleteClient = useCallback((id: string) => {
    setClients((prev) => prev.filter((c) => c.id !== id));
    // Also delete client's jobs
    setJobs((prev) => prev.filter((j) => j.clientId !== id));
  }, []);

  const getClient = useCallback((id: string) => clients.find((c) => c.id === id), [clients]);

  // Quote methods
  const addQuote = useCallback(
    (quoteData: Omit<Quote, 'id' | 'createdAt' | 'updatedAt'>): Quote => {
      const now = new Date().toISOString();
      const newQuote: Quote = {
        ...quoteData,
        id: uuidv4(),
        createdAt: now,
        updatedAt: now,
      };
      setQuotes((prev) => [...prev, newQuote]);

      // Link quote to job
      if (quoteData.jobId) {
        setJobs((prev) =>
          prev.map((j) =>
            j.id === quoteData.jobId
              ? { ...j, quoteId: newQuote.id, updatedAt: now }
              : j
          )
        );
      }

      return newQuote;
    },
    []
  );

  const updateQuote = useCallback((id: string, updates: Partial<Quote>) => {
    setQuotes((prev) =>
      prev.map((quote) =>
        quote.id === id
          ? { ...quote, ...updates, updatedAt: new Date().toISOString() }
          : quote
      )
    );
  }, []);

  const deleteQuote = useCallback((id: string) => {
    setQuotes((prev) => {
      const quote = prev.find((q) => q.id === id);
      if (quote?.jobId) {
        setJobs((jobs) =>
          jobs.map((j) =>
            j.id === quote.jobId ? { ...j, quoteId: undefined } : j
          )
        );
      }
      return prev.filter((q) => q.id !== id);
    });
  }, []);

  const getQuote = useCallback((id: string) => quotes.find((q) => q.id === id), [quotes]);

  const getQuotesByJob = useCallback(
    (jobId: string) => quotes.filter((q) => q.jobId === jobId),
    [quotes]
  );

  // Invoice methods
  const addInvoice = useCallback(
    (invoiceData: Omit<Invoice, 'id' | 'createdAt' | 'updatedAt'>): Invoice => {
      const now = new Date().toISOString();
      const newInvoice: Invoice = {
        ...invoiceData,
        id: uuidv4(),
        createdAt: now,
        updatedAt: now,
      };
      setInvoices((prev) => [...prev, newInvoice]);

      // Link invoice to job
      if (invoiceData.jobId) {
        setJobs((prev) =>
          prev.map((j) =>
            j.id === invoiceData.jobId
              ? { ...j, invoiceId: newInvoice.id, updatedAt: now }
              : j
          )
        );
      }

      return newInvoice;
    },
    []
  );

  const updateInvoice = useCallback((id: string, updates: Partial<Invoice>) => {
    setInvoices((prev) =>
      prev.map((invoice) =>
        invoice.id === id
          ? { ...invoice, ...updates, updatedAt: new Date().toISOString() }
          : invoice
      )
    );
  }, []);

  const deleteInvoice = useCallback((id: string) => {
    setInvoices((prev) => {
      const invoice = prev.find((i) => i.id === id);
      if (invoice?.jobId) {
        setJobs((jobs) =>
          jobs.map((j) =>
            j.id === invoice.jobId ? { ...j, invoiceId: undefined } : j
          )
        );
      }
      return prev.filter((i) => i.id !== id);
    });
  }, []);

  const getInvoice = useCallback((id: string) => invoices.find((i) => i.id === id), [invoices]);

  return (
    <AppContext.Provider
      value={{
        jobs,
        addJob,
        updateJob,
        deleteJob,
        getJob,
        getJobsByClient,
        getJobsByStatus,

        clients,
        addClient,
        updateClient,
        deleteClient,
        getClient,

        quotes,
        addQuote,
        updateQuote,
        deleteQuote,
        getQuote,
        getQuotesByJob,

        invoices,
        addInvoice,
        updateInvoice,
        deleteInvoice,
        getInvoice,

        isLoaded,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
