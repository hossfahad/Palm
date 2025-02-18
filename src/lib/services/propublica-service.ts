import { z } from "zod";

// Zod schema for nonprofit organization data
export const NonprofitOrganizationSchema = z.object({
  organization: z.object({
    ein: z.string(),
    name: z.string(),
    address: z.string().nullable(),
    city: z.string().nullable(),
    state: z.string().nullable(),
    ntee_code: z.string().nullable(),
    raw_ntee_code: z.string().nullable(),
    subsection_code: z.number().nullable(),
    classification_codes: z.array(z.string()).nullable(),
    ruling_date: z.string().nullable(),
    asset_amount: z.number().nullable(),
    income_amount: z.number().nullable(),
    latest_filing_date: z.string().nullable(),
  }),
  filings_with_data: z.array(
    z.object({
      tax_prd_yr: z.string(),
      tax_prd: z.string(),
      formtype: z.string(),
      pdf_url: z.string(),
      updated: z.string(),
      tax_prd_yr_span: z.number(),
    })
  ).optional(),
});

export type NonprofitOrganization = z.infer<typeof NonprofitOrganizationSchema>;

const PROPUBLICA_API_BASE_URL = "https://projects.propublica.org/nonprofits/api/v2";

export class PropublicaService {
  /**
   * Fetches nonprofit organization data by EIN
   * @param ein - Employer Identification Number
   * @returns Promise with nonprofit organization data
   */
  static async getOrganizationByEin(ein: string): Promise<NonprofitOrganization> {
    try {
      const response = await fetch(`${PROPUBLICA_API_BASE_URL}/organizations/${ein}.json`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch organization data: ${response.statusText}`);
      }

      const data = await response.json();
      return NonprofitOrganizationSchema.parse(data);
    } catch (error) {
      console.error("Error fetching organization data:", error);
      throw error;
    }
  }

  /**
   * Searches for nonprofit organizations
   * @param query - Search query string
   * @param state - Optional state filter
   * @param nteeCode - Optional NTEE code filter
   * @returns Promise with search results
   */
  static async searchOrganizations(
    query: string,
    state?: string,
    nteeCode?: string
  ) {
    try {
      const params = new URLSearchParams({
        q: query,
        ...(state && { state }),
        ...(nteeCode && { ntee: nteeCode }),
      });

      const response = await fetch(
        `${PROPUBLICA_API_BASE_URL}/search.json?${params.toString()}`
      );

      if (!response.ok) {
        throw new Error(`Failed to search organizations: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error searching organizations:", error);
      throw error;
    }
  }
} 