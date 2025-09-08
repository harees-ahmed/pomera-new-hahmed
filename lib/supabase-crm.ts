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
  tin?: string;
  
  // Status fields
  company_status: string;
  status_id?: number;
  lead_source?: string;
  source_id?: number;
  lead_score?: string;
  score_id?: number;
  size_id?: number;
  revenue_id?: number;
  position_type_id?: number;
  
  // Contact fields (from primary contact)
  contact_email?: string;
  contact_phone?: string;
  
  // Location fields (from primary address)
  city?: string;
  state?: string;
  
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

export interface CompanyAddress {
  address_id: string;
  company_id: string;
  address_type_id: number;
  street_address?: string;
  apt_suite?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  created_date: string;
  updated_date: string;
}

export interface CompanyContact {
  contact_id: string;
  company_id: string;
  contact_type: string;
  contact_first_name: string;
  contact_last_name: string;
  contact_job_title?: string;
  contact_email?: string;
  contact_phone?: string;
  contact_mobile?: string;
  preferred_contact_method?: 'email' | 'phone' | 'mobile';
  is_primary_contact?: boolean;
  is_decision_maker?: boolean;
  is_active?: boolean;
  created_date: string;
  updated_date: string;
}

export interface CompanyNote {
  note_id: string;
  company_id: string;
  note_type?: string;
  note_type_id?: number;
  note_text: string;
  follow_up_date?: string | null;
  follow_up_type?: string;
  follow_up_completed?: boolean;
  follow_up_notes?: string;
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
): Promise<T> {
  try {
    const data = await operation();
    return data;
  } catch (error: any) {
    // Enhanced error logging for debugging
    console.error(`${errorMessage}:`, {
      error: error,
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
      stack: error.stack
    });
    
    // Create more descriptive error messages
    let errorMsg = errorMessage;
    if (error && typeof error === 'object') {
      if (error.message) {
        errorMsg += `: ${error.message}`;
      }
      if (error.details) {
        errorMsg += ` (${error.details})`;
      }
      if (error.hint) {
        errorMsg += ` - Hint: ${error.hint}`;
      }
    } else if (error) {
      errorMsg += `: ${String(error)}`;
    }
    
    // Throw the enhanced error
    throw new Error(errorMsg);
  }
}

class CRMDatabase {
  // ==================== DIMENSION MANAGEMENT ====================
  
