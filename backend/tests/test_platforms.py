from services.platform_checker import check_platforms

def test_check_platforms():
    results = check_platforms("github")
    assert isinstance(results, list)
