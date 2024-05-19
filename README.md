# Google Image Fetcher

This project is a Node.js application that fetches images from Google search results based on a specified search query and stores them securely in a PostgreSQL database. The application is containerized using Docker and can be easily deployed using Docker Compose.
Also you can use this command `node index.js "search input" number of images` for example `node index.js "dogs" 3` it will download 3 images of dogs and saved them in a image_*.jpg and it will store them in Postgres database

## Prerequisites

- Docker
- Docker Compose

## Setup

### Environment Variables

Create a `.env` file in the root directory of the project and populate it with the following environment variables:

```plaintext
GOOGLE_API_KEY=your_google_api_key
GOOGLE_CSE_ID=your_cse_id
PG_HOST=postgres
PG_PORT=5432
PG_DATABASE=your_database_name
PG_USER=your_postgres_username
PG_PASSWORD=your_postgres_password
```
