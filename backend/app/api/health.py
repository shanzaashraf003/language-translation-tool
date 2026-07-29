"""
Health check endpoint.

Every production API has one of these. It answers a single question:
"Is this service up and able to respond?" Monitoring tools, load
balancers, and container orchestrators (like Kubernetes) poll this
endpoint every few seconds to decide whether to route traffic to
this instance or restart it.

Note: this file only defines the ROUTE. It contains no business logic,
per our api/ vs services/ separation from Phase 1.
"""

from fastapi import APIRouter
from app.config.settings import settings

router = APIRouter(tags=["Health"])


@router.get("/health")
def health_check():
    return {
        "status": "ok",
        "environment": settings.environment,
    }