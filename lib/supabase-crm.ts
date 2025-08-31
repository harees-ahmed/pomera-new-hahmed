// lib/supabase-crm.ts

import { supabase } from './supabase';

// Types
export interface Company {
  company_id: string;
  company_name: string;
  industry?: string;
  company_size?: string;
  annual_revenue?: string;
  company_website?: string;
  
  // Address
  street_number?: string;
  street_name?: string;
  apt_suite?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  
  // Contact Info (primary contact) 
  contact_first_name?: string;
  contact_last_name?: string;
  contact_job_title?: string;
  contact_email?: string;
  contact_phone?: string;
  contact_mobile?: string;
  preferred_contact_method?: string;
  
  // Status fields
  company_status: 'lead' | 'prospect' | 'client' | 'inactive';
  status_id?: number;
  lead_source?: string;
  source_id?: number;
  lead_score?: 'hot' | 'warm' | 'cold';
  score_id?: number;
  size_id?: number;
  revenue_id?: number;
  position_type_id?: number;
  
  // Dates
  expected_close_date?: string;
  
  // Opportunity
  staffing_needs_overview?: string;
  immediate_positions?: number;
  annual_positions?: number;
  opportunity_value?: number;
  position_names?: string;
  position_type?: string;
  additional_staffing_details?: string;
  
  // Metadata
  created_date: string;
  updated_date: string;
  created_by_user_id?: string;
}

export interface CompanyContact {
  contact_id: string;
  company_id: string;
  contact_first_name: string;
  contact_last_name: string;
  contact_job_title?: string;
  contact_email: string;
  contact_phone?: string;
  contact_mobile?: string;
  preferred_contact_method?: 'email' | 'phone' | 'mobile';
  is_primary_contact: boolean;
  created_date: string;
  updated_date: string;
}

export interface CompanyNote {
  note_id: string;
  company_id: string;
  note_type?: string;
  note_type_id?: number;
  note_text: string;
  created_date: string;
  created_by_user_id?: string;
}

export interface CompanyFile {
  file_id: string;
  company_id: string;
  file_name: string;
  file_url: string;
  file_size?: number;
  file_type?: string;
  file_category?: string;
  file_category_id?: number;
  uploaded_date: string;
  uploaded_by_user_id?: string;
}

// Dimension Types
export interface DimensionValue {
  id: number;
  name: string;
  display_order: number;
  is_active: boolean;
  color?: string;
}

// Error handling wrapper
async function withErrorHandling<T>(
  operation: () => Promise<T>,
  errorMessage: string = 'Operation failed'
): Promise<{ data?: T; error?: string }> {
  try {
    const data = await operation();
    return { data };
  } catch (error: any) {
    console.error(errorMessage, error);
    return { error: error.message || errorMessage };
  }
}

class CRMDatabase {
  // ==================== CONNECTION CHECK ====================
  
  async checkConnection() {
    if (!supabase) {
      return { error: 'Supabase client is not initialized. Please check your environment variables.' };
    }
    
    try {
      // Try a simple query to test the connection
      const { data, error } = await supabase.from('companies').select('count').limit(1);
      if (error) {
        return { error: `Database connection failed: ${error.message}` };
      }
      return { success: true, message: 'Database connection successful' };
    } catch (err: any) {
      return { error: `Connection test failed: ${err.message}` };
    }
  }

  // ==================== DIMENSION MANAGEMENT ====================
  
  // Generic dimension fetcher with proper field mapping
  private async getDimensionData(tableName: string, idField: string, nameField: string, colorField?: string) {
    return withErrorHandling(async () => {
      // Check if supabase client is available
      if (!supabase) {
        throw new Error('Supabase client is not initialized. Please check your environment variables.');
      }

      console.log(`Fetching dimensions from ${tableName} with fields: ${idField}, ${nameField}`);
      
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .eq('is_active', true)
        .order('display_order');
      
      if (error) {
        console.error(`Supabase error for ${tableName}:`, error);
        throw error;
      }
      
      console.log(`Raw data from ${tableName}:`, data);
      
      const mappedData = (data || []).map((item: any) => ({
        id: item[idField],
        name: item[nameField],
        display_order: item.display_order || 0,
        is_active: item.is_active || true,
        color: colorField ? item[colorField] : undefined
      })) as DimensionValue[];
      
      console.log(`Mapped data from ${tableName}:`, mappedData);
      
      return mappedData;
    }, `Failed to fetch ${tableName}`);
  }

