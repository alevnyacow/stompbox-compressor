# Compressor

Framework-agnostic plug-and-play entities and value objects.

## Entity example

```ts
import { Entity } from '@stompbox/compressor'
import z from 'zod'

class User extends Entity(
    z.object({ 
        name: z.string().nonempty(), 
        surname: z.string().nonempty()
    })
) { }

type UserModel = User['model']

try {
    // autocomplete and runtime zod validation
    const test = new User({
        id: 'user-1',
        name: '',
        surname: ''
    })
} catch(e) {
    console.error(e)
}

const user = new User({ 
    id: 'user-1', 
    name: 'First', 
    surname: 'User' 
})

const { id, name, surname } = user.model

```

## Value object example

```ts
import { ValueObject } from '@stompbox/compressor'

class PositiveInteger extends ValueObject(
    z.int().positive()
) { }

type PositiveIntegerModel = PositiveInteger['model']

try {
    // autocomplete and runtime zod validation
    const test = new PositiveInteger(-4)
} catch(e) {
    console.error(e)
}

const positiveInteger = new PositiveInteger(5)
console.log(positiveInteger.model) // 5
```