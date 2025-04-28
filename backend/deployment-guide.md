# Food Delivery App Microservices Deployment Guide

This guide provides detailed instructions for containerizing and deploying the food delivery microservices application using Docker and Kubernetes.

## Prerequisites

- Docker
- Docker Compose
- Kubernetes cluster (local like Minikube or remote)
- kubectl configured to connect to your cluster
- Node.js v23.11.0 (for local development)

## Project Structure

The application is structured into multiple microservices:

```
└── 📁backend
    └── 📁api-gateway
    └── 📁restaurant-admin-service
    └── 📁restaurant-delivery-service
    └── 📁restaurant-ops-service
    └── 📁restaurant-order-service
    └── 📁system-admin-service
    └── 📁utility-auth-service
    └── 📁utility-notifications-service
    └── 📁utility-payment-service
    └── 📁kubernetes
    └── 📁scripts
```

## Step 1: Setup API Gateway

The API Gateway acts as the entry point to your microservices. It handles routing, authentication, and request/response transformation.

1. Navigate to the api-gateway directory
2. Create or update the package.json file with the provided contents
3. Install dependencies:
   ```
   npm install
   ```
4. Create the src/index.js file with the provided code
5. Create a .env file with the necessary environment variables

## Step 2: Dockerize Each Microservice

Each microservice needs a Dockerfile to create a container image. Here's the general process for each:

1. Navigate to the service directory (e.g., restaurant-admin-service)
2. Create a Dockerfile with the provided content
3. Make sure the service has a health check endpoint at /health
4. Ensure the package.json file has the correct start script

## Step 3: Set Up Docker Compose for Local Development

1. Create a docker-compose.yml file in the root directory with the provided content
2. Start the services locally:
   ```
   docker compose up -d
   ```
3. Verify all services are running:
   ```
   docker compose ps
   ```

## Step 4: Prepare Kubernetes Deployment Files

1. Create a 'kubernetes' directory in your project root
2. Create the namespace.yaml file
3. Create the configmap.yaml and mongodb-secret.yaml files
4. Create deployment files for each service (provided in this guide)
5. Create the rabbitmq.yaml file

## Step 5: Prepare Environment Variables

Before deploying to Kubernetes, ensure all environment variables are properly configured:

1. Review the configmap.yaml file to ensure all service URLs are correct
2. Check the mongodb-secret.yaml file to ensure all database connection strings are valid
3. Update JWT_SECRET and other sensitive information as needed

## Step 6: Deploy to Kubernetes

Use the provided deployment script:

1. Make the script executable:
   ```
   chmod +x scripts/deploy.sh
   ```
2. Update the DOCKER_REGISTRY and KUBE_CONTEXT variables in the script
3. Run the deployment:
   ```
   ./scripts/deploy.sh
   ```

Alternatively, deploy manually:

1. Create the namespace:
   ```
   kubectl apply -f kubernetes/namespace.yaml
   ```
2. Apply ConfigMap and Secrets:
   ```
   kubectl apply -f kubernetes/configmap.yaml
   kubectl apply -f kubernetes/mongodb-secret.yaml
   ```
3. Deploy RabbitMQ:
   ```
   kubectl apply -f kubernetes/rabbitmq.yaml
   ```
4. Deploy each service:
   ```
   kubectl apply -f kubernetes/api-gateway.yaml
    kubectl apply -f kubernetes/restaurant-admin-service.yaml
    kubectl apply -f kubernetes/restaurant-delivery-service.yaml
    kubectl apply -f kubernetes/restaurant-ops-service.yaml
    kubectl apply -f kubernetes/restaurant-order-service.yaml
    kubectl apply -f kubernetes/system-admin-service.yaml
    kubectl apply -f kubernetes/utility-auth-service.yaml
    kubectl apply -f kubernetes/utility-notifications-service.yaml
    kubectl apply -f kubernetes/utility-payment-service.yaml
   ```

## Step 7: Verify the Deployment

1. Check all pods are running:
   ```
   kubectl get pods -n food-delivery
   ```
2. Verify services are exposed:
   ```
   kubectl get svc -n food-delivery
   ```
3. Check ingress is properly configured:
   ```
   kubectl get ingress -n food-delivery
   ```

## Step 8: Configure External Access

If you're using a cloud provider, you may need to configure additional resources:

- For AWS: Set up an Application Load Balancer
- For GCP: Configure GCP Ingress
- For Azure: Use Azure Application Gateway

Update the Ingress definition with the appropriate annotations for your cloud provider.

## Step 9: Monitoring and Logging

Consider setting up:

1. Prometheus and Grafana for monitoring
2. ELK stack (Elasticsearch, Logstash, Kibana) or similar for logging
3. Distributed tracing with Jaeger or Zipkin

## Troubleshooting

Common issues and solutions:

1. If pods are stuck in 'Pending' state:
   ```
   kubectl describe pod <pod-name> -n food-delivery
   ```

2. If services can't communicate:
   ```
   kubectl exec -it <pod-name> -n food-delivery -- curl <service>:<port>/health
   ```

3. If RabbitMQ connection fails:
   ```
   kubectl logs <pod-name> -n food-delivery
   ```
   Check that the RABBITMQ_URL environment variable is correctly set.

## Scaling

To scale a service, use:

```
kubectl scale deployment <deployment-name> -n food-delivery --replicas=<number>
```

For example, to scale the order service to 4 replicas:

```
kubectl scale deployment restaurant-order-service -n food-delivery --replicas=4
```

## Updating Services

To update a service:

1. Build and push new Docker image with a new tag
2. Update the deployment:
   ```
   kubectl set image deployment/<deployment-name> <container-name>=<new-image> -n food-delivery
   ```
3. Check the rollout status:
   ```
   kubectl rollout status deployment/<deployment-name> -n food-delivery
   ```

## Production Considerations

For production deployment:

1. Use a CI/CD pipeline to automate builds and deployments
2. Implement proper secret management (e.g., HashiCorp Vault, AWS Secrets Manager)
3. Set up backup solutions for the databases
4. Configure horizontal pod autoscaling
5. Implement proper network policies
6. Set resource limits and requests appropriately
7. Use node affinity and anti-affinity rules for better pod distribution
