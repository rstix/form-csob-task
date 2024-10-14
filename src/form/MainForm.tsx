/**
 * Zde vytvořte formulář pomocí knihovny react-hook-form.
 * Formulář by měl splňovat:
 * 1) být validován yup schématem
 * 2) formulář obsahovat pole "NestedFields" z jiného souboru
 * 3) být plně TS typovaný
 * 4) nevalidní vstupy červeně označit (background/outline/border) a zobrazit u nich chybové hlášky
 * 5) nastavte výchozí hodnoty objektem initalValues
 * 6) mít "Submit" tlačítko, po jeho stisku se vylogují data z formuláře:  "console.log(formData)"
 *
 * V tomto souboru budou definovány pole:
 * amount - number; Validace min=0, max=300
 * damagedParts - string[] formou multi-checkboxu s volbami "roof", "front", "side", "rear"
 * vykresleny pole z form/NestedFields
 */

import { useForm, FormProvider, SubmitHandler } from 'react-hook-form';
import NestedFields from './NestedFields';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

interface Witness {
  name: string;
  email: string;
}

interface FormValues {
  amount: number;
  allocation: number;
  damagedParts: string[];
  category: string;
  witnesses: Witness[];
}

// příklad očekávaného výstupního JSON, předvyplňte tímto objektem formulář
const initialValues: FormValues = {
  amount: 250,
  allocation: 140,
  damagedParts: ['side', 'rear'],
  category: 'kitchen-accessories',
  witnesses: [
    {
      name: 'Marek',
      email: 'marek@email.cz',
    },
    {
      name: 'Emily',
      email: 'emily.johnson@x.dummyjson.com',
    },
  ],
};

const damagedPartsOptions = ['roof', 'front', 'side', 'rear'];

const schema = yup.object().shape({
  amount: yup
    .number()
    .nullable()
    .transform((value, originalValue) =>
      String(originalValue).trim() === '' ? null : value
    )
    .min(0, 'Minimum value is 0')
    .max(300, 'Maximum value is 300'),
  damagedParts: yup
    .array()
    .of(yup.string().oneOf(damagedPartsOptions))
    .min(1, 'Select at least one damaged part'),
  allocation: yup
    .number()
    .min(0, 'Minimum value is 0')
    .when('amount', (amount: number, schema) =>
      amount
        ? schema
            .max(amount, `Maximum value is ${amount}`)
            .required('Allocation is required')
        : schema.notRequired()
    ),
  category: yup.string().required('Category is required'),
  witnesses: yup
    .array()
    .of(
      yup.object().shape({
        name: yup.string().required('Name is required'),
        email: yup
          .string()
          .email('Invalid email')
          .required('Email is required')
          .test('email-exists', 'Email already exists', async (value) => {
            if (!value) return true;
            const response = await fetch(
              `https://dummyjson.com/users/search?q=${value}`
            );
            const data = await response.json();
            return data.total === 0;
          }),
      })
    )
    .min(1, 'At least one witness is required')
    .max(5, 'No more than 5 witnesses allowed'),
});

const MainForm = () => {
  const methods = useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues: initialValues,
    mode: 'onBlur',
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = methods;

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    console.log('Form Data:', data);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label>Amount:</label>
          <input
            type="number"
            {...register('amount')}
            style={errors.amount ? { borderColor: 'red' } : {}}
          />
          {errors.amount && (
            <p style={{ color: 'red' }}>{errors.amount.message}</p>
          )}
        </div>

        <div>
          <label>Damaged Parts:</label>
          {damagedPartsOptions.map((part) => (
            <div key={part}>
              <label>
                <input
                  type="checkbox"
                  value={part}
                  {...register('damagedParts')}
                />
                {part}
              </label>
            </div>
          ))}
          {errors.damagedParts && (
            <p style={{ color: 'red' }}>{errors.damagedParts.message}</p>
          )}
        </div>

        <NestedFields />

        <button type="submit">Submit</button>
      </form>
    </FormProvider>
  );
};

export default MainForm;
