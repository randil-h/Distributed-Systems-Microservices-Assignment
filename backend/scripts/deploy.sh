#!/bin/bash

# Set variables
DOCKER_REGISTRY="localhost:5000"
KUBE_CONTEXT="minikube"
VERSION=$(date +%Y%m%d%H%M%S)

# Array of services
SERVICES=(
  "api-gateway"
  "restaurant-admin-service"
  "restaurant-delivery-service"
  "restaurant-ops-service"
  "restaurant-order-service"
  "system-admin-service"
  "utility-auth-service"
  "utility-notifications-service"
  "utility-payment-service"
)

# Build and push Docker images
for SERVICE in "${SERVICES[@]}"; do
  echo "Building $SERVICE..."
  docker build -t $DOCKER_REGISTRY/$SERVICE:$VERSION -t $DOCKER_REGISTRY/$SERVICE:latest ./$SERVICE
  echo "Pushing $SERVICE..."
  docker push $DOCKER_REGISTRY/$SERVICE:$VERSION
  docker push $DOCKER_REGISTRY/$SERVICE:latest
done

# Apply Kubernetes configurations
echo "Creating namespace..."
kubectl apply -f kubernetes/namespace.yaml

echo "Creating ConfigMap and Secrets..."
kubectl apply -f kubernetes/configmap.yaml
kubectl apply -f kubernetes/mongodb-secret.yaml

echo "Deploying RabbitMQ..."
kubectl apply -f kubernetes/rabbitmq.yaml

# Replace DOCKER_REGISTRY placeholder in Kubernetes files
for SERVICE in "${SERVICES[@]}"; do
  echo "Deploying $SERVICE..."
  sed "s|\${DOCKER_REGISTRY}|$DOCKER_REGISTRY|g" kubernetes/$SERVICE.yaml | kubectl apply -f -
done

echo "Deployment completed successfully!"
