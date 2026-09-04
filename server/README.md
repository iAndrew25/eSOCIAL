# eSOCIAL server

A minimal Express server that backs the app's feed.

## Run

```bash
cd server
npm install
npm start
```

The server listens on `http://localhost:3000`.

## Endpoints

- `POST /login` — find-or-create a user. Body: `{ username }`
- `GET /posts` — list all posts (newest first). Optional `?username=` filter.
- `POST /posts` — create a post. `multipart/form-data` with fields
  `username`, `description`, and an optional `image` file.
- `DELETE /posts/:id` — remove a post
- `GET /uploads/:file` — serves uploaded images (static)

Uploaded images are saved to `server/uploads/` and stored on each post as a
host-relative path (e.g. `/uploads/123.jpg`). The app resolves that against its
own base URL, so an image uploaded on one device is visible on any other.

Post/user data is stored in memory and resets on restart; uploaded files persist
on disk until you delete the `uploads/` folder.

## Connecting the app

The app reads the base URL from `EXPO_PUBLIC_API_URL` (defaults to
`http://localhost:3000`).

- iOS simulator: `http://localhost:3000` works out of the box.
- Android emulator: use `http://10.0.2.2:3000`.
- Physical device: use your computer's LAN IP, e.g. `http://192.168.1.10:3000`.

Set it when starting the app, for example:

```bash
EXPO_PUBLIC_API_URL=http://10.0.2.2:3000 npm run android
```