  async getDimensions(tableName: string) {
    return withErrorHandling(async () => {
      console.log(`Fetching dimensions from table: ${tableName}`);
      
      // TEMPORARY: Return mock data while Supabase connection is being fixed
      console.log('Using mock dimensions data due to Supabase connection issues');
      
      const mockDimensions: { [key: string]: DimensionValue[] } = {
        'dim_company_status': [
          { id: 1, name: 'Lead', display_order: 1, is_active: true, color: 'blue' },
          { id: 2, name: 'Prospect', display_order: 2, is_active: true, color: 'orange' },
          { id: 3, name: 'Client', display_order: 3, is_active: true, color: 'green' },
          { id: 4, name: 'Closed', display_order: 4, is_active: true, color: 'gray' }
        ],
        'dim_lead_source': [
          { id: 1, name: 'Website', display_order: 1, is_active: true, color: 'blue' },
          { id: 2, name: 'Referral', display_order: 2, is_active: true, color: 'green' },
          { id: 3, name: 'Cold Call', display_order: 3, is_active: true, color: 'orange' },
          { id: 4, name: 'Email Campaign', display_order: 4, is_active: true, color: 'purple' }
        ],
        'dim_lead_score': [
          { id: 1, name: 'Hot', display_order: 1, is_active: true, color: 'red' },
          { id: 2, name: 'Warm', display_order: 2, is_active: true, color: 'orange' },
          { id: 3, name: 'Cold', display_order: 3, is_active: true, color: 'blue' }
        ],
        'dim_company_size': [
          { id: 1, name: 'Small', display_order: 1, is_active: true, color: 'green' },
          { id: 2, name: 'Medium', display_order: 2, is_active: true, color: 'orange' },
          { id: 3, name: 'Large', display_order: 3, is_active: true, color: 'red' }
        ],
        'dim_annual_revenue': [
          { id: 1, name: '$0-1M', display_order: 1, is_active: true, color: 'green' },
          { id: 2, name: '$1M-5M', display_order: 2, is_active: true, color: 'orange' },
          { id: 3, name: '$5M-10M', display_order: 3, is_active: true, color: 'red' },
          { id: 4, name: '$10M+', display_order: 4, is_active: true, color: 'purple' }
        ],
        'dim_position_type': [
          { id: 1, name: 'Clinical', display_order: 1, is_active: true, color: 'blue' },
          { id: 2, name: 'Technical', display_order: 2, is_active: true, color: 'green' },
          { id: 3, name: 'Administrative', display_order: 3, is_active: true, color: 'orange' }
        ],
        'dim_note_type': [
          { id: 1, name: 'General', display_order: 1, is_active: true, color: 'blue' },
          { id: 2, name: 'Follow-up', display_order: 2, is_active: true, color: 'orange' },
          { id: 3, name: 'Meeting', display_order: 3, is_active: true, color: 'green' }
        ],
        'dim_contact_method': [
          { id: 1, name: 'Email', display_order: 1, is_active: true, color: 'blue' },
          { id: 2, name: 'Phone', display_order: 2, is_active: true, color: 'green' },
          { id: 3, name: 'In-Person', display_order: 3, is_active: true, color: 'orange' }
        ],
        'dim_contact_type': [
          { id: 1, name: 'Primary Contact', display_order: 1, is_active: true, color: 'red' },
          { id: 2, name: 'Decision Maker', display_order: 2, is_active: true, color: 'orange' },
          { id: 3, name: 'Technical Contact', display_order: 3, is_active: true, color: 'blue' }
        ],
        'dim_address_type': [
          { id: 1, name: 'Business', display_order: 1, is_active: true, color: 'blue' },
          { id: 2, name: 'Billing', display_order: 2, is_active: true, color: 'green' },
          { id: 3, name: 'Shipping', display_order: 3, is_active: true, color: 'orange' }
        ],
        'dim_file_category': [
          { id: 1, name: 'Contract', display_order: 1, is_active: true, color: 'blue' },
          { id: 2, name: 'Proposal', display_order: 2, is_active: true, color: 'green' },
          { id: 3, name: 'Documentation', display_order: 3, is_active: true, color: 'orange' }
        ],
        'dim_industry': [
          { id: 1, name: 'Healthcare', display_order: 1, is_active: true, color: 'blue' },
          { id: 2, name: 'Medical Technology', display_order: 2, is_active: true, color: 'green' },
          { id: 3, name: 'Pharmaceutical', display_order: 3, is_active: true, color: 'orange' }
        ],
        'dim_document_type': [
          { id: 1, name: 'PDF', display_order: 1, is_active: true, color: 'red' },
          { id: 2, name: 'Word Document', display_order: 2, is_active: true, color: 'blue' },
          { id: 3, name: 'Excel Spreadsheet', display_order: 3, is_active: true, color: 'green' }
        ]
      };
      
      if (mockDimensions[tableName]) {
        return mockDimensions[tableName];
      }
      
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .eq('is_active', true)
        .order('display_order');
      
      console.log(`Supabase response for ${tableName}:`, { data, error });
      
      if (error) {
        console.error(`Supabase error for ${tableName}:`, error);
        throw error;
      }
      
      if (!data || data.length === 0) {
        console.log(`No data returned for ${tableName}`);
        return [];
      }
      
      console.log(`Raw data for ${tableName}:`, data);
      
      // Map to consistent format based on table name
      const mappedData = (data || []).map(item => {
        let id: number;
        let name: string;
        
        // Determine ID and name columns based on table name
        switch (tableName) {
          case 'dim_company_status':
            id = item.status_id;
            name = item.status_name;
            break;
          case 'dim_lead_source':
            id = item.source_id;
            name = item.source_name;
            break;
          case 'dim_lead_score':
            id = item.score_id;
            name = item.score_name;
            break;
          case 'dim_company_size':
            id = item.size_id;
            name = item.size_name;
            break;
          case 'dim_annual_revenue':
            id = item.revenue_id;
            name = item.revenue_range;
            break;
          case 'dim_position_type':
            id = item.position_type_id;
            name = item.position_type_name;
            break;
          case 'dim_note_type':
            id = item.note_type_id;
            name = item.note_type_name;
            break;
          case 'dim_contact_method':
            id = item.method_id;
            name = item.method_name;
            break;
          case 'dim_contact_type':
            id = item.contact_type_id;
            name = item.contact_type_name;
            break;
          case 'dim_address_type':
            id = item.address_type_id;
            name = item.address_type_name;
            break;
          case 'dim_file_category':
            id = item.category_id;
            name = item.category_name;
            break;
          case 'dim_industry':
            id = item.industry_id;
            name = item.industry_name;
            break;
          case 'dim_document_type':
            id = item.doc_type_id;
            name = item.doc_type_name;
            break;
          default:
            id = item.id || 0;
            name = item.name || 'Unknown';
        }
        
        const mappedItem = {
          id,
          name,
          display_order: item.display_order,
          is_active: item.is_active,
          color: item.score_color || item.color
        };
        
        console.log(`Mapped item for ${tableName}:`, mappedItem);
        return mappedItem;
      }) as DimensionValue[];
      
      console.log(`Final mapped data for ${tableName}:`, mappedData);
      return mappedData;
    }, `Failed to fetch dimensions from ${tableName}`);
  }

