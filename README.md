# mantine-form-joi-resolver

[joi](https://www.npmjs.com/package/joi) resolver for [@mantine/form](https://mantine.dev/form/use-form/).

## Installation

With yarn:

```sh
yarn add joi mantine-form-joi-resolver
```

With npm:

```sh
npm install joi mantine-form-joi-resolver
```

## Basic fields validation

```tsx
import Joi from 'joi';
import { useForm } from '@mantine/form';
import { joiResolver } from 'mantine-form-joi-resolver';

const schema = Joi.object({
  name: Joi.string().min(2).messages({
    'string.min': 'Name should have at least 2 letters',
    'string.empty': 'Name should have at least 2 letters',
  }),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .messages({
      'string.email': 'Invalid email',
      'string.empty': 'Invalid email',
    }),
  age: Joi.number().min(18).message('You must be at least 18 to create an account'),
});

const form = useForm({
  initialValues: {
    name: '',
    email: '',
    age: 16,
  },
  validate: joiResolver(schema),
});

form.validate();
form.errors;
// -> {
//  name: 'Name should have at least 2 letters',
//  email: 'Invalid email',
//  age: 'You must be at least 18 to create an account'
// }
```

## Nested fields validation

```tsx
import Joi from 'joi';
import { useForm } from '@mantine/form';
import { joiResolver } from 'mantine-form-joi-resolver';

const nestedSchema = Joi.object({
  nested: Joi.object({
    field: Joi.string().min(2).messages({
      'string.min': 'Field should have at least 2 letters',
      'string.empty': 'Field should have at least 2 letters',
    }),
  }),
});
const form = useForm({
  initialValues: {
    nested: {
      field: '',
    },
  },
  validate: joiResolver(nestedSchema),
});

form.validate();
form.errors;
// -> {
//  'nested.field': 'Field should have at least 2 letters',
// }
```

## List fields validation

```tsx
import Joi from 'joi';
import { useForm } from '@mantine/form';
import { joiResolver } from 'mantine-form-joi-resolver';

const listSchema = Joi.object({
  list: Joi.array().items(
    Joi.object({
      name: Joi.string().min(2).messages({
        'string.min': 'Name should have at least 2 letters',
        'string.empty': 'Name should have at least 2 letters',
      }),
    })
  ),
});

const form = useForm({
  initialValues: {
    list: [{ name: '' }],
  },
  validate: joiResolver(listSchema),
});

form.validate();
form.errors;
// -> {
//  'list.0.name': 'Name should have at least 2 letters',
// }
```

## License

MIT
