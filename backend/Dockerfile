FROM golang:1.24.4

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY *.go ./

RUN CGO_ENABLED=0 GOOS=linux GOPROXY=direct go build -o /task-server

EXPOSE 8056

CMD ["/task-server"]