  async getCompanyStatuses() {
    try {
      return await this.getDimensionData('dim_company_status', 'status_id', 'status_name');
    } catch (error) {
      console.warn('Falling back to default company statuses');
      return {
        data: [
          { id: 1, name: 'lead', display_order: 1, is_active: true },
          { id: 2, name: 'prospect', display_order: 2, is_active: true },
          { id: 3, name: 'client', display_order: 3, is_active: true },
          { id: 4, name: 'inactive', display_order: 4, is_active: true }
        ]
      };
    }
  }

  async getLeadSources() {
    try {
      return await this.getDimensionData('dim_lead_source', 'source_id', 'source_name');
    } catch (error) {
      console.warn('Falling back to default lead sources');
      return {
        data: [
          { id: 1, name: 'Website', display_order: 1, is_active: true },
          { id: 2, name: 'Referral', display_order: 2, is_active: true },
          { id: 3, name: 'Cold Call', display_order: 3, is_active: true },
          { id: 4, name: 'Trade Show', display_order: 4, is_active: true }
        ]
      };
    }
  }

  async getLeadScores() {
    try {
      return await this.getDimensionData('dim_lead_score', 'score_id', 'score_name', 'score_color');
    } catch (error) {
      console.warn('Falling back to default lead scores');
      return {
        data: [
          { id: 1, name: 'hot', display_order: 1, is_active: true, color: 'red' },
          { id: 2, name: 'warm', display_order: 2, is_active: true, color: 'orange' },
          { id: 3, name: 'cold', display_order: 3, is_active: true, color: 'blue' }
        ]
      };
    }
  }

  async getCompanySizes() {
    try {
      return await this.getDimensionData('dim_company_size', 'size_id', 'size_name');
    } catch (error) {
      console.warn('Falling back to default company sizes');
      return {
        data: [
          { id: 1, name: '1-10 employees', display_order: 1, is_active: true },
          { id: 2, name: '11-50 employees', display_order: 2, is_active: true },
          { id: 3, name: '51-200 employees', display_order: 3, is_active: true },
          { id: 4, name: '200+ employees', display_order: 4, is_active: true }
        ]
      };
    }
  }

  async getAnnualRevenues() {
    try {
      return await this.getDimensionData('dim_annual_revenue', 'revenue_id', 'revenue_range');
    } catch (error) {
      console.warn('Falling back to default annual revenues');
      return {
        data: [
          { id: 1, name: 'Under $1M', display_order: 1, is_active: true },
          { id: 2, name: '$1M - $10M', display_order: 2, is_active: true },
          { id: 3, name: '$10M - $100M', display_order: 3, is_active: true },
          { id: 4, name: 'Over $100M', display_order: 4, is_active: true }
        ]
      };
    }
  }

  async getPositionTypes() {
    try {
      return await this.getDimensionData('dim_position_type', 'position_type_id', 'position_type_name');
    } catch (error) {
      console.warn('Falling back to default position types');
      return {
        data: [
          { id: 1, name: 'Nurse', display_order: 1, is_active: true },
          { id: 2, name: 'Physician', display_order: 2, is_active: true },
          { id: 3, name: 'Technician', display_order: 3, is_active: true },
          { id: 4, name: 'Administrative', display_order: 4, is_active: true }
        ]
      };
    }
  }

  async getNoteTypes() {
    try {
      return await this.getDimensionData('dim_note_type', 'note_type_id', 'note_type_name');
    } catch (error) {
      console.warn('Falling back to default note types');
      return {
        data: [
          { id: 1, name: 'Call', display_order: 1, is_active: true },
          { id: 2, name: 'Email', display_order: 2, is_active: true },
          { id: 3, name: 'Meeting', display_order: 3, is_active: true },
          { id: 4, name: 'Follow-up', display_order: 4, is_active: true }
        ]
      };
    }
  }

