def aggregate(results):
    unique = {}
    for r in results:
        key = (r["platform"], r["url"])
        unique[key] = r
    return list(unique.values())
