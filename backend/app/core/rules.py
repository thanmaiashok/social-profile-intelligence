import re

def rule_based_variants(username: str):
    base = re.sub(r"[._]", "", username)
    return {
        username,
        base,
        base + "123",
        base + "_",
        "_" + base,
        base + ".",
        base.replace("_", "."),
        base.replace(".", "_")
    }
