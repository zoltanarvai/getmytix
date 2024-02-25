import os


def mandatory_env(key: str):
    value = env(key)
    if value is None:
        raise ValueError(f"{key} variable not provided")
    return value


def env(key: str):
    return os.environ.get(key)
