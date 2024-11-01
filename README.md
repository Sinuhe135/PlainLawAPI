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
