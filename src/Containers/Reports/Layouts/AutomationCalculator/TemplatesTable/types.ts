export interface Template {
  name: string;
  id: number;
  elapsed: number;
  host_count: number;
  total_count: number;
  total_org_count: number;
  total_cluster_count: number;
  total_inventory_count: number;
  successful_hosts_total: number;
  successful_elapsed_total: number;
  // Calculated fields
  delta: number;
  avgRunTime: number;
  manualCost: number;
  automatedCost: number;
  enabled: boolean;
  // Anything else accidentally having it
  [key: string]: string | number | boolean;
}
