import { parseServerDashboardHtml } from '../parseServerDashboardHtml';
import { dashboardHtml } from './data';

test('Parses server dashboard html', async () => {
  const res = parseServerDashboardHtml(dashboardHtml);
  expect(res).toMatchSnapshot();
});
