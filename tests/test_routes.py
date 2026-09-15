import pytest
from app.routes import app

@pytest.fixture
def client():
    # Tell Flask that we are in testing mode
    app.config['TESTING'] = True
    
    # Create a test client that can make simulated HTTP requests to the routes
    with app.test_client() as client:
        yield client

def test_search_empty_query(client):
    """Test that searching without a query string returns an empty list."""
    response = client.get('/api/search')
    assert response.status_code == 200
    assert response.get_json() == []

def test_search_with_query(client):
    """Test searching for a real movie."""
    response = client.get('/api/search?q=matrix')
    assert response.status_code == 200
    data = response.get_json()
    
    # Check that we got a list back
    assert isinstance(data, list)
    
    # Check that the first result has 'matrix' in the title
    if len(data) > 0:
        assert 'matrix' in data[0]['title'].lower()

def test_get_movie_success(client):
    """Test retrieving a valid movie's details and mood profile."""
    # Using a known popular movie ID (e.g., The Matrix)
    response = client.get('/api/movie/603')
    assert response.status_code == 200
    
    data = response.get_json()
    assert data['id'] == 603
    assert 'The Matrix' in data['title']
    assert 'moods' in data
    # Ensure moods is a dictionary containing the expected buckets
    assert isinstance(data['moods'], dict)
    assert 'Funny' in data['moods']

def test_get_movie_invalid_id(client):
    """Test retrieving a movie that does not exist."""
    response = client.get('/api/movie/999999999')
    # Since TMDB will 404, the code currently throws an Exception and returns 502
    assert response.status_code == 502
    data = response.get_json()
    assert 'error' in data
