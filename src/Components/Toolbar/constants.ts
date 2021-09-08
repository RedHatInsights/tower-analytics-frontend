export interface OptionsForCategories {
  [key: string]: {
    type: string;
    name: string;
    hasChips: boolean;
    isSingle?: boolean;
    placeholder?: string;
  };
}

export const optionsForCategories: OptionsForCategories = {
  status: {
    type: 'select',
    isSingle: false,
    name: 'Status',
    placeholder: 'Filter by job status',
    hasChips: true,
  },
  quick_date_range: {
    type: 'select',
    isSingle: true,
    name: 'Date',
    placeholder: 'Filter by date',
    hasChips: false,
  },
  start_date: {
    type: 'date',
    name: 'Start date',
    hasChips: false,
  },
  end_date: {
    type: 'date',
    name: 'End date',
    hasChips: false,
  },
  job_type: {
    type: 'select',
    isSingle: false,
    name: 'Job',
    placeholder: 'Filter by job type',
    hasChips: true,
  },
  org_id: {
    type: 'select',
    isSingle: false,
    name: 'Organization',
    placeholder: 'Filter by organization',
    hasChips: true,
  },
  cluster_id: {
    type: 'select',
    isSingle: false,
    name: 'Cluster',
    placeholder: 'Filter by cluster',
    hasChips: true,
  },
  template_id: {
    type: 'select',
    isSingle: false,
    name: 'Template',
    placeholder: 'Filter by template',
    hasChips: true,
  },
  sort_options: {
    type: 'select',
    isSingle: true,
    name: 'Sort by',
    placeholder: 'Sort by attribute',
    hasChips: false,
  },
  automation_status: {
    type: 'select',
    isSingle: false,
    name: 'Automation status',
    placeholder: 'Filter by automation status',
    hasChips: true,
  },
  frequency_period: {
    type: 'select',
    isSingle: false,
    name: 'Frequency',
    placeholder: 'Filter by frequency',
    hasChips: true,
  },
  category: {
    type: 'select',
    isSingle: false,
    name: 'Category',
    placeholder: 'Filter by category',
    hasChips: true,
  },
  inventory_id: {
    type: 'select',
    isSingle: false,
    name: 'Inventory',
    placeholder: 'Filter by inventory',
    hasChips: true,
  },
  name: {
    type: 'text',
    name: 'Search by name',
    hasChips: true,
  },
};
