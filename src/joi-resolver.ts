import type { FormErrors } from '@mantine/form';
import { ObjectSchema, ValidationOptions } from 'joi';

export function joiResolver(schema: ObjectSchema<any>, options?: ValidationOptions) {
  return (values: Record<string, unknown>): FormErrors => {
    const parsed = schema.validate(values, { abortEarly: false, ...options });
    const results: FormErrors = {};

    if (!parsed.error) {
      return results;
    }

    parsed.error.details.forEach((error) => {
      results[error.path.join('.')] = error.message;
    });

    return results;
  };
}
