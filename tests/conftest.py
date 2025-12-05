"""Pytest configuration and shared fixtures.

conftest.py is a special pytest file that:
1. Is automatically discovered (no import needed)
2. Shares fixtures across all tests in the directory and subdirectories
3. Can configure pytest behavior

Java equivalent: A base test class with @BeforeEach / @AfterEach,
or JUnit 5 extensions.
"""

import pytest
from fastapi.testclient import TestClient

from ecommerce.main import app
  
@pytest.fixture
def client() -> TestClient:
  """Create a test client for the FastAPI application.
    
  Fixtures are pytest's dependency injection mechanism.
  Any test can request this fixture by having a parameter named 'client'.
  
  Java equivalent: 
    @Autowired MockMvc mockMvc;
    or
    @BeforeEach void setup() { this.client = ...; }
  
  Returns:
    TestClient: A test client for making HTTP requests
  """
  return TestClient(app)