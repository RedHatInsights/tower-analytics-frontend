import { ChartSchemaElement } from 'react-json-chart-builder';
import { AttributesType, SchemaFnc } from './types';
import { Endpoint, Params } from '../../../Api';
import { ExpandedTableRowName } from '../Layouts/Standard/Components';
import { BaseReportProps } from '../Layouts/types';

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
    console.log('33333333333', dataApi.result.meta.yAxisDomain);
    console.log('xssssssssssss', schema[0]?.props);
    const getMaxY = (data: { meta: any }) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (typeof data !== undefined && data?.meta?.legend.length > 0) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-return,@typescript-eslint/no-unsafe-member-access
        return data.meta.legend.reduce(
          (max: number, b: { host_avg_duration_per_task: number }) =>
            Math.max(max, b.host_avg_duration_per_task),
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          data.meta.legend[0].host_avg_duration_per_task
        );
      }
    };

    let hydratedSchema = JSON.stringify(schema);
    Object.entries(props).forEach((arr) => {
      const regVar = new RegExp(`VAR_${arr[0]}`, 'g');
      hydratedSchema = hydratedSchema.replace(regVar, `${arr[1]}`);
      // replace max domain value for scatterplot chart
      const regVarDomain = new RegExp(`MAX_DOMAIN_`, 'g');
      hydratedSchema = hydratedSchema.replace(
        regVarDomain,
        JSON.stringify(dataApi?.result?.meta?.yAxisDomain)
      );

      // replace max domain value for scatterplot chart
      const regVarTicks = new RegExp(`TICK_VALUES_`, 'g');
      hydratedSchema = hydratedSchema.replace(
        regVarTicks,
        dataApi?.result?.meta?.yTicks?.join()
      );
    });
    console.log('SSSSSSSSSSS STR', hydratedSchema);
    console.log('JJJJJJJJJJJ JSON', JSON.parse(hydratedSchema));
    return JSON.parse(hydratedSchema) as ChartSchemaElement[];
  };

export default hydrateSchema;
