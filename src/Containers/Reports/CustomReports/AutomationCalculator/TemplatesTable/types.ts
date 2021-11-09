export interface Template {
  name: string;
  enabled: boolean;
  id: number;
  avgRunTime: number;
  successful_hosts_total: number;
  delta: number;
  // Extended table fields
  elapsed: number;
  host_count: number;
  total_count: number;
  total_org_count: number;
  total_cluster_count: number;
  total_inventory_count: number;
}
