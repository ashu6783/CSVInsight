import Papa, { ParseConfig } from 'papaparse';

export interface Creative {
  creative_id: string;
  creative_name: string;
  country: string;
  ad_network: string;
  os: string;
  campaign: string;
  ad_group: string;
  ipm: number;
  ctr: number;
  spend: number;
  impressions: number;
  clicks: number;
  cpm: number;
  cost_per_click: number;
  cost_per_install: number;
  installs: number;
  tags: string;
}

export let mockData: Creative[] = [];

export const loadCsvData = (csvContent: string) => {
  const config: ParseConfig<Creative> = {
    header: true,
    skipEmptyLines: true,
    complete: (result: Papa.ParseResult<Creative>) => {
      if (result.errors.length > 0) {
        console.error('Error parsing CSV:', result.errors.map((e) => e.message));
        return;
      }
      mockData = result.data.map((row: Creative) => ({
        creative_id: row.creative_id,
        creative_name: row.creative_name,
        tags: row.tags || '',
        country: row.country,
        ad_network: row.ad_network,
        os: row.os,
        campaign: row.campaign,
        ad_group: row.ad_group,
        ipm: parseFloat(String(row.ipm)) || 0,
        ctr: parseFloat(String(row.ctr)) || 0,
        spend: parseFloat(String(row.spend)) || 0,
        impressions: parseInt(String(row.impressions), 10) || 0,
        clicks: parseInt(String(row.clicks), 10) || 0,
        cpm: parseFloat(String(row.cpm)) || 0,
        cost_per_click: parseFloat(String(row.cost_per_click)) || 0,
        cost_per_install: parseFloat(String(row.cost_per_install)) || 0,
        installs: parseInt(String(row.installs), 10) || 0,
      }));
    },
  };

  Papa.parse<Creative>(csvContent, config);
};