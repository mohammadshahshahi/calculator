"""A simple command-line calculator."""


def calculate(a: float, operator: str, b: float) -> float:
    """Perform one of the four basic arithmetic operations."""
    if operator == "+":
        return a + b
    if operator == "-":
        return a - b
    if operator == "*":
        return a * b
    if operator == "/":
        if b == 0:
            raise ZeroDivisionError("تقسیم بر صفر امکان‌پذیر نیست.")
        return a / b
    raise ValueError("عملگر نامعتبر است. از +، -، * یا / استفاده کن.")


def main() -> None:
    print("ماشین حساب ساده")
    print("برای خروج، در قسمت عدد اول q را وارد کن.")

    while True:
        first_text = input("\nعدد اول: ").strip()
        if first_text.lower() in {"q", "quit", "exit"}:
            print("خدانگهدار!")
            break

        try:
            first = float(first_text)
            operator = input("عملگر (+ - * /): ").strip()
            second = float(input("عدد دوم: ").strip())
            print("نتیجه:", calculate(first, operator, second))
        except ValueError as error:
            print("خطای ورودی:", error)
        except ZeroDivisionError as error:
            print("خطای محاسباتی:", error)


if __name__ == "__main__":
    main()
