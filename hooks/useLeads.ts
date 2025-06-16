import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { GooglePlacesService } from '@/services/googlePlaces';
import { ClaudeMenuService, isClaudeConfigured } from '@/services/claudeMenuService';
import { PerplexityMenuService } from '@/services/perplexityMenuService';

export interface DatabaseLead {
  id: string;
  business_name: string;
  location: string;
  address?: string;
  category: string;
  cuisine_type?: string;
  rating: number;
  review_count: number;
  status: 'new' | 'contacted' | 'sampling' | 'won';
  next_action?: string;
  product_match?: string;
  upcoming_event?: string;
  local_buzz?: string;
  note?: string;
  reminder?: string;
  contact_name?: string;
  contact_title?: string;
  contact_phone?: string;
  contact_email?: string;
  is_open: boolean;
  is_newly_opened: boolean;
  price_level: number;
  latitude?: number;
  longitude?: number;
  sales_potential: 'High' | 'Medium' | 'Low';
  menu_analysis_status: 'pending' | 'processing' | 'completed' | 'failed';
  menu_analysis_data?: any;
  google_place_id?: string;
  menu_analysis_started_at?: string;
  menu_analysis_completed_at?: string;
  created_at: string;
  updated_at: string;
  
  // Post Visit Data - Reference: PRD/POST_VISIT_PRD.md
  post_visit_checklist?: PostVisitChecklistItem[];
  post_visit_notes?: PostVisitNote[];
  post_visit_actions?: PostVisitAction[];
  post_visit_last_updated?: string;
}

// Post Visit Data Types - Reference: PRD/POST_VISIT_PRD.md
export interface PostVisitChecklistItem {
  id: string;
  text: string;
  checked: boolean;
  is_custom: boolean;
  created_at: string;
}

export interface PostVisitNote {
  id: string;
  content: string;
  created_at: string;
  updated_at?: string;
}

export interface PostVisitAction {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  is_custom: boolean;
  due_date?: string;
  created_at: string;
  completed_at?: string;
}

