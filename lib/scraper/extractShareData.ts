import { extractValue } from './extractValue';

export function extractShareData(response: { data: string }) {
  const shares = [];
  response.data.replace(
    '<script type="text/html" id="tmplShare">\n' +
      '                                                                                <table class="domain_os other">\n' +
      '                                                                                    <tr class="advanced">\n' +
      '                                                                                        <td>Unraid Share:</td>',
    '',
  );

  while (response.data.includes('<td>Unraid Share:</td>')) {
    const sourceRow = extractValue(
      response.data,
      '<td>Unraid Share:</td>',
      '</td>',
    );
    const targetRow = extractValue(
      response.data,
      '<td>Unraid Mount tag:</td>',
      '</td>',
    );
    shares.push({
      source: extractValue(sourceRow, 'value="', '"'),
      target: extractValue(targetRow, 'value="', '"'),
    });
    response.data = response.data.replace('<td>Unraid Share:</td>', '');
  }
  return shares;
}
