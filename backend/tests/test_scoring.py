from services.similarity_scoring import similarity_score

def test_similarity_score():
    score = similarity_score("john_doe", "johndoe")
    assert isinstance(score, float)
