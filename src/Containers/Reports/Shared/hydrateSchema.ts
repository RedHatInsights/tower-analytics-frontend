import { ChartSchemaElement } from 'react-json-chart-builder';
import { SchemaFnc } from './types';

/**
 * I have strong hunch that you can use one function to hydrate
 * the schema and return a plain function with the hydrated schema
 * which can be used. This would optimize the code much more, since
 * we would not meet to run JSON stringify and parse + replace
 * methods all the time. However the slowdown is pretty small,
 * so I left it as is for now.
 *
 * @param schema The stringified version of the schema.
 * @returns The hydrated schema with passed variables.
 */

function replaceStringWithArray(
  oj: any,
  sourceValue: string,
  targetValue: any
) {
  // do not replace with non-existing value
  if (!targetValue) return;
  Object.keys(oj).forEach((key) => {
    // return if there's no value
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (!oj[key]) return;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (Array.isArray(oj[key])) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      if (oj[key].includes(sourceValue)) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
        oj[key] = targetValue;
      } else {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        replaceStringWithArray(oj[key], sourceValue, targetValue);
      }
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (typeof oj[key] === 'object') {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      replaceStringWithArray(oj[key], sourceValue, targetValue);
    } else {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (oj[key] === sourceValue) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
        oj[key] = targetValue;
      }
    }
  });
}

const hydrateSchema =
  (
    schema: ChartSchemaElement[],
    dataApi: {
      result: { meta: { count: 0; legend: []; yAxisDomain: []; yTicks: [] } };
    }
  ): SchemaFnc =>
  (props) => {
    if (!props) {
      return schema;
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const hydratedSchema = JSON.parse(JSON.stringify(schema));
    replaceStringWithArray(
      hydratedSchema,
      'MAX_DOMAIN_',
      dataApi?.result?.meta?.yAxisDomain
    );
    replaceStringWithArray(
      hydratedSchema,
      'TICK_VALUES_',
      dataApi?.result?.meta?.yTicks
    );
    let stringifiedHydratedSchema = JSON.stringify(hydratedSchema);
    Object.entries(props).forEach((arr) => {
      const regVar = new RegExp(`VAR_${arr[0]}`, 'g');
      stringifiedHydratedSchema = stringifiedHydratedSchema.replace(
        regVar,
        `${arr[1]}`
      );
    });
    return JSON.parse(stringifiedHydratedSchema) as ChartSchemaElement[];
  };

export default hydrateSchema;
