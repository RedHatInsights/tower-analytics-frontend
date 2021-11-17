import { ChartSchemaElement, ChartType } from 'react-json-chart-builder';
import { SchemaFnc } from './types';

/**
 * I have strong hunch that you can use one function to hydrate
 * the schema and return a plain function with the hydrated schema
 * which can be used. This would optimize the code much more, since
 * we would not neet to run JSON stringify and parse + replace
 * mthods all the time. However the slowdown is pretty small,
 * so I left it as is for now.
 *
 * @param schema The stringified version of the schema.
 * @returns The hidrated schema with passed variables.
 */
const hydrateSchema =
  (schema: ChartSchemaElement[]): SchemaFnc =>
  (props) => {
    if (!props) {
      return schema;
    }

    // The domain padding is currently a bug in the charting library,
    // TODO remove this when the bug is fixed.
    const extendedProps = {
      domainPaddingX:
        props.chartType && props.chartType === ChartType.bar ? 85 : 0,
      ...props,
    };

    let hydratedSchema = JSON.stringify(schema);
    Object.entries(extendedProps).forEach((arr) => {
      const regVar = new RegExp(`VAR_${arr[0]}`, 'g');
      hydratedSchema = hydratedSchema.replace(regVar, `${arr[1]}`);
    });

    return JSON.parse(hydratedSchema) as ChartSchemaElement[];
  };

export default hydrateSchema;
