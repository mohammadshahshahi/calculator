import unittest

from calculator import calculate


class CalculatorTests(unittest.TestCase):
    def test_addition(self):
        self.assertEqual(calculate(2, "+", 3), 5)

    def test_subtraction(self):
        self.assertEqual(calculate(8, "-", 3), 5)

    def test_multiplication(self):
        self.assertEqual(calculate(4, "*", 3), 12)

    def test_division(self):
        self.assertEqual(calculate(10, "/", 2), 5)

    def test_division_by_zero(self):
        with self.assertRaises(ZeroDivisionError):
            calculate(10, "/", 0)

    def test_invalid_operator(self):
        with self.assertRaises(ValueError):
            calculate(2, "%", 3)


if __name__ == "__main__":
    unittest.main()
