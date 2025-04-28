#!/bin/bash

# Set variables
DOCKER_REGISTRY="bimidugunathilake"
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

# Check if service directories exist
for SERVICE in "${SERVICES[@]}"; do
  if [ ! -d "./$SERVICE" ]; then
    echo "ERROR: Directory ./$SERVICE does not exist!"
    exit 1
  fi
done

# Build and push Docker images
for SERVICE in "${SERVICES[@]}"; do
  echo "Building $SERVICE..."
  docker build -t $DOCKER_REGISTRY/$SERVICE:$VERSION -t $DOCKER_REGISTRY/$SERVICE:latest ./$SERVICE || { echo "Build failed for $SERVICE"; exit 1; }
  echo "Pushing $SERVICE..."
  docker push $DOCKER_REGISTRY/$SERVICE:$VERSION || { echo "Push failed for $SERVICE"; exit 1; }
  docker push $DOCKER_REGISTRY/$SERVICE:latest || { echo "Push failed for $SERVICE"; exit 1; }
done

# Apply Kubernetes configurations
echo "Creating namespace..."
kubectl apply -f kubernetes/namespace.yaml || { echo "Namespace creation failed"; exit 1; }

echo "Creating ConfigMap and Secrets..."
kubectl apply -f kubernetes/configmap.yaml || { echo "ConfigMap creation failed"; exit 1; }
kubectl apply -f kubernetes/mongodb-secret.yaml || { echo "MongoDB secret creation failed"; exit 1; }

echo "Deploying RabbitMQ..."
kubectl apply -f kubernetes/rabbitmq.yaml || { echo "RabbitMQ deployment failed"; exit 1; }

# Replace DOCKER_REGISTRY placeholder in Kubernetes files
for SERVICE in "${SERVICES[@]}"; do
  echo "Deploying $SERVICE..."
  if [ -f "kubernetes/$SERVICE.yaml" ]; then
    sed "s|\${DOCKER_REGISTRY}|$DOCKER_REGISTRY|g" kubernetes/$SERVICE.yaml | kubectl apply -f - || { echo "$SERVICE deployment failed"; exit 1; }
  else
    echo "ERROR: kubernetes/$SERVICE.yaml not found!"
    exit 1
  fi
done

echo "Deployment completed successfully!"
