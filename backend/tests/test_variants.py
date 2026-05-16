from services.username_variants import generate_variants

def test_generate_variants():
    variants = generate_variants("john_doe")
    assert "john_doe" in variants
    assert "johndoe" in variants