export const useLeads = () => {
  const [leads, setLeads] = useState<DatabaseLead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLeads = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) {
        throw fetchError;
      }

      setLeads(data || []);
    } catch (err) {
      console.error('Error fetching leads:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch leads');
    } finally {
      setIsLoading(false);
    }
  };

  const addLead = async (leadData: Omit<DatabaseLead, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error: insertError } = await supabase
        .from('leads')
        .insert([leadData])
        .select()
        .single();

      if (insertError) {
        throw insertError;
      }

      if (data) {
        setLeads(prevLeads => [data, ...prevLeads]);
        
        // Trigger background menu analysis if Google Place ID is provided
        if (data.google_place_id && data.menu_analysis_status === 'pending') {
          triggerMenuAnalysis(data.id, data.google_place_id);
        }
      }

      return data;
    } catch (err) {
      console.error('Error adding lead:', err);
      throw err;
    }
  };

  const triggerMenuAnalysis = async (leadId: string, googlePlaceId: string) => {
    try {
      // Update status to processing
      await updateLead(leadId, {
        menu_analysis_status: 'processing',
        menu_analysis_started_at: new Date().toISOString(),
      });

      // In a real app, this would be a background job
      // For now, we'll simulate the process with a timeout
      setTimeout(async () => {
        try {
          // Fetch lead directly from database (don't use stale state)
          const { data: lead, error: leadError } = await supabase
            .from('leads')
            .select('*')
            .eq('id', leadId)
            .single();

          if (leadError || !lead) {
            throw new Error(`Lead not found: ${leadError?.message || 'Unknown error'}`);
          }

          console.log(`🔄 Starting menu analysis for ${lead.business_name}`);

          let menuAnalysis;

          // Try Perplexity service first for real menu data
          // Note: Web uses server-side proxy, mobile uses direct API calls
          if (PerplexityMenuService.isPerplexityConfigured()) {
            console.log('🚀 Attempting real menu analysis with Perplexity...');
            try {
              const placeDetails = await GooglePlacesService.getPlaceDetails(googlePlaceId);
              
              const restaurantInfo = {
                name: lead.business_name,
                address: lead.address || lead.location,
                phone: lead.contact_phone,
                website: placeDetails?.website,
                cuisineType: lead.cuisine_type || 'Restaurant',
                priceLevel: lead.price_level || 2,
                rating: lead.rating,
                reviewCount: lead.review_count
              };
              
              console.log(`🔍 Searching for menu with Perplexity: ${restaurantInfo.name}`);
              const perplexityData = await PerplexityMenuService.extractMenuData(restaurantInfo);
              
              if (perplexityData) {
                console.log(`✅ Perplexity menu data retrieved: ${perplexityData.dishes.length} dishes, confidence: ${perplexityData.confidence}`);
                
                menuAnalysis = PerplexityMenuService.generateMenuAnalysisFromPerplexityData(
                  perplexityData,
                  restaurantInfo
                );
              }
            } catch (perplexityError) {
              console.warn('⚠️ Perplexity analysis failed, falling back to standard analysis:', perplexityError);
            }
          } else {
            console.log('ℹ️ Perplexity not configured, using standard Google Places analysis');
          }

          // Fallback to standard Google Places analysis
          if (!menuAnalysis) {
            console.log('📍 Using standard Google Places analysis...');
            const placeDetails = await GooglePlacesService.getPlaceDetails(googlePlaceId);
            
            const restaurant = {
              id: googlePlaceId,
              name: lead.business_name,
              coordinates: { latitude: lead.latitude, longitude: lead.longitude },
              rating: lead.rating,
              reviewCount: lead.review_count,
              cuisineType: lead.cuisine_type,
              address: lead.address,
              isOpen: true,
              isNewlyOpened: false,
              priceLevel: 2
            };

            menuAnalysis = GooglePlacesService.analyzeMenuFromPlaceData(restaurant, placeDetails);
          }

          // Update the lead with completed analysis
          await updateLead(leadId, {
            menu_analysis_status: 'completed',
            menu_analysis_data: menuAnalysis,
            menu_analysis_completed_at: new Date().toISOString(),
          });

          console.log(`✅ Menu analysis completed for ${lead.business_name}`);
          
          // Force refresh leads data to update UI immediately
          await fetchLeads();
        } catch (error) {
          console.error('Menu analysis failed:', error);
          
          await updateLead(leadId, {
            menu_analysis_status: 'failed',
            menu_analysis_completed_at: new Date().toISOString(),
          });
          
          // Force refresh leads data to update UI
          await fetchLeads();
        }
      }, 5000); // 5 second delay to simulate processing
    } catch (error) {
      console.error('Error starting menu analysis:', error);
    }
  };

  const updateLead = async (id: string, updates: Partial<DatabaseLead>) => {
    try {
      const { data, error: updateError } = await supabase
        .from('leads')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (updateError) {
        throw updateError;
      }

      if (data) {
        setLeads(prevLeads => 
          prevLeads.map(lead => lead.id === id ? data : lead)
        );
      }

      return data;
    } catch (err) {
      console.error('Error updating lead:', err);
      throw err;
    }
  };

  // Force retrigger menu analysis for testing (useful for debugging)
  const retriggerMenuAnalysis = async (leadId: string) => {
    try {
      const lead = leads.find(l => l.id === leadId);
      if (!lead || !lead.google_place_id) {
        console.error('Lead not found or missing Google Place ID');
        return;
      }

      console.log(`🔄 Manually retriggering menu analysis for ${lead.business_name}`);
      
      // Reset status to trigger fresh analysis
      await updateLead(leadId, {
        menu_analysis_status: 'pending',
        menu_analysis_data: null,
        menu_analysis_started_at: null,
        menu_analysis_completed_at: null,
      });

      // Trigger the analysis
      await triggerMenuAnalysis(leadId, lead.google_place_id);
      
    } catch (error) {
      console.error('Error retriggering menu analysis:', error);
    }
  };

  const deleteLead = async (id: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('leads')
        .delete()
        .eq('id', id);

      if (deleteError) {
        throw deleteError;
      }

      setLeads(prevLeads => prevLeads.filter(lead => lead.id !== id));
    } catch (err) {
      console.error('Error deleting lead:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  return {
    leads,
    isLoading,
    error,
    fetchLeads,
    addLead,
    updateLead,
    deleteLead,
    retriggerMenuAnalysis,
  };
};

