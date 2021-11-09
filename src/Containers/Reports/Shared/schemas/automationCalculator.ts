import { CATEGORIES } from '../constants';
import { ReportPageParams } from '../types';
import AutomationCalculator from '../../CustomReports/AutomationCalculator';

const slug = 'automation_calculator';

const name = 'Automation calculator';

const description = 'Some desc.';

const categories = [CATEGORIES.executive];

const reportParams: ReportPageParams = {
  slug,
  name,
  description,
  categories,
  ReportComponent: AutomationCalculator,
};

export default reportParams;
