# CPF

Validate or generate a Brazilian CPF

## Usage

```
import { validate, generate } from 'https://cpf.jsfn.run/index.mjs'

const valid = await validate('676.754.677-10')
console.log(
  await validate(await generate());
);
```
