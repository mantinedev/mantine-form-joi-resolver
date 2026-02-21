import type { FormErrors } from '@mantine/form';
import { ObjectSchema, ValidationError, ValidationOptions } from 'joi';

export type JoiResolverOptions = ValidationOptions & {
  mode?: 'sync' | 'async';
};

function getValidationErrors(error: ValidationError): FormErrors {
  const results: FormErrors = {};

  error.details.forEach((error) => {
    if (!error.path.length) {
      return;
    }

    const fieldPath = error.path.map(String).join('.');
    if (fieldPath) {
      results[fieldPath] = error.message;
    }
  });

  return results;
}

export function joiResolver(
  schema: ObjectSchema<any>,
  options: JoiResolverOptions & { mode: 'async' }
): (values: Record<string, unknown>) => Promise<FormErrors>;

export function joiResolver(
  schema: ObjectSchema<any>,
  options?: JoiResolverOptions
): (values: Record<string, unknown>) => FormErrors;

export function joiResolver(schema: ObjectSchema<any>, options?: JoiResolverOptions) {
  return (values: Record<string, unknown>) => {
    const { mode, ...validationOptions } = options || {};
    const resolvedOptions = { abortEarly: false, ...validationOptions };

    if (mode === 'async') {
      return schema
        .validateAsync(values, resolvedOptions)
        .then(() => ({}))
        .catch((error: unknown) => {
          if (error instanceof ValidationError) {
            return getValidationErrors(error);
          }

          throw error;
        });
    }

    const parsed = schema.validate(values, resolvedOptions);
    if (!parsed.error) {
      return {};
    }

    return getValidationErrors(parsed.error);
  };
}
