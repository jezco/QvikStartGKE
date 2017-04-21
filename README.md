QvikStartGKE is a light weight example project for creating a load balanced and scalable application running
in Google Container engine.

Basic idea is that every module is a deployment and service of its own and the example ingress provided maps urls
to corresponding module.

An example usage of Datastore and Storage and a logging module is provided.

## Google command-line tools, nodeJS and Docker

Project requires that you have GCloud command-line tools, NodeJS and Docker installed
https://cloud.google.com/sdk/
https://nodejs.org/en/download/
https://docs.docker.com/engine/installation/

For this project you need to have billing enabled for your GCloud account.

## Auth and Scope

Create a new project on GCloud Console, Check your projectID from the project overview

This is the id of your project in the Google Cloud Developers Console.

Also replace [GCLOUD_PROJECT] in examplemodule1-deployment.yaml and
examplemodule2-deployment.yaml with the id.

Set the id also on config.js

Set default project and authenticate with correct user:
```
export PROJECT_ID=[PROJECT_ID]
gcloud auth login
gcloud config set project $PROJECT_ID
```
Set default zone for cluster:
```
gcloud config set compute/zone europe-west1-b
```

## Cluster

First Enable Container engine from the Google Cloud console by navigating to
```
Home -> Container engine
```

Create cluster with following command

```
gcloud container clusters create ${PROJECT_ID}-cluster --scopes "cloud-platform" --num-nodes 3 -m n1-standard-1 --zone europe-west1-b
```
Get credentials to make kubectl work:
```
gcloud auth application-default login
gcloud container clusters get-credentials ${PROJECT_ID}-cluster
```

## Application and environment

To start application for development:
```
npm install

start all modules without MODULE env variable:
node index.js

or test one module only:
MODULE=example1 node index.js
MODULE=example2 node index.js
```

## Deployments

Create and push docker image to gcr:
```
docker build -t eu.gcr.io/${PROJECT_ID}/example-image .
gcloud docker -- push eu.gcr.io/${PROJECT_ID}/example-image
```

Create or update new resources in Kubernetes:
```
kubectl apply -f deployment/examplemodule1-deployment.yaml
kubectl apply -f deployment/examplemodule2-deployment.yaml
kubectl apply -f deployment/examplemodule1-service.yaml
kubectl apply -f deployment/examplemodule2-service.yaml
kubectl apply -f deployment/example-ingress.yaml
```
After deploying check for healthy pods and load balancer external IP:
```

kubectl get pods

NAME                                     READY     STATUS    RESTARTS   AGE
qvikstartgke-example1-3728529991-6pvr7   1/1       Running   0          5m
qvikstartgke-example1-3728529991-fz5rg   1/1       Running   0          5m
qvikstartgke-example1-3728529991-krmt7   1/1       Running   0          5m
qvikstartgke-example2-1460139144-6ksn5   1/1       Running   0          5m
qvikstartgke-example2-1460139144-gtzc8   1/1       Running   0          5m
qvikstartgke-example2-1460139144-nbrkl   1/1       Running   0          5m

Console:
Home -> Networking -> Load Balancing -> click the ingress -> Frontend IP address

[ip_address]/ui
[ip_address]/api/example2/entities/test

```

## Storage buckets (Optional)

```
gsutil mb -c regional -l europe-west1 gs://${PROJECT_ID}-examplebucket
```

Enjoy your scalable project. Don't forget to clean up (delete) the cluster after you are done testing.