export function useLeadById(id: string | undefined) {
  const { leads, isLoading: leadsLoading } = useLeads();
  
  const result = useMemo(() => {
    if (!id) return { lead: null, isLoading: false };
    
    const dbLead = leads.find((lead: DatabaseLead) => lead.id === id);
    
    // Convert database lead to the expected Lead format for the detail page
    if (dbLead) {
      // Use database menu analysis if completed, otherwise show appropriate state
      let menuAnalysis;
      
      if (dbLead.menu_analysis_status === 'completed' && dbLead.menu_analysis_data) {
        menuAnalysis = dbLead.menu_analysis_data;
      } else if (dbLead.menu_analysis_status === 'processing') {
        menuAnalysis = {
          title: 'Menu Analysis',
          subtitle: 'AI is analyzing the menu... This usually takes 2-3 minutes.',
          isProcessing: true,
          topItems: []
        };
      } else if (dbLead.menu_analysis_status === 'failed') {
        menuAnalysis = {
          title: 'Menu Analysis',
          subtitle: 'Menu analysis failed. Please try again.',
          isFailed: true,
          topItems: []
        };
      } else {
        // Default mock menu analysis for pending status
        menuAnalysis = {
          title: 'Menu Analysis',
          subtitle: 'Showing example analysis while AI researches the actual menu...',
          isPending: true,
          topItems: [
            {
              id: `${dbLead.category.toLowerCase()}-specialty`,
              name: `Signature ${dbLead.category} Dish`,
              price: '$24.50',
              productMatches: [
                {
                  name: 'Premium ingredients tailored for authentic cuisine'
                }
              ],
              pitchAngle: `This signature dish represents the authentic flavors customers expect. Using premium ingredients will enhance quality and consistency while improving profit margins.`,
              matches: [
                {
                  id: 'premium-ingredient-1',
                  name: 'Premium Main Ingredient',
                  matchPercentage: 88,
                  defaultPrice: '$15.50',
                  retailPrice: '$18.00',
                  yourPrice: '$16.75',
                  avgMargin: '$1.25 / 8.1%',
                  alternatives: [
                    {
                      id: 'alternative-1',
                      name: 'Alternative Premium Option',
                      matchPercentage: 85,
                      defaultPrice: '$14.00',
                      retailPrice: '$16.50',
                      yourPrice: '$15.25',
                      avgMargin: '$1.25 / 8.9%'
                    }
                  ]
                },
                {
                  id: 'premium-ingredient-2',
                  name: 'Specialty Seasoning Blend',
                  matchPercentage: 92,
                  defaultPrice: '$8.50',
                  retailPrice: '$10.00',
                  yourPrice: '$9.25',
                  avgMargin: '$0.75 / 8.8%',
                  alternatives: []
                }
              ],
              basketTotal: {
                salePrice: '$26.00',
                profit: '$2.00',
                avgMargin: '8.3%'
              }
            }
          ]
        };
      }

      const lead = {
        id: dbLead.id,
        name: dbLead.business_name,
        venue: dbLead.category,
        venueType: dbLead.category,
        address: dbLead.address || `${dbLead.location}, NSW`,
        stage: dbLead.status === 'new' ? 'New' : 
               dbLead.status === 'contacted' ? 'Contacted' :
               dbLead.status === 'sampling' ? 'Sampling' : 'Won',
        createdAt: new Date(dbLead.created_at).toLocaleDateString(),
        lastInteraction: 'Recently updated',
        
        // Venue Analysis Fields
        isNew: dbLead.is_newly_opened,
        location: dbLead.location,
        category: dbLead.category,
        bestTime: '11:00-14:00',
        rating: dbLead.rating,
        reviewCount: dbLead.review_count,
        recentReview: {
          date: '2 days ago',
          text: dbLead.local_buzz || `Great ${dbLead.category.toLowerCase()} restaurant with excellent service and quality ingredients.`,
          rating: dbLead.rating,
          reviewCount: dbLead.review_count
        },
        menuAnalysis,
        
        interestedSkus: [
          {
            id: 'sku1',
            name: 'Premium Ingredients',
            details: 'High-quality supplies for better dishes'
          }
        ],
        suggestedActions: [
          {
            title: 'Schedule Visit',
            description: 'Arrange initial meeting to discuss product needs',
            icon: 'calendar'
          },
          {
            title: 'Send Samples',
            description: 'Provide product samples for trial',
            icon: 'send'
          }
        ],
        contact: {
          name: dbLead.contact_name || `${dbLead.business_name} Manager`,
          title: dbLead.contact_title || 'Restaurant Manager',
          phone: dbLead.contact_phone || '+61 2 9xxx xxxx',
          email: dbLead.contact_email || `contact@${dbLead.business_name.toLowerCase().replace(/\s+/g, '')}.com.au`
        },
        notes: [
          {
            id: 'note1',
            date: new Date(dbLead.created_at).toLocaleDateString(),
            content: dbLead.note || `Added from map discovery. ${dbLead.is_open ? 'Currently open' : 'Currently closed'}. Rating: ${dbLead.rating} stars (${dbLead.review_count} reviews).`,
            type: 'Discovery'
          }
        ]
      };
      
      return { lead, isLoading: leadsLoading };
    }
    
    return { lead: null, isLoading: leadsLoading };
  }, [id, leads, leadsLoading]);
  
  return result;
}