  async getContactMethods() {
    try {
      return await this.getDimensionData('dim_contact_method', 'method_id', 'method_name');
    } catch (error) {
      console.warn('Falling back to default contact methods');
      return {
        data: [
          { id: 1, name: 'Email', display_order: 1, is_active: true },
          { id: 2, name: 'Phone', display_order: 2, is_active: true },
          { id: 3, name: 'Mobile', display_order: 3, is_active: true }
        ]
      };
    }
  }

  async getFileCategories() {
    try {
      return await this.getDimensionData('dim_file_category', 'category_id', 'category_name');
    } catch (error) {
      console.warn('Falling back to default file categories');
      return {
        data: [
          { id: 1, name: 'Contract', display_order: 1, is_active: true },
          { id: 2, name: 'Proposal', display_order: 2, is_active: true },
          { id: 3, name: 'Invoice', display_order: 3, is_active: true },
          { id: 4, name: 'Other', display_order: 4, is_active: true }
        ]
      };
    }
  }

  // ==================== COMPANIES ====================
  
  async getCompanies(filters?: {
    status?: string;
    search?: string;
    limit?: number;
    offset?: number;
  }) {
    return withErrorHandling(async () => {
      // Use the view if it exists, otherwise use the table
      let query = supabase
        .from('companies')
        .select('*')
        .order('created_date', { ascending: false });

      if (filters?.status) {
        query = query.eq('company_status', filters.status);
      }

      if (filters?.search) {
        query = query.or(`company_name.ilike.%${filters.search}%,city.ilike.%${filters.search}%,contact_email.ilike.%${filters.search}%`);
      }

      if (filters?.limit) {
        query = query.limit(filters.limit);
      }

      if (filters?.offset) {
        query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      return data as Company[];
    }, 'Failed to fetch companies');
  }

  async getCompanyById(companyId: string) {
    return withErrorHandling(async () => {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('company_id', companyId)
        .single();

      if (error) throw error;
      return data as Company;
    }, 'Failed to fetch company details');
  }

  async createCompany(company: Partial<Company>) {
    return withErrorHandling(async () => {
      const { data, error } = await supabase
        .from('companies')
        .insert([company])
        .select()
        .single();

      if (error) throw error;
      return data as Company;
    }, 'Failed to create company');
  }

  async updateCompany(companyId: string, updates: Partial<Company>) {
    return withErrorHandling(async () => {
      const { data, error } = await supabase
        .from('companies')
        .update(updates)
        .eq('company_id', companyId)
        .select()
        .single();

      if (error) throw error;
      return data as Company;
    }, 'Failed to update company');
  }

  async deleteCompany(companyId: string) {
    return withErrorHandling(async () => {
      const { error } = await supabase
        .from('companies')
        .delete()
        .eq('company_id', companyId);

      if (error) throw error;
      return true;
    }, 'Failed to delete company');
  }

  async updateCompanyStatus(companyId: string, status: Company['company_status']) {
    return withErrorHandling(async () => {
      const { data, error } = await supabase
        .from('companies')
        .update({ company_status: status })
        .eq('company_id', companyId)
        .select()
        .single();

      if (error) throw error;
      return data as Company;
    }, 'Failed to update company status');
  }

  // ==================== CONTACTS ====================
  
  async getCompanyContacts(companyId: string) {
    return withErrorHandling(async () => {
      const { data, error } = await supabase
        .from('company_contacts')
        .select('*')
        .eq('company_id', companyId)
        .order('is_primary_contact', { ascending: false });

      if (error) throw error;
      return data as CompanyContact[];
    }, 'Failed to fetch contacts');
  }

  async createContact(contact: Partial<CompanyContact>) {
    return withErrorHandling(async () => {
      const { data, error } = await supabase
        .from('company_contacts')
        .insert([contact])
        .select()
        .single();

      if (error) throw error;
      return data as CompanyContact;
    }, 'Failed to create contact');
  }

  async updateContact(contactId: string, updates: Partial<CompanyContact>) {
    return withErrorHandling(async () => {
      const { data, error } = await supabase
        .from('company_contacts')
        .update(updates)
        .eq('contact_id', contactId)
        .select()
        .single();

      if (error) throw error;
      return data as CompanyContact;
    }, 'Failed to update contact');
  }

  async deleteContact(contactId: string) {
    return withErrorHandling(async () => {
      const { error } = await supabase
        .from('company_contacts')
        .delete()
        .eq('contact_id', contactId);

      if (error) throw error;
      return true;
    }, 'Failed to delete contact');
  }

  // ==================== NOTES ====================
  
  async getCompanyNotes(companyId: string) {
    return withErrorHandling(async () => {
      const { data, error } = await supabase
        .from('company_notes')
        .select('*')
        .eq('company_id', companyId)
        .order('created_date', { ascending: false });

      if (error) throw error;
      return data as CompanyNote[];
    }, 'Failed to fetch notes');
  }

  async createNote(note: Partial<CompanyNote>) {
    return withErrorHandling(async () => {
      // If note_type is provided but not note_type_id, look it up
      if (note.note_type && !note.note_type_id) {
        const noteTypes = await this.getNoteTypes();
        const noteType = noteTypes.data?.find(t => t.name === note.note_type);
        if (noteType) {
          note.note_type_id = noteType.id;
        }
      }

      const { data, error } = await supabase
        .from('company_notes')
        .insert([note])
        .select()
        .single();

      if (error) throw error;
      return data as CompanyNote;
    }, 'Failed to create note');
  }

  async deleteNote(noteId: string) {
    return withErrorHandling(async () => {
      const { error } = await supabase
        .from('company_notes')
        .delete()
        .eq('note_id', noteId);

      if (error) throw error;
      return true;
    }, 'Failed to delete note');
  }

  // ==================== FILES ====================
  
  async getCompanyFiles(companyId: string) {
    return withErrorHandling(async () => {
      const { data, error } = await supabase
        .from('company_files')
        .select('*')
        .eq('company_id', companyId)
        .order('uploaded_date', { ascending: false });

      if (error) throw error;
      return data as CompanyFile[];
    }, 'Failed to fetch files');
  }

  async uploadFile(file: Partial<CompanyFile>) {
    return withErrorHandling(async () => {
      const { data, error } = await supabase
        .from('company_files')
        .insert([file])
        .select()
        .single();

      if (error) throw error;
      return data as CompanyFile;
    }, 'Failed to upload file');
  }

  async deleteFile(fileId: string) {
    return withErrorHandling(async () => {
      const { error } = await supabase
        .from('company_files')
        .delete()
        .eq('file_id', fileId);

      if (error) throw error;
      return true;
    }, 'Failed to delete file');
  }

  // ==================== STATISTICS ====================
  
  async getStatistics() {
    return withErrorHandling(async () => {
      const { data: companies, error } = await supabase
        .from('companies')
        .select('company_status, opportunity_value');

      if (error) throw error;

      const stats = {
        totalLeads: 0,
        totalProspects: 0,
        totalClients: 0,
        totalOpportunityValue: 0
      };

      companies?.forEach((company: any) => {
        switch (company.company_status) {
          case 'lead':
            stats.totalLeads++;
            break;
          case 'prospect':
            stats.totalProspects++;
            break;
          case 'client':
            stats.totalClients++;
            break;
        }
        stats.totalOpportunityValue += company.opportunity_value || 0;
      });

      return stats;
    }, 'Failed to fetch statistics');
  }

  // ==================== UTILITY FUNCTIONS ====================
  
  formatPhoneNumber(phone: string): string {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }
    return phone;
  }

  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  validateZipCode(zip: string): boolean {
    const zipRegex = /^\d{5}(-\d{4})?$/;
    return zipRegex.test(zip);
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }
}

export const crmDatabase = new CRMDatabase();