package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"strconv"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/cors"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

type Task struct {
  ID          int       `json:"id"`
  Title       string    `json:"title"`
  Description string    `json:"description"`
  Priority    string    `json:"priority"`
  Category    string    `json:"category"`
  Status      string    `json:"status"`
  CreatedAt   time.Time `json:"createdAt" db:"created_at"`
}

var dbPool *pgxpool.Pool

func main() {
  dbUrl := "postgres://postgres:postgres@db:5432/postgres"
  if envDbUrl := os.Getenv("DATABASE_URL"); envDbUrl != "" {
    dbUrl = envDbUrl
  }

  var err error
  dbPool, err = pgxpool.New(context.Background(), dbUrl)
  if err != nil {
    log.Fatalf("Unable to create connection pool: %v\n", err)
  }
  defer dbPool.Close()

  err = dbPool.Ping(context.Background())
  if err != nil {
    log.Fatalf("Unable to connect to database: %v\n", err)
  }

  initDB()

  r := chi.NewRouter()

  r.Use(cors.Handler(cors.Options{
    AllowedOrigins:   []string{"*"},
    AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
    AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
    ExposedHeaders:   []string{"Link"},
    AllowCredentials: true,
    MaxAge:           300,
  }))

  r.Route("/tasks", func(r chi.Router) {
    r.Post("/", createTask)
    r.Get("/", listTasks)
    r.Get("/{id}", getTask)
    r.Put("/{id}", updateTask)
    r.Delete("/{id}", deleteTask)
  })

  port := ":8056"
  log.Printf("Server starting on port %s\n", port)
  if err := http.ListenAndServe(port, r); err != nil {
    log.Fatalf("Server failed: %v", err)
  }
}

func initDB() {
  query := `CREATE TABLE IF NOT EXISTS tasks (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    priority TEXT,
    category TEXT,
    status TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`

  ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
  defer cancel()

  _, err := dbPool.Exec(ctx, query)
  if err != nil {
    log.Fatalf("Unable to create tasks table: %v\n", err)
  }
}

func createTask(w http.ResponseWriter, r *http.Request) {
  var task Task
  if err := json.NewDecoder(r.Body).Decode(&task); err != nil {
    http.Error(w, "Invalid request body", http.StatusBadRequest)
    return
  }

  query := `INSERT INTO tasks (title, description, priority, category, status) 
            VALUES ($1, $2, $3, $4, $5) RETURNING id`

  ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
  defer cancel()

  err := dbPool.QueryRow(ctx, query,
    task.Title,
    task.Description,
    task.Priority,
    task.Category,
    task.Status,
  ).Scan(&task.ID)

  if err != nil {
    http.Error(w, "Failed to create task", http.StatusInternalServerError)
    return
  }

  w.Header().Set("Content-Type", "application/json")
  w.WriteHeader(http.StatusCreated)
  json.NewEncoder(w).Encode(task)
}

func listTasks(w http.ResponseWriter, r *http.Request) {
  query := `SELECT id, title, description, priority, category, status, created_at FROM tasks`

  ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
  defer cancel()

  rows, err := dbPool.Query(ctx, query)
  if err != nil {
    http.Error(w, "Failed to fetch tasks", http.StatusInternalServerError)
    return
  }
  defer rows.Close()

  var tasks []Task
  for rows.Next() {
    var task Task
    err := rows.Scan(
      &task.ID,
      &task.Title,
      &task.Description,
      &task.Priority,
      &task.Category,
      &task.Status,
      &task.CreatedAt,
    )
    if err != nil {
      http.Error(w, "Error scanning tasks", http.StatusInternalServerError)
      return
    }
    tasks = append(tasks, task)
  }

  if err := rows.Err(); err != nil {
    http.Error(w, "Error iterating tasks", http.StatusInternalServerError)
    return
  }



  w.Header().Set("Content-Type", "application/json")
  json.NewEncoder(w).Encode(tasks)
}

func getTask(w http.ResponseWriter, r *http.Request) {
  idStr := chi.URLParam(r, "id")
  id, err := strconv.Atoi(idStr)
  if err != nil {
    http.Error(w, "Invalid task ID", http.StatusBadRequest)
    return
  }

  query := `SELECT id, title, description, priority, category, status, created_at 
            FROM tasks WHERE id = $1`

  ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
  defer cancel()

  var task Task
  err = dbPool.QueryRow(ctx, query, id).Scan(
    &task.ID,
    &task.Title,
    &task.Description,
    &task.Priority,
    &task.Category,
    &task.Status,
    &task.CreatedAt,
  )

  if err == pgx.ErrNoRows {
    http.Error(w, "Task not found", http.StatusNotFound)
    return
  } else if err != nil {
    http.Error(w, "Failed to fetch task", http.StatusInternalServerError)
    return
  }

  w.Header().Set("Content-Type", "application/json")
  json.NewEncoder(w).Encode(task)
}

func updateTask(w http.ResponseWriter, r *http.Request) {
  idStr := chi.URLParam(r, "id")
  id, err := strconv.Atoi(idStr)
  if err != nil {
    http.Error(w, "Invalid task ID", http.StatusBadRequest)
    return
  }

  var task Task
  if err := json.NewDecoder(r.Body).Decode(&task); err != nil {
    http.Error(w, "Invalid request body", http.StatusBadRequest)
    return
  }

  query := `UPDATE tasks 
            SET title = $1, description = $2, priority = $3, 
                category = $4, status = $5 
            WHERE id = $6
            RETURNING id, title, description, priority, category, status, created_at`

  ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
  defer cancel()

  err = dbPool.QueryRow(ctx, query,
    task.Title,
    task.Description,
    task.Priority,
    task.Category,
    task.Status,
    id,
  ).Scan(
    &task.ID,
    &task.Title,
    &task.Description,
    &task.Priority,
    &task.Category,
    &task.Status,
    &task.CreatedAt,
  )

  if err == pgx.ErrNoRows {
    http.Error(w, "Task not found", http.StatusNotFound)
    return
  } else if err != nil {
    http.Error(w, "Failed to update task", http.StatusInternalServerError)
    return
  }

  w.Header().Set("Content-Type", "application/json")
  json.NewEncoder(w).Encode(task)
}

func deleteTask(w http.ResponseWriter, r *http.Request) {
  idStr := chi.URLParam(r, "id")
  id, err := strconv.Atoi(idStr)
  if err != nil {
    http.Error(w, "Invalid task ID", http.StatusBadRequest)
    return
  }

  query := `DELETE FROM tasks WHERE id = $1 RETURNING id`

  ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
  defer cancel()

  var deletedID int
  err = dbPool.QueryRow(ctx, query, id).Scan(&deletedID)

  if err == pgx.ErrNoRows {
    http.Error(w, "Task not found", http.StatusNotFound)
    return
  } else if err != nil {
    http.Error(w, "Failed to delete task", http.StatusInternalServerError)
    return
  }

  w.Header().Set("Content-Type", "application/json")
  fmt.Fprintf(w, `{"message": "Task deleted", "id": %d}`, deletedID)
}
