import unittest

from app import app


class RouteSmokeTests(unittest.TestCase):
    def setUp(self):
        app.config.update(TESTING=True)
        self.client = app.test_client()

    def test_pages_render(self):
        for route in ("/", "/about", "/pricing", "/early-access", "/login", "/app"):
            response = self.client.get(route)
            self.assertEqual(response.status_code, 200, route)
            self.assertIn(b"Karya", response.data)

    def test_health(self):
        response = self.client.get("/health")
        self.assertEqual(response.get_json()["status"], "ok")


if __name__ == "__main__":
    unittest.main()
