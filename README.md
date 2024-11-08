# PlainLaw API
RESTful API para aplicación PlainLaw

## Endpoints

### Módulo autentificación

#### GET
- **/api/auth/check** Verificar sesion iniciada y obtener tipo de usuario

  - Requiere estar logueado

#### POST
- **/api/auth/signup** Registrar usuario.

  - Requiere no estar logueado

```
{
  "username": string min(3) max(20) required,
  "password": string min(3) required,
  "name": string min(3) max(30) required,
  "patLastName": string min(3) max(30) required,
  "matLastName": string min(3) max(30),
  "phone": string min(3) max(15) required
}
```

- **/api/auth/login** Iniciar sesion

  - Requiere no estar logueado
```
{
    "username": string min(3) max(20) required,
    "password": string min(3) required
}
```

#### PUT
- **/api/auth/changePassword** Cambiar la contraseña del usuario actual

  - Requiere estar logueado
```
{
    "password":  string min(3) required,
    "newPassword":  string min(3) required
}
```

#### DELETE
- **/api/auth/logout** Cerrar la sesión del usuario actual

  - Requiere estar logueado

### Módulo usuarios

#### GET

- **/api/users/current** Obtener los datos del usuario actual

  - Requiere estar logueado


#### PUT
- **/api/users/current** Actualizar los datos del usuario actual

  - Requiere estar logueado
```
{
    "name": string min(3) max(30) required,
    "patLastName": string min(3) max(30) required,
    "matLastName": string min(3) max(30),
    "phone": string min(3) max(15) required
}
```

#### DELETE
- **/api/users/current** Elimina al usuario actual

  - Requiere estar logueado

### Módulo resumenes

#### GET

- **/api/summaries/all/[page]** Obtener una lista de todos los resumenes del usuario. 

  - Requiere estar logueado

- **/api/summaries/search/[id]** Obtener el resumen del ID indicado. 

  - Requiere estar logueado


#### POST
- **/api/summaries/ai** Resumir con la I.A. los términos y condiciones. Retorna array con cada párrafo resumido.

  - Requiere estar logueado
```
{
    "termsConditions": array items(string min(3) max(2500) required) required 
}
```

- **/api/summaries/sign** Subir el resumen a la base de datos.

  - Requiere estar logueado
```
{
    "site": string min(3) max(50) required, 
    "content": array items(string min(3) max(350) required) required, 
    "notes": string min(3) max(255)
}
```

#### DELETE
- **/api/summaries/search/[id]** Elimina el resumen del id indicado

  - Requiere estar logueado