import Joi from 'joi';
import { act, renderHook } from '@testing-library/react';
import { useForm } from '@mantine/form';
import { joiResolver } from './joi-resolver';

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

it('validates basic fields with given joi schema', () => {
  const hook = renderHook(() =>
    useForm({
      initialValues: {
        name: '',
        email: '',
        age: 16,
      },
      validate: joiResolver(schema),
    })
  );

  expect(hook.result.current.errors).toStrictEqual({});
  act(() => hook.result.current.validate());

  expect(hook.result.current.errors).toStrictEqual({
    name: 'Name should have at least 2 letters',
    email: 'Invalid email',
    age: 'You must be at least 18 to create an account',
  });

  act(() => hook.result.current.setValues({ name: 'John', email: 'john@email.com', age: 16 }));
  act(() => hook.result.current.validate());

  expect(hook.result.current.errors).toStrictEqual({
    age: 'You must be at least 18 to create an account',
  });
});

const nestedSchema = Joi.object({
  nested: Joi.object({
    field: Joi.string().min(2).messages({
      'string.min': 'Field should have at least 2 letters',
      'string.empty': 'Field should have at least 2 letters',
    }),
  }),
});

it('validates nested fields with given joi schema', () => {
  const hook = renderHook(() =>
    useForm({
      initialValues: {
        nested: {
          field: '',
        },
      },
      validate: joiResolver(nestedSchema),
    })
  );

  expect(hook.result.current.errors).toStrictEqual({});
  act(() => hook.result.current.validate());

  expect(hook.result.current.errors).toStrictEqual({
    'nested.field': 'Field should have at least 2 letters',
  });

  act(() => hook.result.current.setValues({ nested: { field: 'John' } }));
  act(() => hook.result.current.validate());

  expect(hook.result.current.errors).toStrictEqual({});
});

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

it('validates list fields with given joi schema', () => {
  const hook = renderHook(() =>
    useForm({
      initialValues: {
        list: [{ name: '' }],
      },
      validate: joiResolver(listSchema),
    })
  );

  expect(hook.result.current.errors).toStrictEqual({});
  act(() => hook.result.current.validate());

  expect(hook.result.current.errors).toStrictEqual({
    'list.0.name': 'Name should have at least 2 letters',
  });

  act(() => hook.result.current.setValues({ list: [{ name: 'John' }] }));
  act(() => hook.result.current.validate());

  expect(hook.result.current.errors).toStrictEqual({});
});
