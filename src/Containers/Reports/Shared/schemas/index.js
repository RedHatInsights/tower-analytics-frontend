import affected_hosts_by_playbook from './affected_hosts_by_playbook';
import changes_made from './changes_made';
import playbook_run_rate from './playbook_run_rate';

const reports = [
  affected_hosts_by_playbook,
  changes_made,
  playbook_run_rate,
].map((report, id) => ({ id: id + 1, ...report }));

export const getReport = (id) =>
  reports.find((report) => report.id === parseInt(id));

export default reports;
