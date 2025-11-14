# SurtiPollo Project

Proyecto Bases datos, para la avicola SurtiPollo, Con front con tecnologías como Vite + react, tailwind css, y Back hecho con nodeJs Express y MySQL.

[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/DfacZ12/SurtiPolloProject)


## Authors

- Daniel Felipe Acuña
- Julian Estaban Cespedez
- Sharon Dayan Díaz

## API Reference

#### ListUsers

```http
  GET /api/listUsers
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `api_key` | `string` | **Required**. Your API key |

#### SelectUser

```http
  GET /api/selectUser/${id}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `api_key` | `string` | **Required**. Your API key |
| `id`      | `string` | **Required**. Id of item to fetch |


#### CreateUser

```http
  POST /api/createUser
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `api_key` | `string` | **Required**.  Your API key       |
| `formData`| `JSON`   | **Required** |

#### UpdateUser

```http
  POST /api/updateUser
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `api_key` | `string` | **Required**.  Your API key       |
| `formData`| `JSON`   | **Required** |

#### DeleteUser

```http
  POST /api/deleteUser/${id}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `api_key` | `string` | **Required**.  Your API key       |
| `id`      | `string` | **Required**. Id of item to fetch |