  async getCompanyStatuses() {
    return this.getDimensions('dim_company_status');
  }

  async getLeadSources() {
    return this.getDimensions('dim_lead_source');
  }

  async getLeadScores() {
    return this.getDimensions('dim_lead_score');
  }

  async getCompanySizes() {
    return this.getDimensions('dim_company_size');
  }

  async getAnnualRevenues() {
    return this.getDimensions('dim_annual_revenue');
  }

  async getPositionTypes() {
    return this.getDimensions('dim_position_type');
  }

  async getNoteTypes() {
    return this.getDimensions('dim_note_type');
  }

  // Check table structure for debugging
  async checkTableStructure(): Promise<any> {
    return withErrorHandling(async () => {
      // Try a simple query to see what fields exist
      const { data: sampleData, error: sampleError } = await supabase
        .from('company_notes')
        .select('*')
        .limit(1);
      
      if (sampleError) throw sampleError;
      
      // Return field names from sample data
      return {
        fields: Object.keys(sampleData?.[0] || {}),
        sample: sampleData?.[0] || null
      };
    }, 'Failed to check table structure');
  }

  async getContactMethods() {
    return this.getDimensions('dim_contact_method');
  }

  async getContactTypes() {
    return this.getDimensions('dim_contact_type');
  }

  async getAddressTypes() {
    return this.getDimensions('dim_address_type');
  }

  async getFileCategories() {
    return this.getDimensions('dim_file_category');
  }

  async getIndustries() {
    return this.getDimensions('dim_industry');
  }

  async getDocumentTypes() {
    return this.getDimensions('dim_document_type');
  }



  // ==================== COMPANIES ====================
  
