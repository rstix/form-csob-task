Důraz na popsané chování a především validace dle zadání.

## MainForm

Vytvořte formulář v form/MainForm.tsx

- Zde vytvořte formulář pomocí knihovny react-hook-form.
- Formulář by měl splňovat:

1.  být validován yup schématem
2.  formulář obsahovat pole "NestedFields" z vedlejšího souboru
3.  být plně TS typovaný
4.  nevalidní vstupy jakkoliv červeně označit (background/outline/border) a zobrazit u nich chybové hlášky
5.  nastavte výchozí hodnoty objektem initalValues
6.  mít "Submit" tlačítko, po jeho stisku se vylogují data z formuláře: "console.log(formData)"

V tomto souboru budou definovány pole:

- amount - number; Validace min=0, max=300
- damagedParts - string[] formou multiple-checkboxes s volbami "roof", "front", "side", "rear"
- vykresleny pole z form/NestedFields

## NestedFields

Vytvořte formulářová pole v odděleném souboru form/NestedFields.tsx a zahrňte je do MainForm.

- Zde vytvořte formulářové vstupy pomocí react-hook-form, které:

1.  Budou součástí formuláře v MainForm, ale zůstanou v odděleném souboru
2.  Reference formuláře NEbude získána skrze Prop input (vyvarovat se "Prop drilling")
3.  Získá volby (options) pro pole "kategorie" z externího API: https://dummyjson.com/products/categories jako "value" bude "slug", jako "label" bude "name".

V tomto souboru budou definovány pole:

- allocation - number; Bude disabled pokud není amount (z MainForm) vyplněno. Validace na min=0, max=[zadaná hodnota v amount]
- category - string; Select input s volbami z API (label=name; value=slug)
- witnesses - FieldArray - dynamické pole kdy lze tlačítkem přidat a odebrat dalšího svědka; Validace minimálně 1 svědek, max 5 svědků
- witnesses.name - string; Validace required
- witnesses.email - string; Validace e-mail a asynchronní validace, že email neexistuje na API _https://dummyjson.com/users/search?q=[ZADANÝ EMAIL]_ - tato validace by měla mít debounce 500ms

### Vykreslete výsledný formulář v App.tsx cílem je plně funkční formulář logující vyplněná data do konzole
