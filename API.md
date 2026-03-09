# Blog API Reference

Base URL: `http://localhost:5000/api` (or your `PORT`)

---

## Authors

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/authors` | Create author (body: `name`, optional `avatarUrl`, `bio`) |
| GET | `/api/authors` | Get all authors |
| GET | `/api/authors/:id` | Get author by id |
| PUT | `/api/authors/:id` | Update author |
| DELETE | `/api/authors/:id` | Delete author |

---

## Blogs

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/blogs` | Create blog (body: `title`, `content`, `author` ObjectId; optional: `slug`, `category`, `mainImageUrl`, `excerpt`, `publishedDate`, `isPublished`) |
| GET | `/api/blogs` | Get all blogs (paginated). Query: `?page=1&limit=10&category=Articles&sort=asc&published=false` |
| GET | `/api/blogs/with-comments/:id` | Get one blog by **id or slug** with comments and average rating. Query: `?commentPage=1&commentLimit=10` |
| GET | `/api/blogs/:id` | Get one blog by **id or slug** (no comments) |
| PUT | `/api/blogs/:id` | Update blog |
| DELETE | `/api/blogs/:id` | Delete blog (and its comments) |
| POST | `/api/blogs/:id/rate-usefulness` | Rate article usefulness. Body: `{ "type": "heart" \| "thumbsUp" \| "lightbulb" \| "plus" }` |

---

## Comments (nested under blog)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/blogs/:blogId/comments` | Add comment. Body: `commenterName`, `text`; optional: `commenterEmail`, `rating` (1–5), `commenterAvatarUrl` |
| GET | `/api/blogs/:blogId/comments` | Get comments for blog (paginated). Query: `?page=1&limit=10`. Response includes `averageRating`, `ratingCount` |
| GET | `/api/blogs/:blogId/comments/:commentId` | Get one comment |
| PUT | `/api/blogs/:blogId/comments/:commentId` | Update comment |
| DELETE | `/api/blogs/:blogId/comments/:commentId` | Delete comment |

---

## Response shapes

- **List (blogs/comments):** `{ data: [...], pagination: { page, limit, total, totalPages } }`
- **Comments list:** also `averageRating`, `ratingCount`
- **Blog with comments:** blog object + `comments`, `commentsPagination`, `averageRating`, `ratingCount`
- **Errors:** `{ status: "fail", message: "...", validation?: [...] }` (no `stack` in production)

---

## Environment

- `MONGO_URI` – MongoDB connection string
- `PORT` – Server port (default 5000)
- `NODE_ENV=production` – Hides stack traces in errors
