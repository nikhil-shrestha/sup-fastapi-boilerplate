from app.api.v1.routers import accounts, auth, roles, user_roles, users, \
                              networks, devices, facilities, applications, account_facilities, \
                              products, orders
from fastapi import APIRouter

api_router = APIRouter()

api_router.include_router(auth.router)
api_router.include_router(users.router)
api_router.include_router(roles.router)
api_router.include_router(user_roles.router)
api_router.include_router(accounts.router)
api_router.include_router(devices.router)
api_router.include_router(facilities.router)
api_router.include_router(applications.router)
api_router.include_router(account_facilities.router)
api_router.include_router(products.router)
api_router.include_router(orders.router)
api_router.include_router(networks.router)
