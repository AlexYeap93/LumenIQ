from pydantic import BaseModel


class PlanOption(BaseModel):
    id: str
    name: str
    price_label: str
    description: str | None = None
    features: list[str] = []
    is_enterprise: bool = False


class PlanStream(BaseModel):
    id: str
    title: str
    subtitle: str
    plans: list[PlanOption]