  async getCompanies(filters?: {
    status?: string;
    search?: string;
    limit?: number;
    offset?: number;
  }) {
    return withErrorHandling(async () => {
      console.log('=== getCompanies called ===');
      console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
      console.log('Supabase Key exists:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
      
      // TEMPORARY: Return mock data while Supabase connection is being fixed
      console.log('Using mock data due to Supabase connection issues');
      
      const mockCompanies: Company[] = [
        {
          company_id: 'mock-1',
          company_name: 'Acme Healthcare Corp',
          industry: 'Healthcare',
          company_size: 'Large',
          annual_revenue: '$10M+',
          company_website: 'https://acmehealth.com',
          tin: '12-3456789',
          company_status: 'lead',
          lead_source: 'Website',
          lead_score: 'Hot',
          expected_close_date: '2024-02-15',
          immediate_positions: 5,
          annual_positions: 25,
          opportunity_value: 500000,
          position_names: 'Nurses, Doctors, Technicians',
          position_type: 'Clinical',
          additional_staffing_details: 'Looking for experienced healthcare professionals',
          staffing_needs_overview: 'Expanding clinical operations',
          contact_email: 'contact@acmehealth.com',
          contact_phone: '+1-555-0123',
          city: 'New York',
          state: 'NY',
          created_date: new Date().toISOString(),
          updated_date: new Date().toISOString()
        },
        {
          company_id: 'mock-2',
          company_name: 'MedTech Solutions',
          industry: 'Medical Technology',
          company_size: 'Medium',
          annual_revenue: '$5M-10M',
          company_website: 'https://medtechsolutions.com',
          tin: '98-7654321',
          company_status: 'prospect',
          lead_source: 'Referral',
          lead_score: 'Warm',
          expected_close_date: '2024-03-01',
          immediate_positions: 3,
          annual_positions: 15,
          opportunity_value: 250000,
          position_names: 'Engineers, Technicians',
          position_type: 'Technical',
          additional_staffing_details: 'Need skilled technical staff',
          staffing_needs_overview: 'Growing technical team',
          contact_email: 'hr@medtechsolutions.com',
          contact_phone: '+1-555-0456',
          city: 'San Francisco',
          state: 'CA',
          created_date: new Date().toISOString(),
          updated_date: new Date().toISOString()
        }
      ];

      // Apply filters to mock data
      let filteredCompanies = mockCompanies;

      if (filters?.status) {
        filteredCompanies = filteredCompanies.filter(company => 
          company.company_status.toLowerCase() === filters.status?.toLowerCase()
        );
      }

      if (filters?.search) {
        const searchTerm = filters.search.toLowerCase();
        filteredCompanies = filteredCompanies.filter(company =>
          company.company_name.toLowerCase().includes(searchTerm) ||
          company.industry?.toLowerCase().includes(searchTerm)
        );
      }

      if (filters?.limit) {
        filteredCompanies = filteredCompanies.slice(0, filters.limit);
      }

      if (filters?.offset) {
        filteredCompanies = filteredCompanies.slice(filters.offset);
      }

      console.log('Mock data result:', filteredCompanies);
      return filteredCompanies;
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
      // Log the data being sent for debugging
      console.log('Creating company with data:', company);
      
      // Validate required fields
      if (!company.company_name) {
        throw new Error('Company name is required');
      }
      
      // Ensure company_status has a default value
      if (!company.company_status) {
        company.company_status = 'lead';
      }
      
      // Clean up empty date fields - convert empty strings to null
      const cleanedCompany = { ...company };
      if (cleanedCompany.expected_close_date === '') {
        cleanedCompany.expected_close_date = undefined;
      }
      
      // Add timestamps
      const now = new Date().toISOString();
      const companyData = {
        ...cleanedCompany,
        created_date: now,
        updated_date: now
      };
      
      console.log('Final company data to insert:', companyData);
      
      try {
        const { data, error } = await supabase
          .from('companies')
          .insert([companyData])
          .select()
          .single();

        if (error) {
          console.error('Supabase error details:', {
            message: error.message,
            details: error.details,
            hint: error.hint,
            code: error.code,
            fullError: error
          });
          throw new Error(`Database error: ${error.message || 'Unknown error'}`);
        }
        
        console.log('Company created successfully:', data);
        return data as Company;
      } catch (error) {
        console.error('Exception during company creation:', error);
        throw error;
      }
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

  // ==================== ADDRESSES ====================
  
  async getCompanyAddresses(companyId: string) {
    return withErrorHandling(async () => {
      const { data, error } = await supabase
        .from('company_addresses')
        .select('*')
        .eq('company_id', companyId)
        .order('created_date', { ascending: false });

      if (error) throw error;
      return data as CompanyAddress[];
    }, 'Failed to fetch addresses');
  }

  async createAddress(address: Partial<CompanyAddress>) {
    return withErrorHandling(async () => {
      const { data, error } = await supabase
        .from('company_addresses')
        .insert([address])
        .select()
        .single();

      if (error) throw error;
      return data as CompanyAddress;
    }, 'Failed to create address');
  }

  async updateAddress(addressId: string, address: Partial<CompanyAddress>) {
    return withErrorHandling(async () => {
      const { data, error } = await supabase
        .from('company_addresses')
        .update(address)
        .eq('address_id', addressId)
        .select()
        .single();

      if (error) throw error;
      return data as CompanyAddress;
      }, 'Failed to update address');
  }

  async deleteAddress(addressId: string) {
    return withErrorHandling(async () => {
      const { error } = await supabase
        .from('company_addresses')
        .delete()
        .eq('address_id', addressId);

      if (error) throw error;
      return true;
    }, 'Failed to delete address');
  }

  // ==================== CONTACTS ====================
  
  async getCompanyContacts(companyId: string) {
    return withErrorHandling(async () => {
      // First get the contact types from dimension table to determine ordering
      const { data: contactTypes, error: typeError } = await supabase
        .from('dim_contact_type')
        .select('contact_type_name, display_order')
        .eq('is_active', true)
        .order('display_order');

      if (typeError) throw typeError;

      // Get contacts and sort them based on dimension table order
      const { data, error } = await supabase
        .from('company_contacts')
        .select('*')
        .eq('company_id', companyId);

      if (error) throw error;

      // Sort contacts based on contact type display order from dimension table
      const sortedContacts = (data || []).sort((a, b) => {
        const typeA = contactTypes?.find(t => t.contact_type_name === a.contact_type);
        const typeB = contactTypes?.find(t => t.contact_type_name === b.contact_type);
        const orderA = typeA?.display_order || 999;
        const orderB = typeB?.display_order || 999;
        return orderA - orderB;
      });

      return sortedContacts as CompanyContact[];
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

  async createNote(note: Partial<CompanyNote> | { company_id: string; type: string; text: string; follow_up_date?: string }) {
    return withErrorHandling(async () => {
      let processedNote: Partial<CompanyNote>;
      
      // Handle both formats: direct note object or simplified format
      if ('type' in note && 'text' in note) {
        // Simplified format from NotesSection
        const noteTypes = await this.getNoteTypes();
        const noteType = noteTypes.find(t => t.name === note.type);
        
        if (!noteType) {
          throw new Error('Invalid note type');
        }

        processedNote = {
          company_id: note.company_id,
          note_type: note.type,
          note_type_id: noteType.id,
          note_text: note.text,
          follow_up_date: note.follow_up_date || null,
          follow_up_type: undefined,
          created_date: new Date().toISOString()
        };
      } else {
        // Direct note object format
        processedNote = { ...note };
        
        // If note_type is provided but not note_type_id, look it up
        if (processedNote.note_type && !processedNote.note_type_id) {
          const noteTypes = await this.getNoteTypes();
          const noteType = noteTypes.find(t => t.name === processedNote.note_type);
          if (noteType) {
            processedNote.note_type_id = noteType.id;
          }
        }
      }

      const { data, error } = await supabase
        .from('company_notes')
        .insert([processedNote])
        .select()
        .single();

      if (error) {
        console.error('Supabase insert error:', error);
        throw error;
      }
      
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

      companies?.forEach(company => {
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