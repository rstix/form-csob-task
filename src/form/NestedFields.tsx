/**
 * Zde vytvořte formulářové vstupy pomocí react-hook-form, které:
 * 1) Budou součástí formuláře v MainForm, ale zůstanou v odděleném souboru
 * 2) Reference formuláře NEbude získána skrze Prop input (vyvarovat se "Prop drilling")
 * 3) Získá volby (options) pro pole "kategorie" z externího API: https://dummyjson.com/products/categories jako "value" bude "slug", jako "label" bude "name".
 *
 *
 * V tomto souboru budou definovány pole:
 * allocation - number; Bude disabled pokud není amount (z MainForm) vyplněno. Validace na min=0, max=[zadaná hodnota v amount]
 * category - string; Select input s volbami z API (label=name; value=slug)
 * witnesses - FieldArray - dynamické pole kdy lze tlačítkem přidat a odebrat dalšího svědka; Validace minimálně 1 svědek, max 5 svědků
 * witnesses.name - string; Validace required
 * witnesses.email - string; Validace e-mail a asynchronní validace, že email neexistuje na API https://dummyjson.com/users/search?q=[ZADANÝ EMAIL]  - tato validace by měla mít debounce 500ms
 */

import { useEffect, useState } from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';

interface CategoryOption {
  value: string;
  label: string;
}

interface CategoryApi {
  slug: string;
  name: string;
  url: string;
}

const NestedFields = () => {
  const {
    register,
    watch,
    setValue,
    control,
    formState: { errors },
  } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'witnesses',
  });

  const amount = watch('amount');

  const [categories, setCategories] = useState<CategoryOption[]>([]);

  useEffect(() => {
    fetch('https://dummyjson.com/products/categories')
      .then((response) => response.json())
      .then((data: CategoryApi[]) => {
        const options = data.map((item) => ({
          value: item.slug,
          label: item.name,
        }));
        setCategories(options);
      });
  }, []);

  useEffect(() => {
    if (!amount) {
      setValue('allocation', undefined);
    }
  }, [amount, setValue]);

  return (
    <>
      {categories.length && (
        <>
          <div>
            <label>Allocation:</label>
            <input
              type="number"
              {...register('allocation')}
              disabled={!amount}
              style={errors.allocation ? { borderColor: 'red' } : {}}
            />
            {errors.allocation && (
              <p style={{ color: 'red' }}>{errors.allocation.message}</p>
            )}
          </div>

          <div>
            <label>Category:</label>
            <select
              {...register('category')}
              style={errors.category ? { borderColor: 'red' } : {}}
            >
              <option value="">Select category</option>
              {categories.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.category && (
              <p style={{ color: 'red' }}>{errors.category.message}</p>
            )}
          </div>

          <div>
            <label>Witnesses:</label>
            {fields.map((field, index) => (
              <div key={field.id} style={{ marginBottom: '10px' }}>
                <input
                  placeholder="Name"
                  {...register(`witnesses.${index}.name`)}
                  style={
                    errors.witnesses?.[index]?.name
                      ? { borderColor: 'red' }
                      : {}
                  }
                />
                {errors.witnesses?.[index]?.name && (
                  <p style={{ color: 'red' }}>
                    {errors.witnesses[index]?.name?.message}
                  </p>
                )}

                <input
                  placeholder="Email"
                  {...register(`witnesses.${index}.email`)}
                  style={
                    errors.witnesses?.[index]?.email
                      ? { borderColor: 'red' }
                      : {}
                  }
                />
                {errors.witnesses?.[index]?.email && (
                  <p style={{ color: 'red' }}>
                    {errors.witnesses[index]?.email?.message}
                  </p>
                )}

                <button type="button" onClick={() => remove(index)}>
                  Remove Witness
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={() => append({ name: '', email: '' })}
              disabled={fields.length >= 5}
            >
              Add Witness
            </button>
          </div>
        </>
      )}
    </>
  );
};

export default NestedFields;
